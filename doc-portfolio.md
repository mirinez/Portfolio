## {M} Portfolio - Technical Documentation

**Míriam Domínguez Martínez** · Full Stack Web Developer · 2026

> Portfolio online: [miriam-dominguezm.com](https://miriam-dominguezm.com/)

---

### Table of Contents

1. [Introduction](#1-introduction)
2. [index.html — Structure](#2-indexhtml--structure)
3. [styles.css — Styles](#3-stylescss--styles)
4. [script.js — Interactivity](#4-scriptjs--interactivity)

---

## 1. Introduction

This document contains the technical documentation for my personal portfolio. The project has been developed using pure web technologies **HTML, CSS, and vanilla JavaScript** without any additional frameworks, with a focus on learning, thorough code documentation, responsive design, and clean aesthetics.

**Project objective:** to create an online presence that reflects my technical and creative personality, clean, organized, with nods to the development ecosystem (VSCode aesthetics, monospace fonts, dark mode) and that works perfectly on any device.

### File Structure

```
/
├── index.html                        → Main structure
├── styles.css                        → Styles and design system
├── script.js                         → Interactivity (light/dark theme)
├── README.md
├── CNAME                             → Custom domain for GitHub Pages
├── font/
│   ├── JetBrainsMono-Regular.woff2
│   ├── JetBrainsMono-Bold.woff2
│   ├── SourceCodePro-Regular.ttf.woff2
│   ├── SourceCodePro-Bold.ttf.woff2
│   ├── SpaceMono-Regular.ttf
│   └── SpaceMono-Bold.ttf
└── img/
    ├── code.png
    ├── colors.png
    ├── colors-dark.png
    └── template.png
```

---

## 2. index.html - Structure

The HTML file is the skeleton of the project. It is organized into well-defined semantic sections with comments that facilitate navigation through the code.

### `<head>`

Configures charset, viewport for responsiveness, page title, and external resources (favicon, CSS).

- `charset="UTF-8"` - ensures special characters like the **í** in the name render correctly
- `viewport` meta tag - essential for responsive design to work on mobile devices
- Local font and favicon links - no external dependencies

### `<nav>` - Navigation

Fixed navigation bar (`position: fixed`) containing the logo, section links, and theme toggle.

| Element | Description |
|---|---|
| `.logo` | Displays `{M}` - the letter M in dark text, brackets in green, symbolizing a function/object |
| `.nav-links` | List of 5 links anchoring to sections (`href="#id"`), each with a `span.num` in green |
| `#themeToggle` | Button that activates dark mode. `aria-label` improves accessibility for screen readers |
| `.theme-icon` | Symbol `◐` (light mode) that changes to `○` in dark mode - logic handled in `script.js` |

### `<section class="hero">` - Hero Section

Occupies 100% of the viewport (`min-height: 100vh`) and is divided into two columns.

#### Left column - Main content

| Element | Description |
|---|---|
| `.comment` | Text box simulating a code comment. `span.glitching-text` applies the glitch animation to "bug" and "ritual" |
| `.hero-title` | `<h1>` in Space Mono. `.highlight` colors the word "Stack". `span.cursor` generates the blinking cursor with CSS |
| `.stack-pills` | Flex container with tech pills (HTML, CSS, JavaScript, React) |
| `.hero-ctas` | Two CTAs: `btn-primary` (green fill) and `btn-outline` (green border) |
| `.vscode-mini` | Simplified code panel — **only visible on mobile**, hidden on desktop via CSS |

#### Right column - VSCode panel

Full panel simulating a code editor, visible only on desktop screens (hidden on mobile via CSS, replaced by `.vscode-mini`).

**Syntax color classes** (inspired by a dark VSCode theme):

| Class | Element | Color |
|---|---|---|
| `.vsc-ln` | Line numbers | Gray `#636D83` |
| `.vsc-tag` | HTML tags | Red/pink `#e06c75` |
| `.vsc-attr` | Attributes | Orange `#d19a66` |
| `.vsc-val` | Attribute values | Light green `#5da08f` |
| `.vsc-cnt` | Text content | Light gray `#e2ecea` |
| `.vsc-com` | HTML comments | Blue-gray italic `#6b717f` |

`.vscode-badge` floating badge below the panel showing "HTML · No errors" with a pulsing green dot.

### `#about` - About Me Section

Section header follows a consistent pattern used across all sections:
- Large decorative number (`span.section-num`)
- Title in JetBrains Mono (`h2.section-title`)
- Flexible horizontal line filling remaining space (`div.section-line`)
- The final dot uses `.section-dot` to apply the green accent color independently

**Content grid:**

| `.about-left` | Prose paragraphs: background, current location, development focus |
| `.about-right` | Principles card with `// Principles` label and bulleted list **hidden on mobile** (design decision) |

### Pending Sections

| Section | ID | Planned content |
|---|---|---|
| Education | `#education` | CFGS, courses, certifications |
| Projects | `#projects` | Gallery or grid of completed projects |
| Philosophy | `#philosophy` | Development philosophy and values |
| Contact | `#contact` | Form or contact details (email, GitHub, LinkedIn) |

All pending sections share the same layout classes (`.section-header`, `.section-num`, etc.) to maintain visual consistency throughout the site.

---

## 3. styles.css - Styles

The styles file is organized into **15 numbered sections**. It uses CSS custom properties (variables) to maintain consistency and enable dark mode cleanly, and loads local fonts to avoid external dependencies.

### Local Fonts (`@font-face`)

Three typeface families declared locally, no Google Fonts, for better privacy and loading speed. `font-display: swap` prevents FOIT (flash of invisible text) and improves perceived performance.

| Font | Role |
|---|---|
| **JetBrains Mono** | Main body font — maximum readability, code editor aesthetics |
| **Source Code Pro** | VSCode panel font — replicates the look and feel of a real editor |
| **Space Mono** | Hero title font — distinctive character at large sizes |

### Variable System (`:root`)

All color decisions are centralized in `:root` CSS variables. This allows the entire site palette to be changed by editing only this section, and enables clean dark mode without duplicating CSS rules.

**Light mode (default)** base variables defined on `:root`.

**Dark mode** activated by adding `data-theme="dark"` to `<body>` via JavaScript. The same variable names are overridden under `[data-theme="dark"]`, so all elements update automatically without any extra rules.

### Global Reset and Base Styles

Universal box-sizing reset and baseline font/color declarations applied to all elements.

### Navigation

Key technique: `backdrop-filter: blur(12px)` creates the **glassmorphism effect**, content behind the nav bar appears blurred. Requires a semi-transparent background (`rgba` with `alpha < 1`) to be visible.

### Hero Layout

Two-column grid (`display: grid`). Left column holds the main content, right column holds the VSCode panel simulation.

### CSS Animations

| Animation | Element | Behavior |
|---|---|---|
| **Glitch** | `span.glitching-text` ("bug", "ritual") | Simulates signal interference. Runs for only 10% of a 2s loop (90–100%), making it striking without being visually tiring |
| **Cursor blink** | `span.cursor` | Uses `step-end` instead of `ease` for instantaneous on/off blinking — like a real terminal cursor |
| **Pulsing dot** | `.dot-status` (badge) | Infinite 2s pulse on the "HTML · No errors" badge |

### Hero Typography

`clamp()` is used for fluid font sizing. Sizes grow with the viewport between a defined minimum and maximum, eliminating the need for typography-specific media queries.

```css
/* Example pattern */
font-size: clamp(min, preferred, max);
```

### Technology Pills and Buttons

`.stack-pills` uses flexbox with `gap` and `flex-wrap`. Pills use the green accent color with a subtle border. Buttons (`.btn-primary`, `.btn-outline`) follow the same color system, primary has a solid green fill, outline has a transparent background with a green border.

### VSCode Panel

Styled to replicate a dark editor theme. Uses `Source Code Pro` for authentic feel. Indentation is handled with `.vsc-indent1`, `.vsc-indent2`, `.vsc-indent3` classes for visual depth.

### About Me Section

`position: sticky` on the principles card, as the user scrolls through the about section, the card stays visible within its parent container. An elegant technique for keeping contextual information in view without JavaScript.

### Responsive Design

Three main breakpoints, from largest to smallest:

| Breakpoint | Layout |
|---|---|
| `> 900px` | Full desktop - hero in 2 columns, horizontal nav, full VSCode panel visible |
| `≤ 900px` | Tablet / large mobile - hero in 1 column, full VSCode panel hidden, mini-panel visible, nav in 2 rows |
| `≤ 480px` | Mobile - reduced margins, smaller title, compact nav font |
| `≤ 360px` | Small mobile - fine adjustments for Galaxy S or older iPhone SE screens |

**Key responsive rules:**
- `.vscode-panel` (desktop) → `display: none` at `≤ 900px`
- `.vscode-mini` (mobile) → `display: none` at `> 900px`
- `.about-right` (principles) → hidden on mobile (design decision)

> **Note:** The mini code panel required significant work, problems included it appearing under the desktop panel, lines being cut off, and overflow issues. Resolution involved careful use of `padding`, `overflow`, and adding extra left padding for line numbers inside the mini panel (not needed in the main panel).

---

## 4. script.js - Interactivity

The JavaScript file is deliberately minimal and vanilla, its only responsibility is managing the light/dark mode toggle, with persistence via `localStorage`.

### Logic Overview

```
User visits the page
└── Is there a preference saved in localStorage?
    ├── Yes ("dark") → body.setAttribute("data-theme", "dark") + icon ○
    └── No           → default light mode + icon ◐

User clicks the theme button
├── Read current state: does body have data-theme="dark"?
├── Toggle: dark → light  or  light → dark
├── Update icon visually
└── Save new preference in localStorage
```

### Key Methods

| Method | Role |
|---|---|
| `getElementById("themeToggle")` | Selects the button by ID — faster than `querySelector` |
| `querySelector(".theme-icon")` | Selects the icon span inside the button |
| `localStorage.getItem("theme")` | Reads saved preference from the browser (persists between sessions) |
| `setAttribute("data-theme", "dark")` | Adds the attribute to `<body>` — CSS detects it and applies dark mode variables |
| `icon.textContent` | Switches the icon character: `◐` = light mode, `○` = dark mode |
| `localStorage.setItem(...)` | Saves the new preference for the next visit |

The logic is written functionally without external state, each click determines the current state directly by reading the DOM, eliminating possible inconsistencies.

---

*by Míriam Domínguez Martínez · 2026*
