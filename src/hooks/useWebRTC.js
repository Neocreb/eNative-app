import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export function useWebRTC(currentUser) {
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');
  const pc = useRef(null);
  const localStream = useRef(null);
  const callId = useRef(null);

  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.current = stream;
    return stream;
  };

  const createPeerConnection = (onTrack) => {
    const conn = new RTCPeerConnection(ICE_SERVERS);
    if (localStream.current) {
      localStream.current.getTracks().forEach(t => conn.addTrack(t, localStream.current));
    }
    conn.ontrack = (e) => onTrack && onTrack(e.streams[0]);
    return conn;
  };

  // Listen for incoming calls
  useEffect(() => {
    if (!currentUser) return;
    const channel = supabase
      .channel('incoming-calls')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'calls',
        filter: `callee_id=eq.${currentUser.id}`
      }, (payload) => {
        if (payload.new.status === 'pending') {
          setIncomingCall(payload.new);
          setCallStatus('incoming');
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentUser]);

  const startCall = async (calleeId, calleeEnumber, onRemoteStream) => {
    try {
      setCallStatus('connecting');
      await getMedia();
      pc.current = createPeerConnection(onRemoteStream);

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

      const { data } = await supabase.from('calls').insert({
        caller_id: currentUser.id,
        callee_id: calleeId,
        caller_enumber: currentUser.enumber,
        callee_enumber: calleeEnumber,
        offer: offer,
        status: 'pending'
      }).select().single();

      callId.current = data.id;
      setActiveCall(data);

      // Send ICE candidates
      pc.current.onicecandidate = async (e) => {
        if (e.candidate) {
          await supabase.from('ice_candidates').insert({
            call_id: callId.current,
            sender_id: currentUser.id,
            candidate: e.candidate
          });
        }
      };

      // Wait for answer
      const answerChannel = supabase
        .channel(`call-answer-${data.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'calls',
          filter: `id=eq.${data.id}`
        }, async (payload) => {
          if (payload.new.answer && pc.current.signalingState !== 'stable') {
            await pc.current.setRemoteDescription(payload.new.answer);
            setCallStatus('active');
          }
        })
        .subscribe();

    } catch (err) {
      console.error('startCall error:', err);
      setCallStatus('error');
    }
  };

  const answerCall = async (call, onRemoteStream) => {
    try {
      setCallStatus('connecting');
      await getMedia();
      pc.current = createPeerConnection(onRemoteStream);

      await pc.current.setRemoteDescription(call.offer);
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);

      await supabase.from('calls').update({
        answer: answer,
        status: 'active'
      }).eq('id', call.id);

      callId.current = call.id;
      setActiveCall(call);
      setIncomingCall(null);
      setCallStatus('active');

      pc.current.onicecandidate = async (e) => {
        if (e.candidate) {
          await supabase.from('ice_candidates').insert({
            call_id: call.id,
            sender_id: currentUser.id,
            candidate: e.candidate
          });
        }
      };

    } catch (err) {
      console.error('answerCall error:', err);
      setCallStatus('error');
    }
  };

  const endCall = async () => {
    if (callId.current) {
      await supabase.from('calls').update({ status: 'ended' }).eq('id', callId.current);
    }
    pc.current?.close();
    localStream.current?.getTracks().forEach(t => t.stop());
    pc.current = null;
    localStream.current = null;
    callId.current = null;
    setActiveCall(null);
    setIncomingCall(null);
    setCallStatus('idle');
  };

  const rejectCall = async (call) => {
    await supabase.from('calls').update({ status: 'rejected' }).eq('id', call.id);
    setIncomingCall(null);
    setCallStatus('idle');
  };

  return { incomingCall, activeCall, callStatus, startCall, answerCall, endCall, rejectCall };
}
