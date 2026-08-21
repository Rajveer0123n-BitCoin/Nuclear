import React, { useState, useEffect } from 'react';
import {
  DifficultyId,
  GuessEntry,
  BestScoresMap,
} from './types';
import {
  DIFFICULTY_CONFIGS,
  getRandomNumber,
} from './utils/gameLogic';
import { soundFx } from './utils/audio';

import { Header } from './components/Header';
import { DifficultySelector } from './components/DifficultySelector';
import { GameArea } from './components/GameArea';
import { WinScreen } from './components/WinScreen';
import { StatsModal } from './components/StatsModal';
import { HelpModal } from './components/HelpModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

const LOCAL_STORAGE_KEY = 'num_guess_best_scores_v1';

const INITIAL_BEST_SCORES: BestScoresMap = {
  easy: null,
  medium: null,
  hard: null,
  extreme: null,
};

export default function App() {
  const [gameState, setGameState] = useState<'selecting' | 'playing' | 'won'>('selecting');
  const [difficulty, setDifficulty] = useState<DifficultyId>('medium');
  const [secretNumber, setSecretNumber] = useState<number>(500);
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [currentMin, setCurrentMin] = useState<number>(1);
  const [currentMax, setCurrentMax] = useState<number>(1000);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isNewBestRecord, setIsNewBestRecord] = useState<boolean>(false);

  const [bestScores, setBestScores] = useState<BestScoresMap>(() => {
    if (typeof window === 'undefined') return INITIAL_BEST_SCORES;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BEST_SCORES;
    } catch {
      return INITIAL_BEST_SCORES;
    }
  });

  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Save best scores to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bestScores));
    } catch {
      // Ignore storage errors
    }
  }, [bestScores]);

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectDifficulty = (selectedDiff: DifficultyId) => {
    const config = DIFFICULTY_CONFIGS[selectedDiff];
    setDifficulty(selectedDiff);
    const secret = getRandomNumber(config.min, config.max);
    setSecretNumber(secret);
    setGuesses([]);
    setCurrentMin(config.min);
    setCurrentMax(config.max);
    setIsNewBestRecord(false);
    setGameState('playing');
  };

  const handleGuess = (guessNum: number) => {
    const minAtTime = currentMin;
    const maxAtTime = currentMax;

    if (guessNum === secretNumber) {
      soundFx.playWin();
      const newCount = guesses.length + 1;
      const prevBest = bestScores[difficulty];

      let isNewRecord = false;
      if (!prevBest || newCount < prevBest.guesses) {
        isNewRecord = true;
        setBestScores((prev) => ({
          ...prev,
          [difficulty]: { guesses: newCount, timestamp: Date.now() },
        }));
      }

      setIsNewBestRecord(isNewRecord);
      setGuesses((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          guessNumber: guessNum,
          feedback: 'correct',
          timestamp: Date.now(),
          minBoundAtTime: minAtTime,
          maxBoundAtTime: maxAtTime,
        },
      ]);
      setGameState('won');
    } else if (guessNum < secretNumber) {
      soundFx.playHigher();
      setCurrentMin((prev) => Math.max(prev, guessNum + 1));
      setGuesses((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          guessNumber: guessNum,
          feedback: 'higher',
          timestamp: Date.now(),
          minBoundAtTime: minAtTime,
          maxBoundAtTime: maxAtTime,
        },
      ]);
    } else {
      soundFx.playLower();
      setCurrentMax((prev) => Math.min(prev, guessNum - 1));
      setGuesses((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          guessNumber: guessNum,
          feedback: 'lower',
          timestamp: Date.now(),
          minBoundAtTime: minAtTime,
          maxBoundAtTime: maxAtTime,
        },
      ]);
    }
  };

  const handleRestart = () => {
    handleSelectDifficulty(difficulty);
  };

  const handleResetToDifficulty = () => {
    setGameState('selecting');
  };

  const handleClearStats = () => {
    setBestScores(INITIAL_BEST_SCORES);
  };

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col font-sans transition-colors duration-300 selection:bg-black selection:text-white">
      <ConfettiCanvas active={gameState === 'won'} />
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onResetToDifficulty={handleResetToDifficulty}
        isPlaying={gameState !== 'selecting'}
      />
      <main className="flex-1 flex flex-col justify-center py-6">
        {gameState === 'selecting' && (
          <DifficultySelector
            onSelectDifficulty={handleSelectDifficulty}
            bestScores={bestScores}
          />
        )}
        {gameState === 'playing' && (
          <GameArea
            config={currentConfig}
            secretNumber={secretNumber}
            guesses={guesses}
            currentMin={currentMin}
            currentMax={currentMax}
            onGuess={handleGuess}
            onRestart={handleRestart}
            onResetDifficulty={handleResetToDifficulty}
          />
        )}
        {gameState === 'won' && (
          <WinScreen
            config={currentConfig}
            secretNumber={secretNumber}
            totalGuesses={guesses.length}
            isNewBestRecord={isNewBestRecord}
            onPlayAgain={handleRestart}
            onChangeDifficulty={handleResetToDifficulty}
          />
        )}
      </main>
      <footer className="py-4 px-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-widest text-black/50">
        <p>Number Guessing Challenge //I want to make it minimal looking pro</p>
        <p>Deduction Engine NC-8829-X</p>
      </footer>
     <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        bestScores={bestScores}
        onClearStats={handleClearStats}      />
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
