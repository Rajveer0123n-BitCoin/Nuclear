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
  
}