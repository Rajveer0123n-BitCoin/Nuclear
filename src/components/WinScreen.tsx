import React from 'react';
import { motion } from 'motion/react';
import { DifficultyConfig, RatingDetail } from '../types';
import { calculateRating, formatNumber } from '../utils/gameLogic';
import { soundFx } from '../utils/audio';
import { Trophy, Star, RotateCcw, ArrowLeft, Award, Sparkles } from 'lucide-react';

interface WinScreenProps {
  config: DifficultyConfig;
  secretNumber: number;
  totalGuesses: number;
  isNewBestRecord: boolean;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export const WinScreen: React.FC<WinScreenProps> = ({
  config,
  secretNumber,
  totalGuesses,
  isNewBestRecord,
  onPlayAgain,
  onChangeDifficulty,
}) => {
  const ratingDetail: RatingDetail = calculateRating(totalGuesses, config.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg mx-auto px-4 py-8"
    >
      <div className="bg-white border-2 border-black p-6 sm:p-8 text-center relative shadow-md">
        {/* Victory Icon / Badge */}
        <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-50 block mb-1">
          Deduction Completed
        </span>

        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-[#1A1A1A]">
          Victory Achieved
        </h2>

        {/* New Record Banner */}
        {isNewBestRecord && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-wider my-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Personal Best Record!</span>
          </motion.div>
        )}

        {/* Secret Number Display Banner */}
        <div className="my-6 p-4 bg-[#F2F2F2] border border-black/10">
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block mb-1">
            Secret Target Number
          </span>
          <span className="text-5xl sm:text-6xl font-black font-mono text-black tracking-tight">
            {formatNumber(secretNumber)}
          </span>
        </div>

        {/* Rating Card */}
        <div className="p-4 bg-white border border-black/20 mb-6 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-black" />
              <span className="text-base font-mono font-black uppercase text-black">
                Rating: {ratingDetail.rating}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= ratingDetail.stars
                      ? 'text-black fill-black'
                      : 'text-black/20'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs font-mono text-black/80">
            {ratingDetail.message}
          </p>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-8 text-center font-mono">
          <div className="p-3 bg-[#F2F2F2] border border-black/10">
            <span className="text-[9px] uppercase font-bold opacity-50 block">
              Guesses
            </span>
            <span className="text-xl font-black text-black">
              {totalGuesses}
            </span>
          </div>

          <div className="p-3 bg-[#F2F2F2] border border-black/10">
            <span className="text-[9px] uppercase font-bold opacity-50 block">
              Difficulty
            </span>
            <span className="text-xs font-black text-black mt-1 block uppercase">
              {config.name}
            </span>
          </div>

          <div className="p-3 bg-[#F2F2F2] border border-black/10">
            <span className="text-[9px] uppercase font-bold opacity-50 block">
              Optimal
            </span>
            <span className="text-xs font-black text-black mt-1 block">
              ≤ {config.optimalGuesses}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-6 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group"
          >
            <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onChangeDifficulty();
            }}
            className="w-full py-3.5 px-6 bg-white text-black border border-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Difficulty</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
