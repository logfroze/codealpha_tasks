import React from 'react';
import { Trophy, Frown, RotateCcw, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { HangmanState } from '../types';

interface GameViewProps {
  gameState: HangmanState;
  onGuessLetter: (letter: string) => void;
  onRestartRound: () => void;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export const GameView: React.FC<GameViewProps> = ({
  gameState,
  onGuessLetter,
  onRestartRound,
}) => {
  const { secretWord, guessedLetters, incorrectGuesses, status, stats } = gameState;
  const isWon = status === 'won';
  const isLost = status === 'lost' || (status === 'waiting_replay' && incorrectGuesses >= 6);
  const isFinished = isWon || isLost;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full space-y-6">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-medium">Current Streak</div>
            <div className="text-lg font-bold text-zinc-900 flex items-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{stats.currentStreak}</span>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">Wins</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-medium">Games Won</div>
            <div className="text-lg font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span>{stats.won}</span>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">Total</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-medium">Mistakes</div>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">
              <span className={incorrectGuesses >= 5 ? 'text-rose-600' : 'text-zinc-900'}>
                {incorrectGuesses}
              </span>
              <span className="text-xs text-zinc-400 font-normal"> / 6</span>
            </div>
          </div>
          <ShieldAlert className={`w-4 h-4 ${incorrectGuesses >= 4 ? 'text-rose-500' : 'text-zinc-400'}`} />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-medium">Category</div>
            <div className="text-sm font-semibold text-zinc-900 mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Programming</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            Python
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Status Announcement Banner */}
        {isWon && (
          <div className="w-full mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900">Congratulations! You Won!</h3>
                <p className="text-xs text-emerald-700">You guessed the secret word correctly with {6 - incorrectGuesses} mistakes left.</p>
              </div>
            </div>
            <button
              onClick={onRestartRound}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Next Round</span>
            </button>
          </div>
        )}

        {isLost && (
          <div className="w-full mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center">
                <Frown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900">Game Over!</h3>
                <p className="text-xs text-rose-700">
                  You ran out of attempts. The word was <strong className="font-mono uppercase text-rose-950 underline">{secretWord}</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={onRestartRound}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Visual SVG Hangman Illustration */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 my-2 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full stroke-zinc-800" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Gallows Base */}
            <line x1="20" y1="180" x2="100" y2="180" className="stroke-zinc-400" strokeWidth="6" />
            {/* Pole */}
            <line x1="60" y1="180" x2="60" y2="20" className="stroke-zinc-500" strokeWidth="5" />
            {/* Top Beam */}
            <line x1="58" y1="20" x2="140" y2="20" className="stroke-zinc-500" strokeWidth="5" />
            {/* Angle Brace */}
            <line x1="60" y1="50" x2="90" y2="20" className="stroke-zinc-400" strokeWidth="4" />
            {/* Rope */}
            <line x1="140" y1="20" x2="140" y2="45" className="stroke-amber-600" strokeWidth="3" />

            {/* Stage 1: Head */}
            {incorrectGuesses >= 1 && (
              <circle cx="140" cy="65" r="18" className="stroke-rose-600 fill-white" strokeWidth="3.5" />
            )}

            {/* Stage 2: Body */}
            {incorrectGuesses >= 2 && (
              <line x1="140" y1="83" x2="140" y2="125" className="stroke-rose-600" strokeWidth="3.5" />
            )}

            {/* Stage 3: Left Arm */}
            {incorrectGuesses >= 3 && (
              <line x1="140" y1="95" x2="115" y2="115" className="stroke-rose-600" strokeWidth="3.5" />
            )}

            {/* Stage 4: Right Arm */}
            {incorrectGuesses >= 4 && (
              <line x1="140" y1="95" x2="165" y2="115" className="stroke-rose-600" strokeWidth="3.5" />
            )}

            {/* Stage 5: Left Leg */}
            {incorrectGuesses >= 5 && (
              <line x1="140" y1="125" x2="118" y2="158" className="stroke-rose-600" strokeWidth="3.5" />
            )}

            {/* Stage 6: Right Leg (Full Gallows) */}
            {incorrectGuesses >= 6 && (
              <line x1="140" y1="125" x2="162" y2="158" className="stroke-rose-600" strokeWidth="3.5" />
            )}

            {/* Dead Eyes Face on Game Over */}
            {incorrectGuesses >= 6 && (
              <>
                <line x1="133" y1="60" x2="137" y2="64" className="stroke-rose-600" strokeWidth="2" />
                <line x1="137" y1="60" x2="133" y2="64" className="stroke-rose-600" strokeWidth="2" />
                <line x1="143" y1="60" x2="147" y2="64" className="stroke-rose-600" strokeWidth="2" />
                <line x1="147" y1="60" x2="143" y2="64" className="stroke-rose-600" strokeWidth="2" />
                <path d="M 134 73 Q 140 68 146 73" className="stroke-rose-600" strokeWidth="2" />
              </>
            )}
          </svg>
        </div>

        {/* Word Mystery Letter Tiles */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 my-6">
          {secretWord.split('').map((char, index) => {
            const revealed = guessedLetters.includes(char) || isLost;
            return (
              <div
                key={index}
                className={`w-10 h-13 sm:w-13 sm:h-16 rounded-xl flex items-center justify-center font-mono text-xl sm:text-2xl font-bold uppercase border-2 transition-all shadow-xs ${
                  revealed
                    ? isLost && !guessedLetters.includes(char)
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-emerald-50 border-emerald-500 text-emerald-800 scale-105'
                    : 'bg-zinc-100 border-zinc-300 text-transparent'
                }`}
              >
                {revealed ? char : ''}
              </div>
            );
          })}
        </div>

        {/* Guessed Letters Summary Indicator */}
        <div className="text-xs text-zinc-500 mb-6 font-mono">
          Guessed Letters: {guessedLetters.length > 0 ? guessedLetters.sort().join(', ').toUpperCase() : 'None'}
        </div>

        {/* Interactive On-Screen Keyboard */}
        <div className="w-full max-w-xl flex flex-col items-center gap-1.5 sm:gap-2">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-1 sm:gap-1.5 justify-center w-full">
              {row.map((letter) => {
                const isGuessed = guessedLetters.includes(letter);
                const isMatch = isGuessed && secretWord.includes(letter);
                const isMiss = isGuessed && !secretWord.includes(letter);

                return (
                  <button
                    key={letter}
                    disabled={isGuessed || isFinished}
                    onClick={() => onGuessLetter(letter)}
                    className={`h-10 sm:h-11 min-w-[28px] sm:min-w-[38px] px-2 rounded-lg text-xs sm:text-sm font-semibold font-mono uppercase transition-all flex items-center justify-center ${
                      isMatch
                        ? 'bg-emerald-600 text-white shadow-xs border border-emerald-700 cursor-not-allowed'
                        : isMiss
                        ? 'bg-zinc-200 text-zinc-400 border border-zinc-200 line-through cursor-not-allowed opacity-50'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 active:scale-95'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
