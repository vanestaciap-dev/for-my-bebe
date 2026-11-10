import React, { useState, useEffect } from 'react';
import { LoveStoryConfig } from '../types/game';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { Heart, Sparkles, Send, Download, Printer, Image as ImageIcon } from 'lucide-react';

interface LoveLetterModalProps {
  config: LoveStoryConfig;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ config, onClose }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    // Opening fanfare
    sound.playUnlockGate();
    const timer = setTimeout(() => {
      setIsOpened(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a']
      });
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleSendReply = (answer: string) => {
    sound.playHeartSound();
    setReplyMessage(answer);
    setHasReplied(true);
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      {/* Floating Pixel Hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-[10%] text-3xl animate-bounce">💖</div>
        <div className="absolute top-40 right-[15%] text-2xl animate-pulse">✨</div>
        <div className="absolute bottom-20 left-[20%] text-4xl animate-bounce delay-150">💕</div>
        <div className="absolute bottom-10 right-[25%] text-3xl animate-pulse delay-300">🌸</div>
      </div>

      <div className="relative w-full max-w-2xl bg-amber-50 text-slate-900 border-8 border-rose-600 rounded-none p-5 sm:p-8 shadow-[12px_12px_0_0_#4c0519] my-auto">
        {/* Top close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-pixel text-xs border-2 border-rose-800"
        >
          ✕ CLOSE
        </button>

        {/* Envelope Header */}
        <div className="text-center border-b-2 border-rose-300 pb-4 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-500 rounded-full border-4 border-rose-700 mb-2 shadow-sm animate-pulse">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="font-pixel text-sm sm:text-base text-rose-700 tracking-wider">
            THE HIDDEN LOVE LETTER
          </h2>
          <p className="font-pixel text-[11px] text-rose-900/70 mt-1">
            FOR: {config.boyfriendName.toUpperCase()} · FROM: {config.girlfriendName.toUpperCase()}
          </p>
          <p className="text-xs text-rose-600/80 font-pixel mt-0.5">
            DATE: {config.anniversaryDate}
          </p>
        </div>

        {/* Letter Parchment Content */}
        <div className="space-y-4 text-slate-800 leading-relaxed font-handwriting text-2xl sm:text-3xl max-h-[55vh] overflow-y-auto pr-2">
          <h3 className="font-handwriting text-3xl sm:text-4xl text-rose-800 font-bold">
            Dearest {config.boyfriendName},
          </h3>

          {config.loveLetterBody.map((paragraph, idx) => (
            <p key={idx} className="leading-snug">
              {paragraph}
            </p>
          ))}

          <div className="pt-4 border-t border-rose-200">
            <p className="italic text-rose-700">{config.loveLetterSignoff}</p>
            <p className="font-bold text-3xl sm:text-4xl text-rose-900 font-handwriting mt-1">
              {config.girlfriendName} ❤️
            </p>
          </div>

          {/* Polaroid Memory Carousel / Gallery */}
          {config.photos && config.photos.length > 0 && (
            <div className="pt-6 border-t-2 border-dashed border-rose-200 font-vt">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-rose-500" />
                <span className="font-pixel text-xs text-rose-700">
                  OUR POLAROID VAULT ({activePhotoIdx + 1}/{config.photos.length})
                </span>
              </div>

              {/* Active Polaroid Card */}
              <div className="bg-white p-3 border-4 border-slate-200 shadow-md max-w-sm mx-auto transform rotate-1 hover:rotate-0 transition-transform">
                <div className="h-52 bg-slate-100 overflow-hidden border border-slate-300">
                  <img
                    src={config.photos[activePhotoIdx].url}
                    alt={config.photos[activePhotoIdx].caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pt-2 text-center">
                  <p className="font-handwriting text-2xl text-slate-800 leading-tight">
                    "{config.photos[activePhotoIdx].caption}"
                  </p>
                  <p className="font-pixel text-[10px] text-slate-400 mt-1">
                    {config.photos[activePhotoIdx].date}
                  </p>
                </div>
              </div>

              {/* Photo Selector Thumbnails */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {config.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActivePhotoIdx(i);
                      sound.playFootstep();
                    }}
                    className={`w-10 h-10 border-2 overflow-hidden ${
                      i === activePhotoIdx ? 'border-rose-600 scale-105' : 'border-slate-300 opacity-60'
                    }`}
                  >
                    <img src={photo.url} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Boyfriend Response Section */}
        <div className="mt-6 pt-4 border-t-2 border-rose-300 font-vt">
          {!hasReplied ? (
            <div className="space-y-3 text-center">
              <p className="font-pixel text-xs text-rose-700">
                ❤️ WILL YOU BE MY PLAYER TWO FOREVER? ❤️
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleSendReply('YES, forever and always! 💖💍')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-pixel text-xs border-2 border-rose-800 shadow-sm cursor-pointer active:scale-95 transition-transform"
                >
                  💍 YES, FOREVER & ALWAYS!
                </button>
                <button
                  onClick={() => handleSendReply('I love you to the moon, back, and beyond! 🚀❤️')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs border-2 border-amber-700 shadow-sm cursor-pointer active:scale-95 transition-transform"
                >
                  🌟 I LOVE YOU TO THE MOON!
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-100 border-2 border-rose-400 text-center space-y-2 animate-fadeIn">
              <Sparkles className="w-6 h-6 text-rose-600 mx-auto animate-spin" />
              <p className="font-pixel text-xs text-rose-800">
                RESPONSE RECORDED IN THE STARS:
              </p>
              <p className="font-handwriting text-3xl text-rose-900 font-bold">
                "{replyMessage}"
              </p>
              <p className="font-pixel text-[10px] text-rose-600">
                Quest Completed with 100% Love & Sweet Memories!
              </p>
            </div>
          )}

          {/* Action links */}
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-rose-200 text-xs">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 font-pixel text-[11px]"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save Letter
            </button>
            <span className="font-pixel text-[10px] text-rose-400">
              Made with love just for you
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
