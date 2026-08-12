import React from 'react';
import { Volume2, VolumeX, Trophy, Sparkles, HelpCircle, ArrowLeftRight } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
  onResetToDifficulty: () => void;
  isPlaying: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenStats,
  onOpenHelp,
  onResetToDifficulty,
  isPlaying,
}) => {
  return (
    <header className="w-full border-b border-black/10 px-4 sm:px-8 py-5 flex items-center justify-between bg-[#F2F2F2]">
      <div
        onClick={() => {
          soundFx.playClick();
          onResetToDifficulty();
        }}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
          NG
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-[#1A1A1A]">
            Number Guessing
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-widest mt-1 opacity-60">
            Deduction Modality
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isPlaying && (
          <button
            onClick={() => {
              soundFx.playClick();
              onResetToDifficulty();
            }}
            className="px-3.5 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-black border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all flex items-center gap-1.5"
            title="Change Difficulty"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Difficulty</span>
          </button>
        )}

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenHelp();
          }}
          className="p-2 text-black border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all"
          title="How to Play"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenStats();
          }}
          className="p-2 text-black border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all"
          title="Personal Bests"
        >
          <Trophy className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onToggleMute();
          }}
          className="p-2 text-black border border-black/20 hover:border-black hover:bg-black hover:text-white transition-all"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-600" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
