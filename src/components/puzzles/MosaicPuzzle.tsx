import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Eye, Wand2, CheckCircle2 } from 'lucide-react';

interface MosaicPuzzleProps {
  onSuccess: () => void;
  onClose: () => void;
  isAlreadySolved: boolean;
}

// 3x3 grid (indices 0 to 8, with 8 as the empty space initially or in target)
// Target state: [0, 1, 2, 3, 4, 5, 6, 7, 8]
const TARGET_STATE = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Adorable 16-bit retro pixel emojis and colors for the 9 tiles depicting Kota Lama memories
const TILE_PIECES = [
  { id: 0, label: '⛪ Blenduk', desc: 'Kubah Gereja', color: 'bg-teal-900 border-teal-600' },
  { id: 1, label: '🚲 Ontel', desc: 'Sepeda Kenangan', color: 'bg-emerald-900 border-emerald-600' },
  { id: 2, label: '🌉 Jembatan', desc: 'Kali Semarang', color: 'bg-cyan-900 border-cyan-600' },
  { id: 3, label: '🍨 Toko Oen', desc: 'Es Krim Manis', color: 'bg-rose-900 border-rose-600' },
  { id: 4, label: '👩‍❤️‍👨 Kita', desc: 'Genggaman Tangan', color: 'bg-pink-900 border-pink-600' },
  { id: 5, label: '🍰 Marba', desc: 'Cheesecake', color: 'bg-amber-900 border-amber-600' },
  { id: 6, label: '📼 Kaset', desc: 'Lagu Romantis', color: 'bg-slate-800 border-slate-600' },
  { id: 7, label: '🌸 Melati', desc: 'Taman Srigunting', color: 'bg-indigo-900 border-indigo-600' },
  { id: 8, label: '💖 Abadi', desc: 'Cinta Selamanya', color: 'bg-rose-950 border-rose-700' },
];

export const MosaicPuzzle: React.FC<MosaicPuzzleProps> = ({ onSuccess, onClose, isAlreadySolved }) => {
  // A solvable scrambled starting board (a few moves away from target for fun)
  const [tiles, setTiles] = useState<number[]>([1, 0, 2, 3, 4, 5, 6, 7, 8]);
  const [showPreview, setShowPreview] = useState(false);
  const [hasWon, setHasWon] = useState(isAlreadySolved);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (!isAlreadySolved) {
      // Solvable friendly scramble: swap 0 and 1, 4 and 5
      setTiles([1, 0, 2, 4, 3, 5, 6, 7, 8]);
    } else {
      setTiles(TARGET_STATE);
    }
  }, [isAlreadySolved]);

  // Check if solved
  const checkWin = (currentTiles: number[]) => {
    const won = currentTiles.every((val, idx) => val === TARGET_STATE[idx]);
    if (won && !hasWon) {
      setHasWon(true);
      sound.playPuzzleSuccess();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleTileClick = (index: number) => {
    if (hasWon) return;

    sound.playFootstep();

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      // Swap tiles
      const nextTiles = [...tiles];
      const temp = nextTiles[selectedIdx];
      nextTiles[selectedIdx] = nextTiles[index];
      nextTiles[index] = temp;

      setTiles(nextTiles);
      setMoves(m => m + 1);
      setSelectedIdx(null);
      checkWin(nextTiles);
    }
  };

  const handleAutoSolve = () => {
    sound.playCollectSound();
    setTiles(TARGET_STATE);
    setHasWon(true);
    confetti({ particleCount: 60, spread: 60 });
    setTimeout(() => {
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border-4 border-sky-600 rounded-none p-5 text-slate-100 shadow-[8px_8px_0_0_#0f172a] font-vt text-lg">
        {/* Retro Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-sky-400" />
            <h3 className="font-pixel text-xs text-sky-300 tracking-wider">
              PUZZLE 2: STARLIT MOSAIC
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-slate-800 hover:bg-rose-900 border-2 border-slate-600 hover:border-rose-500 text-xs font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Status prompt */}
        <div className="bg-slate-950 p-3 border-2 border-slate-800 mb-4 text-center">
          <p className="text-sm font-pixel text-sky-200 mb-1">
            {hasWon ? '🔑 MOSAIC KEY ACQUIRED!' : `Moves: ${moves} · Tap two tiles to swap!`}
          </p>
          <p className="text-sky-100/90 text-sm">
            {hasWon
              ? 'Our starry night memory is complete!'
              : 'Arrange the tiles so the memory matches our cozy picnic scene.'}
          </p>
        </div>

        {/* 3x3 Tile Grid or Preview */}
        {showPreview ? (
          <div className="bg-slate-950 p-4 border-4 border-sky-500 mb-4 text-center">
            <p className="font-pixel text-xs text-sky-300 mb-2">TARGET MEMORY PREVIEW</p>
            <div className="grid grid-cols-3 gap-2">
              {TARGET_STATE.map(id => (
                <div
                  key={id}
                  className={`p-3 border-2 ${TILE_PIECES[id].color} flex flex-col items-center justify-center`}
                >
                  <span className="text-xl">{TILE_PIECES[id].label.split(' ')[0]}</span>
                  <span className="text-[11px] font-pixel text-white mt-1">
                    {TILE_PIECES[id].label.split(' ')[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-950 p-3 border-2 border-slate-800">
            {tiles.map((tileId, idx) => {
              const piece = TILE_PIECES[tileId];
              const isSelected = selectedIdx === idx;
              const isCorrect = tileId === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  disabled={hasWon}
                  className={`h-24 p-2 flex flex-col items-center justify-center border-4 font-pixel transition-all select-none ${
                    piece.color
                  } ${
                    isSelected
                      ? 'border-yellow-400 scale-95 shadow-[0_0_15px_#facc15]'
                      : isCorrect
                      ? 'border-emerald-500/80'
                      : 'hover:brightness-110'
                  } ${hasWon ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="text-2xl mb-1">{piece.label.split(' ')[0]}</span>
                  <span className="text-[10px] text-white tracking-tighter">
                    {piece.label.split(' ')[1]}
                  </span>
                  <span className="text-[9px] text-slate-300 mt-0.5">
                    {isCorrect ? '✓' : idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-slate-800">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-xs font-pixel"
          >
            <Eye className="w-3.5 h-3.5" />
            {showPreview ? 'Back to Tiles' : 'Preview'}
          </button>

          {!hasWon && (
            <button
              onClick={handleAutoSolve}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-900/60 hover:bg-sky-800 border-2 border-sky-600 text-sky-200 text-xs font-pixel"
              title="A sweet shortcut if you want to focus on the story!"
            >
              <Wand2 className="w-3.5 h-3.5 text-sky-400" />
              Easy Solve
            </button>
          )}

          {hasWon && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 border-2 border-sky-300 font-pixel text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Collect Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
