import React from 'react';
import { Direction } from '../types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Backpack, Swords } from 'lucide-react';
import { sound } from '../utils/audio';

interface MobileControlsProps {
  onMoveStart: (dir: Direction) => void;
  onMoveEnd: () => void;
  onInteract: () => void;
  onAttack?: () => void;
  onOpenInventory: () => void;
  isNearInteractable: boolean;
  interactLabel?: string;
  isSprinting: boolean;
  onToggleSprint: () => void;
  isHellRealm?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveStart,
  onMoveEnd,
  onInteract,
  onAttack,
  onOpenInventory,
  isNearInteractable,
  interactLabel,
  isSprinting,
  onToggleSprint,
  isHellRealm = false
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-3 px-2 select-none touch-none">
      {/* 16-bit D-Pad */}
      <div className="relative w-36 h-36 bg-slate-900/90 border-4 border-slate-700 rounded-none shadow-[4px_4px_0_0_#0f172a] p-1 flex items-center justify-center">
        {/* Up */}
        <button
          onPointerDown={e => {
            e.preventDefault();
            onMoveStart('up');
          }}
          onPointerUp={e => {
            e.preventDefault();
            onMoveEnd();
          }}
          onPointerLeave={onMoveEnd}
          className="absolute top-1 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:bg-rose-600 border-2 border-slate-600 active:border-rose-400 flex items-center justify-center text-slate-200"
          aria-label="Move Up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Down */}
        <button
          onPointerDown={e => {
            e.preventDefault();
            onMoveStart('down');
          }}
          onPointerUp={e => {
            e.preventDefault();
            onMoveEnd();
          }}
          onPointerLeave={onMoveEnd}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:bg-rose-600 border-2 border-slate-600 active:border-rose-400 flex items-center justify-center text-slate-200"
          aria-label="Move Down"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* Left */}
        <button
          onPointerDown={e => {
            e.preventDefault();
            onMoveStart('left');
          }}
          onPointerUp={e => {
            e.preventDefault();
            onMoveEnd();
          }}
          onPointerLeave={onMoveEnd}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:bg-rose-600 border-2 border-slate-600 active:border-rose-400 flex items-center justify-center text-slate-200"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Right */}
        <button
          onPointerDown={e => {
            e.preventDefault();
            onMoveStart('right');
          }}
          onPointerUp={e => {
            e.preventDefault();
            onMoveEnd();
          }}
          onPointerLeave={onMoveEnd}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800 hover:bg-slate-700 active:bg-rose-600 border-2 border-slate-600 active:border-rose-400 flex items-center justify-center text-slate-200"
          aria-label="Move Right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Center Pivot */}
        <div className="w-6 h-6 bg-slate-950 border border-slate-800 rounded-none" />
      </div>

      {/* Action Buttons: [B] Sprint, [🎒] Bag, [⚔️] Attack (if Hell), [A] Interact */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Inventory Quick Open */}
        <button
          onClick={() => {
            sound.playDialogueBeep(480);
            onOpenInventory();
          }}
          className="w-11 h-11 bg-slate-800 active:bg-slate-700 border-3 border-slate-600 flex flex-col items-center justify-center text-amber-300 font-pixel text-[9px] shadow-[2px_2px_0_0_#0f172a]"
          title="Open Satchel"
        >
          <Backpack className="w-4 h-4 mb-0.5 text-amber-400" />
          BAG
        </button>

        {/* B Button: Sprint */}
        <button
          onClick={onToggleSprint}
          className={`w-11 h-11 border-3 font-pixel text-xs flex flex-col items-center justify-center shadow-[3px_3px_0_0_#0f172a] active:scale-95 transition-all ${
            isSprinting
              ? 'bg-amber-600 border-amber-300 text-white animate-pulse'
              : 'bg-slate-800 border-slate-600 text-slate-300'
          }`}
          title="Toggle Sprint"
        >
          <span>B</span>
          <span className="text-[7px]">{isSprinting ? 'RUN' : 'WALK'}</span>
        </button>

        {/* Sword Attack Button in Hell Realm */}
        {isHellRealm && onAttack && (
          <button
            onClick={onAttack}
            className="w-13 h-13 bg-rose-700 active:bg-rose-600 border-3 border-rose-400 flex flex-col items-center justify-center text-white font-pixel text-[9px] shadow-[3px_3px_0_0_#450a0a] active:scale-95 transition-all animate-pulse"
            title="Swing Sword"
          >
            <Swords className="w-5 h-5 text-amber-300 mb-0.5" />
            <span>SLASH</span>
          </button>
        )}

        {/* A Button: Action / Interact */}
        <button
          onClick={() => {
            if (isNearInteractable) {
              sound.playDialogueBeep(600);
              onInteract();
            } else if (isHellRealm && onAttack) {
              onAttack();
            } else {
              sound.playDialogueBeep(600);
              onInteract();
            }
          }}
          className={`w-14 h-14 border-4 font-pixel text-xs flex flex-col items-center justify-center shadow-[4px_4px_0_0_#0f172a] active:scale-95 transition-all cursor-pointer ${
            isNearInteractable
              ? 'bg-rose-600 hover:bg-rose-500 border-rose-300 text-white animate-bounce'
              : 'bg-slate-800 border-slate-600 text-slate-400'
          }`}
        >
          <span className="text-sm font-bold">A</span>
          <span className="text-[8px] mt-0.5 text-center leading-none">
            {isNearInteractable ? (interactLabel || 'EXAMINE') : (isHellRealm ? 'SWORD' : 'ACTION')}
          </span>
        </button>
      </div>
    </div>
  );
};
