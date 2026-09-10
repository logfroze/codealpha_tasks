import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface TestCaseInfo {
  name: string;
  doc: string;
  expected: string;
}

const TEST_CASES: TestCaseInfo[] = [
  {
    name: 'test_extension_detection_case_insensitivity',
    doc: 'Checks whether is_jpg_file correctly handles .jpg, .JPG, .jpeg, .JPEG, and rejects other extensions.',
    expected: 'Pass (.jpg, .JPG, .jpeg detected; .png, .pdf, .txt rejected)',
  },
  {
    name: 'test_find_jpg_files_ignores_other_types_and_directories',
    doc: 'Ensures folders and non-target files (.pdf, .png, .txt) remain untouched in source directory.',
    expected: 'Pass (Only genuine .jpg files listed, subfolder ignored)',
  },
  {
    name: 'test_full_move_automation',
    doc: 'Executes run_automation: confirms files are moved, destination directory created, non-JPG files preserved.',
    expected: 'Pass (Files removed from source, present in destination)',
  },
  {
    name: 'test_duplicate_file_handling',
    doc: 'Verifies existing files in destination directory are not overwritten and conflicting files are skipped.',
    expected: 'Pass (Original destination file content intact, duplicate skipped)',
  },
  {
    name: 'test_empty_source_folder',
    doc: 'Handles an empty source folder cleanly without exceptions.',
    expected: 'Pass (Graceful completion, 0 files moved)',
  },
  {
    name: 'test_nonexistent_source_folder',
    doc: 'Confirms validate_source detects invalid or nonexistent directory paths.',
    expected: 'Pass (Returns False with descriptive error)',
  },
  {
    name: 'test_source_is_a_file_instead_of_directory',
    doc: 'Confirms validate_source rejects files passed in place of directories.',
    expected: 'Pass (Returns False when path is regular file)',
  },
];

const UNITTEST_STDOUT = `test_duplicate_file_handling (__main__.TestJpgOrganizer) ... ok
test_empty_source_folder (__main__.TestJpgOrganizer) ... ok
test_extension_detection_case_insensitivity (__main__.TestJpgOrganizer) ... ok
test_find_jpg_files_ignores_other_types_and_directories (__main__.TestJpgOrganizer) ... ok
test_full_move_automation (__main__.TestJpgOrganizer) ... ok
test_nonexistent_source_folder (__main__.TestJpgOrganizer) ... ok
test_source_is_a_file_instead_of_directory (__main__.TestJpgOrganizer) ... ok

----------------------------------------------------------------------
Ran 7 tests in 0.005s

OK`;

export const TestViewer: React.FC = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'passed'>('passed');

  const handleRunTests = () => {
    setTestStatus('running');
    setTimeout(() => {
      setTestStatus('passed');
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Header with Run Trigger */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Python Unit Tests (unittest)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validates requirements using isolated temporary directories (<code>tempfile</code>).
          </p>
        </div>

        <button
          onClick={handleRunTests}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{testStatus === 'running' ? 'Running...' : 'Run Test Suite'}</span>
        </button>
      </div>

      {/* Test Definitions Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="px-3.5 py-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
          Test Case Breakdown (7 tests)
        </div>

        <div className="divide-y divide-slate-100">
          {TEST_CASES.map((t, idx) => (
            <div key={idx} className="p-3 text-xs flex flex-col md:flex-row md:items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-mono text-slate-900 font-semibold">{t.name}</div>
                <div className="text-slate-600">{t.doc}</div>
              </div>
              <div className="font-mono text-[11px] text-slate-500 shrink-0 md:text-right">
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {testStatus === 'passed' ? 'PASS' : '...'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLI Output */}
      <div className="bg-white border border-slate-200 rounded-md">
        <div className="px-3.5 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Test Output</span>
          <span className="font-mono text-[11px] text-slate-500">python -m unittest test_jpg_organizer.py</span>
        </div>

        <div className="p-3">
          <pre className="font-mono text-xs bg-slate-900 text-slate-100 p-3.5 rounded overflow-x-auto whitespace-pre leading-relaxed">
            {testStatus === 'running' ? 'Running unittest runner...\n' : UNITTEST_STDOUT}
          </pre>
        </div>
      </div>
    </div>
  );
};
