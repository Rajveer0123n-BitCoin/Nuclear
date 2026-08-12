import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';
import { HelpCircle, X, ArrowUpRight, ArrowDownRight, Lightbulb } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <HelpCircle className="w-5 h-5 text-black" />
              <h3 className="text-lg font-black uppercase tracking-tight text-black font-mono">
                System Guide
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

          <div className="py-4 space-y-4 font-mono text-xs text-black/80">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-black text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                01
              </div>
              <div>
                <p className="font-bold text-black text-sm uppercase">
                  Select Scope
                </p>
                <p className="mt-0.5">
                  Pick domain range: Easy (1–100), Medium (1–1,000), Hard (1–10,000), or Extreme (1–100,000).
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-black text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                02
              </div>
              <div>
                <p className="font-bold text-black text-sm uppercase">
                  Directional Hints
                </p>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-black">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span><strong>Higher</strong>: Secret number is larger.</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-black">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span><strong>Lower</strong>: Secret number is smaller.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-black text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                03
              </div>
              <div>
                <p className="font-bold text-black text-sm uppercase">
                  Bisection Strategy
                </p>
                <p className="mt-0.5">
                  Divide search space by picking the midpoint of current active range.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F2F2F2] border border-black/20 flex gap-2.5">
              <Lightbulb className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-black uppercase block mb-0.5">Optimal Algorithm</span>
                <p className="text-[10px] text-black/70">
                  By clicking "Bisect", you automatically split remaining bounds in half!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/10 text-right">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-5 py-2.5 bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all"
            >
              Acknowledge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
