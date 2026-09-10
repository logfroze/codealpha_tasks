import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TerminalView } from './components/TerminalView';
import { GameView } from './components/GameView';
import { CodeViewer } from './components/CodeViewer';
import { TestSuiteView } from './components/TestSuiteView';
import { ViewMode, HangmanState, TerminalLine, GameStats } from './types';
import { HANGMAN_PY_SOURCE } from './data/files';

const WORDS = ['python', 'developer', 'internship', 'programming', 'algorithm'];
const MAX_INCORRECT_GUESSES = 6;

const HANGMAN_STAGES = [
  `   ------\n   |    |\n   |\n   |\n   |\n   |\n=========`,
  `   ------\n   |    |\n   |    O\n   |\n   |\n   |\n=========`,
  `   ------\n   |    |\n   |    O\n   |    |\n   |\n   |\n=========`,
  `   ------\n   |    |\n   |    O\n   |   /|\n   |\n   |\n=========`,
  `   ------\n   |    |\n   |    O\n   |   /|\\\n   |\n   |\n=========`,
  `   ------\n   |    |\n   |    O\n   |   /|\\\n   |   /\n   |\n=========`,
  `   ------\n   |    |\n   |    O\n   |   /|\\\n   |   / \\\n   |\n=========`,
];

function buildHiddenWord(secretWord: string, guessedLetters: string[]): string {
  return secretWord
    .split('')
    .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');
}

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<ViewMode>('terminal');
  const [stats, setStats] = useState<GameStats>({
    played: 0,
    won: 0,
    lost: 0,
    currentStreak: 0,
  });

  const [gameState, setGameState] = useState<HangmanState>(() => {
    const initialWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    return {
      secretWord: initialWord,
      guessedLetters: [],
      incorrectGuesses: 0,
      status: 'playing',
      roundCount: 1,
      stats: { played: 0, won: 0, lost: 0, currentStreak: 0 },
    };
  });

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

  const startNewRound = useCallback((resetSessionCount = false) => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setGameState((prev) => {
      const newRoundCount = resetSessionCount ? 1 : prev.roundCount + 1;
      return {
        secretWord: newWord,
        guessedLetters: [],
        incorrectGuesses: 0,
        status: 'playing',
        roundCount: newRoundCount,
        stats: prev.stats,
      };
    });

    const initLines: TerminalLine[] = [
      {
        id: `b-${Date.now()}-1`,
        text: '========================================\n        CODEALPHA HANGMAN GAME\n========================================',
        type: 'banner',
      },
      {
        id: `b-${Date.now()}-2`,
        text: `Welcome! Guess the hidden word one letter at a time.\nYou are allowed up to ${MAX_INCORRECT_GUESSES} incorrect guesses.\n`,
        type: 'status',
      },
      {
        id: `b-${Date.now()}-3`,
        text: HANGMAN_STAGES[0],
        type: 'stage',
      },
      {
        id: `b-${Date.now()}-4`,
        text: `Word: ${buildHiddenWord(newWord, [])}\nGuessed letters: None\nIncorrect guesses: 0/${MAX_INCORRECT_GUESSES}  (Remaining: ${MAX_INCORRECT_GUESSES})\n----------------------------------------`,
        type: 'status',
      },
    ];

    setTerminalLines(initLines);
  }, []);

  useEffect(() => {
    startNewRound(true);
  }, [startNewRound]);

  const handleSendInput = (raw: string) => {
    const input = raw.trim();

    // Echo input to terminal
    setTerminalLines((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, text: raw, type: 'user' },
    ]);

    // Replay mode handling
    if (gameState.status === 'waiting_replay') {
      const normalized = input.toLowerCase();
      if (normalized === 'y' || normalized === 'yes') {
        setTerminalLines((prev) => [
          ...prev,
          { id: `s-${Date.now()}`, text: '\nStarting next game round...', type: 'status' },
        ]);
        startNewRound(false);
      } else if (normalized === 'n' || normalized === 'no') {
        setTerminalLines((prev) => [
          ...prev,
          {
            id: `s-${Date.now()}`,
            text: '\nThank you for playing CodeAlpha Hangman! Goodbye.\n[Session Finished - Click Restart to play again]',
            type: 'system',
          },
        ]);
      } else {
        setTerminalLines((prev) => [
          ...prev,
          { id: `e-${Date.now()}`, text: "[!] Please enter 'y' for yes or 'n' for no.", type: 'feedback_error' },
        ]);
      }
      return;
    }

    // Input validations matching get_player_guess()
    if (!input) {
      setTerminalLines((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, text: '[!] Please enter a letter. Input cannot be empty.', type: 'feedback_error' },
      ]);
      return;
    }

    if (input.length !== 1) {
      setTerminalLines((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, text: '[!] Please enter only one letter at a time.', type: 'feedback_error' },
      ]);
      return;
    }

    if (!/^[a-zA-Z]$/.test(input)) {
      setTerminalLines((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, text: '[!] Invalid character. Please enter an English letter (A-Z).', type: 'feedback_error' },
      ]);
      return;
    }

    const letter = input.toLowerCase();

    if (gameState.guessedLetters.includes(letter)) {
      setTerminalLines((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, text: `[!] You already guessed '${letter}'. Try another letter.`, type: 'feedback_error' },
      ]);
      return;
    }

    // Process guess
    const newGuessed = [...gameState.guessedLetters, letter];
    const isHit = gameState.secretWord.includes(letter);
    const newIncorrect = isHit ? gameState.incorrectGuesses : gameState.incorrectGuesses + 1;
    const isWin = gameState.secretWord.split('').every((c) => newGuessed.includes(c));
    const isLoss = !isHit && newIncorrect >= MAX_INCORRECT_GUESSES;

    const newLines: TerminalLine[] = [];

    if (isHit) {
      newLines.push({
        id: `h-${Date.now()}`,
        text: `[+] Good guess! '${letter}' is in the word.`,
        type: 'feedback_success',
      });
    } else {
      newLines.push({
        id: `m-${Date.now()}`,
        text: `[-] Sorry, '${letter}' is not in the word.`,
        type: 'feedback_error',
      });
    }

    if (isWin) {
      newLines.push({
        id: `win-${Date.now()}`,
        text: `****************************************\n        CONGRATULATIONS! YOU WON!\n****************************************\nThe secret word was: ${gameState.secretWord}`,
        type: 'win',
      });

      const updatedStats: GameStats = {
        played: stats.played + 1,
        won: stats.won + 1,
        lost: stats.lost,
        currentStreak: stats.currentStreak + 1,
      };

      setStats(updatedStats);
      setGameState((prev) => ({
        ...prev,
        guessedLetters: newGuessed,
        status: 'waiting_replay',
        stats: updatedStats,
      }));

      setTerminalLines((prev) => [...prev, ...newLines]);
      return;
    }

    if (isLoss) {
      newLines.push(
        {
          id: `stage-${Date.now()}`,
          text: HANGMAN_STAGES[newIncorrect],
          type: 'stage',
        },
        {
          id: `loss-${Date.now()}`,
          text: `========================================\n           GAME OVER!\n========================================\nYou ran out of guesses. The word was: '${gameState.secretWord}'. Better luck next time!\n`,
          type: 'game_over',
        }
      );

      const updatedStats: GameStats = {
        played: stats.played + 1,
        won: stats.won,
        lost: stats.lost + 1,
        currentStreak: 0,
      };

      setStats(updatedStats);
      setGameState((prev) => ({
        ...prev,
        guessedLetters: newGuessed,
        incorrectGuesses: newIncorrect,
        status: 'waiting_replay',
        stats: updatedStats,
      }));

      setTerminalLines((prev) => [...prev, ...newLines]);
      return;
    }

    // Ongoing game round status printout
    const remaining = MAX_INCORRECT_GUESSES - newIncorrect;
    newLines.push(
      {
        id: `stage-${Date.now()}`,
        text: HANGMAN_STAGES[newIncorrect],
        type: 'stage',
      },
      {
        id: `st-${Date.now()}`,
        text: `Word: ${buildHiddenWord(gameState.secretWord, newGuessed)}\nGuessed letters: ${newGuessed.sort().join(', ')}\nIncorrect guesses: ${newIncorrect}/${MAX_INCORRECT_GUESSES}  (Remaining: ${remaining})\n----------------------------------------`,
        type: 'status',
      }
    );

    setGameState((prev) => ({
      ...prev,
      guessedLetters: newGuessed,
      incorrectGuesses: newIncorrect,
    }));

    setTerminalLines((prev) => [...prev, ...newLines]);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-900">
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onResetSession={() => startNewRound(false)}
        onDownloadScript={() => handleDownloadFile('hangman.py', HANGMAN_PY_SOURCE)}
        pythonStatus="ready"
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col">
        {currentMode === 'terminal' && (
          <TerminalView
            lines={terminalLines}
            gameState={gameState}
            onSendInput={handleSendInput}
            onResetSession={() => startNewRound(false)}
          />
        )}

        {currentMode === 'game' && (
          <GameView
            gameState={gameState}
            onGuessLetter={(letter) => handleSendInput(letter)}
            onRestartRound={() => startNewRound(false)}
          />
        )}

        {currentMode === 'code' && (
          <CodeViewer onDownload={handleDownloadFile} />
        )}

        {currentMode === 'tests' && <TestSuiteView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-3.5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div>
            CodeAlpha Internship Project &bull; Task 1: Hangman Console Game
          </div>
          <div className="font-mono text-zinc-400">
            Python 3.10 Runtime Environment &bull; React 19 Engine
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
