import React, { useState, useEffect } from 'react';
import { LoveStoryConfig } from '../types/game';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { Flame, ShieldAlert, Heart, Swords, Sparkles, Printer } from 'lucide-react';

interface HellLetterModalProps {
  config: LoveStoryConfig;
  onClose: () => void;
}

export const HellLetterModal: React.FC<HellLetterModalProps> = ({ config, onClose }) => {
  const [hasVowed, setHasVowed] = useState(false);
  const [vowText, setVowText] = useState('');

  useEffect(() => {
    sound.playHellChestUnlock();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f97316', '#fbbf24', '#f43f5e']
    });
  }, []);

  const handleVow = (text: string) => {
    sound.playHeartSound();
    setVowText(text);
    setHasVowed(true);
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ef4444', '#fbbf24']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      {/* Volcanic Embers in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-[15%] text-3xl animate-bounce">🔥</div>
        <div className="absolute top-32 right-[20%] text-2xl animate-pulse">⚔️</div>
        <div className="absolute bottom-16 left-[25%] text-4xl animate-bounce delay-150">💖</div>
        <div className="absolute bottom-12 right-[15%] text-3xl animate-pulse delay-300">🗡️</div>
      </div>

      <div className="relative w-full max-w-2xl bg-stone-900 text-stone-100 border-8 border-rose-600 rounded-none p-5 sm:p-8 shadow-[12px_12px_0_0_#450a0a] my-auto font-vt">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-2.5 py-1 bg-stone-800 hover:bg-rose-900 text-white font-pixel text-xs border-2 border-stone-600"
        >
          ✕ CLOSE
        </button>

        {/* Hell Crest Header */}
        <div className="text-center border-b-2 border-rose-900/80 pb-4 mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-900/60 rounded-full border-4 border-rose-500 mb-2 shadow-[0_0_20px_#f43f5e] animate-pulse">
            <Swords className="w-8 h-8 text-amber-300" />
          </div>
          <div className="inline-block bg-rose-950 px-3 py-0.5 border border-rose-500 text-amber-300 font-pixel text-[10px] mb-2">
            🏆 DEMON SLAYER OF LOVE · BADGE ACQUIRED
          </div>
          <h2 className="font-pixel text-sm sm:text-base text-rose-400 tracking-wider">
            {config.hellLetterTitle || 'SURAT DARI LEMBAH API'}
          </h2>
          <p className="font-pixel text-[11px] text-stone-400 mt-1">
            SEMUA 4 IBLIS TELAH DIKALAHKAN OLEH: {config.boyfriendName.toUpperCase()}
          </p>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-stone-200 leading-relaxed font-handwriting text-2xl sm:text-3xl max-h-[50vh] overflow-y-auto pr-2">
          <h3 className="font-handwriting text-3xl sm:text-4xl text-rose-400 font-bold">
            Dearest {config.boyfriendName},
          </h3>

          {(config.hellLetterBody || [
            'Kamu telah bertarung menembus lahar dan kegelapan, mengalahkan iblis keraguan, jarak, dan rasa takut, lalu membuka peti obsidian terkutuk ini di dasar terdalam.',
            'Aku menyembunyikan surat rahasia ini di sini karena cinta kita bukan hanya tentang hari-hari cerah dan manis di Kota Lama. Cinta kita teruji kuat karena kita selalu saling memilih bahkan saat menghadapi badai, hari-hari yang melelahkan, dan kegelapan hidup.',
            'Setiap kali kamu merasa lelah, tertekan dengan pekerjaan, atau menghadapi masa-masa sulit, ingatlah bahwa kamu tidak pernah bertarung sendirian. Aku akan selalu berdiri di sampingmu, menggenggam pedang cinta bersamamu, mengusir semua iblis kegelapan yang menghalangi jalan kita.',
            'Kamu adalah pahlawanku, kesatria terkuatku, dan tempat ternyamanku pulang. Terima kasih telah membuktikan bahwa cinta kita mampu menaklukkan apapun di dunia ini dan selamanya!'
          ]).map((paragraph, idx) => (
            <p key={idx} className="leading-snug">
              {paragraph}
            </p>
          ))}

          <div className="pt-4 border-t border-rose-900/60 font-handwriting text-rose-300">
            <p className="italic">Selamanya bersama dalam setiap pertempuran hidup,</p>
            <p className="font-bold text-3xl sm:text-4xl text-rose-400 mt-1">
              {config.girlfriendName} ❤️🗡️
            </p>
          </div>
        </div>

        {/* Boyfriend Heroic Vow */}
        <div className="mt-6 pt-4 border-t-2 border-stone-800">
          {!hasVowed ? (
            <div className="space-y-3 text-center">
              <p className="font-pixel text-xs text-amber-300">
                ⚔️ UCAPKAN SUMPAH KESATRIA CINTA KEPADA {config.girlfriendName.toUpperCase()} ⚔️
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() =>
                    handleVow('Aku akan selalu melindungimu dan bertarung bersamamu selamanya! 🗡️❤️')
                  }
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-pixel text-xs border-2 border-rose-400 shadow-md cursor-pointer active:scale-95 transition-transform"
                >
                  ⚔️ AKU SELALU MELINDUNGIMU!
                </button>
                <button
                  onClick={() =>
                    handleVow('Tidak ada iblis atau jarak yang bisa memisahkan kita! 💖🔥')
                  }
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-pixel text-xs border-2 border-amber-300 shadow-md cursor-pointer active:scale-95 transition-transform"
                >
                  🔥 CINTA KITA TAK TERKALAHKAN!
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-stone-950 border-2 border-rose-500 text-center space-y-2 animate-fadeIn">
              <Sparkles className="w-6 h-6 text-amber-400 mx-auto animate-spin" />
              <p className="font-pixel text-xs text-rose-400">
                SUMPAH KESATRIA TERCATAT ABADI DI LEMBAH API:
              </p>
              <p className="font-handwriting text-3xl text-amber-200 font-bold">
                "{vowText}"
              </p>
              <p className="font-pixel text-[10px] text-stone-400">
                Lembah Api Kini Dipenuhi Bunga Kasih Abadi ❤️
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-3 border-t border-stone-800 text-xs">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 font-pixel text-[11px]"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Surat Lembah Api
            </button>
            <span className="font-pixel text-[10px] text-rose-400">
              Lembah Gelap Telah Diterangi Cinta Kita
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
