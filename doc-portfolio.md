# Portfolio

Notebook: Portfolio (https://www.notion.so/Portfolio-321365943b2e8089b6caea24e97cea65?pvs=21)

**{M} Technical Documentation of the Portfolio**

Míriam Domínguez Martínez - *Full Stack Web Developer · 2026*

---

1. **Introduction**

This document contains the technical documentation for my personal portfolio. The project has been developed using pure web technologies, **HTML, CSS, and vanilla JavaScript**, without any additional frameworks at this time, with a focus on learning, good documentation of my code, responsive design, and clean aesthetics.

The portfolio is available online at: [miriam-dominguezm.com](https://miriam-dominguezm.com/)

**Project objective:** to create an online presence that reflects my technical and creative personality, as well as being clean and organized, with nods to the development ecosystem (VSCode, monospace, dark mode) and that works perfectly on any device.

**The file structure is as follows:**

```
/

├── index.html       
├── styles.css      
├── script.js         → Interactivity (light/dark theme)
├── [README.md](http://readme.md/)    
├── CNAME             → Custom domain for GitHub Pages
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

1. **index.html** 

The HTML file as the skeleton of the style. It is organized into well-defined semantic sections, with comments that facilitate navigation through the code.

- **<head>**

![](/doc-port-img/image.png)

*The header configures the charset, the viewport for responsiveness, the title, and external resources (favicon, CSS). The **charset="UTF-8"** ensures that special characters such as the **í** in the name are displayed correctly. The viewport meta tag is essential for the responsive design to work on mobile devices.*

- **<nav>**

![](/doc-port-img/image%201.png)

| **.logo** | Displays {M} with the letter M in dark text color and the brackets in green, symbolizing function/object |
| --- | --- |
| **.nav-links** | List of 5 links with anchors to sections (href="#id"). Each one has a span.num with the number in green |
| **#themeToggle** | Button that activates dark mode. The aria-label improves accessibility for screen readers |
| **.theme-icon** | Symbol ◐ (crescent moon) that changes to ○ in dark mode — logic in script.js |

*The navigation bar is fixed (position: fixed) and contains the logo, section links, and theme switch button.* 

- **Hero section**

*The hero section occupies 100% of the window (min-height: 100vh) and is divided into two columns: the left column with the main content and the right column with the panel simulating VSCode.*

**Left column:** 

![](/doc-port-img/code.png)

*Here I put a short description, my title, and anchor a couple of glitch animations to two words that I then anchor in the CSS.*

| **.comment** | Text box simulating a code comment. The span.glitching-text has glitch animation. |
| --- | --- |
| **.hero-title** | H1 in Space Mono. The word Stack has the .highlight class. The span.cursor generates the flashing with CSS |
| **.stack-pills** | Flex container with pills for each technology in the current stack |
| **.hero-ctas** | Two CTAs: btn-primary (green fill) and btn-outline (green border) |

**Right column:**

Here there are two code panels, the one shown on computers and the one shown on other devices, which is a mini code panel. Later, using CSS, I will hide each one respectively, so that on mobile phones and other screens only a mini code panel is visible, and on computers the original complete panel with more text is visible.

![](/doc-port-img/image%202.png)

![](/doc-port-img/image%203.png)

**Mini code panel:** 

![](/doc-port-img/image%204.png)

*The syntax classes of the VSCode panel follow the color palette of a typical dark theme in both panels:*

| **.vsc-ln** | Line number — gray (#636D83) |
| --- | --- |
| **.vsc-tag** | HTML tags — red/pink (#e06c75) |
| **.vsc-attr** | Attributes — orange (#d19a66) |
| **.vsc-val** | Attribute values — light green (#5da08f) |
| **.vsc-cnt** | Text content — light gray (#e2ecea) |
| **.vsc-com** | HTML comments — blue-gray italic (#6b717f) |
| **.vscode-badge** | Floating badge below the panel with pulsing green dot |

*It's inspired by my VSCode theme.*

**Code panel:**

![](/doc-port-img/image%205.png)

*Also, superimposed below the code panel, both the mini and the main one, I have a speech bubble with **HTML - No errors** and a flashing green dot.*

![](/doc-port-img/image%206.png)

- **About Me section**

The section header always follows the same pattern: large decorative number + title in **JetBrains Mono** + flexible horizontal line that occupies the remaining space. The final dot has the class .section-dot to color it green independently.

![](/doc-port-img/image%207.png)

![](/doc-port-img/image%208.png)

*The list of **Principles** disappears on mobile devices thanks to CSS**,** due to a design decision.*

- **Pending sections**

| **#education  .section-education** | Education — CFGS, courses, certifications |
| --- | --- |
| **#projects   .section-projects** | Gallery or grid of completed projects |
| **#philosophy .section-philosophy** | Development philosophy and values as a programmer |
| **#contact    .section-contact** | Form or contact details (email, GitHub, LinkedIn) |

*Each section shares the same layout classes (.section-header, .section-num, etc.) to maintain visual consistency throughout the site.*

---

1. **styles.css**

The styles file is organized into 15 numbered sections. It uses CSS variables (custom properties) to maintain consistency and facilitate dark mode, and local fonts to avoid external dependencies.

- **Local fonts**

*Three typeface families are declared with **@font-face,** serving the files locally (without Google Fonts) for greater privacy and loading speed*.

| **JetBrains Mono** | Main body font — maximum readability, code editor aesthetics |
| --- | --- |
| **Source Code Pro** | VSCode panel font — replicates the look and feel of a real editor |
| **Space Mono** | Hero title font — distinctive character and larger size |

*font-display: swap prevents "flash of invisible text" (FOIT) and improves the perception of speed.*

![](/doc-port-img/image%209.png)

- **Variable system**

All color decisions are centralized in :root variables. This allows you to change the entire site palette by editing only this section, and enables dark mode cleanly.

**Light or original mode variables:**

![](/doc-port-img/image%2010.png)

**Dark mode variables:**

![](/doc-port-img/image%2011.png)

*Dark mode is activated by adding data-theme="dark" to the <body> element using JavaScript. By overriding the same variables, **all elements on the site change automatically** without the need to duplicate CSS rules.*

- **Global reset and base styles**

![](/doc-port-img/image%2012.png)

- **Navigation**

***backdrop-filter: blur(12px)** creates the "glassmorphism" effect—content behind the navigation bar appears blurred. The background must be **semi-transparent (rgba with alpha < 1)** for this to work.*

![](/doc-port-img/image%2013.png)

![](/doc-port-img/image%2014.png)

- **Hero, two-column layout**

![](/doc-port-img/image%2015.png)

- **CSS animations**

The terms **"bug"** and **"ritual"** in the hero comment on the home page have a glitch animation, as mentioned above, which simulates signal interference with a 2-second infinite loop.

*The glitch only occurs between 90% and 100% of the cycle; 90% of the time the text is still, which makes the effect more striking and less visually tiring.*

![](/doc-port-img/image%2016.png)

![](/doc-port-img/image%2017.png)

**.comment in** a box

Cursor flashing at the end of the Full Stack Web Dev title.

![](/doc-port-img/image%2018.png)

***step-end** instead of **ease** makes the blinking instantaneous (on/off), like a real terminal cursor.*

![](/doc-port-img/image%2019.png)

And then we have the pulsing dot in the **HTML - No errors** box we talked about earlier, which also maintains an infinite 2-second pulse.

- **Hero typography**

***clamp()** is a modern CSS function that allows you to define a fluid size between a minimum and a maximum. The font size grows with the viewport but never exceeds the defined limits, without the need for media queries for typography.*

![](/doc-port-img/image%2020.png)

- **Technology pills and buttons**

![](/doc-port-img/image%2021.png)

![](/doc-port-img/image%2022.png)

- **VSCode panel**

![](/doc-port-img/image%2023.png)

![](/doc-port-img/image%2024.png)

- **About Me section**

***position: sticky** on the principles card means that when you scroll down in the "about" section, the card remains visible within its parent container. It's an elegant technique for keeping contextual information visible.*

![](/doc-port-img/image%2025.png)
![](/doc-port-img/image%2026.png)

- **Responsive design**

I have three main breakpoints, from largest to smallest:

| **> 900px** | Full desktop layout — hero in 2 columns, horizontal nav, VSCode panel visible |
| --- | --- |
| **≤ 900px** | Tablet/large mobile — hero in 1 column, VSCode panel hidden, mini-panel visible, nav in 2 rows |
| **≤ 480px** | Mobile — reduced margins, smaller title, very compact nav font |
| **≤ 360px** | Small mobile — fine adjustments for Galaxy S or older iPhone SE screens |

*I've been testing absolutely all the sizes that Chrome lets you test, for example, I still have problems with 360 that I don't know how to adjust, but it's a very rare device, so I'll leave it as a question for later.*

The important thing is the **hide function**, which I have applied to both the main panel and **the code panel** so that they are hidden and the small **minicode panel**, designed specifically for mobile devices, is displayed. I have also hidden the **Principles** list, as I mentioned earlier.

![](/doc-port-img/image%2027.png)

 *I've had a lot of problems with the **minicode panel**, such as it not hiding in the computer version and being visible under the original code panel, or not being directly visible on mobile devices, the lines of code being cut off, etc. I've had to try both **padding** and **space**, as well as learning how **overflows** work  in order to adjust it to my needs. Then I had to create **extra padding for the code line numbers** within the minicode panel (which I didn't do in the main code panel) to add some margin, as they were cut off on the left.*

![](/doc-port-img/image%2028.png)

---

1. **script.js**

The JavaScript file is deliberately minimal and vanilla because I'm still studying this section. At this point in the project, its only responsibility is to manage the switch between light mode and dark mode, with persistence via localStorage, which I learned about through searches on Reddit.

![](/doc-port-img/image%2029.png)

Basically, what it does is first check if there is a preference saved in localStorage. Then it automatically applies or does not apply the **dark theme** as soon as the user enters the page.

*The logic is written in a functional way and without external state—each click determines the current state directly by reading the DOM, which eliminates possible inconsistencies.*

| **getElementById("themeToggle")** | Selects the button by its id — faster than querySelector |
| --- | --- |
| **querySelector(".theme-icon")** | Selects the icon span inside the button |
| **localStorage.getItem("theme")** | Reads the preference saved in the browser (persists between sessions) |
| **setAttribute("data-theme", "dark")** | Adds the attribute to the body — CSS detects it and applies the dark mode variables |
| **icon.textContent** | Changes the icon character: ◐ = light mode, ○ = dark mode |
| **localStorage.setItem(...)** | Saves the new preference for the next visit |

User visits the page

└── Is there a preference saved in localStorage?

├── Yes ("dark") → body.setAttribute("data-theme", "dark") + icon ○

└── No → default light mode + icon ◐

User clicks on the theme button

├── Read current status: does body have data-theme="dark"?

├── Toggle: dark→light or light→dark

├── Visually update icon

└── Save new preference in localStorage
