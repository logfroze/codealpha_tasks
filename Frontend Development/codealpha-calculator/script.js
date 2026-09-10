/**
 * CodeAlpha Calculator - Vanilla JavaScript Implementation
 * Architecture: Clean state machine, DOM event delegation, keyboard listener,
 * floating-point precision correction, history management, and sound synthesis.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Calculator State Machine
  // --------------------------------------------------------------------------
  const state = {
    currentInput: '0',
    previousOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    lastOperator: null,
    lastSecondOperand: null,
    isError: false,
    errorMessage: '',
    history: [],
    soundEnabled: false,
    theme: 'dark'
  };

  // --------------------------------------------------------------------------
  // DOM Elements
  // --------------------------------------------------------------------------
  const primaryDisplay = document.getElementById('primary-display');
  const secondaryDisplay = document.getElementById('secondary-display');
  const keypad = document.getElementById('keypad');
  const copyBtn = document.getElementById('btn-copy');
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const soundToggleBtn = document.getElementById('btn-sound-toggle');
  const historyToggleBtn = document.getElementById('btn-history-toggle');
  const historyDrawer = document.getElementById('history-drawer');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('btn-clear-history');
  const historyCountBadge = document.getElementById('history-count');

  // --------------------------------------------------------------------------
  // Web Audio Synthesizer (Zero asset dependencies, gentle tactile click)
  // --------------------------------------------------------------------------
  let audioCtx = null;

  function playClickSound(freq = 600) {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {
      // Audio playback silently disabled if not allowed
    }
  }

  // --------------------------------------------------------------------------
  // Helper: Floating-point precision cleanup
  // --------------------------------------------------------------------------
  function formatAccurateResult(num) {
    if (!isFinite(num)) return null;
    // Fix floating point issues like 0.1 + 0.2 = 0.30000000000000004
    // Using 12 significant figures and stripping trailing zeros
    const rounded = parseFloat(num.toPrecision(12));
    // If extraordinarily large or small, use scientific notation
    if (Math.abs(rounded) >= 1e14 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-6)) {
      return rounded.toExponential(6).replace(/\+/, '');
    }
    return String(rounded);
  }

  // Helper: Format number string with commas for integer portion
  function formatDisplayNumber(numStr) {
    if (!numStr) return '0';
    if (numStr.includes('e') || numStr.includes('E')) return numStr;

    const parts = numStr.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    // Handle leading negative sign
    const isNegative = integerPart.startsWith('-');
    const cleanInt = isNegative ? integerPart.slice(1) : integerPart;

    const formattedInt = cleanInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (isNegative ? '-' : '') + formattedInt + decimalPart;
  }

  // --------------------------------------------------------------------------
  // Display Updates & Auto-Scaling
  // --------------------------------------------------------------------------
  function updateDisplay() {
    if (state.isError) {
      primaryDisplay.textContent = state.errorMessage || 'Error';
      primaryDisplay.classList.add('is-error');
      primaryDisplay.className = 'primary-display is-error';
      secondaryDisplay.textContent = '';
      highlightActiveOperator(null);
      return;
    }

    primaryDisplay.classList.remove('is-error');

    // Auto font-size scaling based on length
    const rawLen = state.currentInput.length;
    primaryDisplay.className = 'primary-display';
    if (rawLen > 16) {
      primaryDisplay.classList.add('scale-xs');
    } else if (rawLen > 12) {
      primaryDisplay.classList.add('scale-sm');
    } else if (rawLen > 9) {
      primaryDisplay.classList.add('scale-md');
    }

    primaryDisplay.textContent = formatDisplayNumber(state.currentInput);

    // Update secondary display
    if (state.previousOperand !== null && state.operator) {
      const opSymbol = getOperatorSymbol(state.operator);
      const prevFormatted = formatDisplayNumber(String(state.previousOperand));

      if (state.waitingForSecondOperand) {
        secondaryDisplay.textContent = `${prevFormatted} ${opSymbol}`;
      } else {
        secondaryDisplay.textContent = `${prevFormatted} ${opSymbol} ${formatDisplayNumber(state.currentInput)}`;
      }
    } else {
      secondaryDisplay.textContent = '';
    }

    // Highlight selected pending operator
    if (state.waitingForSecondOperand && state.operator) {
      highlightActiveOperator(state.operator);
    } else {
      highlightActiveOperator(null);
    }
  }

  function getOperatorSymbol(op) {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  }

  function highlightActiveOperator(op) {
    const opButtons = document.querySelectorAll('.btn-op');
    opButtons.forEach(btn => {
      if (op && btn.dataset.operator === op) {
        btn.classList.add('is-selected');
      } else {
        btn.classList.remove('is-selected');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Core Calculator Operations
  // --------------------------------------------------------------------------
  function inputDigit(digit) {
    playClickSound(700);

    if (state.isError) {
      clearAll();
    }

    if (state.waitingForSecondOperand) {
      state.currentInput = digit;
      state.waitingForSecondOperand = false;
    } else {
      if (state.currentInput === '0') {
        state.currentInput = digit;
      } else {
        // Limit maximum input length to 16 digits
        if (state.currentInput.replace(/[.-]/g, '').length < 16) {
          state.currentInput += digit;
        }
      }
    }

    // Reset repeated equals history
    state.lastOperator = null;
    state.lastSecondOperand = null;
    updateDisplay();
  }

  function inputDecimal() {
    playClickSound(650);

    if (state.isError) {
      clearAll();
    }

    if (state.waitingForSecondOperand) {
      state.currentInput = '0.';
      state.waitingForSecondOperand = false;
      updateDisplay();
      return;
    }

    if (!state.currentInput.includes('.')) {
      state.currentInput += '.';
    }
    updateDisplay();
  }

  function toggleSign() {
    playClickSound(600);

    if (state.isError) {
      clearAll();
      return;
    }

    if (state.currentInput === '0') return;

    if (state.currentInput.startsWith('-')) {
      state.currentInput = state.currentInput.slice(1);
    } else {
      state.currentInput = '-' + state.currentInput;
    }
    updateDisplay();
  }

  function deleteLast() {
    playClickSound(500);

    if (state.isError) {
      clearAll();
      return;
    }

    // If waiting for second operand, backspace does nothing
    if (state.waitingForSecondOperand) return;

    if (state.currentInput.length > 1) {
      state.currentInput = state.currentInput.slice(0, -1);
      if (state.currentInput === '-' || state.currentInput === '') {
        state.currentInput = '0';
      }
    } else {
      state.currentInput = '0';
    }
    updateDisplay();
  }

  function clearAll() {
    playClickSound(400);
    state.currentInput = '0';
    state.previousOperand = null;
    state.operator = null;
    state.waitingForSecondOperand = false;
    state.lastOperator = null;
    state.lastSecondOperand = null;
    state.isError = false;
    state.errorMessage = '';
    updateDisplay();
  }

  function applyPercent() {
    playClickSound(650);

    if (state.isError) return;

    const current = parseFloat(state.currentInput);
    if (isNaN(current)) return;

    let result;
    // If in an addition/subtraction context: calculate percentage of previous operand
    // e.g. 200 + 10% = 200 + 20
    if (state.previousOperand !== null && (state.operator === '+' || state.operator === '-')) {
      result = (state.previousOperand * current) / 100;
    } else {
      // Standalone or multiplication/division: 50% = 0.5
      result = current / 100;
    }

    const formatted = formatAccurateResult(result);
    if (formatted !== null) {
      state.currentInput = formatted;
      updateDisplay();
    }
  }

  function chooseOperator(nextOperator) {
    playClickSound(800);

    if (state.isError) return;

    const inputValue = parseFloat(state.currentInput);

    // If user clicked operator while waiting for second operand, simply update the operator
    if (state.operator && state.waitingForSecondOperand) {
      state.operator = nextOperator;
      updateDisplay();
      return;
    }

    if (state.previousOperand === null && !isNaN(inputValue)) {
      state.previousOperand = inputValue;
    } else if (state.operator) {
      // Evaluate previous operation first
      const result = executeCalculation(state.previousOperand, inputValue, state.operator);
      if (result === null) {
        setError('Cannot divide by 0');
        return;
      }

      const formatted = formatAccurateResult(result);
      addToHistory(
        `${formatDisplayNumber(String(state.previousOperand))} ${getOperatorSymbol(state.operator)} ${formatDisplayNumber(state.currentInput)}`,
        formatDisplayNumber(formatted)
      );

      state.currentInput = formatted;
      state.previousOperand = result;
    }

    state.waitingForSecondOperand = true;
    state.operator = nextOperator;
    state.lastOperator = null;
    state.lastSecondOperand = null;
    updateDisplay();
  }

  function calculate() {
    playClickSound(900);

    if (state.isError) return;

    let prev = state.previousOperand;
    let current = parseFloat(state.currentInput);
    let op = state.operator;

    // Handle repeated equals: pressing '=' consecutively repeats last operator & second operand
    if (op === null && state.lastOperator !== null && state.lastSecondOperand !== null) {
      prev = current;
      current = state.lastSecondOperand;
      op = state.lastOperator;
    }

    if (op === null || prev === null) {
      return;
    }

    const result = executeCalculation(prev, current, op);

    if (result === null) {
      setError('Cannot divide by 0');
      return;
    }

    const formattedResult = formatAccurateResult(result);
    const expression = `${formatDisplayNumber(String(prev))} ${getOperatorSymbol(op)} ${formatDisplayNumber(String(current))}`;

    addToHistory(expression, formatDisplayNumber(formattedResult));

    // Save for repeated equals functionality
    state.lastOperator = op;
    state.lastSecondOperand = current;

    state.currentInput = formattedResult;
    state.previousOperand = null;
    state.operator = null;
    state.waitingForSecondOperand = true;
    updateDisplay();
  }

  function executeCalculation(first, second, operator) {
    switch (operator) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        if (second === 0) {
          return null; // Division by zero
        }
        return first / second;
      default:
        return second;
    }
  }

  function setError(message) {
    state.isError = true;
    state.errorMessage = message;
    state.previousOperand = null;
    state.operator = null;
    state.waitingForSecondOperand = false;
    updateDisplay();
  }

  // --------------------------------------------------------------------------
  // Calculation History Management
  // --------------------------------------------------------------------------
  function addToHistory(expression, result) {
    const item = {
      expression,
      result,
      timestamp: Date.now()
    };
    state.history.unshift(item);
    if (state.history.length > 20) {
      state.history.pop();
    }
    saveHistory();
    renderHistory();
  }

  function saveHistory() {
    try {
      localStorage.setItem('codealpha_calc_history', JSON.stringify(state.history));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem('codealpha_calc_history');
      if (saved) {
        state.history = JSON.parse(saved);
      }
    } catch (e) {
      state.history = [];
    }
    renderHistory();
  }

  function clearHistory() {
    state.history = [];
    saveHistory();
    renderHistory();
  }

  function renderHistory() {
    if (!historyList) return;

    if (historyCountBadge) {
      if (state.history.length > 0) {
        historyCountBadge.textContent = state.history.length;
        historyCountBadge.style.display = 'flex';
      } else {
        historyCountBadge.style.display = 'none';
      }
    }

    if (state.history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
      return;
    }

    historyList.innerHTML = '';
    state.history.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'history-item';
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `Restore calculation: ${item.expression} = ${item.result}`);
      el.innerHTML = `
        <span class="history-item-exp">${escapeHtml(item.expression)} =</span>
        <span class="history-item-res">${escapeHtml(item.result)}</span>
      `;

      el.addEventListener('click', () => {
        restoreFromHistory(item.result);
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          restoreFromHistory(item.result);
        }
      });

      historyList.appendChild(el);
    });
  }

  function restoreFromHistory(resultStr) {
    const rawNum = resultStr.replace(/,/g, '');
    state.currentInput = rawNum;
    state.waitingForSecondOperand = false;
    state.isError = false;
    updateDisplay();
    // Close history drawer on selection for convenience
    toggleHistoryDrawer(false);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function toggleHistoryDrawer(forceState) {
    const isOpen = forceState !== undefined ? forceState : !historyDrawer.classList.contains('is-open');
    if (isOpen) {
      historyDrawer.classList.add('is-open');
      historyToggleBtn.classList.add('active');
      historyToggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      historyDrawer.classList.remove('is-open');
      historyToggleBtn.classList.remove('active');
      historyToggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // --------------------------------------------------------------------------
  // Copy to Clipboard
  // --------------------------------------------------------------------------
  function copyCurrentDisplay() {
    if (state.isError) return;
    const textToCopy = state.currentInput;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyFeedback();
      }).catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopyFeedback();
    } catch (e) {}
    document.body.removeChild(textarea);
  }

  function showCopyFeedback() {
    if (!copyBtn) return;
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.classList.remove('copied');
    }, 1400);
  }

  // --------------------------------------------------------------------------
  // Theme & Preferences
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem('codealpha_calc_theme') || 'dark';
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('codealpha_calc_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      themeToggleBtn.innerHTML = theme === 'dark'
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    }
  }

  function toggleTheme() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function initSound() {
    const savedSound = localStorage.getItem('codealpha_calc_sound');
    state.soundEnabled = savedSound === 'true';
    updateSoundUI();
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('codealpha_calc_sound', state.soundEnabled);
    updateSoundUI();
    if (state.soundEnabled) {
      playClickSound(750);
    }
  }

  function updateSoundUI() {
    if (soundToggleBtn) {
      soundToggleBtn.classList.toggle('active', state.soundEnabled);
      soundToggleBtn.setAttribute('aria-label', state.soundEnabled ? 'Mute sound' : 'Enable sound');
      soundToggleBtn.innerHTML = state.soundEnabled
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>';
    }
  }

  // --------------------------------------------------------------------------
  // Keyboard Interactions & Visual Highlights
  // --------------------------------------------------------------------------
  function triggerButtonVisual(selector) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.classList.add('is-pressed');
      setTimeout(() => {
        btn.classList.remove('is-pressed');
      }, 120);
    }
  }

  function handleKeyDown(e) {
    // Ignore key events if focused in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key;

    // Numbers 0-9
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      triggerButtonVisual(`[data-number="${key}"]`);
      inputDigit(key);
      return;
    }

    // Decimal point / comma
    if (key === '.' || key === ',') {
      e.preventDefault();
      triggerButtonVisual('[data-action="decimal"]');
      inputDecimal();
      return;
    }

    // Operators
    if (key === '+') {
      e.preventDefault();
      triggerButtonVisual('[data-operator="+"]');
      chooseOperator('+');
      return;
    }
    if (key === '-') {
      e.preventDefault();
      triggerButtonVisual('[data-operator="-"]');
      chooseOperator('-');
      return;
    }
    if (key === '*' || key === 'x' || key === 'X') {
      e.preventDefault();
      triggerButtonVisual('[data-operator="*"]');
      chooseOperator('*');
      return;
    }
    if (key === '/') {
      e.preventDefault();
      triggerButtonVisual('[data-operator="/"]');
      chooseOperator('/');
      return;
    }

    // Percentage
    if (key === '%') {
      e.preventDefault();
      triggerButtonVisual('[data-action="percent"]');
      applyPercent();
      return;
    }

    // Equals / Calculate
    if (key === 'Enter' || key === '=') {
      e.preventDefault();
      triggerButtonVisual('[data-action="calculate"]');
      calculate();
      return;
    }

    // Backspace / Delete
    if (key === 'Backspace') {
      e.preventDefault();
      triggerButtonVisual('[data-action="delete"]');
      deleteLast();
      return;
    }

    // Clear (Escape or 'c' or 'C')
    if (key === 'Escape' || key.toLowerCase() === 'c') {
      e.preventDefault();
      triggerButtonVisual('[data-action="clear"]');
      clearAll();
      return;
    }
  }

  // --------------------------------------------------------------------------
  // Click Event Delegation
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Keypad clicks
    if (keypad) {
      keypad.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const num = button.dataset.number;
        const operator = button.dataset.operator;
        const action = button.dataset.action;

        if (num !== undefined) {
          inputDigit(num);
        } else if (operator) {
          chooseOperator(operator);
        } else if (action) {
          switch (action) {
            case 'clear':
              clearAll();
              break;
            case 'delete':
              deleteLast();
              break;
            case 'decimal':
              inputDecimal();
              break;
            case 'calculate':
              calculate();
              break;
            case 'percent':
              applyPercent();
              break;
            case 'negate':
              toggleSign();
              break;
          }
        }
      });
    }

    // Top action bar
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', toggleSound);
    }
    if (historyToggleBtn) {
      historyToggleBtn.addEventListener('click', () => toggleHistoryDrawer());
    }
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', clearHistory);
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', copyCurrentDisplay);
    }

    // Global keyboard listener
    window.addEventListener('keydown', handleKeyDown);
  }

  // --------------------------------------------------------------------------
  // Application Bootstrap
  // --------------------------------------------------------------------------
  function init() {
    initTheme();
    initSound();
    loadHistory();
    setupEventListeners();
    updateDisplay();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
