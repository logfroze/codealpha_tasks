import React from 'react';
import { Terminal, Gamepad2, FileCode, CheckCircle2, RotateCcw, Download } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
  onResetSession: () => void;
  onDownloadScript: () => void;
  pythonStatus: 'ready' | 'loading' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onResetSession,
  onDownloadScript,
  pythonStatus,
}) => {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Brand & Internship Details */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-mono text-sm font-bold shadow-xs">
            py
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
                CodeAlpha Hangman Game
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-zinc-900 text-white shadow-xs">
                CodeAlpha - Python - Task 01
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    pythonStatus === 'ready' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`}
                />
                Python 3.10 Engine
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Classic console-based word guessing application — CodeAlpha - Python - Task 01
            </p>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end">
          <nav className="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200" aria-label="Tabs">
            <button
              id="tab-terminal-btn"
              onClick={() => onSelectMode('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentMode === 'terminal'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </button>

            <button
              id="tab-game-btn"
              onClick={() => onSelectMode('game')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentMode === 'game'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game UI</span>
            </button>

            <button
              id="tab-code-btn"
              onClick={() => onSelectMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentMode === 'code'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Python Code</span>
            </button>

            <button
              id="tab-tests-btn"
              onClick={() => onSelectMode('tests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentMode === 'tests'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Test Suite</span>
            </button>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              id="header-restart-btn"
              onClick={onResetSession}
              title="Restart game session"
              className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="header-download-btn"
              onClick={onDownloadScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
