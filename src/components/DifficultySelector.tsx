import React from 'react';
import { motion } from 'motion/react';
import { DIFFICULTY_CONFIGS, formatNumber } from '../utils/gameLogic';
import { DifficultyId, BestScoresMap } from '../types';
import { soundFx } from '../utils/audio';
import { Trophy, ArrowRight } from 'lucide-react';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: DifficultyId) => void;
  bestScores: BestScoresMap;
}

const INDEX_NUMS: Record<DifficultyId, string> = {
  easy: '01',
  medium: '02',
  hard: '03',
  extreme: '04',
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  onSelectDifficulty,
  bestScores,
}) => {
  const configs = Object.values(DIFFICULTY_CONFIGS);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Editorial Header */}
      <div className="mb-10 text-center sm:text-left border-b border-black/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-50 block mb-2">
            Phase 01 // Configuration
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            Select Challenge Scope
          </h2>
        </div>
        <p className="text-xs font-mono uppercase tracking-widest opacity-60">
          Target Deduction Domain
        </p>
      </div>

      {/* Difficulty Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {configs.map((config, index) => {
          const bestScore = bestScores[config.id];

          return (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundFx.playClick();
                onSelectDifficulty(config.id);
              }}
              className="bg-white border border-black/15 hover:border-black p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-black text-white">
                    {INDEX_NUMS[config.id]}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-black/60 font-semibold">
                    {config.badgeText}
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight text-[#1A1A1A] mb-1">
                  {config.name}
                </h3>

                <p className="text-3xl font-black font-mono tracking-tighter text-black my-3">
                  {formatNumber(config.min)}—{formatNumber(config.max)}
                </p>

                <p className="text-[11px] font-mono text-black/60 mb-6">
                  Target: <span className="font-bold text-black">≤ {config.optimalGuesses} steps</span>
                </p>
              </div>

              <div>
                {bestScore ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-black bg-black/5 px-2.5 py-1.5 mb-4 border border-black/10">
                    <Trophy className="w-3.5 h-3.5 shrink-0" />
                    <span>Best: {bestScore.guesses} {bestScore.guesses === 1 ? 'guess' : 'guesses'}</span>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-black/30 italic px-2.5 py-1.5 mb-4">
                    Uncharted Domain
                  </div>
                )}

                <button className="w-full py-3 px-4 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-neutral-800 transition-colors">
                  <span>Initiate</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Editorial Quote Block */}
      <div className="max-w-xl mx-auto p-6 bg-white border border-black/10 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
        <div className="font-mono text-2xl font-black text-black/20 shrink-0">“</div>
        <div className="flex-1">
          <p className="text-xs font-serif italic text-black/80 leading-relaxed mb-2">
            "The secret number lies between the echoes of your previous guesses. Aim higher, or lower, but do not lose your way."
          </p>
          <p className="text-[9px] font-mono uppercase tracking-widest text-black/50 font-bold">
            — The Algorithm
          </p>
        </div>
      </div>
    </div>
  );
};
