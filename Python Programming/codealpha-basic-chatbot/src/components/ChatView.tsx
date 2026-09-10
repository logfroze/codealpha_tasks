import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RotateCcw, ShieldCheck, Tag } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onResetSession: () => void;
  isSessionEnded: boolean;
  isProcessing: boolean;
}

const SAMPLE_PROMPTS = [
  'hello',
  'how are you',
  'good morning',
  'what is your name',
  'thanks',
  'help',
  'bye',
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  onResetSession,
  isSessionEnded,
  isProcessing,
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing, isSessionEnded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSessionEnded || isProcessing) return;

    const msg = inputText;
    setInputText('');
    await onSendMessage(msg);
  };

  const handleSelectPrompt = async (prompt: string) => {
    if (isSessionEnded || isProcessing) return;
    await onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      {/* Chat Header Bar */}
      <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-xs font-semibold">
            Bot
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Python Rule-Based Engine</h2>
            <p className="text-xs text-zinc-500">Deterministic `if-elif-else` evaluation without LLM</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            <span>Rule Engine Active</span>
          </span>
          <button
            id="reset-chat-btn"
            onClick={onResetSession}
            title="Reset conversation"
            className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List Area */}
      <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/30">
        {/* Welcome Card */}
        <div className="p-4 rounded-lg bg-white border border-zinc-200 shadow-xs text-xs text-zinc-600 max-w-lg">
          <p className="font-semibold text-zinc-900 mb-1">CodeAlpha Chatbot Initialized</p>
          <p className="leading-relaxed mb-2">
            Try standard greetings (<code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">hello</code>,{' '}
            <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">how are you</code>), query identity, or type{' '}
            <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">bye</code> to exit.
          </p>
          <div className="flex items-center flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-400">Suggestions:</span>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleSelectPrompt(p)}
                disabled={isSessionEnded || isProcessing}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Message stream */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-1 shadow-xs">
                Py
              </div>
            )}

            <div className={`max-w-[78%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-zinc-900 text-white shadow-xs rounded-br-xs'
                    : 'bg-white border border-zinc-200 text-zinc-800 shadow-xs rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Bot Metadata info tag */}
              {msg.sender === 'bot' && msg.ruleCategory && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                    <Tag className="w-2.5 h-2.5 text-zinc-400" />
                    <span>{msg.ruleCategory}</span>
                  </span>
                  {msg.normalized && (
                    <span className="text-[10px] text-zinc-400 font-mono">
                      (parsed: &ldquo;{msg.normalized}&rdquo;)
                    </span>
                  )}
                </div>
              )}

              <span className="text-[10px] text-zinc-400 mt-0.5 px-1">{msg.timestamp}</span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 pl-10">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
            <span className="text-zinc-500 font-mono text-[11px]">Evaluating rule tree...</span>
          </div>
        )}

        {isSessionEnded && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
            <span>Session ended via exit command (`bye`). Restart anytime to chat again.</span>
            <button
              onClick={onResetSession}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors"
            >
              Restart Chat
            </button>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-white border-t border-zinc-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            id="chat-text-input"
            type="text"
            disabled={isSessionEnded || isProcessing}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isSessionEnded ? "Conversation ended. Click 'Restart Chat' above." : 'Type your message (e.g. hello, how are you)...'
            }
            className="flex-1 px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white text-zinc-900 placeholder-zinc-400 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSessionEnded || isProcessing}
            className="inline-flex items-center justify-center p-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
