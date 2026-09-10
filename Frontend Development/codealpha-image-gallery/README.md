# CodeAlpha Image Gallery

> A responsive, accessible, and lightweight visual photography gallery built with semantic HTML5, modern CSS3 (Grid & Flexbox), and vanilla JavaScript. Features category filtering, interactive lightbox modal viewing with loop navigation, keyboard controls, and touch swipe gestures.

---

## Overview

Developed as part of the **CodeAlpha Frontend Development Internship (Task 01)**, this project demonstrates clean, production-grade frontend fundamentals without reliance on heavy frameworks or external dependencies.

The interface adheres to an **editorial photography archive aesthetic**—deliberate whitespace, refined typography hierarchy pairing Playfair Display with Plus Jakarta Sans, subtle terracotta accent highlights, and smooth micro-interactions that feel human-designed.

---

## Features

- 🖼️ **Responsive CSS Grid Layout**: Fluid multi-column gallery that adapts gracefully across mobile phones (375px+), tablets (768px), and ultra-wide desktop monitors (1440px+).
- 🏷️ **Dynamic Category Filtering**: Filter across 5 disciplines (*Nature, Architecture, Travel, People, Lifestyle*) with real-time item counters on filter pills and instant DOM updates.
- 🔍 **Interactive Lightbox Modal**: High-resolution image inspection with smooth scale/fade transitions, dynamic title captions, photographer credits, and locations.
- 🔁 **Filter-Aware Looping Navigation**: Previous/Next navigation loops circularly (from last image to first, and first to last) and **strictly respects active category filters** (e.g., browsing within Nature cycles only through Nature photographs).
- ⌨️ **Comprehensive Keyboard Accessibility**: Full keyboard navigation support:
  - <kbd>Arrow Right</kbd> → Next image
  - <kbd>Arrow Left</kbd> → Previous image
  - <kbd>Escape</kbd> → Close lightbox
  - <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> → Modal focus trap
  - <kbd>Enter</kbd> / <kbd>Space</kbd> → Open focused gallery card
- 📱 **Mobile Touch Gesture Support**: Native touch swipe gestures (<kbd>Swipe Left</kbd> for next, <kbd>Swipe Right</kbd> for previous) for an intuitive smartphone experience.
- ⚡ **Performance & Best Practices**:
  - Native `loading="lazy"` on thumbnails
  - Dynamic image preloading for adjacent lightbox items
  - Zero third-party runtime dependencies (pure Vanilla JS)
  - Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`)
  - Accessible ARIA roles (`role="dialog"`, `aria-modal="true"`, `role="tablist"`, `aria-selected`)

---

## Technologies Used

- **HTML5**: Semantic document structure, accessibility landmarks, ARIA attributes.
- **CSS3**: CSS Custom Properties (Variables), CSS Grid, Flexbox, responsive clamp typography, cubic-bezier transitions.
- **Vanilla JavaScript (ES6+)**: DOM querying and manipulation, custom event listeners, state-driven filtering, touch event calculation, keyboard navigation.
- **Google Fonts**: Playfair Display & Plus Jakarta Sans.

---

## Project Structure

```text
CodeAlpha_ImageGallery/
│
├── index.html              # Main semantic HTML5 markup
├── css/
│   └── style.css           # Custom styles, variables, grid & lightbox
├── js/
│   └── script.js           # Gallery dataset, filter logic & lightbox controller
├── public/                 # Static assets & icons
├── README.md               # Project documentation & overview
└── metadata.json           # Application descriptor
```

---

## How to Run Locally

You can run this project locally on your machine in two easy ways:

### Method 1: Instant (No Installation Required)
Simply extract the downloaded ZIP file and **double-click `index.html`** to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari. All styles and scripts use relative paths and run natively.

### Method 2: With a Local Web Server (Recommended)
If you prefer running on `localhost`:

- **Using VS Code Live Server extension**:
  Right-click `index.html` inside VS Code and select **"Open with Live Server"**.

- **Using Node / npm (Vite dev server)**:
  ```bash
  npm install
  npm run dev
  ```
  Then open `http://localhost:3000` (or the URL shown in your terminal).

- **Using Python**:
  ```bash
  python -m http.server 3000
  ```
  Then navigate to `http://localhost:3000`.

---

## Screenshots

| Desktop Editorial View | Interactive Lightbox Modal |
|:---:|:---:|
| Responsive CSS Grid with category filters and hover overlays | Fullscreen viewer with metadata, counter, and navigation controls |

---

## Live Demo

A live deployment of this gallery can be viewed directly in the Google AI Studio container preview environment.

---

## Internship Task

- **Organization**: CodeAlpha
- **Track**: Frontend Development Internship
- **Task Number**: 01
- **Task Name**: Responsive Image Gallery with Lightbox

---

## Author

- **Intern**: CodeAlpha Frontend Development Intern
- **Focus**: Responsive Web Design, Clean CSS Architecture & Vanilla JavaScript DOM
