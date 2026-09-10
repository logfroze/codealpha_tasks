import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { PYTHON_SCRIPT_CODE, TEST_SUITE_CODE } from '../data/pythonScript';

export const CodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'main' | 'test'>('main');
  const [copied, setCopied] = useState(false);

  const currentCode = activeFile === 'main' ? PYTHON_SCRIPT_CODE : TEST_SUITE_CODE;
  const currentFileName = activeFile === 'main' ? 'jpg_organizer.py' : 'test_jpg_organizer.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = currentCode.trim().split('\n');

  return (
    <div className="space-y-4">
      {/* File selector and actions toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            id="tab-view-main-script"
            onClick={() => setActiveFile('main')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeFile === 'main'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            jpg_organizer.py
            <span className="text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Core Script</span>
          </button>

          <button
            id="tab-view-test-script"
            onClick={() => setActiveFile('test')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeFile === 'test'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            test_jpg_organizer.py
            <span className="text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">7 Tests</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-code-button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            id="download-code-button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {currentFileName}</span>
          </button>
        </div>
      </div>

      {/* Code Box with Line Numbers */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-slate-300">{currentFileName}</span>
          <span>{lines.length} lines • Python 3 Standard Library</span>
        </div>

        <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] align-top">
                    {idx + 1}
                  </td>
                  <td className="text-slate-300 whitespace-pre font-mono">
                    {line.startsWith('def ') ? (
                      <span className="text-emerald-400 font-semibold">{line}</span>
                    ) : line.startsWith('import ') || line.startsWith('from ') ? (
                      <span className="text-sky-400">{line}</span>
                    ) : line.startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith('*') ? (
                      <span className="text-slate-500 italic">{line}</span>
                    ) : line.includes('print(') ? (
                      <span>
                        <span className="text-amber-400">print</span>
                        {line.substring(line.indexOf('print') + 5)}
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
      </div>
    </div>
  );
};
