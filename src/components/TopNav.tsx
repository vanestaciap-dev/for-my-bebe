import React from 'react';
import { Heart, Music, Backpack, Settings, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopNavProps {
  onOpenInventory: () => void;
  onOpenSettings: () => void;
  onOpenControlsHelp: () => void;
  onOpenLetterDirect?: () => void;
  isLetterAvailable: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenInventory,
  onOpenSettings,
  onOpenControlsHelp,
  onOpenLetterDirect,
  isLetterAvailable,
  isMuted,
  onToggleMute
}) => {
  return (
    <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3 border-b-2 border-slate-800 bg-slate-950 text-slate-100 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
        <span className="text-sm sm:text-base font-pixel tracking-wider text-rose-400 whitespace-nowrap shrink-0">
          KOTA LAMA · 16-BIT
        </span>
      </div>

      {/* Zone 2: Clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={onOpenInventory}
          className="hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-vt text-lg cursor-pointer"
        >
          <Backpack className="w-4 h-4 text-amber-400" />
          Quest Satchel
        </button>
        <button
          onClick={onOpenSettings}
          className="hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-vt text-lg cursor-pointer"
        >
          <Settings className="w-4 h-4 text-sky-400" />
          Customize Memories
        </button>
        <button
          onClick={onOpenControlsHelp}
          className="hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-vt text-lg cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          Controls Guide
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-pixel text-xs flex items-center gap-1 cursor-pointer"
          title="Toggle 8-bit Music & Audio"
        >
          <Music className={`w-3.5 h-3.5 ${!isMuted ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span className="hidden sm:inline text-[10px]">
            {isMuted ? 'MUTED' : 'CALM LO-FI'}
          </span>
        </button>

        {isLetterAvailable && onOpenLetterDirect ? (
          <button
            onClick={onOpenLetterDirect}
            className="px-3 py-1.5 text-xs font-pixel text-white bg-rose-600 hover:bg-rose-500 border-2 border-rose-400 rounded-none shadow-[2px_2px_0_0_#4c0519] cursor-pointer whitespace-nowrap shrink-0 animate-bounce"
          >
            💌 OPEN LOVE LETTER
          </button>
        ) : (
          <button
            onClick={onOpenInventory}
            className="px-3 py-1.5 text-xs font-pixel text-slate-200 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 rounded-none shadow-[2px_2px_0_0_#0f172a] cursor-pointer whitespace-nowrap shrink-0"
          >
            VIEW QUEST
          </button>
        )}
      </div>
    </header>
  );
};
