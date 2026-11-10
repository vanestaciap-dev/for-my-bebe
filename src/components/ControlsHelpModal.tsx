import React from 'react';
import { Gamepad2, Smartphone, Keyboard, Sparkles } from 'lucide-react';

interface ControlsHelpModalProps {
  onClose: () => void;
}

export const ControlsHelpModal: React.FC<ControlsHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-vt text-lg">
      <div className="relative w-full max-w-lg bg-slate-900 border-4 border-slate-700 p-5 text-slate-100 shadow-[8px_8px_0_0_#0f172a]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-rose-400" />
            <h3 className="font-pixel text-xs text-rose-300 tracking-wider">
              HOW TO PLAY & EXPLORE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-slate-800 hover:bg-rose-900 border-2 border-slate-600 hover:border-rose-500 text-xs font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Desktop Controls */}
          <div className="p-3 bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-pixel text-xs mb-2">
              <Keyboard className="w-4 h-4" />
              DESKTOP CONTROLS:
            </div>
            <ul className="space-y-1 text-slate-300 text-base">
              <li>
                <span className="text-amber-300 font-pixel text-[10px]">W A S D</span> or <span className="text-amber-300 font-pixel text-[10px]">Arrow Keys</span>: Walk around
              </li>
              <li>
                <span className="text-amber-300 font-pixel text-[10px]">Space / Enter / E</span>: Examine & Talk when near objects
              </li>
              <li>
                <span className="text-amber-300 font-pixel text-[10px]">Mouse Click</span>: Tap any tile to walk directly to it
              </li>
            </ul>
          </div>

          {/* Mobile Controls */}
          <div className="p-3 bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 font-pixel text-xs mb-2">
              <Smartphone className="w-4 h-4" />
              TOUCH & MOBILE CONTROLS:
            </div>
            <ul className="space-y-1 text-slate-300 text-base">
              <li>
                <span className="text-sky-300 font-pixel text-[10px]">Virtual D-Pad</span>: Touch and hold any arrow to walk
              </li>
              <li>
                <span className="text-rose-400 font-pixel text-[10px]">[A] Button</span>: Talk to characters or pick up collectibles
              </li>
              <li>
                <span className="text-amber-400 font-pixel text-[10px]">[B] Button</span>: Toggle Run/Sprint speed
              </li>
              <li>
                <span className="text-emerald-400 font-pixel text-[10px]">Direct Tap</span>: Tap any spot on the map to walk there!
              </li>
            </ul>
          </div>

          {/* Quest Mission */}
          <div className="p-3 bg-rose-950/40 border border-rose-800/80 text-rose-200">
            <div className="flex items-center gap-1.5 font-pixel text-xs text-rose-300 mb-1">
              <Sparkles className="w-4 h-4 text-rose-400" />
              KOTA LAMA LOVE LETTER QUEST:
            </div>
            <p className="text-base leading-snug">
              1. Jelajahi Kota Lama, Semarang untuk temukan 3 camilan kenangan: Toko Oen Ice Cream 🍨 (NW), Gedung Marba Cheesecake 🍰 (NE), dan Kaset Pita Bioskop Marabunta 📼 (SW).<br/>
              2. Selesaikan 3 teka-teki memori untuk dapatkan 3 Kunci: Lonceng Blenduk 🎵, Mosaik 16-bit 🧩, dan Trivia Cinta 💖.<br/>
              3. Buka Gerbang Kasih di Gereja Blenduk untuk naik ke balkon dan baca Surat Cinta Rahasia!
            </p>
          </div>

          {/* Nether Realm Demon Battle & Health Guide */}
          <div className="p-3 bg-stone-950 border border-red-900/80 text-red-200">
            <div className="flex items-center gap-1.5 font-pixel text-xs text-amber-400 mb-1">
              ⚔️ PERTARUNGAN LEMBAH API NERAKA & NYAWA:
            </div>
            <p className="text-base leading-snug text-stone-300">
              • Di balik Bioskop Marabunta (SW, pojok kiri bawah) terdapat lorong rahasia menuju Lembah Neraka.<br/>
              • <strong className="text-amber-300 font-pixel text-[10px]">[F] / [SLASH]</strong>: Tebas 4 iblis penjaga peti.<br/>
              • <strong className="text-rose-400 font-pixel text-[10px]">Nyawa (HP) ❤️❤️❤️❤️❤️</strong>: Iblis akan menyerang balik dengan cakaran dan bola api! Hindari serangan mereka.<br/>
              • Mengalahkan iblis akan menjatuhkan Kristal Cinta 💖 untuk memulihkan 2 nyawa. Jika kalah, kekuatan cinta akan membangkitkanmu kembali di portal!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 font-pixel text-xs"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
