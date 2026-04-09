/* ─── KAPSALON ZENO — ADMIN PANEL ─────────────────────────────
   Password is stored in localStorage under 'zenoPassword'.
   Default password: Zeno2024
   Content is stored under 'zenoContent'.
──────────────────────────────────────────────────────────────── */

const CONTENT_KEY  = 'zenoContent';
const PASSWORD_KEY = 'zenoPassword';
const SESSION_KEY  = 'zenoAdminSession';
const DEFAULT_PW   = 'Zeno2024';

/* ── DEFAULT CONTENT ─────────────────────────────────────────── */
const DEFAULTS = {
  logoSrc:     '',
  heroBadge:   'Brunssum · Walk-ins Welcome',
  heroLine1:   'Welkom Bij',
  heroLine2:   'Kapsalon',
  heroLine2Em: 'Zeno.',
  heroSub:     'Jouw premium kapsalon in Brunssum. Altijd welkom, zonder afspraak.',
  services: [
    { name: 'Knippen & Stylen',            desc: 'Precisie knippen op maat — afgestemd op jouw gezichtsvorm en stijl.',                price: '€17' },
    { name: 'Knippen met Baard & Stylen',  desc: 'Het complete pakket — premium knipbeurt én perfect gesculpteerde baard in één.',    price: '€25' },
    { name: 'Kinderen Knippen',            desc: 'Speciaal voor kinderen t/m 12 jaar. Vakkundig, snel en in een fijne sfeer.',         price: '€15' },
    { name: 'Fade',                        desc: 'Strakke fade en scherpe lijnen voor een verzorgde, cleane afwerking.',              price: '€10' },
    { name: 'Baard Trimmen & Stylen',      desc: 'Jouw baard in model — precies getrimd en gestyled voor een stoere look.',           price: '€10' },
    { name: 'Gezichtsbehandeling',         desc: 'Verfrissende gezichtsbehandeling voor een stralende, verzorgde huid.',              price: '€10' },
  ],
  hours: { ma: 'Gesloten', di: '09:00 – 18:30', wo: '09:00 – 18:30', do: '09:00 – 18:30', vr: '09:00 – 18:30', za: '09:00 – 18:30', zo: '11:00 – 17:00' },
  gallery: [
    { src: 'galerij/skinfade.png',  label: 'Skin Fade' },
    { src: 'galerij/baard.png',     label: 'Baard' },
    { src: 'galerij/taper.png',     label: 'Classic Taper' },
    { src: 'galerij/fade.png',      label: 'Fade' },
    { src: 'galerij/kinderen.png',  label: 'Kinderen Knippen' },
    { src: 'galerij/stylen.png',    label: 'Knippen & Stylen' },
  ],
  reviews: [
    { text: '"Beste kapsalon in de regio, zonder twijfel. Zeno knipt mijn haar al jaren en ik ga nergens anders naartoe."', name: 'Rayan M.', role: 'Vaste klant' },
    { text: '"De fades zijn absoluut prachtig. De sfeer, de muziek, alles klopt. Ik kom hier elke keer weer terug!"',       name: 'Adam K.',  role: 'Vaste klant' },
    { text: '"Gewoon binnenlopen en je wordt meteen geholpen. Knippen was top en de prijs is meer dan eerlijk. Aanrader!"',  name: 'Kevin V.', role: 'Vaste klant' },
    { text: '"Liep binnen zonder afspraak, liep eruit als een nieuwe man. Het team is ongelooflijk getalenteerd. Top zaak!"', name: 'Tom B.',  role: 'Vaste klant' },
  ],
  aboutPhoto:  '',
  barberPhoto: '',
  aboutP1:     'Kapsalon Zeno staat voor kwaliteit, vakmanschap en een warme sfeer. Wij geloven dat elke man verdient om er op zijn best uit te zien — of je nu een afspraak hebt of gewoon binnenloopt.',
  aboutP2:     'We werken met passie en precisie, en combineren klassieke technieken met moderne stijlen. Bij Kapsalon Zeno ben je geen klant — je bent familie.',
  aboutF1Title: 'Zonder Afspraak',   aboutF1Desc: 'Loop gewoon binnen — we werken ook zonder afspraak, altijd welkom.',
  aboutF2Title: 'Vakkundig Team',    aboutF2Desc: 'Onze kappers zijn getraind in zowel klassieke als moderne technieken.',
  aboutF3Title: '6 Dagen Per Week',  aboutF3Desc: 'Di t/m za van 09:00–18:30, zondag van 11:00–17:00. Maandag gesloten.',
};

/* ── HELPERS ─────────────────────────────────────────────────── */
function getContent() {
  try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(CONTENT_KEY)) || {}); }
  catch(e) { return Object.assign({}, DEFAULTS); }
}
function saveContent(data) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
}
function getPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PW;
}
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function toast(msg, ok = true) {
  const el = document.getElementById('admin-toast');
  el.textContent = ok ? '✓ ' + msg : '✕ ' + msg;
  el.style.borderColor = ok ? 'var(--gold)' : 'var(--red)';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

/* ── AUTH ────────────────────────────────────────────────────── */
if (isLoggedIn()) {
  showDashboard();
} else {
  document.getElementById('login-screen').style.display = 'flex';
}

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const pw = document.getElementById('password-input').value;
  if (pw === getPassword()) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    document.getElementById('login-error').style.display = 'none';
    showDashboard();
  } else {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('password-input').value = '';
    document.getElementById('password-input').focus();
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

/* ── SHOW DASHBOARD ──────────────────────────────────────────── */
function showDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  buildServicesEditor();
  buildGalleryEditor();
  buildReviewsEditor();
  populateFields();
  populateLogoPreview();
  populateAboutPhotoPreviews();
}

/* ── TAB SWITCHING ───────────────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ── POPULATE FIELDS WITH SAVED DATA ────────────────────────── */
function populateFields() {
  const c = getContent();

  // Simple key → value fields
  document.querySelectorAll('[data-key]').forEach(input => {
    const key = input.dataset.key;
    if (key.startsWith('hours.')) {
      const day = key.split('.')[1];
      if (c.hours && c.hours[day] !== undefined) input.value = c.hours[day];
    } else if (c[key] !== undefined) {
      input.value = c[key];
    }
  });
}

/* ── LOGO UPLOAD ────────────────────────────────────────────── */
function populateLogoPreview() {
  const c = getContent();
  const preview = document.getElementById('logo-preview');
  const removeBtn = document.getElementById('logo-remove-btn');
  if (c.logoSrc) {
    preview.style.backgroundImage = `url('${c.logoSrc}')`;
    preview.querySelector('.preview-placeholder').style.display = 'none';
    removeBtn.style.display = 'inline-flex';
  }
}

window.handleLogoUpload = function(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    toast('Logo is te groot (max 2MB).', false);
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    const preview = document.getElementById('logo-preview');
    preview.style.backgroundImage = `url('${src}')`;
    preview.querySelector('.preview-placeholder').style.display = 'none';
    preview.dataset.newSrc = src;
    document.getElementById('logo-remove-btn').style.display = 'inline-flex';
    toast('Logo geladen. Klik op "Opslaan" om te bewaren.');
  };
  reader.readAsDataURL(file);
};

window.removeLogo = function() {
  const preview = document.getElementById('logo-preview');
  preview.style.backgroundImage = '';
  preview.querySelector('.preview-placeholder').style.display = '';
  delete preview.dataset.newSrc;
  preview.dataset.removeLogo = 'true';
  document.getElementById('logo-remove-btn').style.display = 'none';
  toast('Logo verwijderd. Klik op "Opslaan" om te bewaren.');
};

/* ── ABOUT PHOTO UPLOADS ────────────────────────────────────── */
function populateAboutPhotoPreviews() {
  const c = getContent();
  if (c.aboutPhoto) {
    const el = document.getElementById('about-photo-preview');
    el.style.backgroundImage = `url('${c.aboutPhoto}')`;
    el.querySelector('.preview-placeholder').style.display = 'none';
  }
  if (c.barberPhoto) {
    const el = document.getElementById('barber-photo-preview');
    el.style.backgroundImage = `url('${c.barberPhoto}')`;
    el.querySelector('.preview-placeholder').style.display = 'none';
  }
}

window.handleAboutPhotoUpload = function(input, type) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) {
    toast('Foto is te groot (max 3MB).', false);
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    const previewId = type === 'about' ? 'about-photo-preview' : 'barber-photo-preview';
    const preview = document.getElementById(previewId);
    preview.style.backgroundImage = `url('${src}')`;
    preview.querySelector('.preview-placeholder').style.display = 'none';
    preview.dataset.newSrc = src;
    toast(`${type === 'about' ? 'Zaak' : 'Kapper'} foto geladen. Klik op "Opslaan" om te bewaren.`);
  };
  reader.readAsDataURL(file);
};

/* ── BUILD SERVICES EDITOR ───────────────────────────────────── */
function buildServicesEditor() {
  const c = getContent();
  const container = document.getElementById('services-list');
  container.innerHTML = '';

  c.services.forEach((svc, i) => {
    const card = document.createElement('div');
    card.className = 'service-edit-card';
    card.innerHTML = `
      <div class="svc-header">
        <span class="svc-num">0${i + 1}</span>
        <span style="color:var(--text);font-weight:600;font-size:0.9rem">${svc.name}</span>
      </div>
      <div class="svc-fields">
        <div class="field">
          <label>Naam</label>
          <input type="text" data-svc-i="${i}" data-svc-field="name" value="${svc.name}" />
        </div>
        <div class="field">
          <label>Omschrijving</label>
          <input type="text" data-svc-i="${i}" data-svc-field="desc" value="${svc.desc}" />
        </div>
        <div class="field">
          <label>Prijs</label>
          <input type="text" data-svc-i="${i}" data-svc-field="price" value="${svc.price}" placeholder="€17" />
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ── BUILD GALLERY EDITOR ────────────────────────────────────── */
function buildGalleryEditor() {
  const c = getContent();
  const container = document.getElementById('gallery-list');
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'gallery-edit-grid';

  c.gallery.forEach((item, i) => {
    const cell = document.createElement('div');
    cell.className = 'gallery-edit-item';
    cell.innerHTML = `
      <div class="gallery-preview" id="gpreview-${i}" style="background-image: url('${item.src}')">
        <span class="preview-placeholder" style="${item.src ? 'display:none' : ''}">🖼️</span>
        <button type="button" class="upload-btn" onclick="document.getElementById('gupload-${i}').click()">📁 Foto wijzigen</button>
        <input type="file" id="gupload-${i}" accept="image/*" style="display:none" data-gallery-i="${i}" onchange="handleImageUpload(this)" />
      </div>
      <div class="gallery-edit-fields">
        <div class="field">
          <label>Bijschrift</label>
          <input type="text" data-gallery-label="${i}" value="${item.label}" placeholder="Bijschrift..." />
        </div>
      </div>
    `;
    grid.appendChild(cell);
  });

  container.appendChild(grid);
}

/* ── BUILD REVIEWS EDITOR ────────────────────────────────────── */
function buildReviewsEditor() {
  const c = getContent();
  const container = document.getElementById('reviews-list');
  container.innerHTML = '';

  const reviews = c.reviews || DEFAULTS.reviews;

  reviews.forEach((rev, i) => {
    const card = document.createElement('div');
    card.className = 'service-edit-card';
    card.innerHTML = `
      <div class="svc-header">
        <span class="svc-num">⭐ ${i + 1}</span>
        <span style="color:var(--text);font-weight:600;font-size:0.9rem">${rev.name}</span>
      </div>
      <div class="svc-fields" style="grid-template-columns: 1fr 1fr">
        <div class="field" style="grid-column: 1 / -1">
          <label>Review tekst</label>
          <textarea data-rev-i="${i}" data-rev-field="text" rows="2" style="resize:vertical">${rev.text}</textarea>
        </div>
        <div class="field">
          <label>Naam</label>
          <input type="text" data-rev-i="${i}" data-rev-field="name" value="${rev.name}" />
        </div>
        <div class="field">
          <label>Rol / Omschrijving</label>
          <input type="text" data-rev-i="${i}" data-rev-field="role" value="${rev.role}" placeholder="Vaste klant" />
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ── IMAGE UPLOAD ────────────────────────────────────────────── */
window.handleImageUpload = function(input) {
  const i = parseInt(input.dataset.galleryI);
  const file = input.files[0];
  if (!file) return;

  if (file.size > 3 * 1024 * 1024) {
    toast('Foto is te groot (max 3MB). Verklein de foto en probeer opnieuw.', false);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    const preview = document.getElementById(`gpreview-${i}`);
    preview.style.backgroundImage = `url('${src}')`;
    preview.querySelector('.preview-placeholder').style.display = 'none';
    // Store temporarily in dataset
    preview.dataset.newSrc = src;
    toast(`Foto ${i + 1} geladen. Klik op "Opslaan" om te bewaren.`);
  };
  reader.readAsDataURL(file);
};

/* ── SAVE BUTTONS ────────────────────────────────────────────── */
document.querySelectorAll('.btn-save[data-panel]').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.dataset.panel;
    const c = getContent();

    if (panel === 'home') {
      // Save logo
      const logoPreview = document.getElementById('logo-preview');
      if (logoPreview.dataset.newSrc) {
        c.logoSrc = logoPreview.dataset.newSrc;
        delete logoPreview.dataset.newSrc;
      } else if (logoPreview.dataset.removeLogo === 'true') {
        c.logoSrc = '';
        delete logoPreview.dataset.removeLogo;
      }

      // Save hero text
      ['heroBadge','heroLine1','heroLine2','heroLine2Em','heroSub'].forEach(key => {
        const inp = document.querySelector(`[data-key="${key}"]`);
        if (inp) c[key] = inp.value;
      });
      toast('Homepage & logo opgeslagen!');
    }

    else if (panel === 'diensten') {
      document.querySelectorAll('[data-svc-i]').forEach(inp => {
        const i = parseInt(inp.dataset.svcI);
        const field = inp.dataset.svcField;
        if (!c.services[i]) c.services[i] = {};
        c.services[i][field] = inp.value;
      });
      toast('Diensten & prijzen opgeslagen!');
    }

    else if (panel === 'hours') {
      if (!c.hours) c.hours = {};
      ['ma','di','wo','do','vr','za','zo'].forEach(day => {
        const inp = document.querySelector(`[data-key="hours.${day}"]`);
        if (inp) c.hours[day] = inp.value;
      });
      toast('Openingstijden opgeslagen!');
    }

    else if (panel === 'gallery') {
      if (!c.gallery) c.gallery = DEFAULTS.gallery.slice();
      // Collect labels
      document.querySelectorAll('[data-gallery-label]').forEach(inp => {
        const i = parseInt(inp.dataset.galleryLabel);
        if (!c.gallery[i]) c.gallery[i] = {};
        c.gallery[i].label = inp.value;
      });
      // Collect uploaded images
      document.querySelectorAll('.gallery-preview[data-new-src]').forEach(preview => {
        const id = preview.id; // gpreview-N
        const i = parseInt(id.replace('gpreview-', ''));
        if (!c.gallery[i]) c.gallery[i] = {};
        c.gallery[i].src = preview.dataset.newSrc;
        delete preview.dataset.newSrc;
      });
      toast('Galerij opgeslagen!');
    }

    else if (panel === 'reviews') {
      if (!c.reviews) c.reviews = DEFAULTS.reviews.slice();
      document.querySelectorAll('[data-rev-i]').forEach(inp => {
        const i = parseInt(inp.dataset.revI);
        const field = inp.dataset.revField;
        if (!c.reviews[i]) c.reviews[i] = {};
        c.reviews[i][field] = inp.value;
      });
      toast('Reviews opgeslagen!');
    }

    else if (panel === 'about') {
      // Save about photos
      const aboutPreview = document.getElementById('about-photo-preview');
      if (aboutPreview.dataset.newSrc) {
        c.aboutPhoto = aboutPreview.dataset.newSrc;
        delete aboutPreview.dataset.newSrc;
      }
      const barberPreview = document.getElementById('barber-photo-preview');
      if (barberPreview.dataset.newSrc) {
        c.barberPhoto = barberPreview.dataset.newSrc;
        delete barberPreview.dataset.newSrc;
      }

      // Save text
      ['aboutP1','aboutP2','aboutF1Title','aboutF1Desc','aboutF2Title','aboutF2Desc','aboutF3Title','aboutF3Desc'].forEach(key => {
        const inp = document.querySelector(`[data-key="${key}"]`);
        if (inp) c[key] = inp.value;
      });
      toast('Over Ons pagina opgeslagen!');
    }

    saveContent(c);
  });
});

/* ── CHANGE PASSWORD ─────────────────────────────────────────── */
document.getElementById('pw-save-btn').addEventListener('click', () => {
  const current  = document.getElementById('pw-current').value;
  const newPw    = document.getElementById('pw-new').value;
  const confirm  = document.getElementById('pw-confirm').value;
  const msgEl    = document.getElementById('pw-msg');

  msgEl.style.display = 'none';

  if (current !== getPassword()) {
    msgEl.textContent = 'Huidig wachtwoord is onjuist.';
    msgEl.style.display = 'block';
    return;
  }
  if (newPw.length < 6) {
    msgEl.textContent = 'Nieuw wachtwoord moet minimaal 6 tekens zijn.';
    msgEl.style.display = 'block';
    return;
  }
  if (newPw !== confirm) {
    msgEl.textContent = 'Wachtwoorden komen niet overeen.';
    msgEl.style.display = 'block';
    return;
  }

  localStorage.setItem(PASSWORD_KEY, newPw);
  document.getElementById('pw-current').value = '';
  document.getElementById('pw-new').value = '';
  document.getElementById('pw-confirm').value = '';
  toast('Wachtwoord succesvol gewijzigd!');
});
