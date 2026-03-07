import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

const { data: buckets } = await supabase.storage.listBuckets()
console.log('📦 BUCKETS:', JSON.stringify(buckets, null, 2))

const { data: profile } = await supabase
  .from('profiles')
  .select('id, user_id, avatar_url')
  .limit(1)
console.log('👤 PROFILE:', JSON.stringify(profile, null, 2))

const { data: files } = await supabase.storage
  .from('avatars')
  .list()
console.log('🖼️ FILES:', JSON.stringify(files, null, 2))
