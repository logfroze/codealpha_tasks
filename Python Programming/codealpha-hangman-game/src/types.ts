export type ViewMode = 'terminal' | 'game' | 'code' | 'tests';

export type GameStatus = 'playing' | 'won' | 'lost' | 'waiting_replay';

export interface TerminalLine {
  id: string;
  text: string;
  type:
    | 'banner'
    | 'stage'
    | 'status'
    | 'prompt'
    | 'user'
    | 'feedback_success'
    | 'feedback_error'
    | 'win'
    | 'game_over'
    | 'system';
}

export interface GameStats {
  played: number;
  won: number;
  lost: number;
  currentStreak: number;
}

export interface HangmanState {
  secretWord: string;
  guessedLetters: string[];
  incorrectGuesses: number;
  status: GameStatus;
  roundCount: number;
  stats: GameStats;
}

export interface TestCaseInfo {
  name: string;
  description: string;
  expected: string;
  status: 'passed' | 'running' | 'idle';
}

export interface PythonFilesData {
  hangmanPy: string;
  testHangmanPy: string;
  readmeMd: string;
}
