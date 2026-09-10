import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, BookOpen, CheckCircle } from 'lucide-react';
import { HANGMAN_PY_SOURCE, TEST_HANGMAN_PY_SOURCE, README_MD_SOURCE } from '../data/files';

interface CodeViewerProps {
  onDownload: (filename: string, content: string) => void;
}

type ActiveTab = 'hangman.py' | 'test_hangman.py' | 'README.md';

export const CodeViewer: React.FC<CodeViewerProps> = ({ onDownload }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hangman.py');
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'hangman.py':
        return HANGMAN_PY_SOURCE;
      case 'test_hangman.py':
        return TEST_HANGMAN_PY_SOURCE;
      case 'README.md':
        return README_MD_SOURCE;
      default:
        return '';
    }
  };

  const content = getActiveContent();
  const lines = content.trim().split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      {/* File Navigation & Tool Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('hangman.py')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
              activeTab === 'hangman.py'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            <span>hangman.py</span>
          </button>

          <button
            onClick={() => setActiveTab('test_hangman.py')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
              activeTab === 'test_hangman.py'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>test_hangman.py</span>
          </button>

          <button
            onClick={() => setActiveTab('README.md')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
              activeTab === 'README.md'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>README.md</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onDownload(activeTab, content)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-900 text-white hover:bg-zinc-800 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 overflow-y-auto max-h-[620px] bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-300">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/60">
                <td className="w-10 pr-4 text-right text-zinc-600 select-none align-top font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="whitespace-pre overflow-x-auto text-zinc-200">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
