import React, { useState } from 'react';
import { CollectibleItem, MemoryPuzzle } from '../types/game';
import { Sparkles, MapPin, CheckCircle, Lock, Gift, KeyRound } from 'lucide-react';
import { sound } from '../utils/audio';

interface InventoryModalProps {
  collectibles: CollectibleItem[];
  puzzles: MemoryPuzzle[];
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  collectibles,
  puzzles,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'keys'>('items');
  const [selectedItem, setSelectedItem] = useState<CollectibleItem | null>(collectibles[0]);

  const itemsFoundCount = collectibles.filter(c => c.found).length;
  const keysFoundCount = puzzles.filter(p => p.solved).length;
  const totalCompleted = itemsFoundCount + keysFoundCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-slate-900 border-4 border-rose-600 rounded-none p-4 sm:p-5 text-slate-100 shadow-[8px_8px_0_0_#0f172a] font-vt text-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-rose-400" />
            <h3 className="font-pixel text-xs sm:text-sm text-rose-300 tracking-wider">
              INVENTORY & QUEST SATCHEL
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-slate-800 hover:bg-rose-900 border-2 border-slate-600 hover:border-rose-500 text-xs font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Quest Summary Bar */}
        <div className="bg-slate-950 p-3 border-2 border-slate-800 mb-3">
          <div className="flex items-center justify-between text-xs font-pixel mb-1.5">
            <span className="text-slate-300">LOVE QUEST PROGRESS</span>
            <span className="text-rose-400">{totalCompleted} / 6 DISCOVERED</span>
          </div>
          <div className="w-full bg-slate-800 h-3 border border-slate-700">
            <div
              className="bg-linear-to-r from-rose-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${(totalCompleted / 6) * 100}%` }}
            />
          </div>
          {totalCompleted === 6 && (
            <p className="text-center font-pixel text-xs text-amber-300 mt-2 animate-pulse">
              ✨ SEMUA KENANGAN & KUNCI TERKUMPUL! MENUJU GEREJA BLENDUK (UTARA)! ✨
            </p>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 border-b-2 border-slate-800 pb-2 mb-3">
          <button
            onClick={() => {
              setActiveTab('items');
              sound.playDialogueBeep(450);
            }}
            className={`flex-1 py-1.5 px-3 border-2 font-pixel text-xs flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'items'
                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-4 h-4" />
            Favorite Treats ({itemsFoundCount}/3)
          </button>
          <button
            onClick={() => {
              setActiveTab('keys');
              sound.playDialogueBeep(450);
            }}
            className={`flex-1 py-1.5 px-3 border-2 font-pixel text-xs flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'keys'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Memory Keys ({keysFoundCount}/3)
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {activeTab === 'items' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {collectibles.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      sound.playFootstep();
                    }}
                    className={`p-3 border-2 text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-rose-400 bg-slate-800'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{item.icon}</span>
                      {item.found ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-pixel text-[11px] text-slate-100 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-rose-300 font-pixel mt-1">
                        {item.found ? 'FOUND!' : 'NOT FOUND'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {puzzles.map(puzzle => (
                <div
                  key={puzzle.id}
                  className={`p-3 border-2 flex items-center justify-between ${
                    puzzle.solved
                      ? 'border-amber-500/80 bg-amber-950/20'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{puzzle.keyIcon}</span>
                    <div>
                      <h4 className="font-pixel text-xs text-slate-100">{puzzle.keyName}</h4>
                      <p className="text-sm text-slate-400 leading-tight">{puzzle.description}</p>
                    </div>
                  </div>
                  <div>
                    {puzzle.solved ? (
                      <span className="font-pixel text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-1 border border-emerald-600">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="font-pixel text-[10px] text-slate-500 bg-slate-900 px-2 py-1 border border-slate-700">
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed item story card if on items tab */}
          {activeTab === 'items' && selectedItem && (
            <div className="p-3.5 bg-slate-950 border-2 border-slate-800 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedItem.icon}</span>
                <div>
                  <h4 className="font-pixel text-xs text-rose-300">{selectedItem.name}</h4>
                  <p className="text-xs text-slate-400">{selectedItem.category}</p>
                </div>
              </div>

              {selectedItem.found ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-rose-950/40 border border-rose-800/60">
                    <p className="text-xs font-pixel text-rose-300 mb-1">OUR MEMORY STORY:</p>
                    <p className="text-base text-rose-100 leading-snug">
                      "{selectedItem.memoryStory}"
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    Found with love in our 8-bit universe.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-pixel text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    LOCATION CLUE:
                  </div>
                  <p className="text-base">{selectedItem.locationHint}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 font-pixel text-xs"
          >
            Close Satchel
          </button>
        </div>
      </div>
    </div>
  );
};
