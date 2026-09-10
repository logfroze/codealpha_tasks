import React, { useState } from 'react';
import { Play, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { FileEntry, RunSummary, MoveResult } from '../types';

interface Preset {
  label: string;
  source: FileEntry[];
  dest: FileEntry[];
}

const PRESETS: Record<string, Preset> = {
  mixed: {
    label: 'Mixed directory',
    source: [
      { name: 'vacation_sunset.jpg' },
      { name: 'IMG_2026_PORTRAIT.JPG' },
      { name: 'project_brief.pdf' },
      { name: 'app_icon.png' },
      { name: 'meeting_notes.txt' },
      { name: 'holiday_family.Jpg' },
      { name: 'backup_archive', isDir: true },
    ],
    dest: [],
  },
  duplicate: {
    label: 'Duplicate collision',
    source: [
      { name: 'avatar.jpg' },
      { name: 'new_shot.jpg' },
      { name: 'notes.txt' },
    ],
    dest: [
      { name: 'avatar.jpg' },
    ],
  },
  noJpg: {
    label: 'No .jpg files',
    source: [
      { name: 'data.csv' },
      { name: 'report.docx' },
      { name: 'logo.png' },
      { name: 'scripts', isDir: true },
    ],
    dest: [],
  },
  empty: {
    label: 'Empty directory',
    source: [],
    dest: [],
  },
};

export const OrganizerRunner: React.FC = () => {
  const [sourcePath, setSourcePath] = useState('/home/user/Downloads');
  const [destPath, setDestPath] = useState('/home/user/Pictures/Organized');
  const [activePreset, setActivePreset] = useState<string>('mixed');

  const [sourceFiles, setSourceFiles] = useState<FileEntry[]>(PRESETS.mixed.source);
  const [destFiles, setDestFiles] = useState<FileEntry[]>(PRESETS.mixed.dest);
  const [newFileName, setNewFileName] = useState('');
  const [newFileIsDir, setNewFileIsDir] = useState(false);

  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);
  const [lastResults, setLastResults] = useState<MoveResult[] | null>(null);

  const applyPreset = (key: string) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setActivePreset(key);
    setSourceFiles([...preset.source]);
    setDestFiles([...preset.dest]);
    setRunSummary(null);
    setLastResults(null);
  };

  const handleReset = () => {
    applyPreset(activePreset);
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFileName.trim();
    if (!trimmed) return;
    if (sourceFiles.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }
    setSourceFiles((prev) => [...prev, { name: trimmed, isDir: newFileIsDir }]);
    setNewFileName('');
    setNewFileIsDir(false);
  };

  const handleRemoveSourceFile = (index: number) => {
    setSourceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isJpg = (filename: string): boolean => {
    const lower = filename.toLowerCase();
    return lower.endsWith('.jpg') || lower.endsWith('.jpeg');
  };

  const handleRun = () => {
    // 1. Validation
    if (!sourcePath.trim()) {
      setRunSummary({
        sourcePath,
        destPath,
        totalFound: 0,
        moved: 0,
        skipped: 0,
        failed: 1,
        stdout: '[Error] Source folder path cannot be empty.',
      });
      return;
    }

    if (sourcePath.trim() === destPath.trim()) {
      setRunSummary({
        sourcePath,
        destPath,
        totalFound: 0,
        moved: 0,
        skipped: 0,
        failed: 1,
        stdout: '[Error] Source and destination folders cannot be the same.',
      });
      return;
    }

    // 2. Scan source for JPG files (ignoring subdirectories and non-jpgs)
    const jpgFiles = sourceFiles.filter((f) => !f.isDir && isJpg(f.name));
    const totalFound = jpgFiles.length;

    let stdoutLines: string[] = [
      'JPG File Organizer',
      'Moves .jpg files from a source directory to a destination directory.\n',
    ];

    if (totalFound === 0) {
      stdoutLines.push(`[Notice] No .jpg files found in '${sourcePath}'. Nothing to move.`);
      stdoutLines.push('\nSummary:');
      stdoutLines.push(`  Source:       ${sourcePath}`);
      stdoutLines.push(`  Destination:  ${destPath}`);
      stdoutLines.push('  Total .jpg:   0');
      stdoutLines.push('  Moved:        0');
      stdoutLines.push('  Skipped:      0');

      setRunSummary({
        sourcePath,
        destPath,
        totalFound: 0,
        moved: 0,
        skipped: 0,
        failed: 0,
        stdout: stdoutLines.join('\n'),
      });
      setLastResults([]);
      return;
    }

    stdoutLines.push(`Found ${totalFound} .jpg file(s) to process.\n`);
    stdoutLines.push('-------------------------------------------------------');
    stdoutLines.push('Processing files:');
    stdoutLines.push('-------------------------------------------------------');

    let moved = 0;
    let skipped = 0;
    const results: MoveResult[] = [];

    const newDest = [...destFiles];
    const newSource: FileEntry[] = [];

    // Keep non-jpg and directories in source
    for (const file of sourceFiles) {
      if (file.isDir || !isJpg(file.name)) {
        newSource.push(file);
      }
    }

    // Process JPG candidates
    for (const file of jpgFiles) {
      const existsInDest = newDest.some((d) => d.name.toLowerCase() === file.name.toLowerCase());
      if (existsInDest) {
        skipped++;
        stdoutLines.push(`[skip]  ${file.name} (already exists in destination)`);
        results.push({ filename: file.name, status: 'skipped', reason: 'File with this name already exists in destination' });
        newSource.push(file); // stays in source
      } else {
        moved++;
        stdoutLines.push(`[moved] ${file.name}`);
        results.push({ filename: file.name, status: 'moved' });
        newDest.push(file);
      }
    }

    stdoutLines.push('\nSummary:');
    stdoutLines.push(`  Source:       ${sourcePath}`);
    stdoutLines.push(`  Destination:  ${destPath}`);
    stdoutLines.push(`  Total .jpg:   ${totalFound}`);
    stdoutLines.push(`  Moved:        ${moved}`);
    stdoutLines.push(`  Skipped:      ${skipped}`);

    setSourceFiles(newSource);
    setDestFiles(newDest);
    setLastResults(results);
    setRunSummary({
      sourcePath,
      destPath,
      totalFound,
      moved,
      skipped,
      failed: 0,
      stdout: stdoutLines.join('\n'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Path Configuration and Controls */}
      <div className="bg-white border border-slate-200 rounded-md p-4">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Directory Configuration
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label htmlFor="source-dir-input" className="block text-xs font-medium text-slate-600 mb-1">
              Source Directory (<code>os.path.isdir</code>)
            </label>
            <input
              id="source-dir-input"
              type="text"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              className="w-full font-mono text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label htmlFor="dest-dir-input" className="block text-xs font-medium text-slate-600 mb-1">
              Destination Directory (<code>os.makedirs</code>)
            </label>
            <input
              id="dest-dir-input"
              type="text"
              value={destPath}
              onChange={(e) => setDestPath(e.target.value)}
              className="w-full font-mono text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-slate-500">Test Preset:</span>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activePreset === key
                    ? 'bg-slate-200 font-semibold text-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="runner-reset-btn"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset State
            </button>
            <button
              id="runner-execute-btn"
              onClick={handleRun}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Run Script
            </button>
          </div>
        </div>
      </div>

      {/* Directory State Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Files Panel */}
        <div className="bg-white border border-slate-200 rounded-md flex flex-col">
          <div className="px-3.5 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-800">Source Directory</span>
              <span className="ml-1.5 font-mono text-slate-500">({sourceFiles.length} items)</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">{sourcePath}</span>
          </div>

          <div className="p-3 divide-y divide-slate-100 max-h-60 overflow-y-auto flex-1">
            {sourceFiles.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-6 text-center">
                Directory is empty
              </div>
            ) : (
              sourceFiles.map((file, idx) => {
                const isCandidate = !file.isDir && isJpg(file.name);
                return (
                  <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate font-mono">
                      <span className="text-slate-400 text-[11px]">
                        {file.isDir ? '[dir]' : isCandidate ? '[jpg]' : '[file]'}
                      </span>
                      <span className={isCandidate ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSourceFile(idx)}
                      title="Remove from test source"
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddFile} className="p-2.5 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add test file (e.g. photo.jpg)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 font-mono text-xs px-2.5 py-1 border border-slate-300 rounded bg-white"
            />
            <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={newFileIsDir}
                onChange={(e) => setNewFileIsDir(e.target.checked)}
                className="rounded text-slate-900"
              />
              isDir
            </label>
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Destination Files Panel */}
        <div className="bg-white border border-slate-200 rounded-md flex flex-col">
          <div className="px-3.5 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-800">Destination Directory</span>
              <span className="ml-1.5 font-mono text-slate-500">({destFiles.length} items)</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">{destPath}</span>
          </div>

          <div className="p-3 divide-y divide-slate-100 max-h-60 overflow-y-auto flex-1">
            {destFiles.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-6 text-center">
                Destination directory will be created by script
              </div>
            ) : (
              destFiles.map((file, idx) => (
                <div key={idx} className="py-1.5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900">{file.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {file.isDir ? 'dir' : 'file'}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
            Auto-created if absent (<code className="text-slate-700">os.makedirs</code>). Existing files are preserved.
          </div>
        </div>
      </div>

      {/* Script Standard Output */}
      <div className="bg-white border border-slate-200 rounded-md">
        <div className="px-3.5 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Execution Output (stdout)</span>
          <span className="text-[11px] text-slate-500 font-mono">python jpg_organizer.py</span>
        </div>

        <div className="p-3">
          {runSummary ? (
            <pre className="font-mono text-xs bg-slate-900 text-slate-100 p-3.5 rounded overflow-x-auto whitespace-pre leading-relaxed">
              {runSummary.stdout}
            </pre>
          ) : (
            <div className="text-xs text-slate-500 py-6 text-center font-mono">
              Click &quot;Run Script&quot; above to execute the organizer on the current test directory state.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
