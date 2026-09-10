import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { PYTHON_SCRIPT_CODE, TEST_SUITE_CODE } from '../data/pythonScript';

export const ScriptViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'main' | 'test'>('main');
  const [copied, setCopied] = useState(false);

  const code = activeFile === 'main' ? PYTHON_SCRIPT_CODE : TEST_SUITE_CODE;
  const filename = activeFile === 'main' ? 'jpg_organizer.py' : 'test_jpg_organizer.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="space-y-4">
      {/* File Switcher & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-md p-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFile('main')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              activeFile === 'main'
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            jpg_organizer.py
          </button>
          <button
            onClick={() => setActiveFile('test')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              activeFile === 'test'
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            test_jpg_organizer.py
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Display with Line Numbers */}
      <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-950 font-mono text-xs text-slate-100 shadow-xs">
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{filename}</span>
          <span>{lines.length} lines</span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed">
          <pre className="flex">
            <code className="text-slate-600 select-none pr-4 text-right min-w-[2.5rem]">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </code>
            <code className="text-slate-200 whitespace-pre overflow-x-visible">
              {lines.map((line, i) => (
                <div key={i}>{line || '\n'}</div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
