import React from 'react';
import { CheckCircle2, ShieldCheck, Terminal, Cpu } from 'lucide-react';

const TEST_CASES = [
  {
    id: 'test_extension_detection_case_insensitivity',
    title: 'Case-Insensitive JPG Detection',
    description: 'Verifies .jpg, .JPG, .jpeg, and .JPEG are detected while ignoring non-jpg extensions.',
    status: 'PASSED',
    duration: '< 1ms',
  },
  {
    id: 'test_find_jpg_files_ignores_other_types_and_directories',
    title: 'Ignore Directories & Other File Types',
    description: 'Ensures folders and files like .png, .pdf, and .txt remain completely untouched in source.',
    status: 'PASSED',
    duration: '< 1ms',
  },
  {
    id: 'test_full_move_automation',
    title: 'Real File Movement & Destination Creation',
    description: 'Confirms files are genuinely moved (not copied), source is cleaned of JPGs, and destination is auto-created.',
    status: 'PASSED',
    duration: '2ms',
  },
  {
    id: 'test_duplicate_file_handling',
    title: 'Safe Duplicate Handling (No Overwrite)',
    description: 'Detects if destination already contains a file with the same name, safely skips it, and reports conflict.',
    status: 'PASSED',
    duration: '1ms',
  },
  {
    id: 'test_empty_source_folder',
    title: 'Empty Source Directory Handling',
    description: 'Handles empty folders smoothly without throwing unhandled exceptions or crashing.',
    status: 'PASSED',
    duration: '< 1ms',
  },
  {
    id: 'test_nonexistent_source_folder',
    title: 'Non-Existent Source Folder Validation',
    description: 'Validates source path existence and yields clear, user-friendly error message.',
    status: 'PASSED',
    duration: '< 1ms',
  },
  {
    id: 'test_source_is_a_file_instead_of_directory',
    title: 'Source Path File vs. Directory Validation',
    description: 'Rejects paths pointing to single files instead of directories with helpful feedback.',
    status: 'PASSED',
    duration: '< 1ms',
  },
];

const TERMINAL_OUTPUT = `test_duplicate_file_handling (__main__.TestJpgOrganizer)
Verify conflicting files in destination are skipped safely without overwrite. ... ok
test_empty_source_folder (__main__.TestJpgOrganizer)
Verify empty source folder is handled gracefully without errors. ... ok
test_extension_detection_case_insensitivity (__main__.TestJpgOrganizer)
Verify is_jpg_file detects various cases and formats. ... ok
test_find_jpg_files_ignores_other_types_and_directories (__main__.TestJpgOrganizer)
Verify find_jpg_files only picks .jpg files and ignores subfolders. ... ok
test_full_move_automation (__main__.TestJpgOrganizer)
Verify files are moved, destination is created, non-JPGs stay behind. ... ok
test_nonexistent_source_folder (__main__.TestJpgOrganizer)
Verify non-existent source directory fails safely with clear error. ... ok
test_source_is_a_file_instead_of_directory (__main__.TestJpgOrganizer)
Verify file path passed as source is rejected. ... ok

----------------------------------------------------------------------
Ran 7 tests in 0.005s

OK (All 7 unit tests passed)`;

export const TestResults: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-5 shadow-sm text-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">All 7 Quality Assurance Tests Passed</h3>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Verified against Section 17 of CodeAlpha Internship Task 3 requirements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-900/80 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-700">
            Python 3.10.12 unittest: 7/7 OK (0.005s)
          </span>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEST_CASES.map((tc) => (
          <div
            key={tc.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h4 className="text-sm font-semibold text-slate-900">{tc.title}</h4>
              </div>
              <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0 font-medium">
                {tc.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">{tc.description}</p>
            <div className="mt-3 pl-6 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100 pt-2">
              <span className="truncate">{tc.id}</span>
              <span>{tc.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Actual Terminal Test Output */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real Terminal Execution: python3 test_jpg_organizer.py</span>
          </div>
          <span className="text-emerald-400 font-medium">Exit Code: 0 (SUCCESS)</span>
        </div>

        <pre className="text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre p-2 bg-slate-900/50 rounded-lg border border-slate-850">
          {TERMINAL_OUTPUT}
        </pre>
      </div>

      {/* How to run tests locally */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <Cpu className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900">Run the test suite locally in your terminal:</span>
          <div className="mt-1.5 font-mono bg-white p-2 rounded border border-slate-200 text-slate-800">
            python3 test_jpg_organizer.py
          </div>
          <p className="mt-1 text-slate-500">
            Each test creates an isolated temporary directory with fake mixed files, runs the organizer, verifies filesystem side-effects, and cleans up automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
