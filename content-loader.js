/* ─── ZENO CONTENT LOADER ───────────────────────────────────────
   Runs on every page. Reads saved content from localStorage
   and patches the DOM before the page is shown.
──────────────────────────────────────────────────────────────── */
(function () {
  const KEY = 'zenoContent';

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }

  function set(selector, value) {
    const el = document.querySelector(selector);
    if (el && value !== undefined && value !== '') el.textContent = value;
  }

  function setAll(selector, value) {
    if (value === undefined || value === '') return;
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  }

  function applyAll() {
    const c = get();

    /* ── LOGO ─────────────────────────────── */
    if (c.logoSrc) {
      document.querySelectorAll('[data-ed="site-logo"]').forEach(logoLink => {
        // Replace text content with an image
        const existingImg = logoLink.querySelector('.logo-custom-img');
        if (existingImg) {
          existingImg.src = c.logoSrc;
        } else {
          // Hide text elements
          const icon = logoLink.querySelector('.logo-icon');
          const text = logoLink.querySelector('.logo-text');
          if (icon) icon.style.display = 'none';
          if (text) text.style.display = 'none';
          // Insert image
          const img = document.createElement('img');
          img.src = c.logoSrc;
          img.alt = 'Kapsalon Zeno';
          img.className = 'logo-custom-img';
          img.style.height = '36px';
          img.style.width = 'auto';
          img.style.objectFit = 'contain';
          logoLink.prepend(img);
        }
      });
    }

    /* ── HERO ─────────────────────────────── */
    set('[data-ed="hero-badge"]',    c.heroBadge);
    set('[data-ed="hero-line1"]',    c.heroLine1);
    set('[data-ed="hero-line2"]',    c.heroLine2);
    set('[data-ed="hero-line2-em"]', c.heroLine2Em);
    set('[data-ed="hero-sub"]',      c.heroSub);

    /* ── SERVICES ─────────────────────────── */
    if (c.services) {
      c.services.forEach((s, i) => {
        set(`[data-ed="svc-${i}-name"]`,  s.name);
        set(`[data-ed="svc-${i}-desc"]`,  s.desc);
        set(`[data-ed="svc-${i}-price"]`, s.price);
      });
    }

    /* ── HOURS ────────────────────────────── */
    if (c.hours) {
      ['ma','di','wo','do','vr','za','zo'].forEach(d => {
        if (c.hours[d]) set(`[data-ed="hours-${d}"]`, c.hours[d]);
      });
    }

    /* ── GALLERY ──────────────────────────── */
    if (c.gallery) {
      c.gallery.forEach((item, i) => {
        const el = document.querySelector(`[data-ed="gallery-${i}"]`);
        if (!el) return;
        if (item.src) el.style.backgroundImage = `url('${item.src}')`;
        const cap = el.querySelector('.gallery-overlay span');
        if (cap && item.label) cap.textContent = item.label;
      });
    }

    /* ── REVIEWS ──────────────────────────── */
    if (c.reviews) {
      c.reviews.forEach((rev, i) => {
        set(`[data-ed="review-${i}-text"]`, rev.text);
        set(`[data-ed="review-${i}-name"]`, rev.name);
        set(`[data-ed="review-${i}-role"]`, rev.role);
      });
    }

    /* ── ABOUT ────────────────────────────── */
    set('[data-ed="about-p1"]', c.aboutP1);
    set('[data-ed="about-p2"]', c.aboutP2);
    [1, 2, 3].forEach(n => {
      set(`[data-ed="about-f${n}-title"]`, c[`aboutF${n}Title`]);
      set(`[data-ed="about-f${n}-desc"]`,  c[`aboutF${n}Desc`]);
    });

    /* ── ABOUT PHOTO ─────────────────────── */
    if (c.aboutPhoto) {
      const aboutCard = document.querySelector('[data-ed="about-photo"]');
      if (aboutCard) {
        aboutCard.style.backgroundImage = `url('${c.aboutPhoto}')`;
        aboutCard.style.backgroundSize = 'cover';
        aboutCard.style.backgroundPosition = 'center';
        // Hide the placeholder scissors
        const scissors = aboutCard.querySelector('.about-img-scissors');
        if (scissors) scissors.style.display = 'none';
      }
    }

    /* ── BARBER PHOTO ────────────────────── */
    if (c.barberPhoto) {
      const barberEl = document.querySelector('[data-ed="barber-photo"]');
      if (barberEl) {
        barberEl.style.backgroundImage = `url('${c.barberPhoto}')`;
        barberEl.style.backgroundSize = 'cover';
        barberEl.style.backgroundPosition = 'center';
        // Hide the avatar letter
        const avatar = barberEl.querySelector('.barber-avatar');
        if (avatar) avatar.style.display = 'none';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  } else {
    applyAll();
  }
})();
