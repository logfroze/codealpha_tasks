import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  Folder, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { FileItem, SimulationLog } from '../types';

const INITIAL_SOURCE_FILES: FileItem[] = [
  { id: '1', name: 'vacation_sunset.jpg', size: '2.4 MB', type: 'jpg', isJpg: true, status: 'pending' },
  { id: '2', name: 'IMG_2026_PORTRAIT.JPG', size: '3.1 MB', type: 'jpg', isJpg: true, status: 'pending' },
  { id: '3', name: 'project_brief.pdf', size: '450 KB', type: 'pdf', isJpg: false, status: 'pending' },
  { id: '4', name: 'app_logo.png', size: '120 KB', type: 'png', isJpg: false, status: 'pending' },
  { id: '5', name: 'existing_avatar.jpg', size: '890 KB', type: 'jpg', isJpg: true, status: 'pending', statusNote: 'Duplicate' },
  { id: '6', name: 'meeting_notes.txt', size: '14 KB', type: 'txt', isJpg: false, status: 'pending' },
  { id: '7', name: 'holiday_family.Jpg', size: '4.2 MB', type: 'jpg', isJpg: true, status: 'pending' },
  { id: '8', name: 'backup_archive/', size: 'DIR', type: 'folder', isJpg: false, status: 'pending' },
];

const INITIAL_DEST_FILES: FileItem[] = [
  { id: 'd1', name: 'existing_avatar.jpg', size: '890 KB', type: 'jpg', isJpg: true, status: 'pending' },
];

export const TerminalSimulation: React.FC = () => {
  const [sourceFiles, setSourceFiles] = useState<FileItem[]>(INITIAL_SOURCE_FILES);
  const [destFiles, setDestFiles] = useState<FileItem[]>(INITIAL_DEST_FILES);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logs, setLogs] = useState<SimulationLog[]>([]);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setIsCompleted(false);

    // Initial Banner
    setLogs([
      { id: '1', type: 'banner', text: '=======================================================' },
      { id: '2', type: 'banner', text: '      CODEALPHA TASK AUTOMATION: JPG FILE ORGANIZER     ' },
      { id: '3', type: 'banner', text: '=======================================================' },
      { id: '4', type: 'info', text: 'This script automates moving all .jpg image files from' },
      { id: '5', type: 'info', text: 'a designated source directory into a destination folder.\n' },
      { id: '6', type: 'info', text: 'Source:      /home/user/Downloads' },
      { id: '7', type: 'info', text: 'Destination: /home/user/Organized_Photos' },
      { id: '8', type: 'info', text: '[Info] Verified source folder: 8 item(s) found.' },
    ]);

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Discover JPGs
    const jpgs = sourceFiles.filter((f) => f.isJpg && f.type !== 'folder');
    setLogs((prev) => [
      ...prev,
      { id: '9', type: 'info', text: `Found ${jpgs.length} .jpg file(s) to process.\n` },
      { id: '10', type: 'banner', text: '-------------------------------------------------------' },
      { id: '11', type: 'info', text: 'Processing files:' },
      { id: '12', type: 'banner', text: '-------------------------------------------------------' },
    ]);

    let movedCount = 0;
    let skippedCount = 0;
    const currentDest = [...destFiles];
    const updatedSource = [...sourceFiles];

    for (let i = 0; i < sourceFiles.length; i++) {
      const file = sourceFiles[i];
      if (!file.isJpg || file.type === 'folder') {
        // Non-jpg or folder stays untouched
        file.status = 'untouched';
        continue;
      }

      await new Promise((resolve) => setTimeout(resolve, 450));

      const isDuplicate = currentDest.some((d) => d.name.toLowerCase() === file.name.toLowerCase());

      if (isDuplicate) {
        file.status = 'skipped';
        skippedCount++;
        setLogs((prev) => [
          ...prev,
          { id: `log-${file.id}`, type: 'skipped', text: `[SKIPPED] Duplicate file already exists in destination: ${file.name}` },
        ]);
      } else {
        file.status = 'moved';
        movedCount++;
        currentDest.push({ ...file, status: 'moved' });
        setLogs((prev) => [
          ...prev,
          { id: `log-${file.id}`, type: 'moved', text: `[MOVED]   ${file.name}` },
        ]);
      }

      setSourceFiles([...updatedSource]);
      setDestFiles([...currentDest]);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    // Summary
    setLogs((prev) => [
      ...prev,
      { id: 's1', type: 'banner', text: '\n=======================================================' },
      { id: 's2', type: 'banner', text: '                 AUTOMATION COMPLETE                 ' },
      { id: 's3', type: 'banner', text: '=======================================================' },
      { id: 's4', type: 'info', text: 'Source Folder:      /home/user/Downloads' },
      { id: 's5', type: 'info', text: 'Destination Folder: /home/user/Organized_Photos' },
      { id: 's6', type: 'banner', text: '-------------------------------------------------------' },
      { id: 's7', type: 'info', text: `JPG files found:    ${jpgs.length}` },
      { id: 's8', type: 'moved', text: `Files moved:        ${movedCount}` },
      { id: 's9', type: 'skipped', text: `Files skipped:      ${skippedCount}` },
      { id: 's10', type: 'banner', text: '=======================================================\n' },
    ]);

    setIsRunning(false);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setSourceFiles(INITIAL_SOURCE_FILES);
    setDestFiles(INITIAL_DEST_FILES);
    setLogs([]);
    setIsCompleted(false);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg font-semibold text-white">Live Python Automation Simulator</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulates exact <code className="text-emerald-400 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">os</code> and <code className="text-emerald-400 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">shutil</code> execution in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="run-automation-btn"
            onClick={handleRun}
            disabled={isRunning || isCompleted}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isRunning || isCompleted
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Executing Python Script...' : isCompleted ? 'Completed' : 'Run Script (python jpg_organizer.py)'}
          </button>

          <button
            id="reset-simulation-btn"
            onClick={handleReset}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Grid: Source Directory vs Destination Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Folder Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Source Folder</h3>
                <span className="text-xs font-mono text-slate-500">/home/user/Downloads</span>
              </div>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
              {sourceFiles.length} items
            </span>
          </div>

          <div className="space-y-2">
            {sourceFiles.map((file) => {
              const isMoved = file.status === 'moved';
              const isSkipped = file.status === 'skipped';
              return (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-sm transition-colors ${
                    isMoved
                      ? 'bg-slate-50 border-dashed border-slate-200 opacity-50 line-through'
                      : isSkipped
                      ? 'bg-amber-50/70 border-amber-200 text-slate-800'
                      : 'bg-slate-50/50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {file.type === 'folder' ? (
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : file.isJpg ? (
                      <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-mono text-xs truncate">{file.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 font-mono">{file.size}</span>
                    {isMoved && (
                      <span className="text-[11px] font-medium bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Moved
                      </span>
                    )}
                    {isSkipped && (
                      <span className="text-[11px] font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        Skipped (Duplicate)
                      </span>
                    )}
                    {!file.isJpg && file.type !== 'folder' && (
                      <span className="text-[11px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        Ignored (Non-JPG)
                      </span>
                    )}
                    {file.type === 'folder' && (
                      <span className="text-[11px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        Folder (Ignored)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Destination Folder Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <Folder className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Destination Folder</h3>
                <span className="text-xs font-mono text-slate-500">/home/user/Organized_Photos</span>
              </div>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-100">
              {destFiles.length} file(s)
            </span>
          </div>

          <div className="space-y-2">
            {destFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/30 text-sm"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono text-xs truncate text-slate-800">{file.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 font-mono">{file.size}</span>
                  <span className="text-[11px] font-medium bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    In Destination
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Destination folder is created on the fly with <code className="text-slate-800 font-mono bg-white px-1 py-0.5 rounded border">os.makedirs()</code> if missing. Pre-existing files are safely protected against overwrite.
            </span>
          </div>
        </div>
      </div>

      {/* Simulated Terminal Output */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="ml-2 text-slate-300 font-semibold flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              Terminal - python3 jpg_organizer.py
            </span>
          </div>
          <span>Python 3.10.12 (Standard Library)</span>
        </div>

        <div className="text-xs space-y-1 max-h-72 overflow-y-auto pr-2 select-text">
          {logs.length === 0 ? (
            <div className="text-slate-500 py-6 text-center italic">
              Click &quot;Run Script&quot; above to execute the automation simulation and observe live terminal output.
            </div>
          ) : (
            logs.map((log) => {
              let color = 'text-slate-300';
              if (log.type === 'banner') color = 'text-slate-500';
              if (log.type === 'moved') color = 'text-emerald-400 font-semibold';
              if (log.type === 'skipped') color = 'text-amber-400 font-medium';
              if (log.type === 'failed' || log.type === 'error') color = 'text-red-400';
              return (
                <div key={log.id} className={color}>
                  {log.text}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
