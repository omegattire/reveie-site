import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const CONFIG = {
  SUPABASE_URL: 'https://hfmtwopfoyjxgdlxufsv.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',

  STORAGE_BUCKET: 'review-images',

  BRAND_NAME: 'Omega Attire',
  BRAND_TAGLINE: 'Real Reviews. Real Customers. Real Quality.',
  WHATSAPP_NUMBER: '919999999999',
  INSTAGRAM_HANDLE: 'omegaattire',
  CONTACT_EMAIL: 'hello@omegaattire.in',

  ADMIN_EMAIL: 'admin@omegaattire.in',
}

// ✅ create supabase ONLY ONCE
const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
)

// ✅ export properly
export { CONFIG, supabase }
