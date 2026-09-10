import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, CornerDownLeft, RotateCcw, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

interface TerminalViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onResetSession: () => void;
  isSessionEnded: boolean;
  isProcessing: boolean;
}

const QUICK_INPUTS = [
  'hello',
  'how are you',
  'good morning',
  'what is your name',
  'thanks',
  'help',
  'bye',
  'unrecognized query',
];

export const TerminalView: React.FC<TerminalViewProps> = ({
  messages,
  onSendMessage,
  onResetSession,
  isSessionEnded,
  isProcessing,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [sentHistory, setSentHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll on new message
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing, isSessionEnded]);

  useEffect(() => {
    // Focus input on mount or session reset
    if (!isSessionEnded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSessionEnded]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSessionEnded || isProcessing) return;

    const message = inputValue;
    setInputValue('');
    if (message.trim()) {
      setSentHistory((prev) => [...prev, message]);
      setHistoryIndex(-1);
    }
    await onSendMessage(message);
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

  const handleQuickPrompt = (prompt: string) => {
    if (isSessionEnded) return;
    setInputValue(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
              <span>bash - python3 chatbot.py</span>
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
          className="flex-1 p-5 font-mono text-sm overflow-y-auto leading-relaxed text-zinc-200 cursor-text selection:bg-emerald-500/30 selection:text-emerald-200"
        >
          {/* Welcome Banner as specified in CodeAlpha prompt Section 11 */}
          <div className="text-zinc-400 whitespace-pre mb-4 font-mono select-none">
            <span className="text-zinc-500">========================================</span>
            <br />
            <span className="text-emerald-400 font-bold">          BASIC PYTHON CHATBOT</span>
            <br />
            <span className="text-zinc-500">========================================</span>
            <br />
            <br />
            <span className="text-zinc-300">Hello! I'm a simple rule-based chatbot.</span>
            <br />
            <span className="text-zinc-400">Type a message to start chatting.</span>
            <br />
            <span className="text-amber-400">Type 'bye' to exit.</span>
          </div>

          {/* Conversation Transcript */}
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2.5">
              {msg.sender === 'user' ? (
                <div className="flex items-start gap-1">
                  <span className="text-sky-400 font-semibold select-none">You:</span>
                  <span className="text-zinc-100 font-normal pl-1">{msg.text || '<empty>'}</span>
                </div>
              ) : msg.sender === 'bot' ? (
                <div className="flex items-start gap-1">
                  <span className="text-emerald-400 font-semibold select-none">Bot:</span>
                  <span className="text-emerald-100 font-normal pl-1">{msg.text}</span>
                  {msg.ruleCategory && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 select-none border border-zinc-700/50">
                      {msg.ruleCategory}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-zinc-500 italic text-xs py-1 select-none">
                  # {msg.text}
                </div>
              )}
            </div>
          ))}

          {/* Interactive Input Line */}
          {!isSessionEnded ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-3">
              <span className="text-sky-400 font-semibold select-none">You:</span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  id="terminal-cli-input"
                  type="text"
                  value={inputValue}
                  disabled={isProcessing}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isProcessing ? 'Processing input...' : 'Type message here...'}
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full bg-transparent border-none outline-none font-mono text-sm text-zinc-100 pl-1.5 focus:ring-0 placeholder-zinc-600 caret-emerald-400"
                />
              </div>
            </form>
          ) : (
            <div className="mt-4 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs text-zinc-400">
                <span className="text-amber-400 font-semibold">[Session Terminated]</span> Program exited after receiving goodbye/exit command.
              </div>
              <button
                id="restart-cli-btn"
                onClick={onResetSession}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart python3 chatbot.py</span>
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="text-xs text-zinc-500 mt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Executing Python rule matching...</span>
            </div>
          )}
        </div>

        {/* Quick Input Bar and Helper Controls */}
        <div className="p-3 bg-[#11141a] border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-xs text-zinc-500 font-mono select-none mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>Quick:</span>
            </span>
            {QUICK_INPUTS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickPrompt(item)}
                disabled={isSessionEnded || isProcessing}
                className="px-2 py-1 text-xs font-mono rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-zinc-500 hidden lg:inline font-mono">
              Press Enter ↵ to send
            </span>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSessionEnded || isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors disabled:opacity-40"
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
