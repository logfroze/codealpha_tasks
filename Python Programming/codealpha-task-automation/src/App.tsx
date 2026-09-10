import { useState } from 'react';
import { Download } from 'lucide-react';
import { TabId } from './types';
import { OrganizerRunner } from './components/OrganizerRunner';
import { ScriptViewer } from './components/ScriptViewer';
import { TestViewer } from './components/TestViewer';
import { ReadmeViewer } from './components/ReadmeViewer';
import { PYTHON_SCRIPT_CODE } from './data/pythonScript';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('runner');

  const handleDownload = () => {
    const blob = new Blob([PYTHON_SCRIPT_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jpg_organizer.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  JPG File Organizer
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-900 text-white shadow-xs">
                  CodeAlpha - Python - Task 03
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Python automation utility to move .jpg files between directories using standard library modules (<code className="font-mono text-slate-700">os</code>, <code className="font-mono text-slate-700">shutil</code>).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="header-download-btn"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Script</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 pt-2 border-t border-slate-100 overflow-x-auto">
            <button
              id="tab-runner"
              onClick={() => setActiveTab('runner')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'runner'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Interactive Runner
            </button>

            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Python Script
            </button>

            <button
              id="tab-tests"
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'tests'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Unit Tests
            </button>

            <button
              id="tab-readme"
              onClick={() => setActiveTab('readme')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeTab === 'readme'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Documentation
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'runner' && <OrganizerRunner />}
        {activeTab === 'code' && <ScriptViewer />}
        {activeTab === 'tests' && <TestViewer />}
        {activeTab === 'readme' && <ReadmeViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <span>Task 3: Task Automation with Python Scripts &bull; Built with standard library modules os and shutil</span>
      </footer>
    </div>
  );
}
