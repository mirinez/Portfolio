## PORTFOLIO PROJECT STRUCTURE - COMPLETE GUIDE

### Quick Overview

```
portfolio-project/
├── index.html                    # Main HTML file
├── styles.css                    # All styling (responsive, theme toggle, animations)
├── main.js                       # JavaScript (modal, theme, validation, email)
├── README.md                     # Project documentation
├── CNAME                         # GitHub Pages custom domain configuration
│
├── img/                          # Image assets folder
│   ├── avatar.jpg                # Your profile picture (72x72px+, square)
│   ├── p-1.jpg                   # Portfolio project preview
│   ├── p-2.jpg                   # Student Platform project preview
│   ├── p-3.jpg                   # Postcard Simulator project preview
│   └── svg/                      # SVG icons folder
│       ├── github.svg            # GitHub icon (20x20px, black)
│       └── linkedin.svg          # LinkedIn icon (20x20px, black)
│
└── font/                         # Font files folder (WOFF2 format)
    ├── Inter-Light.woff2         # font-weight: 300
    ├── Inter-Regular.woff2       # font-weight: 400
    ├── Inter-Medium.woff2        # font-weight: 500
    ├── Inter-SemiBold.woff2      # font-weight: 600
    ├── Inter-Bold.woff2          # font-weight: 700
    └── DancingScript-Bold.woff2  # Signature font
```

---

##  FILE DESCRIPTIONS

### Core Files

**index.html**
- Main HTML structure of the portfolio
- Contains all sections: Hero, Projects, About, Education, Beyond the Code, Contact
- Semantic HTML with ARIA labels for accessibility
- Project cards with data-* attributes for modal population
- Newsletter form with email input
- Theme toggle button

**styles.css**
- Complete styling for all elements
- CSS variables for theming (light & dark modes)
- Responsive design with 3 breakpoints:
  - Desktop (> 900px): Tilted cards with hover effects
  - Tablet (768px - 900px): 3-column grid, always-visible titles
  - Mobile (< 600px): Single-column stack, optimized touch
- Animations: pulse keyframes, smooth transitions, hover effects
- Font loading via @font-face

**main.js**
- Step 1: Theme toggle with localStorage persistence
- Step 2: Image fallback handling (hides broken images)
- Step 3: Project modal (click to open, keyboard navigation)
- Step 4: Email validation for newsletter signup

**README.md**
- Complete project documentation
- Features overview
- Customization instructions
- Deployment guides
- Accessibility details

**CNAME**
- Custom domain configuration for GitHub Pages
- Leave empty or add your domain (e.g., miriam.dev)

---

## IMAGE ASSETS

### img/ Folder Structure

```
img/
├── avatar.jpg              # Profile picture
│   └─ Size: 72x72px minimum (square)
│   └─ Used in: Hero section
│
├── p-1.jpg                 # Portfolio project
│   └─ Size: 400x280px+ (landscape)
│   └─ Used in: Projects strip, modal
│
├── p-2.jpg                 # Student Platform
│   └─ Size: 400x280px+ (landscape)
│   └─ Used in: Projects strip, modal
│
├── p-3.jpg                 # Postcard Simulator
│   └─ Size: 400x280px+ (landscape)
│   └─ Used in: Projects strip, modal
│
└── svg/
    ├── github.svg          # GitHub icon
    │   └─ Size: 20x20px, black SVG
    │   └─ Used in: Footer social links
    │
    └── linkedin.svg        # LinkedIn icon
        └─ Size: 20x20px, black SVG
        └─ Used in: Footer social links
```

### Image Specifications

| Image | Dimensions | Format | Usage | Required |
|-------|-----------|--------|-------|----------|
| avatar.jpg | 72x72px+ (square) | JPG/PNG/WebP | Hero profile pic | Yes* |
| p-1.jpg | 400x280px+ | JPG/PNG/WebP | Portfolio card | Yes* |
| p-2.jpg | 400x280px+ | JPG/PNG/WebP | Student Platform | Yes* |
| p-3.jpg | 400x280px+ | JPG/PNG/WebP | Postcard Simulator | Yes* |
| github.svg | 20x20px | SVG | Footer social | Yes* |
| linkedin.svg | 20x20px | SVG | Footer social | Yes* |

*Missing images will degrade gracefully (background color shows, no broken icons)

---

## FONT FILES

### font/ Folder Structure

**Inter Font Family** (Main UI font)
```
font/
├── Inter-Light.woff2       # font-weight: 300 (light text)
├── Inter-Regular.woff2     # font-weight: 400 (body text)
├── Inter-Medium.woff2      # font-weight: 500 (labels)
├── Inter-SemiBold.woff2    # font-weight: 600 (section titles)
└── Inter-Bold.woff2        # font-weight: 700 (headings)
```

**Dancing Script** (Signature font)
```
font/
└── DancingScript-Bold.woff2 # font-weight: 700 (footer signature)
```

### Font Sources

- **Inter**: https://fonts.google.com/specimen/Inter
  - Download all weights (300, 400, 500, 600, 700)
  - Export as WOFF2

- **Dancing Script**: https://fonts.google.com/specimen/Dancing+Script
  - Download Bold weight (700)
  - Export as WOFF2

### Font Fallbacks (if missing)

```css
Inter → sans-serif
Dancing Script → cursive
```

---

## CUSTOMIZATION GUIDE

### 1. Update Profile Information

**Edit these sections in index.html:**

```html
<!-- Hero section -->
<img class="avatar" src="img/avatar.jpg" alt="Your Name - Profile picture" />
<h1 class="name">Your Name</h1>
<p class="tagline">Your Tagline Here</p>

<!-- About section -->
<p class="about-text">Your bio here...</p>
<div class="about-tags">
  <span class="about-tag">Skill 1</span>
  <span class="about-tag">Skill 2</span>
  <!-- more skills -->
</div>

<!-- Education section -->
<div class="edu-card">
  <div class="edu-date">Year - Year</div>
  <div class="edu-title">Course/Degree Name</div>
  <div class="edu-location">Location - Institution</div>
  <div class="edu-desc">Description...</div>
</div>
```

### 2. Update Project Cards

**Edit data-* attributes in index.html:**

```html
<div class="photo-item"
     data-title="Your Project Name"
     data-desc="Full project description here"
     data-tech="HTML, CSS, JavaScript, React"
     data-link="https://project-url.com"
     ...>
  <img src="img/p-1.jpg" alt="Project preview" class="project-img" />
  <div class="project-overlay" aria-hidden="true">
    <span class="project-title">Your Project Name</span>
    <span class="project-view-hint">Click to learn more →</span>
  </div>
</div>
```

### 3. Change Colors

**Edit CSS variables in styles.css:**

```css
:root {
  /* Light mode colors */
  --bg-outer:       #eef0f3;      /* Page background */
  --bg-card:        #ffffff;      /* Card background */
  --bg-card-inner:  #f5f6f8;      /* Inner card sections */
  --text-primary:   #1a1f2e;      /* Main text color */
  --text-secondary: #6b7280;      /* Secondary text */
  --text-muted:     #9ca3af;      /* Muted/subtle text */
  --border:         #e5e7eb;      /* Border color */
  --btn-bg:         #1a1f2e;      /* Button background */
  --btn-text:       #ffffff;      /* Button text */
}

body.dark {
  /* Dark mode colors (same variable names, different values) */
  --bg-outer:       #0d1117;
  --bg-card:        #161b27;
  /* ... etc ... */
}
```

### 4. Update Social Links

**Edit footer in index.html:**

```html
<a href="https://github.com/YOUR-USERNAME" class="footer-icon" aria-label="GitHub profile">
  <img src="img/svg/github.svg" alt="GitHub" class="footer-icon-img" />
</a>
<a href="https://linkedin.com/in/YOUR-PROFILE" class="footer-icon" aria-label="LinkedIn profile">
  <img src="img/svg/linkedin.svg" alt="LinkedIn" class="footer-icon-img" />
</a>
```

### 5. Update CNAME (if using custom domain)

```
miriam.dev
```

---

## RESPONSIVE DESIGN BREAKPOINTS

### Desktop (> 900px)
- Full 3-column layout with side areas.
- Project cards: Tilted 2° and lifted 4px.
- Overlay and hints: Hidden by default, visible on hover.
- Center column width: 740px.

### Tablet (768px - 900px)
- Project cards: 3 in a row, no tilt.
- Overlay and hints: **Always visible** (not just on hover).
- Center column width: 100% with padding.
- Photo height: 120px.

### Mobile (< 600px)
- Single column layout.
- Project cards: Stacked vertically.
- Overlay: Always visible.
- Hint: Hidden (display: none).
- Photo height: 180px.
- Full-width cards.

---

## JAVASCRIPT FEATURES

### Step 1: Theme Toggle
```javascript
toggleTheme()  // Called from HTML button
// Saves preference to localStorage
// Applies/removes 'dark' class on <body>
```

### Step 2: Image Fallbacks
```javascript
// Automatically hides broken images
// No broken icon appears, background color shows
```

### Step 3: Project Modal
```javascript
openModal(card)   // Opens modal with project data
closeModal()      // Closes modal, restores scroll
// Keyboard shortcuts: Enter, Space, Escape
// Accessible with focus management
```

### Step 4: Email Validation
```javascript
isValidEmail(email)  // Validates email format
// Real-time validation on input
// Button disabled until valid email
// Supports Enter key to submit
```
---

**Created by:** Míriam Domínguez Martínez  
**Last updated:** 2026
