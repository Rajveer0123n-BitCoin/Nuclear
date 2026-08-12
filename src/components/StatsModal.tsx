import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BestScoresMap } from '../types';
import { DIFFICULTY_CONFIGS, formatNumber } from '../utils/gameLogic';
import { soundFx } from '../utils/audio';
import { Trophy, X, Trash2 } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestScores: BestScoresMap;
  onClearStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  bestScores,
  onClearStats,
}) => {
  if (!isOpen) return null;

  const configs = Object.values(DIFFICULTY_CONFIGS);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white border-2 border-black p-6 relative shadow-lg"
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-black" />
              <h3 className="text-lg font-black uppercase tracking-tight text-black font-mono">
                Personal Best Records
              </h3>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-2.5 font-mono">
            {configs.map((config) => {
              const record = bestScores[config.id];

              return (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-3 bg-[#F2F2F2] border border-black/10"
                >
                  <div>
                    <span className="text-xs font-black uppercase text-black block">
                      {config.name}
                    </span>
                    <span className="text-[10px] text-black/50">
                      {formatNumber(config.min)} — {formatNumber(config.max)}
                    </span>
                  </div>

                  <div className="text-right">
                    {record ? (
                      <div>
                        <span className="text-sm font-black text-black">
                          {record.guesses} {record.guesses === 1 ? 'guess' : 'guesses'}
                        </span>
                        <span className="text-[9px] text-black/40 block">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-black/30 italic">
                        Unrecorded
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-black/10 flex items-center justify-between">
            <button
              onClick={() => {
                soundFx.playClick();
                onClearStats();
              }}
              className="flex items-center gap-1.5 font-mono text-xs text-rose-700 font-bold hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Records</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
