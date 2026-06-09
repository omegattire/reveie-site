/* ================================================================
   OMEGA ATTIRE – SHARED UI UTILITIES
   ================================================================ */

// ── NAVBAR ────────────────────────────────────────────────────
function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () =>
      navbar.classList.toggle('scrolled', window.scrollY > 36)
    );
  }
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      })
    );
  }
}

// ── DARK MODE ─────────────────────────────────────────────────
function initDarkMode() {
  const btn = document.getElementById('darkToggle');
  const apply = (dark) => {
    document.body.classList.toggle('dark', dark);
    if (btn) btn.textContent = dark ? '☀' : '☽';
  };
  apply(localStorage.getItem('oa-dark') === '1');
  if (btn) {
    btn.addEventListener('click', () => {
      const dark = !document.body.classList.contains('dark');
      localStorage.setItem('oa-dark', dark ? '1' : '0');
      apply(dark);
    });
  }
}

// ── SCROLL REVEAL ──────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, duration = 3200) {
  let t = document.getElementById('oa-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'oa-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

// ── LIGHTBOX ──────────────────────────────────────────────────
let _lb = null;
function openLightbox(src) {
  if (!_lb) {
    _lb = document.createElement('div');
    _lb.className = 'lightbox';
    _lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">✕</button>
      <img src="" alt="Customer photo">`;
    _lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    _lb.addEventListener('click', e => { if (e.target === _lb) closeLightbox(); });
    document.body.appendChild(_lb);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }
  _lb.querySelector('img').src = src;
  _lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  _lb?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── REVIEW CARD BUILDER ───────────────────────────────────────
const AVATAR_COLORS = ['#E61919','#0d47a1','#2e7d32','#6a1b9a','#e65100','#00695c','#c62828','#283593'];
function avatarColor(name) {
  let h = 0;
  for (const c of (name || 'A')) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}
function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function starsHTML(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildReviewCard(r) {
  const imgs = (r.images || []).slice(0, 4).map(src =>
    `<img src="${src}" class="rc-img" alt="Customer photo" loading="lazy"
          onclick="openLightbox('${src}')">`
  ).join('');

  return `
  <div class="review-card reveal">
    <div class="rc-top">
      <div class="rc-author">
        <div class="rc-avatar" style="background:${avatarColor(r.name)}">${initials(r.name)}</div>
        <div>
          <div class="rc-name">${escapeHtml(r.name)}</div>
          <div class="rc-city">📍 ${escapeHtml(r.city)}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div class="rc-stars">${starsHTML(r.rating)}</div>
        ${r.verified ? '<div class="verified-badge">✓ Verified</div>' : ''}
      </div>
    </div>
    <div class="rc-text">"${escapeHtml(r.review_text)}"</div>
    <div class="rc-meta">
      <span>🛍 ${escapeHtml(r.product)}</span>
      <span>📅 ${formatDate(r.created_at)}</span>
    </div>
    ${imgs ? `<div class="rc-images">${imgs}</div>` : ''}
    <button class="rc-share" onclick="shareReview(${r.id},'${escapeHtml(r.name)}',${r.rating})">🔗 Share</button>
  </div>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ── SHARE ─────────────────────────────────────────────────────
function shareReview(id, name, rating) {
  const text = `Check out ${name}'s ${rating}★ review for Omega Attire! #OmegaAttire`;
  const url  = window.location.origin + '/reviews.html';
  if (navigator.share) {
    navigator.share({ title: 'Omega Attire Review', text, url });
  } else {
    navigator.clipboard.writeText(text + ' ' + url)
      .then(() => showToast('🔗 Link copied to clipboard!'));
  }
}

// ── STATS COUNTER ANIMATION ───────────────────────────────────
function animateCount(el, target, isDecimal = false, suffix = '') {
  if (!el) return;
  let start = null;
  const duration = 1600;
  const step = (ts) => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = (isDecimal
      ? (ease * target).toFixed(1)
      : Math.floor(ease * target)) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── FAQ ───────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── CONTACT FORM ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll reply within 24 hours.');
    form.reset();
  });
}

// ── STAR PICKER ───────────────────────────────────────────────
const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];
function initStarPicker(pickerId, hiddenId, labelId) {
  const picker = document.getElementById(pickerId);
  const hidden = document.getElementById(hiddenId);
  const lbl    = document.getElementById(labelId);
  if (!picker) return;

  const stars = picker.querySelectorAll('.star-pick');
  stars.forEach(s => {
    s.addEventListener('mouseenter', () => {
      const v = +s.dataset.v;
      stars.forEach(x => x.classList.toggle('on', +x.dataset.v <= v));
      if (lbl) lbl.textContent = STAR_LABELS[v];
    });
    s.addEventListener('click', () => {
      const v = +s.dataset.v;
      if (hidden) hidden.value = v;
      stars.forEach(x => x.dataset.chosen = +x.dataset.v <= v ? '1' : '0');
      if (lbl) lbl.textContent = `${STAR_LABELS[v]} (${v}/5)`;
    });
  });
  picker.addEventListener('mouseleave', () => {
    const v = hidden ? +hidden.value : 0;
    stars.forEach(x => x.classList.toggle('on', +x.dataset.v <= v));
    if (lbl) lbl.textContent = v ? `${STAR_LABELS[v]} (${v}/5)` : 'Select rating';
  });
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────
function initPhotoUpload(zoneId, inputId, previewId, errId) {
  const zone    = document.getElementById(zoneId);
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    addFiles(Array.from(e.dataTransfer.files));
  });
  input.addEventListener('change', () => addFiles(Array.from(input.files)));

  function addFiles(files) {
    const errEl = document.getElementById(errId);
    const valid = files.filter(f =>
      f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
    );
    if (valid.length < files.length && errEl)
      errEl.textContent = 'Some files skipped (must be image, max 5 MB each).';
    else if (errEl) errEl.textContent = '';

    // Attach to zone element for retrieval
    zone._files = zone._files || [];
    zone._files = [...zone._files, ...valid].slice(0, 5);
    renderThumbs();
    input.value = '';
  }

  function renderThumbs() {
    if (!preview) return;
    preview.innerHTML = '';
    (zone._files || []).forEach((f, i) => {
      const url  = URL.createObjectURL(f);
      const wrap = document.createElement('div');
      wrap.className = 'photo-thumb-wrap';
      wrap.innerHTML = `
        <img src="${url}" class="photo-thumb" alt="preview">
        <button class="thumb-remove" type="button" data-i="${i}">✕</button>`;
      wrap.querySelector('.thumb-remove').addEventListener('click', () => {
        zone._files.splice(i, 1);
        renderThumbs();
      });
      preview.appendChild(wrap);
    });
  }
}

// ── WHATSAPP / INSTAGRAM LINKS ────────────────────────────────
function setContactLinks() {
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`;
  });
  document.querySelectorAll('[data-ig]').forEach(el => {
    el.href = `https://instagram.com/${CONFIG.INSTAGRAM_HANDLE}`;
  });
  document.querySelectorAll('[data-email]').forEach(el => {
    el.href = `mailto:${CONFIG.CONTACT_EMAIL}`;
    el.textContent = CONFIG.CONTACT_EMAIL;
  });
}

// ── INIT ALL ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDarkMode();
  initFAQ();
  initContactForm();
  setContactLinks();
  // Reveal observer is called after content loads (in each page script)
});
