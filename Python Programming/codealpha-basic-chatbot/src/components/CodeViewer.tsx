import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, BookOpen, CheckCircle } from 'lucide-react';
import { PythonFilesData } from '../types';

interface CodeViewerProps {
  files: PythonFilesData;
  onDownload: (filename: string) => void;
}

type ActiveTab = 'chatbot.py' | 'README.md' | 'test_chatbot.py';

export const CodeViewer: React.FC<CodeViewerProps> = ({ files, onDownload }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chatbot.py');
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'chatbot.py':
        return files.chatbotPy;
      case 'README.md':
        return files.readmeMd;
      case 'test_chatbot.py':
        return files.testChatbotPy;
      default:
        return '';
    }
  };

  const content = getActiveContent();
  const lines = content.split('\n');

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
            onClick={() => setActiveTab('chatbot.py')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
              activeTab === 'chatbot.py'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            <span>chatbot.py</span>
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

          <button
            onClick={() => setActiveTab('test_chatbot.py')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
              activeTab === 'test_chatbot.py'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>test_chatbot.py</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-md transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onDownload(activeTab)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-md transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="flex-1 overflow-auto bg-[#0d1117] text-zinc-200 font-mono text-xs leading-relaxed p-4 selection:bg-blue-500/30">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/40">
                <td className="w-12 pr-4 text-right select-none text-zinc-600 font-mono text-[11px] align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono text-zinc-300">
                  {/* Basic syntax coloring highlights for python keywords and comments */}
                  {line.startsWith('def ') ? (
                    <span>
                      <span className="text-purple-400">def </span>
                      <span className="text-yellow-300">{line.slice(4)}</span>
                    </span>
                  ) : line.startsWith('import ') || line.startsWith('from ') ? (
                    <span className="text-purple-400">{line}</span>
                  ) : line.trim().startsWith('#') ? (
                    <span className="text-zinc-500 italic">{line}</span>
                  ) : line.trim().startsWith('"""') || line.trim().endsWith('"""') ? (
                    <span className="text-emerald-400/90 italic">{line}</span>
                  ) : line.includes('elif ') || line.includes('if ') || line.includes('else:') ? (
                    <span className="text-zinc-200">
                      {line.replace(/(if |elif |else:)/g, '%%KW%%$1%%KW%%').split('%%KW%%').map((part, i) =>
                        ['if ', 'elif ', 'else:'].includes(part) ? (
                          <span key={i} className="text-rose-400 font-semibold">{part}</span>
                        ) : (
                          part
                        )
                      )}
                    </span>
                  ) : (
                    line
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terminal Command Footer */}
      <div className="px-4 py-2.5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-600 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Run locally:</span>
          <code className="px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-800 font-semibold">
            python3 chatbot.py
          </code>
        </div>
        <span className="text-zinc-400 hidden sm:inline">
          Standard Library Only • 0 pip dependencies
        </span>
      </div>
    </div>
  );
};
