/* main.js | Portfolio
   Míriam Domínguez Martínez
*/

/*
   Step 1 · Theme Toggle
   Step 2 · Image Fallbacks
   Step 3 · Project Modal
   Step 4 · Email Validation
*/


/* =================
   STEP 1 · THEME TOGGLE
   Persists the light/dark preference in localStorage to
   avoid a flash of the wrong theme on reload.
   =================
*/

// 1.1 · Restore — applies the saved theme before the first paint
(function restoreTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
})();

// 1.2 · Toggle — called from the button in the HTML (onclick)
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}


/* =================
   STEP 2 · IMAGE FALLBACKS
   Hides broken images so the container background fills the
   space cleanly — no broken icon, no alt text rendered.
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
   Opens a modal populated from the card's data-* attributes,
   manages focus, scroll lock, and multiple close triggers.
   =================
*/

// 3.1 · DOM references
const modal      = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalImg   = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');
const modalTags  = document.getElementById('modalTags');
const modalLink  = document.getElementById('modalLink');

// 3.2 · Open modal — populates content from the card's data-* attributes
function openModal(card) {
  const title = card.dataset.title || 'Project';
  const desc  = card.dataset.desc  || '';
  const tech  = card.dataset.tech  || '';
  const link  = card.dataset.link  || '#';
  const img   = card.querySelector('.project-img');

  modalTitle.textContent = title;
  modalDesc.textContent  = desc;
  modalLink.href         = link;
  modalImg.src           = img ? img.src : '';
  modalImg.alt           = img ? img.alt : title;

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

// 3.3 · Close modal — restores page scroll
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

modalClose.addEventListener('click', closeModal);                              // ✕ button

modal.addEventListener('click', function (e) {                                 // Backdrop click
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', function (e) {                            // Escape key
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});


/* =================
   STEP 4 · EMAIL VALIDATION
   Validates email format before allowing submission
   =================
*/

const newsletterInput = document.querySelector('.newsletter-input');
const newsletterBtn = document.querySelector('.newsletter-btn');

// 4.1 · Email validation regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 4.2 · Handle button state based on input
if (newsletterInput && newsletterBtn) {
  newsletterInput.addEventListener('input', function () {
    const isValid = isValidEmail(this.value.trim());
    newsletterBtn.disabled = !isValid;
    newsletterBtn.style.opacity = isValid ? '1' : '0.5';
    newsletterBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
  });

  // 4.3 · Handle form submission
  newsletterBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const email = newsletterInput.value.trim();
    
    if (isValidEmail(email)) {
      console.log('Email válido:', email);
      // TODO: Backend integration would go here
      alert('Thank you!');
      newsletterInput.value = '';
      newsletterBtn.disabled = true;
      newsletterBtn.style.opacity = '0.5';
    }
  });

  // 4.4 · Allow Enter key to submit
  newsletterInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !newsletterBtn.disabled) {
      newsletterBtn.click();
    }
  });
}
