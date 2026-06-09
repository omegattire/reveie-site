/* ================================================================
   OMEGA ATTIRE – SUPABASE CLIENT (FIXED VERSION)
   Uses shared client from config.js (NO DUPLICATES)
   ================================================================ */

// ✅ import from config.js (IMPORTANT)
import { supabase } from './config.js'

// ── INIT CHECK ──────────────────────────────────────────────────
function initSupabase() {
  if (!supabase) {
    console.error('❌ Supabase not initialised');
    return false;
  }
  return true;
}

// ── HELPERS ──────────────────────────────────────────────────

// Upload one image
async function uploadImage(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const allowed = ['jpg', 'jpeg', 'png', 'webp'];

  if (!allowed.includes(ext)) {
    throw new Error(`File type .${ext} not allowed.`);
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`${file.name} exceeds 5 MB limit.`);
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `reviews/${filename}`;

  const { error } = await supabase.storage
    .from('review-images')
    .upload(path, file);

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('review-images')
    .getPublicUrl(path);

  return data.publicUrl;
}

// Upload multiple images
async function uploadImages(files) {
  const urls = [];

  for (const file of files) {
    const url = await uploadImage(file);
    urls.push(url);
  }

  return urls;
}

// Fetch reviews
async function fetchApprovedReviews({
  rating = 0,
  search = '',
  page = 1,
  perPage = 9,
  sort = 'newest'
} = {}) {

  let query = supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('status', 'approved');

  if (rating > 0) {
    query = query.eq('rating', rating);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,city.ilike.%${search}%,review_text.ilike.%${search}%`
    );
  }

  query =
    sort === 'oldest'
      ? query.order('created_at', { ascending: true })
      : query.order('created_at', { ascending: false });

  const from = (page - 1) * perPage;

  query = query.range(from, from + perPage - 1);

  const { data, error, count } = await query;

  return {
    data: data || [],
    count: count || 0,
    error
  };
}

// Fetch stats
async function fetchStats() {
  const { data, error } = await supabase
    .from('review_stats')
    .select('*')
    .single();

  if (error) return null;

  return data;
}

// Submit review
async function submitReview(payload) {
  const { error } = await supabase
    .from('reviews')
    .insert([payload]);

  if (error) throw new Error(error.message);
}

// ✅ export functions (IMPORTANT)
export {
  initSupabase,
  uploadImage,
  uploadImages,
  fetchApprovedReviews,
  fetchStats,
  submitReview
};
