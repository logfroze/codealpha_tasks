import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, RotateCcw, Sparkles } from 'lucide-react';
import { TerminalLine, HangmanState } from '../types';

interface TerminalViewProps {
  lines: TerminalLine[];
  gameState: HangmanState;
  onSendInput: (input: string) => void;
  onResetSession: () => void;
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const TerminalView: React.FC<TerminalViewProps> = ({
  lines,
  gameState,
  onSendInput,
  onResetSession,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [sentHistory, setSentHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [gameState.status]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = inputValue;
    setInputValue('');
    if (val.trim()) {
      setSentHistory((prev) => [...prev, val]);
      setHistoryIndex(-1);
    }
    onSendInput(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (sentHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? sentHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(sentHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= sentHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(sentHistory[nextIndex]);
      }
    }
  };

  const handleQuickLetter = (letter: string) => {
    if (gameState.status === 'waiting_replay') {
      onSendInput(letter === 'y' ? 'y' : 'n');
    } else {
      onSendInput(letter);
    }
    inputRef.current?.focus();
  };

  const isReplayPrompt = gameState.status === 'waiting_replay';

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      {/* Terminal Window Frame */}
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-[#0c0e12] shadow-2xl">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#16191f] border-b border-zinc-800 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-px bg-zinc-700 mx-2" />
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <TerminalIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>bash - python3 hangman.py</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
            <span className="hidden sm:inline">UTF-8</span>
            <span className="text-emerald-400 font-semibold">Python 3.10</span>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-5 font-mono text-sm overflow-y-auto leading-relaxed text-zinc-200 cursor-text selection:bg-emerald-500/30 selection:text-emerald-200 min-h-[420px] max-h-[600px]"
        >
          {lines.map((line) => {
            if (line.type === 'banner') {
              return (
                <div key={line.id} className="text-emerald-400 font-bold whitespace-pre mb-1">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'stage') {
              return (
                <pre key={line.id} className="font-mono text-amber-300 whitespace-pre my-2 leading-tight select-none">
                  {line.text}
                </pre>
              );
            }
            if (line.type === 'status') {
              return (
                <div key={line.id} className="text-zinc-300 whitespace-pre mb-1 font-mono">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'user') {
              return (
                <div key={line.id} className="text-sky-400 font-semibold my-1">
                  &gt; {line.text}
                </div>
              );
            }
            if (line.type === 'feedback_success') {
              return (
                <div key={line.id} className="text-emerald-400 font-semibold my-1">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'feedback_error') {
              return (
                <div key={line.id} className="text-rose-400 font-medium my-1">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'win') {
              return (
                <div key={line.id} className="text-emerald-300 font-bold whitespace-pre my-2 p-2 bg-emerald-950/40 rounded border border-emerald-800/60">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'game_over') {
              return (
                <div key={line.id} className="text-rose-300 font-bold whitespace-pre my-2 p-2 bg-rose-950/40 rounded border border-rose-800/60">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-zinc-400 whitespace-pre">
                {line.text}
              </div>
            );
          })}

          {/* Interactive Active Input Prompt */}
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5 mt-3 pt-2 border-t border-zinc-800/60">
            <span className="text-amber-400 font-semibold select-none">
              {isReplayPrompt ? 'Would you like to play again? (y/n): ' : 'Enter a letter: '}
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                id="terminal-input"
                type="text"
                value={inputValue}
                maxLength={isReplayPrompt ? 4 : 1}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck="false"
                autoFocus
                placeholder={isReplayPrompt ? 'y or n...' : 'type letter...'}
                className="w-full bg-transparent border-none outline-none font-mono text-sm text-zinc-100 pl-1 focus:ring-0 placeholder-zinc-700 caret-emerald-400"
              />
            </div>
          </form>
        </div>

        {/* Quick Input Bar / Alphabet Selector */}
        <div className="p-3 bg-[#11141a] border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-1">
            <span className="text-xs text-zinc-500 font-mono select-none mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>{isReplayPrompt ? 'Quick:' : 'Letters:'}</span>
            </span>

            {isReplayPrompt ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickLetter('y')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                >
                  Yes (y)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLetter('n')}
                  className="px-3 py-1 text-xs font-mono font-semibold rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                >
                  No (n)
                </button>
              </>
            ) : (
              ALPHABET.map((char) => {
                const isGuessed = gameState.guessedLetters.includes(char);
                const isCorrect = isGuessed && gameState.secretWord.includes(char);
                const isWrong = isGuessed && !gameState.secretWord.includes(char);

                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleQuickLetter(char)}
                    disabled={isGuessed}
                    className={`w-6 h-6 text-xs font-mono font-semibold rounded uppercase transition-colors flex items-center justify-center ${
                      isCorrect
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 cursor-not-allowed opacity-60'
                        : isWrong
                        ? 'bg-rose-950/40 text-rose-500/60 border border-rose-900/40 cursor-not-allowed opacity-40 line-through'
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60'
                    }`}
                  >
                    {char}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onResetSession}
              title="Reset game"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors"
            >
              <span>Execute</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
