# CodeAlpha Music Player

A clean, responsive, and accessible web-based music player built with vanilla HTML5, CSS3, and modern JavaScript. Developed as part of the CodeAlpha Frontend Development Internship.

---

## Overview

The **CodeAlpha Music Player** is a standalone music player application designed to provide an intuitive and responsive listening experience directly in the browser. Emphasizing clean code architecture, accessible HTML semantics, and native browser APIs, this project operates with zero external frameworks or heavy runtime libraries.

---

## Features

- **Multi-Theme Aesthetic Presets**:
  - **Midnight Aura**: Deep twilight violet/obsidian canvas with glowing coral-orange progress sliders, atmospheric background orbs, and frosted glass cards.
  - **Porcelain Studio**: Ethereal studio light theme with electric violet accents, floating white cards, and delicate drop shadows.
  - **Sunset Vibe**: Modern editorial styling with warm neutral background, high-contrast typography, and vibrant vermilion accents.
- **Dynamic Soundwave Equalizer**: Interactive audio frequency visualization bars that dance rhythmically when tracks are playing.
- **HTML5 Audio Engine**: Direct playback control using native browser audio elements and events (`loadedmetadata`, `timeupdate`, `ended`, `error`).
- **Dynamic Track Metadata**: Synchronized display of song titles, artist names, album info, and high-resolution album artwork.
- **Interactive Progress & Seeking**: Continuous progress tracking with click-to-seek, drag seeking, and real-time hover time preview tooltips.
- **Volume & Mute Control**: Smooth volume slider with dynamic speaker status icons and stateful mute/unmute restoration.
- **Playlist Management**: Interactive queue displaying track numbering, album thumbnails, track durations, and active playing equalizers.
- **Playback Modes**:
  - **Autoplay**: Automatically transitions to the next track upon completion.
  - **Shuffle**: Non-repeating randomized track selection.
  - **Repeat Modes**: Cycle between Repeat All, Repeat One (single-track loop), and Repeat Off.
- **Keyboard Shortcuts**:
  - `Space`: Play / Pause
  - `ArrowLeft` / `ArrowRight`: Seek backward / forward 5 seconds
  - `Shift + ArrowLeft` / `Shift + ArrowRight`: Previous / Next track
  - `ArrowUp` / `ArrowDown`: Volume up / down 5%
  - `M`: Mute / Unmute
  - `S`: Toggle Shuffle
  - `R`: Cycle Repeat modes
  - `Esc`: Close shortcuts guide
- **Micro-Interactions**: Subtle vinyl disc animation on playback, album art transitions, and smooth hover states.
- **Error Handling & Resilience**: Graceful error banners and fallback handling for network interruptions or missing media.
- **Responsive Layout**: Designed for desktops (two-column dashboard) down to tablets and mobile devices with 44px+ touch targets.

---

## Technologies Used

- **HTML5**: Semantic document layout, accessible ARIA attributes, and native `<audio>` element.
- **CSS3**: CSS Custom Properties (variables), Flexbox, CSS Grid, responsive media queries, and keyframe animations.
- **JavaScript (ES6+)**: Vanilla DOM manipulation, HTML5 Audio API event listeners, state management, and keyboard event handlers.

---

## Project Structure

```text
CodeAlpha_MusicPlayer/
│
├── index.html              # Primary HTML entry point and semantic structure
├── style.css               # Vanilla CSS layout, themes, sliders, and responsiveness
├── script.js               # Core audio playback engine and state management
│
├── assets/
│   ├── images/             # Album artwork files (.jpg, .svg)
│   │   ├── cover1.jpg
│   │   ├── cover2.jpg
│   │   ├── cover3.jpg
│   │   ├── cover4.jpg
│   │   └── cover5.jpg
│   └── audio/              # Preloaded public domain audio tracks (.mp3)
│       ├── song1.mp3       # Clair de Lune (Claude Debussy)
│       ├── song2.mp3       # The Entertainer (Scott Joplin)
│       ├── song3.mp3       # Maple Leaf Rag (Scott Joplin)
│       ├── song4.mp3       # Für Elise (Ludwig van Beethoven)
│       └── song5.mp3       # Spring Allegro (Antonio Vivaldi)
│
└── README.md               # Project documentation and guide
```

---

## How to Run

### Method 1: Direct in Browser (Zero Configuration)
Because this project is built entirely in vanilla HTML, CSS, and JavaScript with no external dependencies or build steps required:
1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Method 2: Local Static Server
If running via a local development server:
```bash
# Using Python
python3 -m http.server 3000

# Using Node http-server or npx serve
npx serve .
```
Navigate to `http://localhost:3000` in your web browser.

---

## Screenshots

The player features a focused two-column interface on desktop screens, transitioning smoothly into a stacked single-column view on mobile viewports:

- **Now Playing Card**: High-contrast artwork frame, vinyl record groove animation, track metadata, interactive progress slider, primary playback controls, and volume slider.
- **Queue Panel**: Clean track listings with active playing indicators, duration tags, and playback mode toggles.

---

## Live Demo

- **Development Preview**: Accessible through your deployment container URL or hosted on GitHub Pages / static hosting.

---

## Internship Task

- **Organization**: CodeAlpha
- **Domain**: Frontend Development Internship
- **Task**: Music Player Application (HTML, CSS, JavaScript)
- **Objective**: Build a functional, polished, and responsive music player demonstrating clean DOM manipulation, audio API control, and modern UI engineering principles.

---

## Audio Licensing & Credits

All audio tracks and compositions utilized in this project are in the **Public Domain (CC0 / Open Media)**:
- *Clair de Lune* — Composed by Claude Debussy (1905)
- *The Entertainer* — Composed by Scott Joplin (1902)
- *Maple Leaf Rag* — Composed by Scott Joplin (1899)
- *Für Elise* — Composed by Ludwig van Beethoven (1810)
- *The Four Seasons: Spring (Allegro)* — Composed by Antonio Vivaldi (1725)

---

## Author

- **Intern**: CodeAlpha Frontend Development Intern
- **GitHub**: [logfroze](https://github.com/logfroze)
