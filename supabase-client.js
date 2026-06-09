/* ================================================================
   OMEGA ATTIRE – SUPABASE CLIENT
   Shared Supabase instance used by all pages.
   Loaded AFTER config.js on every HTML page.
   ================================================================ */

// Supabase JS v2 loaded via CDN in each HTML file.
// This file creates the single shared client.

let supabase;

function initSupabase() {
  if (
    CONFIG.SUPABASE_URL.includes('PASTE_YOUR') ||
    CONFIG.SUPABASE_ANON_KEY.includes('PASTE_YOUR')
  ) {
    console.error(
      '❌ Supabase not configured.\n' +
      'Open config.js and replace PASTE_YOUR_SUPABASE_PROJECT_URL_HERE ' +
      'and PASTE_YOUR_SUPABASE_ANON_PUBLIC_KEY_HERE with your real credentials.'
    );
    return false;
  }

  supabase = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_ANON_KEY
  );

  return true;
}

// ── HELPERS ──────────────────────────────────────────────────

// Upload one image file → returns public URL or throws
async function uploadImage(file) {
  const ext      = file.name.split('.').pop().toLowerCase();
  const allowed  = ['jpg', 'jpeg', 'png', 'webp'];
  if (!allowed.includes(ext)) throw new Error(`File type .${ext} not allowed.`);
  if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} exceeds 5 MB limit.`);

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path     = `reviews/${filename}`;

  const { error } = await supabase.storage
    .from(CONFIG.STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from(CONFIG.STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

// Upload array of files → returns array of public URLs
async function uploadImages(files) {
  const urls = [];
  for (const file of files) {
    const url = await uploadImage(file);
    urls.push(url);
  }
  return urls;
}

// Fetch approved reviews with optional filters
async function fetchApprovedReviews({ rating = 0, search = '', page = 1, perPage = 9, sort = 'newest' } = {}) {
  if (!supabase) return { data: [], count: 0, error: 'Supabase not initialised' };

  let query = supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('status', 'approved');

  if (rating > 0)  query = query.eq('rating', rating);
  if (search)      query = query.or(
    `name.ilike.%${search}%,city.ilike.%${search}%,review_text.ilike.%${search}%`
  );

  query = sort === 'oldest'
    ? query.order('created_at', { ascending: true })
    : query.order('created_at', { ascending: false });

  const from = (page - 1) * perPage;
  query = query.range(from, from + perPage - 1);

  const { data, error, count } = await query;
  return { data: data || [], count: count || 0, error };
}

// Fetch public stats (average rating, total, distribution)
async function fetchStats() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('review_stats')
    .select('*')
    .single();
  if (error) return null;
  return data;
}

// Submit a new review (status = 'pending' by default in DB)
async function submitReview(payload) {
  if (!supabase) throw new Error('Supabase not initialised');
  const { error } = await supabase
    .from('reviews')
    .insert([payload]);
  if (error) throw new Error(error.message);
}
