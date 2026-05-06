/*
   main.js | Portfolio
   Míriam Domínguez Martínez
*/

/*
   Step 1  - Theme Toggle
   Step 2  - Image Fallbacks
   Step 3  - Project Modal
   Step 4  - Email Validation
   Step 5  - SPA Router (main view / detail view)
   Step 6  - Language Bar Animation
   Step 6b - Scroll To Top Button
   Step 7  - Click Sound
   Step 8  - Scroll Reveal
   Step 9  - Typed Text Hero
   Step 10 - Float Badge Timing
*/


/* =================
   STEP 1 - THEME TOGGLE
   Persists the light/dark preference in localStorage
   =================
*/

// 1.1 - Restore: applies the saved theme before the first paint
(function restoreTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
})();

// 1.2 - Toggle: called from the button in the HTML (onclick)
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}


/* =================
   STEP 2 - IMAGE FALLBACKS
   Hides broken images so the container background fills the
   space cleanly, no broken icon, no alt text rendered
   =================
*/

// 2.1 - Suppresses the broken-image icon on a given <img>
function suppressBrokenIcon(img) {
  img.addEventListener('error', function () {
    img.style.display = 'none';
  });
}

// 2.2 - Apply to all existing images on load
document.querySelectorAll('img').forEach(suppressBrokenIcon);


/* =================
   STEP 3 - PROJECT MODAL
   Opens a quick-peek modal from the card's data-* attributes.
   A "Full Details" button inside the modal navigates to the
   SPA detail view for that project, using the same data-id as the hash param
   =================
*/

// 3.1 - DOM references
const modal           = document.getElementById('projectModal');
const modalClose      = document.getElementById('modalClose');
const modalImgWrap    = document.getElementById('modalImgWrap');
const modalTitle      = document.getElementById('modalTitle');
const modalDesc       = document.getElementById('modalDesc');
const modalTags       = document.getElementById('modalTags');
const modalLink       = document.getElementById('modalLink');
const modalDetailBtn  = document.getElementById('modalDetailBtn');

// 3.2 - Open modal: populates content from the card's data-* attributes
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

  /*
    We clear the wrap first, then inject an <img> only if the probe succeeds.
    This way if the image URL is broken, the modal still opens with the title and description,
    and the wrap area just shows the background color without a broken icon or alt text
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

// 3.3 - Close modal: restores page scroll
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// 3.4 - Open / close event listeners
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

// 3.5 - Focus trap: keeps Tab key inside the modal while it's open
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
   STEP 5 - SPA ROUTER
   Hash-based routing:
     #project/:id   -> project detail view
     empty / other  -> main portfolio view

   Browser back/forward buttons work natively via popstate.
   =================
*/

// 5.1 - Collect all project cards into a map keyed by data-id
const projectsMap = {};
document.querySelectorAll('.photo-item[data-id]').forEach(function (card) {
  projectsMap[card.dataset.id] = card;
});

// 5.2 - View references
const mainView   = document.getElementById('mainView');
const detailView = document.getElementById('detailView');

// 5.3 - Detail view DOM references
const detailTitle     = document.getElementById('detailTitle');
const detailDesc      = document.getElementById('detailDesc');
const detailFeatures  = document.getElementById('detailFeatures');
const detailTags      = document.getElementById('detailTags');
const detailGallery   = document.getElementById('detailGallery');
const detailDemoBtn   = document.getElementById('detailDemoBtn');
const detailGithubBtn = document.getElementById('detailGithubBtn');
const detailBack      = document.getElementById('detailBack');

// 5.4 - Populate the detail view with data from a project card
function renderDetailView(card) {
  const title    = card.dataset.title    || 'Project';
  const desc     = card.dataset.longDesc || card.dataset.desc || '';
  const tech     = card.dataset.tech     || '';
  const features = card.dataset.features || '';
  const github   = card.dataset.github   || '#';
  const demo     = card.dataset.demo     || '#';
  const images   = card.dataset.images   || '';

  // Title
  detailTitle.textContent = title;

  // Long description
  detailDesc.textContent = desc;

  // Gallery: pipe-separated media paths (images or .mp4 videos)
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
        video.className   = 'detail-gallery-img'; // reuses same sizing CSS
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

  // Features: pipe-separated list
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

// 5.5 - Show/hide views with a smooth transition
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
    // Default: show main view, hide detail
    detailView.classList.add('view-hidden');
    detailView.setAttribute('aria-hidden', 'true');

    mainView.classList.remove('view-hidden');
    mainView.setAttribute('aria-hidden', 'false');

    document.body.classList.remove('detail-active');
  }
}

// 5.6 - Router: reads the current hash and routes accordingly
const router = {
  // Parse hash into { route, param }
  parse: function () {
    const hash  = window.location.hash.replace('#', '');
    const parts = hash.split('/');
    return { route: parts[0], param: parts[1] || null };
  },

  // Programmatic navigation: pushes a new history entry
  navigate: function (path) {
    window.location.hash = path;
  },

  // Handle the current hash state (called on load + popstate)
  handle: function () {
    const { route, param } = router.parse();

    if (route === 'project' && param && projectsMap[param]) {
      renderDetailView(projectsMap[param]);
      showView('detail');

    } else {
      /*
        Section anchor (#about, #projects, etc.) or empty hash:
        only switch back to main view if we were already in the detail view.
        The browser handles the native anchor scroll by itself.
      */
      if (!detailView.classList.contains('view-hidden')) {
        showView('main');
      }
    }
  }
};

// 5.7 - Back button: goes to the previous history entry
detailBack.addEventListener('click', function () {
  /*
    If there's history to go back to, use it; otherwise fall back to home hash
    to ensure we don't get stuck on a non-existent hash
  */
  if (history.length > 1) {
    history.back();
  } else {
    router.navigate('');
  }
});

// 5.8 - Listen for hash changes (back/forward buttons, direct URL)
window.addEventListener('hashchange', function () {
  router.handle();
});

// Initial route
router.handle();


/* =================
   STEP 6 - LANGUAGE BAR ANIMATION
   Uses IntersectionObserver so the bars fill only when the
   section scrolls into view, making the animation feel intentional.
   Each bar's target percentage is stored in a data-width attribute.
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
   STEP 6b - SCROLL TO TOP BUTTON
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
   STEP 7 - SOUND ENGINE
   Click sound reverse-engineered from a real mechanical mouse sample:
     Press   - bandpass noise centred on ~830 Hz, decay ~5 ms
     Release - bandpass noise centred on ~690 Hz, decay ~7 ms, at +78 ms
   Uses the Web Audio API, no external files required.
   Silenced automatically when prefers-reduced-motion is active.
   =================
*/

/*
  7.1 - AudioContext is created on demand, and resumed if suspended, to comply with browser autoplay policies
*/

const sfx = (function () {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Respect the OS-level "reduce motion" setting
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*
    7.2 - snap: short filtered-noise burst modelling a single switch hit.
    at    : AudioContext timestamp (seconds)
    freq  : bandpass centre frequency (Hz), sets the "pitch" of the click
    q     : filter Q, higher = narrower band = more tonal
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

    const src  = c.createBufferSource();
    src.buffer = buf;

    // Narrow bandpass, concentrates energy around the target frequency
    const bp           = c.createBiquadFilter();
    bp.type            = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value         = q;

    // Soft roll-off above 5 kHz to remove harshness
    const lp           = c.createBiquadFilter();
    lp.type            = 'lowpass';
    lp.frequency.value = 5000;

    const gain = c.createGain();
    gain.gain.setValueAtTime(vol,    at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);

    src.connect(bp);
    bp.connect(lp);
    lp.connect(gain);
    gain.connect(c.destination);

    src.start(at);
    src.stop(at + decay + 0.005);
  }

  /*
    7.3 - Mechanical mouse click: two snaps derived from spectral analysis of a real mouse sample.
    Press   : ~830 Hz centre, very tight decay (5 ms)
    Release : ~690 Hz centre (lower/darker), slightly longer (7 ms), arrives 78 ms after press
  */

  return {
    click: function () {
      if (reducedMotion) return;
      const c   = getCtx();
      const now = c.currentTime;

      snap(now,         830, 2.2, 0.55, 0.005); // press
      snap(now + 0.078, 690, 2.0, 0.38, 0.007); // release
    }
  };
})();

/*
  7.4 - Universal click listener: one delegated handler on the document
  catches every click that originates from a button, link, or any
  element with an interactive role/attribute
*/

document.addEventListener('click', function (e) {
  const target = e.target.closest(
    'button, a, [role="button"], [tabindex], .photo-item, label'
  );
  if (target) sfx.click();
}, { passive: true });


/* =================
   STEP 8 - SCROLL REVEAL
   IntersectionObserver adds .sr-visible to any .sr element
   when it enters the viewport for the first time, triggering CSS transitions.
     - threshold 0.12 means the element is considered "visible" when 12% of it is in view
     - rootMargin with a negative bottom value triggers the reveal slightly before the element
       fully enters the viewport, creating a smoother effect
   =================
*/

(function initScrollReveal() {
  const elements = document.querySelectorAll('.sr');
  if (!elements.length) return;

  // Fallback for old browsers that don't support IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('sr-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function (el) { observer.observe(el); });
})();


/* =================
   STEP 9 - TYPED TEXT HERO
   Cycles through role labels with a blinking cursor, using a simple custom typewriter effect.
   =================
*/

(function initTypedText() {
  const tagline = document.querySelector('.tagline');
  if (!tagline) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const words  = ['Full Stack Developer', 'Frontend Enthusiast', 'Learning to code magic'];
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  // Insert cursor span (aria-hidden so screen readers ignore it)
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  function type() {
    if (paused) return;

    const currentWord = words[wordIdx];

    if (!deleting) {
      charIdx++;
      tagline.textContent = currentWord.slice(0, charIdx);
      tagline.appendChild(cursor);

      if (charIdx === currentWord.length) {
        // Pause before deleting
        paused = true;
        setTimeout(function () {
          deleting = true;
          paused   = false;
          setTimeout(type, 60);
        }, 1800);
        return;
      }
      setTimeout(type, 70);

    } else {
      charIdx--;
      tagline.textContent = currentWord.slice(0, charIdx);
      tagline.appendChild(cursor);

      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        // Brief pause between words
        paused = true;
        setTimeout(function () {
          paused = false;
          setTimeout(type, 70);
        }, 400);
        return;
      }
      setTimeout(type, 38);
    }
  }

  // Small delay so the hero fade-in completes first
  setTimeout(type, 800);
})();


/* =================
   STEP 10 - FLOAT BADGE TIMING
   Each badge (Tech stack tags) gets a random float duration and delay within a defined range.
   These values are set as CSS custom properties, creating a floating effect.
   =================
*/

(function initFloatBadges() {
  document.querySelectorAll('.about-tag').forEach(function (badge) {
    const dur   = (2.5 + Math.random() * 2).toFixed(2) + 's';
    const delay = (Math.random() * 1.5).toFixed(2) + 's';
    badge.style.setProperty('--float-dur',   dur);
    badge.style.setProperty('--float-delay', delay);
  });
})();

/* ================= 
   STEP 11 - EMAILJS CONTACT FORM
   Uses EmailJS to send form submissions directly to my email without a backend.
   =================
*/

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Inicialiting EmailJS with my Public Key
emailjs.init('usS7zxBmmO109wEpM');

// DOM references for the contact form and button
const contactForm = document.getElementById('contactForm');
const contactBtn  = document.getElementById('contactBtn');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!email || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    contactBtn.disabled = true;
    const originalText = contactBtn.textContent;
    contactBtn.textContent = '...';

    const templateParams = {
        from_email: email,         
        name: email.split('@')[0], 
        message: message,       
        time: new Date().toLocaleString() 
    };

    emailjs.send('service_t324zdc', 'template_ysdjdd9', templateParams)
    .then(function() {
        showToast('Message sent correctly!');
        contactForm.reset();
    })
    .catch(function(err) {
        showToast('Error sending message', 'error');
        console.error(err);
    })
    .finally(function() {
        contactBtn.disabled = false;
        contactBtn.textContent = originalText;
    });
  });
}