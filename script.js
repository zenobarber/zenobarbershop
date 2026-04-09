/* ─── PAGE LOADER ───────────────────────────────────────────── */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 1300);
});

/* ─── NAVBAR SCROLL ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── HAMBURGER MENU ────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.style.display = 'none';
  });
});

/* ─── REVEAL ON SCROLL ──────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.max(0, idx) * 90;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Immediately reveal anything already in the viewport on load
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal').forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => el.classList.add('visible'), i * 100);
    }
  });
});

/* ─── TIME SLOT SELECTION ───────────────────────────────────── */
document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
    slot.classList.add('active');
  });
});

/* ─── BOOKING FORM ──────────────────────────────────────────── */
const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('🎉 <strong>Booking Confirmed!</strong> We\'ll see you soon, King.');
  bookingForm.reset();
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
});

/* ─── NEWSLETTER FORM ───────────────────────────────────────── */
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('✦ <strong>You\'re in!</strong> Stay sharp — great content incoming.');
  newsletterForm.reset();
});

/* ─── TOAST NOTIFICATION ────────────────────────────────────── */
function showToast(html) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = html;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

/* ─── SMOOTH SCROLL ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── SET MIN DATE FOR BOOKING ──────────────────────────────── */
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/* ─── HERO PARALLAX ─────────────────────────────────────────── */
const heroGrid = document.querySelector('.hero-grid');
window.addEventListener('scroll', () => {
  if (!heroGrid) return;
  const y = window.scrollY;
  heroGrid.style.transform = `translateY(${y * 0.25}px)`;
}, { passive: true });

/* ─── LIGHTBOX ──────────────────────────────────────────────── */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxCap  = document.getElementById('lightbox-caption');
const lbClose      = document.getElementById('lightbox-close');
const lbPrev       = document.getElementById('lightbox-prev');
const lbNext       = document.getElementById('lightbox-next');

let galleryItems = [];
let currentIndex = 0;

window.openLightbox = function openLightbox(index) {
  galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  currentIndex = index;
  const item    = galleryItems[index];
  const bg      = item.style.backgroundImage;
  const src     = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  const caption = item.querySelector('.gallery-overlay span')?.textContent || '';
  lightboxImg.src = src;
  lightboxCap.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() {
  galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
}
function showNext() {
  galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  openLightbox((currentIndex + 1) % galleryItems.length);
}

// Delegation on the gallery grid
document.querySelector('.gallery-grid')?.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item) return;
  galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  openLightbox(galleryItems.indexOf(item));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

/* ─── GALLERY ITEM GLOW ON HOVER ────────────────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty('--mx', `${x}%`);
    item.style.setProperty('--my', `${y}%`);
  });
});
