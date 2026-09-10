export type TabId = 'runner' | 'code' | 'tests' | 'readme';

export interface FileEntry {
  name: string;
  isDir?: boolean;
}

export interface MoveResult {
  filename: string;
  status: 'moved' | 'skipped' | 'ignored';
  reason?: string;
}

export interface RunSummary {
  sourcePath: string;
  destPath: string;
  totalFound: number;
  moved: number;
  skipped: number;
  failed: number;
  stdout: string;
}
