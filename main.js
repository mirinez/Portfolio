/* 
   main.js | Portfolio
   Míriam Domínguez Martínez
*/

/*
   Step 1 · Theme Toggle
   Step 2 · Image Fallbacks
   Step 3 · Project Modal
   Step 4 · Email Validation
   Step 5 · SPA Router - Project Detail View
   Step 6 · Click sound (This part of the code was an idea copied entirely from the internet)
*/


/* =================
   STEP 1 · THEME TOGGLE
   Persists the light/dark preference in localStorage to
   avoid a flash of the wrong theme on reload.
   =================
*/

// 1.1 · Restore, applies the saved theme before the first paint
(function restoreTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
})();

// 1.2 · Toggle, called from the button in the HTML (onclick)
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}


/* =================
   STEP 2 · IMAGE FALLBACKS
   Hides broken images so the container background fills the
   space cleanly, no broken icon, no alt text rendered.
   =================
*/

// 2.1 · Suppresses the broken-image icon on a given <img>
function suppressBrokenIcon(img) {
  img.addEventListener('error', function () {
    img.style.display = 'none';
  });
}

// 2.2 · Apply to all existing images on load
document.querySelectorAll('img').forEach(suppressBrokenIcon);


/* =================
   STEP 3 · PROJECT MODAL
   Opens a quick-peek modal from the card's data-* attributes.
   A "Full Details →" button inside the modal navigates to the
   SPA detail view.
   =================
*/

// 3.1 · DOM references
const modal           = document.getElementById('projectModal');
const modalClose      = document.getElementById('modalClose');
const modalImgWrap    = document.getElementById('modalImgWrap');
const modalTitle      = document.getElementById('modalTitle');
const modalDesc       = document.getElementById('modalDesc');
const modalTags       = document.getElementById('modalTags');
const modalLink       = document.getElementById('modalLink');
const modalDetailBtn  = document.getElementById('modalDetailBtn');

// 3.2 · Open modal, populates content from the card's data-* attributes
function openModal(card) {
  const title = card.dataset.title || 'Project';
  const desc  = card.dataset.desc  || '';
  const tech  = card.dataset.tech  || '';
  const demo  = card.dataset.demo  || '#';
  const id    = card.dataset.id    || '';
  const img   = card.querySelector('.project-img');

  modalTitle.textContent = title;
  modalDesc.textContent  = desc;
  modalLink.href         = demo;

  // The card's <img> may have display:none (set by suppressBrokenIcon) which
  // makes naturalWidth unreliable. Instead we probe the src with a fresh Image
  // object that is never added to the DOM, so display never interferes.
  // We clear the wrap first, then inject an <img> only if the probe succeeds.
  modalImgWrap.innerHTML = '';
  const src = img ? img.getAttribute('src') : '';
  if (src) {
    const probe = new Image();
    probe.onload = function () {
      const modalImg     = document.createElement('img');
      modalImg.src       = src;
      modalImg.alt       = img.alt;
      modalImg.className = 'modal-img';
      modalImgWrap.appendChild(modalImg);
    };
    probe.onerror = function () { /* wrap stays empty, no broken icon */ };
    probe.src = src;
  }

  // Hide "View Project" button if no real demo link provided
  modalLink.style.display = (demo && demo !== '#') ? '' : 'none';

  // Wire the "Full Details" button to the SPA router
  modalDetailBtn.onclick = function () {
    closeModal();
    router.navigate('project/' + id);
  };

  // Build tech tag pills from the comma-separated string
  modalTags.innerHTML = '';
  if (tech.trim()) {
    tech.split(',').forEach(function (tag) {
      const span       = document.createElement('span');
      span.className   = 'modal-tag';
      span.textContent = tag.trim();
      modalTags.appendChild(span);
    });
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

// 3.3 · Close modal, restores page scroll
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// 3.4 · Open / close event listeners
document.querySelectorAll('.photo-item').forEach(function (card) {
  card.addEventListener('click', function () { openModal(card); });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', function (e) {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

// 3.5 · Focus trap, keeps Tab key inside the modal while it's open
modal.addEventListener('keydown', function (e) {
  if (!modal.classList.contains('is-open') || e.key !== 'Tab') return;
  const focusable = Array.from(
    modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
});


/* =================
   STEP 4 · EMAIL VALIDATION
   =================
*/

const newsletterInput = document.querySelector('.newsletter-input');
const newsletterBtn   = document.querySelector('.newsletter-btn');

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

if (newsletterInput && newsletterBtn) {
  newsletterInput.addEventListener('input', function () {
    const isValid = isValidEmail(this.value.trim());
    newsletterBtn.disabled           = !isValid;
    newsletterBtn.style.opacity      = isValid ? '1' : '0.5';
    newsletterBtn.style.cursor       = isValid ? 'pointer' : 'not-allowed';
  });

  newsletterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const email = newsletterInput.value.trim();
    if (isValidEmail(email)) {
      console.log('Email válido:', email);
      alert('Thank you!');
      newsletterInput.value      = '';
      newsletterBtn.disabled     = true;
      newsletterBtn.style.opacity = '0.5';
    }
  });

  newsletterInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !newsletterBtn.disabled) {
      newsletterBtn.click();
    }
  });
}


/* =================
   STEP 5 · SPA ROUTER PROJECT DETAIL VIEW
   Hash-based routing:  #project/:id  →  detail view
   Empty hash / no match →  main portfolio view
   Browser back / forward buttons work natively via popstate.
   =================
*/

// 5.1 · Collect all project cards into a map keyed by data-id
const projectsMap = {};
document.querySelectorAll('.photo-item[data-id]').forEach(function (card) {
  projectsMap[card.dataset.id] = card;
});

// 5.2 · View references
const mainView   = document.getElementById('mainView');
const detailView = document.getElementById('detailView');

// 5.3 · Detail view DOM references
const detailTitle     = document.getElementById('detailTitle');
const detailDesc      = document.getElementById('detailDesc');
const detailFeatures  = document.getElementById('detailFeatures');
const detailTags      = document.getElementById('detailTags');
const detailGallery   = document.getElementById('detailGallery');
const detailDemoBtn   = document.getElementById('detailDemoBtn');
const detailGithubBtn = document.getElementById('detailGithubBtn');
const detailBack      = document.getElementById('detailBack');

// 5.4 · Populate the detail view with data from a project card
function renderDetailView(card) {
  const title      = card.dataset.title     || 'Project';
  const desc       = card.dataset.longDesc  || card.dataset.desc || '';
  const tech       = card.dataset.tech      || '';
  const features   = card.dataset.features  || '';
  const github     = card.dataset.github    || '#';
  const demo       = card.dataset.demo      || '#';
  const images     = card.dataset.images    || '';

  // Title
  detailTitle.textContent = title;

  // Long description
  detailDesc.textContent = desc;

  // Gallery, pipe-separated media paths (images or .mp4 videos)
  detailGallery.innerHTML = '';
  if (images.trim()) {
    images.split('|').forEach(function (src) {
      const cleanSrc = src.trim();
      const wrap     = document.createElement('div');
      wrap.className = 'detail-gallery-item';

      if (cleanSrc.match(/\.mp4(\?.*)?$/i)) {
        // Video: autoplay, loop, muted, no controls
        const video       = document.createElement('video');
        video.src         = cleanSrc;
        video.className   = 'detail-gallery-img';  // reuses same sizing CSS
        video.autoplay    = true;
        video.loop        = true;
        video.muted       = true;       // required for autoplay in all browsers
        video.playsInline = true;       // iOS: prevents fullscreen takeover
        video.setAttribute('aria-label', title + ' demo video');
        video.addEventListener('error', function () {
          wrap.style.display = 'none';
        });
        wrap.appendChild(video);
      } else {
        // Image fallback
        const img = document.createElement('img');
        img.src       = cleanSrc;
        img.alt       = title + ' screenshot';
        img.className = 'detail-gallery-img';
        suppressBrokenIcon(img);
        wrap.appendChild(img);
      }

      detailGallery.appendChild(wrap);
    });
  }

  // Features, separated list
  detailFeatures.innerHTML = '';
  if (features.trim()) {
    features.split('|').forEach(function (feat) {
      const li       = document.createElement('li');
      li.className   = 'detail-feature-item';
      li.textContent = feat.trim();
      detailFeatures.appendChild(li);
    });
  }

  // Tech stack tags
  detailTags.innerHTML = '';
  if (tech.trim()) {
    tech.split(',').forEach(function (tag) {
      const span       = document.createElement('span');
      span.className   = 'detail-tag';
      span.textContent = tag.trim();
      detailTags.appendChild(span);
    });
  }

  // Action buttons
  detailDemoBtn.href   = demo;
  detailGithubBtn.href = github;

  // Hide buttons if no real link provided
  detailDemoBtn.style.display   = (demo   && demo   !== '#') ? '' : 'none';
  detailGithubBtn.style.display = (github && github !== '#') ? '' : 'none';
}

// 5.5 · Show / hide views with a smooth transition
function showView(view) {
  if (view === 'detail') {
    mainView.classList.add('view-hidden');
    mainView.setAttribute('aria-hidden', 'true');
    detailView.classList.remove('view-hidden');
    detailView.setAttribute('aria-hidden', 'false');
    document.body.classList.add('detail-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    detailBack.focus();
  } else {
    detailView.classList.add('view-hidden');
    detailView.setAttribute('aria-hidden', 'true');
    mainView.classList.remove('view-hidden');
    mainView.setAttribute('aria-hidden', 'false');
    document.body.classList.remove('detail-active');
    // Note: no scrollTo here — we let the browser handle native anchor scrolling
  }
}

// 5.6 · Router, reads the current hash and routes accordingly
const router = {
  // Parse hash → route segments
  parse: function () {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('/');
    return { route: parts[0], param: parts[1] || null };
  },

  // Programmatic navigation, pushes a new history entry
  navigate: function (path) {
    window.location.hash = path;
  },

  // Handle the current hash state (called on load + popstate)
  handle: function () {
    const { route, param } = router.parse();

    if (route === 'project' && param && projectsMap[param]) {
      // SPA route → render detail view
      renderDetailView(projectsMap[param]);
      showView('detail');
    } else {
      // Section anchor (#about, #projects, etc.) or empty hash →
      // only switch back to main view if we were in the detail view,
      // and let the browser handle the native anchor scroll naturally.
      if (!detailView.classList.contains('view-hidden')) {
        showView('main');
      }
    }
  }
};

// 5.7 · Back button, goes to the previous history entry
detailBack.addEventListener('click', function () {
  // If there's history to go back to, use it; otherwise fall back to home hash
  if (history.length > 1) {
    history.back();
  } else {
    router.navigate('');
  }
});

// 5.8 · Listen for hash changes (back / forward buttons, direct URL)
window.addEventListener('hashchange', function () {
  router.handle();
});

// 5.9 · Handle the initial hash on page load
router.handle();


/* =================
   STEP 6 · SOUND ENGINE
   Click sound reverse-engineered from a real mechanical mouse sample:
     Press   - bandpass noise centred on ~830 Hz, decay ~5 ms
     Release - bandpass noise centred on ~690 Hz, decay ~7 ms, at +78 ms
   Uses the Web Audio API, no external files required.
   Silenced automatically when prefers-reduced-motion is active.
   =================
*/

// 6.1 · AudioContext, lazily created on the first user gesture to
//       comply with browser autoplay policies (Chrome, Safari, Firefox).
const sfx = (function () {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Respect the OS-level "reduce motion" preference as a proxy for
  // users who want a quieter, less stimulating experience.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 6.2 · snap, short filtered-noise burst modelling a single switch hit.
  //   at    : AudioContext timestamp (seconds)
  //   freq  : bandpass centre frequency (Hz), sets the "pitch" of the click
  //   q     : filter Q higher = narrower band = more tonal
  //   vol   : peak gain
  //   decay : time (s) to fade to silence
  function snap(at, freq, q, vol, decay) {
    const c = getCtx();

    // White noise source
    const bufSize = Math.ceil(c.sampleRate * (decay + 0.004));
    const buf     = c.createBuffer(1, bufSize, c.sampleRate);
    const d       = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

    const src    = c.createBufferSource();
    src.buffer   = buf;

    // Narrow bandpass, concentrates energy around the target frequency
    const bp     = c.createBiquadFilter();
    bp.type            = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value         = q;

    // Soft roll-off above 5 kHz to remove harshness
    const lp     = c.createBiquadFilter();
    lp.type            = 'lowpass';
    lp.frequency.value = 5000;

    const gain   = c.createGain();
    gain.gain.setValueAtTime(vol,   at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);

    src.connect(bp);
    bp.connect(lp);
    lp.connect(gain);
    gain.connect(c.destination);

    src.start(at);
    src.stop(at + decay + 0.005);
  }

  // 6.3 · Mechanical mouse click, two snaps derived from spectral analysis
  //       of a real mouse sample:
  //         Press   : ~830 Hz centre, very tight decay (5 ms)
  //         Release : ~690 Hz centre (lower/darker), slightly longer (7 ms)
  //                   arrives 78 ms after the press, measured from the sample.
  return {
    click: function () {
      if (reducedMotion) return;
      const c   = getCtx();
      const now = c.currentTime;

      snap(now,         830, 2.2, 0.55, 0.005);   // press
      snap(now + 0.078, 690, 2.0, 0.38, 0.007);   // release
    }
  };
})();

// 6.4 · Universal click listener, one delegated handler on the document
//       catches every click that originates from a button, link, or any
//       element with a recognised interactive role / attribute, without
//       touching the existing individual listeners.
document.addEventListener('click', function (e) {
  const target = e.target.closest(
    'button, a, [role="button"], [tabindex], .photo-item, label'
  );
  if (target) sfx.click();
}, { passive: true });
