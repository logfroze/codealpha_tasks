import React from 'react';
import { BookOpen, FolderTree, CheckSquare, Terminal, Lightbulb } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Project Specification</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          CodeAlpha Task Automation — Task 3: JPG File Organizer
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          A focused, practical Python automation tool developed for the CodeAlpha programming internship. It automates moving all <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono text-xs">.jpg</code> image files from an unsorted source directory into a clean destination folder.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Standard Library Modules</span>
            <p className="font-mono text-slate-800 font-semibold mt-0.5">os, shutil, sys</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Third-Party Dependencies</span>
            <p className="font-mono text-emerald-700 font-semibold mt-0.5">None (0 packages)</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Python Version</span>
            <p className="font-mono text-slate-800 font-semibold mt-0.5">Python 3.6+</p>
          </div>
        </div>
      </div>

      {/* Concept Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-800 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900 text-base">Key Python Concepts Used</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Concept</th>
                <th className="py-2.5 px-3 font-semibold">Python Function / Method</th>
                <th className="py-2.5 px-3 font-semibold">Real-Life Purpose in Script</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Source Folder Validation</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">os.path.exists(), os.path.isdir()</td>
                <td className="py-2.5 px-3">Confirms the folder exists and is not a file before beginning.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Auto Destination Creation</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">os.makedirs(dest, exist_ok=True)</td>
                <td className="py-2.5 px-3">Creates missing folders automatically without error if already present.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Directory Scanning</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">os.listdir(source)</td>
                <td className="py-2.5 px-3">Discovers all immediate entries inside the source directory.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">File vs Folder Check</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">os.path.isfile(full_path)</td>
                <td className="py-2.5 px-3">Ensures subdirectories are ignored and left untouched.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Case-Insensitive Match</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">.lower().endswith((&apos;.jpg&apos;, &apos;.jpeg&apos;))</td>
                <td className="py-2.5 px-3">Captures .jpg, .JPG, .Jpg, and .jpeg extensions reliably.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Duplicate Protection</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">os.path.exists(dest_file)</td>
                <td className="py-2.5 px-3">Prevents silently overwriting pre-existing files in destination.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Atomic File Movement</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">shutil.move(src, dest)</td>
                <td className="py-2.5 px-3">Relocates files to the destination without leaving copies behind.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Structure & Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FolderTree className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900 text-sm">Clean Project Structure</h3>
          </div>
          <pre className="text-xs font-mono bg-slate-950 text-slate-300 p-4 rounded-lg leading-relaxed">
{`CodeAlpha_Task_Automation/
│
├── jpg_organizer.py       # Core automation script
├── test_jpg_organizer.py  # 7 automated unit tests
└── README.md              # Full documentation`}
          </pre>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900 text-sm">How to Run in Terminal</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Interactive Mode:</span>
              <div className="font-mono bg-slate-950 text-emerald-400 p-2.5 rounded-lg mt-1">
                python3 jpg_organizer.py
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">CLI Arguments Mode:</span>
              <div className="font-mono bg-slate-950 text-emerald-400 p-2.5 rounded-lg mt-1">
                python3 jpg_organizer.py &quot;/path/to/source&quot; &quot;/path/to/dest&quot;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internship Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-900 text-sm">CodeAlpha Task 3 Submission Checklist</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Python 3 standard library only (`os`, `shutil`)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Source folder verified & validated</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Destination folder automatically provisioned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Case-insensitive `.jpg` & `.jpeg` matching</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Non-jpg files & subfolders ignored safely</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Files moved (not copied)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Duplicates skipped to prevent silent overwrite</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Formatted summary report at completion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
