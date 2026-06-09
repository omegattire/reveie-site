/* ================================================================
   OMEGA ATTIRE – CONFIGURATION FILE
   ================================================================
   INSTRUCTIONS:
   1. Go to https://supabase.com → Your Project → Settings → API
   2. Copy "Project URL" → paste as SUPABASE_URL
   3. Copy "anon public" key → paste as SUPABASE_ANON_KEY
   4. Go to Settings → API → Service Role key → paste as SUPABASE_SERVICE_KEY
      (Service key is only used in admin.html — keep it secret)
   5. Update WHATSAPP_NUMBER and INSTAGRAM_HANDLE
   ================================================================ */

const CONFIG = {

  // ── SUPABASE ─────────────────────────────────────────────────
  SUPABASE_URL:         'https://hfmtwopfoyjxgdlxufsv.supabase.co',
  // Example:           'https://abcdefghijkl.supabase.co'

  SUPABASE_ANON_KEY:    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbXR3b3Bmb3lqeGdkbHh1ZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA3MzcsImV4cCI6MjA5NjU3NjczN30.UothZRsSAeHPu_rxSpEsbBtuWnTTNjuUWqZzhZhvPrM',
  // Example:           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbXR3b3Bmb3lqeGdkbHh1ZnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTAwMDczNywiZXhwIjoyMDk2NTc2NzM3fQ.XNBqUT5k9dbxTfzLlFwXUd0w-3kvG6ZkAOM7_GIBS0g',
  // Example:           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  // WARNING: Only used in admin panel. Never expose on public pages.

  // ── STORAGE ──────────────────────────────────────────────────
  STORAGE_BUCKET: 'review-images',
  // This must match the bucket name you create in Supabase Storage

  // ── BRAND ────────────────────────────────────────────────────
  BRAND_NAME:      'Omega Attire',
  BRAND_TAGLINE:   'Real Reviews. Real Customers. Real Quality.',
  WHATSAPP_NUMBER: '919999999999',
  // Format: country code + number, no + or spaces. Example: '919876543210'
  INSTAGRAM_HANDLE: 'omegaattire',
  CONTACT_EMAIL:    'hello@omegaattire.in',

  // ── ADMIN ────────────────────────────────────────────────────
  ADMIN_EMAIL:    'admin@omegaattire.in',
  // Used for Supabase Auth login on admin panel

};
