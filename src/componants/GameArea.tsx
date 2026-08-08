import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DifficultyConfig, GuessEntry } from '../types';
import { formatNumber } from '../utils/gameLogic';
import { soundFx } from '../utils/audio';
import {
  ArrowUpRight,
  ArrowDownRight,
  Send,
  RotateCcw,
  Calculator,
  AlertCircle,
  History,
} from 'lucide-react';

interface GameAreaProps {
  config: DifficultyConfig;
  secretNumber: number;
  guesses: GuessEntry[];
  currentMin: number;
  currentMax: number;
  onGuess: (guess: number) => void;
  onRestart: () => void;
  onResetDifficulty: () => void;
}

export const GameArea: React.FC<GameAreaProps> = ({
  config,
  secretNumber,
  guesses,
  currentMin,
  currentMax,
  onGuess,
  onRestart,
  onResetDifficultylty,
}) =>gsjhbugvhgv mjbjckvcf jknobub