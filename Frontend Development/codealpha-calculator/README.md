# CodeAlpha Calculator

A responsive, modern, human-crafted calculator web application built with **pure HTML5, CSS3, and Vanilla JavaScript**. Designed and engineered as part of the CodeAlpha Frontend Development Internship.

---

## Overview

CodeAlpha Calculator is a lightweight, responsive single-page calculator application that blends clean physical hardware aesthetics with modern web responsiveness. Unlike generic AI-generated interfaces with excessive neon glows or heavy frameworks, this project is crafted with deliberate typography, tactile keypress micro-interactions, floating-point precision guards, full physical keyboard support, and calculation history persistence.

---

## Features

- **Core Arithmetic Operations**: Accurate addition (`+`), subtraction (`−`), multiplication (`×`), and division (`÷`).
- **Human-Crafted Visual Design**: Clean dual-theme palette (Dark and Light modes) with soft natural shadows, tactile button depression feedback, and crisp contrast.
- **Smart Decimal Handling**: Supports multi-digit and decimal inputs while strictly preventing invalid duplicates (e.g., `12.5.7`).
- **Precision Floating-Point Logic**: Prevents JavaScript floating-point errors (such as `0.1 + 0.2 = 0.30000000000000004`) using normalized precision formatting.
- **Consecutive & Chained Calculations**: Seamlessly chains operations (e.g. `25 + 75 + 50 = 150`) and supports continuing operations directly from calculated results.
- **Operator Overriding**: Changing an operator mid-calculation smoothly updates the pending operation without corrupting state.
- **Repeated Equals**: Pressing `=` multiple times automatically repeats the last applied operator and second operand.
- **Division by Zero Protection**: Prevents `Infinity` or application lockup by presenting a graceful `"Cannot divide by 0"` notice recoverable by pressing `C` or typing any digit.
- **Percentage & Sign Toggle**: Quick percentage calculation (`%`) and positive/negative negation (`±`).
- **Calculation History Drawer**: Keeps track of recent calculations stored locally in `localStorage`. Clicking any past calculation immediately restores its result.
- **Full Physical Keyboard Support**: Complete keyboard control (`0–9`, `.`, `+`, `-`, `*`, `/`, `Enter`, `=`, `Backspace`, `Escape`) with synchronous visual button highlights.
- **Auto-Scaling Display**: Dynamically scales typography down as numbers lengthen to prevent display overflow on all screen sizes.
- **Quick Clipboard Copy**: One-click copy button on the display with instant visual confirmation.
- **Tactile Click Audio (Optional)**: Built-in, synthesized Web Audio click effect that can be toggled on or off without downloading external audio files.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices down to 320px screen widths.
- **Zero Framework Overhead**: Built with 100% vanilla HTML, CSS, and JavaScript.

---

## Technologies Used

- **HTML5**: Semantic tags (`<main>`, `<header>`, `<section>`, `<footer>`, `<button>`), ARIA attributes (`aria-label`, `aria-live`, `aria-atomic`, `role="grid"`), and accessible DOM hierarchy.
- **CSS3**: CSS Custom Properties (Variables), CSS Grid, Flexbox, transitions, tactile keypress states, fluid typography, and dark/light color schemes.
- **Vanilla JavaScript (ES6+)**: Pure state-machine architecture, event delegation, Web Audio API synthesis, `localStorage` persistence, and Clipboard API.

---

## How It Works

The application operates as a predictable, decoupled state machine:

```text
User Input (Click / Physical Keyboard)
                ↓
    Event Delegation / Keydown Handler
                ↓
           State Machine
   (currentInput, previousOperand, operator,
    waitingForSecondOperand, lastOperator)
                ↓
      Calculation & Precision Engine
                ↓
    Display Formatter & Dynamic Scaler
                ↓
      History Persistence & UI Render
```

1. **Input Stage**: Numeric keys update the `currentInput` string up to a maximum length of 16 digits.
2. **Operator Stage**: Selecting an operator stores the current value into `previousOperand` and primes the state machine to await the next number.
3. **Calculation Stage**: `executeCalculation()` evaluates the expression using standard arithmetic. Numbers are processed through `formatAccurateResult()` to sanitize binary floating-point artifacts.
4. **History & Persistence**: Finished equations are prepended to the history log and saved to browser `localStorage`.

---

## How to Run

### Option 1: Direct Browser Opening (No Server Required)
Because this application uses standard HTML, CSS, and JavaScript without dependencies:
1. Clone or download this repository.
2. Double-click `index.html` or drag it into any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Option 2: Run with Local HTTP Server
Using Python:
```bash
python3 -m http.server 3000
```
Or using Node `npx serve`:
```bash
npx serve .
```
Then open `http://localhost:3000` in your web browser.

---

## Keyboard Shortcuts

| Key | Calculator Action |
| :--- | :--- |
| `0` – `9` | Input Number |
| `.` or `,` | Decimal Point |
| `+` | Addition |
| `-` | Subtraction |
| `*` or `x` | Multiplication |
| `/` | Division |
| `%` | Percentage |
| `Enter` or `=` | Calculate Result |
| `Backspace` | Delete Last Digit |
| `Escape` or `c` | Clear Calculator (`C`) |

---

## Screenshots

```text
┌──────────────────────────────────────────────┐
│  ● CodeAlpha   [Calc]         [🔊] [🕒] [🌙]  │
├──────────────────────────────────────────────┤
│  [📋]                              125 × 4   │
│                                        500   │
├──────────────┬──────────────┬────────────────┤
│      C       │     DEL      │   %    │   ÷   │
├──────────────┼──────────────┼────────┼───────┤
│      7       │      8       │   9    │   ×   │
├──────────────┼──────────────┼────────┼───────┤
│      4       │      5       │   6    │   −   │
├──────────────┼──────────────┼────────┼───────┤
│      1       │      2       │   3    │   +   │
├──────────────┼──────────────┼────────┼───────┤
│      ±       │      0       │   .    │   =   │
└──────────────┴──────────────┴────────┴───────┘
```

---

## Live Demo

A live deployment of the application is accessible on Google Cloud Run via AI Studio Build preview.

---

## Internship Task

- **Organization**: CodeAlpha
- **Role**: Frontend Development Internship
- **Task Number**: Task 1
- **Project Name**: Calculator Web Application

---

## Author

**Frontend Development Intern**  
CodeAlpha Internship Program  
*Built with HTML, CSS, and Vanilla JavaScript.*
