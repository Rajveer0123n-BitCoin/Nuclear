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
  onResetDifficulty,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [guesses.length]);

  const lastGuess = guesses.length > 0 ? guesses[guesses.length - 1] : null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) {
      triggerError('Enter a numerical value.');
      return;
    }

    const num = parseInt(trimmed, 10);

    if (isNaN(num)) {
      triggerError('Invalid whole number.');
      return;
    }

    if (num < config.min || num > config.max) {
      triggerError(`Value must be between ${formatNumber(config.min)} and ${formatNumber(config.max)}.`);
      return;
    }

    setErrorMessage(null);
    setInputValue('');
    onGuess(num);
  };

  const triggerError = (msg: string) => {
    soundFx.playError();
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    inputRef.current?.focus();
  };

  const midPoint = Math.floor((currentMin + currentMax) / 2);

  const fillMidpoint = () => {
    soundFx.playClick();
    setInputValue(midPoint.toString());
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  const totalRange = config.max - config.min + 1;
  const currentRangeSize = currentMax - currentMin + 1;
  const rangeNarrowPercent = Math.max(0, Math.min(100, Math.round(100 - (currentRangeSize / totalRange) * 100)));

  // Compute watermark feedback text
  const feedbackWatermark = !lastGuess
    ? 'TARGET'
    : lastGuess.feedback === 'higher'
    ? 'HIGHER'
    : 'LOWER';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col justify-between relative min-h-[520px]">
      {/* Background Giant Artistic Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[120px] sm:text-[200px] font-black text-black/[0.035] tracking-tighter uppercase font-mono transition-all duration-300">
          {feedbackWatermark}
        </span>
      </div>

      {/* Top Session & Domain Status Header */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50 block">
            Domain Range
          </span>
          <span className="text-sm font-black font-mono">
            {formatNumber(config.min)} — {formatNumber(config.max)} ({config.name})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block">
              Attempt Count
            </span>
            <span className="text-xl font-black font-mono">
              {String(guesses.length).padStart(2, '0')}
            </span>
          </div>

          <div className="w-10 h-10 border border-black flex items-center justify-center font-mono text-xs font-bold bg-white" title="Range Eliminated">
            {rangeNarrowPercent}%
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onRestart();
            }}
            className="p-2 border border-black/20 hover:border-black bg-white hover:bg-black hover:text-white transition-all"
            title="Restart Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Center Gameplay Interactive Panel */}
      <div className="z-10 flex-1 flex flex-col items-center justify-center my-4">
        {/* Valid Range Indicator Bar */}
        <div className="w-full max-w-md bg-white border border-black/10 p-3 mb-6">
          <div className="flex items-center justify-between font-mono text-[11px] mb-1.5">
            <span className="opacity-50">Active Bounds</span>
            <span className="font-bold">{formatNumber(currentMin)} ... {formatNumber(currentMax)}</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 relative overflow-hidden">
            <motion.div
              className="bg-black h-full"
              style={{
                left: `${((currentMin - config.min) / totalRange) * 100}%`,
                width: `${Math.max(1, (currentRangeSize / totalRange) * 100)}%`,
                position: 'relative',
              }}
            />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
          <motion.div
            animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-2">
              Input Guess Number
            </span>

            <div className="relative w-full max-w-xs mb-4">
              <input
                ref={inputRef}
                type="number"
                min={config.min}
                max={config.max}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="?"
                className="w-full bg-transparent text-5xl sm:text-7xl font-black font-mono text-center outline-none border-b-4 border-black/20 focus:border-black transition-colors py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 border border-rose-200 mb-4"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feedback Message */}
            {lastGuess && (
              <div className="mb-6 text-center">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 font-mono text-xs font-bold tracking-widest uppercase border ${
                  lastGuess.feedback === 'higher'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black'
                }`}>
                  {lastGuess.feedback === 'higher' ? (
                    <>
                      <ArrowUpRight className="w-4 h-4" /> Higher than {formatNumber(lastGuess.guessNumber)}
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4" /> Lower than {formatNumber(lastGuess.guessNumber)}
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={fillMidpoint}
                className="px-4 py-3 border border-black/20 bg-white font-mono text-xs font-bold uppercase tracking-wider hover:border-black transition-all flex items-center gap-1.5"
                title="Binary search midpoint"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Bisect ({formatNumber(midPoint)})</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
              >
                <span>Submit Guess</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </form>
      </div>

      {/* History Visualizer Bar Chart Footer */}
      {guesses.length > 0 && (
        <div className="z-10 mt-8 pt-4 border-t border-black/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 flex items-center gap-1.5">
              <History className="w-3 h-3" /> Attempt Sequence Visualizer
            </span>
            <span className="text-[10px] font-mono font-bold">
              {guesses.length} total
            </span>
          </div>

          <div className="flex items-end gap-2 h-16 bg-white p-3 border border-black/10 overflow-x-auto scrollbar-thin">
            {guesses.map((entry, idx) => {
              const relHeightPercent = Math.max(15, Math.min(100, Math.round(((entry.guessNumber - config.min) / totalRange) * 100)));
              const isLast = idx === guesses.length - 1;

              return (
                <div
                  key={entry.id}
                  className="flex flex-col items-center gap-1 group relative cursor-pointer"
                  style={{ minWidth: '24px' }}
                >
                  <div className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 bg-black text-white px-1 py-0.5 z-20 whitespace-nowrap">
                    #{idx + 1}: {formatNumber(entry.guessNumber)}
                  </div>
                  <div
                    className={`w-5 transition-all ${
                      isLast
                        ? 'bg-black'
                        : entry.feedback === 'higher'
                        ? 'bg-black/30 group-hover:bg-black/60'
                        : 'bg-black/15 group-hover:bg-black/40'
                    }`}
                    style={{ height: `${relHeightPercent}%` }}
                  />
                  <span className="text-[8px] font-mono opacity-40">
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
