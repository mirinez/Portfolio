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
   Step 6 · Language Bar Animation
   Step 6b · Scroll To Top Button
   Step 7 · Click sound (This part of the code was an idea copied entirely from the internet)
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
  modalDesc.innerHTML = desc.replace(/\n/g, '<br>');
  modalLink.href         = demo;

  /*
    The card's <img> may have display:none (set by suppressBrokenIcon) which
    makes naturalWidth unreliable. Instead we probe the src with a fresh Image
    object that is never added to the DOM, so display never interferes.
    We clear the wrap first, then inject an <img> only if the probe succeeds.
  */
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
  detailDesc.innerHTML = desc.replace(/\n/g, '<br>');

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
        video.muted       = true;                  // required for autoplay in all browsers
        video.playsInline = true;                  // iOS: prevents fullscreen takeover
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

    if (playgroundView) {
      playgroundView.classList.add('view-hidden');
      playgroundView.setAttribute('aria-hidden', 'true');
    }

    mainView.setAttribute('aria-hidden', 'true');
    detailView.classList.remove('view-hidden');
    detailView.setAttribute('aria-hidden', 'false');

    document.body.classList.add('detail-active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    detailBack.focus();

  } else if (view === 'playground') {
    mainView.classList.add('view-hidden');
    detailView.classList.add('view-hidden');

    mainView.setAttribute('aria-hidden', 'true');
    detailView.setAttribute('aria-hidden', 'true');

    if (playgroundView) {
      playgroundView.classList.remove('view-hidden');
      playgroundView.setAttribute('aria-hidden', 'false');
    }

    document.body.classList.add('detail-active');

    requestAnimationFrame(function () {
      centerPlaygroundCanvas();
      randomizePlaygroundItems();
    });

  } else {
    detailView.classList.add('view-hidden');
    detailView.setAttribute('aria-hidden', 'true');

    if (playgroundView) {
      playgroundView.classList.add('view-hidden');
      playgroundView.setAttribute('aria-hidden', 'true');
    }

    mainView.classList.remove('view-hidden');
    mainView.setAttribute('aria-hidden', 'false');

    document.body.classList.remove('detail-active');
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

    if (route === 'playground') {
    showView('playground');

    } else if (route === 'project' && param && projectsMap[param]) {
      // SPA route → render detail view
      renderDetailView(projectsMap[param]);
      showView('detail');
    } else {
      /* 
        Section anchor (#about, #projects, etc.) or empty hash →
        only switch back to main view if we were in the detail view,
        and let the browser handle the native anchor scroll naturally.
      */
      if (
        !detailView.classList.contains('view-hidden') ||
        (playgroundView && !playgroundView.classList.contains('view-hidden'))
      ) {
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
// Delayed until playground references are initialized

/* =================
   STEP 5b · PLAYGROUND VIEW
   Free draggable canvas with centered intro message.
   Uses the same hash router system as the project detail view.
   =================
*/

// 5b.1 · View references
const playgroundView     = document.getElementById('playgroundView');
const playgroundViewport = document.getElementById('playgroundViewport');
const playgroundCanvas   = document.getElementById('playgroundCanvas');
const playgroundBack     = document.getElementById('playgroundBack');
const playgroundCenter   = document.getElementById('playgroundCenter');

// 5b.2 · Drag state
let isDraggingPlayground = false;
let playgroundStartX     = 0;
let playgroundStartY     = 0;
let currentCanvasX       = 0;
let currentCanvasY       = 0;

// 5b.3 · Updates the canvas position
function updatePlaygroundCanvas() {
  if (!playgroundCanvas) return;

  playgroundCanvas.style.transform =
    `translate(${currentCanvasX}px, ${currentCanvasY}px)`;
}

// 5b.4 · Centers the welcome message on first open
function centerPlaygroundCanvas() {
  if (!playgroundViewport || !playgroundCenter) return;

  const viewportRect = playgroundViewport.getBoundingClientRect();
  const centerRect   = playgroundCenter.getBoundingClientRect();

  const canvasWidth = 4000;
  const canvasHeight = 3000;

  const centerX = viewportRect.width / 2 - (canvasWidth / 2);
  const centerY = viewportRect.height / 2 - (canvasHeight / 2);

  currentCanvasX = centerX;
  currentCanvasY = centerY;

  updatePlaygroundCanvas();
}


function randomizePlaygroundItems() {
  const items = document.querySelectorAll('.playground-item');
  if (!items.length || !playgroundCenter) return;

  // Remove any previous visibility classes so the animation re-runs
  items.forEach(function (item) {
    item.classList.remove('pg-visible');
  });

  // Canvas centre anchor
  const originX = 2000;
  const originY = 1500;

  // Safe zone around the tagline, items must not overlap this area
  const safeW = 350; /* Bajar o subir los num hace que als fotos se acerquen mas o menos al texto */
  const safeH = 100;

  /*
    Items are distributed across two loose orbital rings so they
    surround the tagline naturally without bunching in a single circle.
    Alternating items go on inner vs outer ring to create depth.
  */
  const rings = [
    { minR: 280, maxR: 280 },  // inner ring
    { minR: 410, maxR: 380 },  // outer ring
  ];

  const placed = [];

  items.forEach(function (item, idx) {
    const iW = item.offsetWidth  || 268;
    const iH = item.offsetHeight || 200;

    const ring = rings[idx % rings.length];

    let x = 0;
    let y = 0;
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 500) {
      attempts++;

      // Spread angle evenly then add jitter so items are not perfectly equidistant
      const baseAngle = (Math.PI * 2 / items.length) * idx - Math.PI / 2;
      const jitter    = (Math.random() - 0.5) * (Math.PI / items.length) * 1.4;
      const angle     = baseAngle + jitter;
      const r         = ring.minR + Math.random() * (ring.maxR - ring.minR);

      x = originX + Math.cos(angle) * r - iW / 2;
      y = originY + Math.sin(angle) * r - iH / 2;

      // Must clear the centre safe zone
      const clearCenter =
        x + iW < originX - safeW / 2 ||
        x       > originX + safeW / 2 ||
        y + iH  < originY - safeH / 2 ||
        y       > originY + safeH / 2;

      // Must not overlap already-placed items (16px gap)
      const clearOthers = placed.every(function (p) {
        return (
          x + iW + 16 < p.x          ||
          x            > p.x + p.w + 16 ||
          y + iH + 16  < p.y          ||
          y            > p.y + p.h + 16
        );
      });

      if (clearCenter && clearOthers) valid = true;
    }

    placed.push({ x, y, w: iW, h: iH });

    // Rotation: use the value from data-rot if provided, else random ±10°
    const dataRot = parseFloat(item.dataset.rot);
    const rot     = isNaN(dataRot) ? (Math.random() * 20) - 10 : dataRot;

    item.style.left = x + 'px';
    item.style.top  = y + 'px';
    item.style.setProperty('--item-rotation', rot + 'deg');
    item.style.transform = 'rotate(' + rot + 'deg)';

    // Staggered fade-in: each item appears 60ms after the previous one
    setTimeout(function () {
      item.classList.add('pg-visible');
    }, 80 + idx * 60);
  });
}

// 5b.5 · Starts dragging
if (playgroundViewport) {
  playgroundViewport.addEventListener('mousedown', function (e) {
    isDraggingPlayground = true;
    playgroundViewport.classList.add('dragging');

    playgroundStartX = e.clientX - currentCanvasX;
    playgroundStartY = e.clientY - currentCanvasY;
  });
}

// 5b.6 · Moves canvas while dragging
window.addEventListener('mousemove', function (e) {
  if (!isDraggingPlayground) return;

  currentCanvasX = e.clientX - playgroundStartX;
  currentCanvasY = e.clientY - playgroundStartY;

  updatePlaygroundCanvas();
});

// 5b.7 · Ends dragging
window.addEventListener('mouseup', function () {
  isDraggingPlayground = false;

  if (playgroundViewport) {
    playgroundViewport.classList.remove('dragging');
  }
});

// 5b.8 · Mobile touch support
if (playgroundViewport) {
  playgroundViewport.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];

    isDraggingPlayground = true;
    playgroundStartX = touch.clientX - currentCanvasX;
    playgroundStartY = touch.clientY - currentCanvasY;
  }, { passive: true });
}

window.addEventListener('touchmove', function (e) {
  if (!isDraggingPlayground) return;

  const touch = e.touches[0];

  currentCanvasX = touch.clientX - playgroundStartX;
  currentCanvasY = touch.clientY - playgroundStartY;

  updatePlaygroundCanvas();
}, { passive: true });

window.addEventListener('touchend', function () {
  isDraggingPlayground = false;
});

// 5b.9 · Back button
if (playgroundBack) {
  playgroundBack.addEventListener('click', function () {
    router.navigate('');
  });
}

// 5b.10 · Handle the initial route after all playground refs exist
router.handle();

/* =================
   STEP 6 · LANGUAGE BAR ANIMATION
   Uses IntersectionObserver so the bars fill only when the
   section scrolls into view, making the animation feel intentional.
   Falls back gracefully if IntersectionObserver is not available.
   =================
*/

(function initLangBars() {
  const fills = document.querySelectorAll('.lang-bar-fill');
  if (!fills.length) return;

  function animateBars(entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const fill      = entry.target;
      const targetPct = fill.dataset.width || '0';
      // Set the CSS custom property the transition reads from
      fill.style.setProperty('--lang-target-width', targetPct + '%');
      fill.classList.add('lang-bar-animated');
      observer.unobserve(fill); // fire once only
    });
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(animateBars, {
      threshold: 0.3 // trigger when 30% of the bar is visible
    });
    fills.forEach(function (fill) { obs.observe(fill); });
  } else {
    // Fallback: fill immediately without animation
    fills.forEach(function (fill) {
      fill.style.setProperty('--lang-target-width', (fill.dataset.width || '0') + '%');
      fill.classList.add('lang-bar-animated');
    });
  }
})();


/* =================
   STEP 6b · SCROLL TO TOP BUTTON
   Shows after the user scrolls down 300 px.
   Works in both the main view and the detail view.
   =================
*/

(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  // Toggle visibility based on scroll position
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll smoothly to the top on click
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* =================
   STEP 7 · SOUND ENGINE
   Click sound reverse-engineered from a real mechanical mouse sample:
     Press   - bandpass noise centred on ~830 Hz, decay ~5 ms
     Release - bandpass noise centred on ~690 Hz, decay ~7 ms, at +78 ms
   Uses the Web Audio API, no external files required.
   Silenced automatically when prefers-reduced-motion is active.
   =================
*/

/*
  7.1 · AudioContext, lazily created on the first user gesture to 
  comply with browser autoplay policies (Chrome, Safari, Firefox).
*/

const sfx = (function () {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Respect the OS-level "reduce motion"
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
  7.2 · snap, short filtered-noise burst modelling a single switch hit.
  at    : AudioContext timestamp (seconds)
  freq  : bandpass centre frequency (Hz), sets the "pitch" of the click
  q     : filter Q higher = narrower band = more tonal
  vol   : peak gain
  decay : time (s) to fade to silence
*/

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

/* 
  7.3 · Mechanical mouse click, two snaps derived from spectral analysis of a real mouse sample:
  Press   : ~830 Hz centre, very tight decay (5 ms)
  Release : ~690 Hz centre (lower/darker), slightly longer (7 ms)
  arrives 78 ms after the press, measured from the sample.
*/

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

/* 
  7.4 · Universal click listener, one delegated handler on the document
  catches every click that originates from a button, link, or any
  element with a recognised interactive role / attribute, without
  touching the existing individual listeners.
*/ 

document.addEventListener('click', function (e) {
  const target = e.target.closest(
    'button, a, [role="button"], [tabindex], .photo-item, label'
  );
  if (target) sfx.click();
}, { passive: true });


/* =================
   STEP 5c · DRAGGABLE PLAYGROUND ITEMS
   Allows each playground card to be picked up and moved independently.
   =================
*/

let activePlaygroundItem = null;
let activeItemOffsetX = 0;
let activeItemOffsetY = 0;

document.querySelectorAll('.draggable-item').forEach(function (item) {
  item.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    e.preventDefault();

    activePlaygroundItem = item;
    item.classList.add('dragging-item');

    const itemRect = item.getBoundingClientRect();
    activeItemOffsetX = e.clientX - itemRect.left;
    activeItemOffsetY = e.clientY - itemRect.top;
  });

  item.addEventListener('touchstart', function (e) {
    e.stopPropagation();

    const touch = e.touches[0];
    activePlaygroundItem = item;
    item.classList.add('dragging-item');

    const itemRect = item.getBoundingClientRect();
    activeItemOffsetX = touch.clientX - itemRect.left;
    activeItemOffsetY = touch.clientY - itemRect.top;
  }, { passive: true });
});

window.addEventListener('mousemove', function (e) {
  if (!activePlaygroundItem || !playgroundCanvas) return;

  const canvasRect = playgroundCanvas.getBoundingClientRect();

  const left = e.clientX - canvasRect.left - activeItemOffsetX;
  const top = e.clientY - canvasRect.top - activeItemOffsetY;

  activePlaygroundItem.style.left = left + 'px';
  activePlaygroundItem.style.top = top + 'px';
});

window.addEventListener('touchmove', function (e) {
  if (!activePlaygroundItem || !playgroundCanvas) return;

  const touch = e.touches[0];
  const canvasRect = playgroundCanvas.getBoundingClientRect();

  const left = touch.clientX - canvasRect.left - activeItemOffsetX;
  const top = touch.clientY - canvasRect.top - activeItemOffsetY;

  activePlaygroundItem.style.left = left + 'px';
  activePlaygroundItem.style.top = top + 'px';
}, { passive: true });

function releasePlaygroundItem() {
  if (!activePlaygroundItem) return;

  activePlaygroundItem.classList.remove('dragging-item');
  activePlaygroundItem = null;
}

window.addEventListener('mouseup', releasePlaygroundItem);
window.addEventListener('touchend', releasePlaygroundItem);
