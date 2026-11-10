import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';

interface DialogueBoxProps {
  speakerName: string;
  portrait: string;
  lines: string[];
  onFinish: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speakerName,
  portrait,
  lines,
  onFinish
}) => {
  const [lineIndex, setLineIndex] = useState(0);

  const currentLine = lines[lineIndex] || '';

  useEffect(() => {
    sound.playDialogueBeep(480);
  }, [lineIndex]);

  const handleNext = () => {
    sound.playDialogueBeep(520);
    if (lineIndex + 1 < lines.length) {
      setLineIndex(i => i + 1);
    } else {
      onFinish();
    }
  };

  // Keyboard navigation: Enter or Space advances
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lineIndex, lines]);

  return (
    <div
      onClick={handleNext}
      className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-40 bg-slate-900 border-4 border-rose-600 p-3 sm:p-4 text-slate-100 font-vt shadow-[6px_6px_0_0_#0f172a] cursor-pointer select-none"
    >
      <div className="flex items-start gap-3">
        {/* Portrait */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-950 border-2 border-slate-700 flex items-center justify-center text-3xl shrink-0">
          {portrait}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
            <h4 className="font-pixel text-[11px] sm:text-xs text-rose-400 uppercase tracking-wider">
              {speakerName}
            </h4>
            <span className="font-pixel text-[9px] text-slate-500">
              {lineIndex + 1}/{lines.length}
            </span>
          </div>

          <p className="text-lg sm:text-xl text-slate-100 leading-snug min-h-[2.5rem]">
            {currentLine}
          </p>

          <div className="flex justify-end items-center gap-1.5 pt-1 text-amber-400 font-pixel text-[9px]">
            <span>{lineIndex + 1 === lines.length ? 'FINISH' : 'NEXT'}</span>
            <span className="animate-bounce inline-block">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
};
