import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { TriviaQuestion } from '../../types/game';

interface TriviaPuzzleProps {
  questions: TriviaQuestion[];
  onSuccess: () => void;
  onClose: () => void;
  isAlreadySolved: boolean;
}

export const TriviaPuzzle: React.FC<TriviaPuzzleProps> = ({
  questions,
  onSuccess,
  onClose,
  isAlreadySolved
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [hasWon, setHasWon] = useState(isAlreadySolved);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (feedback?.isCorrect || hasWon) return;

    setSelectedOption(idx);
    sound.playDialogueBeep(520);

    if (idx === currentQ.correctIndex) {
      sound.playPuzzleSuccess();
      setFeedback({
        text: currentQ.sweetNote,
        isCorrect: true
      });

      setTimeout(() => {
        if (currentIdx + 1 < questions.length) {
          setCurrentIdx(i => i + 1);
          setSelectedOption(null);
          setFeedback(null);
        } else {
          // All done!
          setHasWon(true);
          confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      }, 1600);
    } else {
      sound.playFootstep();
      setFeedback({
        text: 'Aww, nice try! Think back to our funniest dates... try again!',
        isCorrect: false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border-4 border-rose-600 rounded-none p-5 text-slate-100 shadow-[8px_8px_0_0_#0f172a] font-vt text-lg">
        {/* Retro Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
            <h3 className="font-pixel text-xs text-rose-300 tracking-wider">
              PUZZLE 3: MEMORY TRIVIA
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-slate-800 hover:bg-rose-900 border-2 border-slate-600 hover:border-rose-500 text-xs font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="bg-slate-950 p-3 border-2 border-slate-800 mb-4 text-center">
          <p className="text-sm font-pixel text-rose-300 mb-1">
            {hasWon
              ? '💖 TRIVIA KEY ACQUIRED!'
              : `Question ${currentIdx + 1} of ${questions.length}`}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 border border-slate-700 ${
                  i < currentIdx || hasWon
                    ? 'bg-rose-500'
                    : i === currentIdx
                    ? 'bg-rose-400 animate-pulse'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Content */}
        {!hasWon ? (
          <div>
            <div className="p-3 bg-slate-800/80 border-2 border-slate-700 mb-4">
              <p className="text-xl text-rose-100 leading-snug">
                "{currentQ.question}"
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = feedback?.isCorrect && idx === currentQ.correctIndex;
                const isWrong = isSelected && feedback && !feedback.isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={feedback?.isCorrect}
                    className={`w-full p-3 text-left border-2 font-vt text-lg transition-all flex items-start gap-3 select-none ${
                      isCorrect
                        ? 'bg-emerald-900/90 border-emerald-400 text-white'
                        : isWrong
                        ? 'bg-rose-950 border-rose-500 text-rose-200'
                        : isSelected
                        ? 'bg-slate-700 border-rose-400'
                        : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="font-pixel text-xs text-rose-400 mt-1">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1 leading-tight">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback message */}
            {feedback && (
              <div
                className={`p-2.5 border-2 text-center text-base mb-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-600 text-rose-200'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-950 border-2 border-rose-500/60 p-4 mb-4">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto mb-2 animate-bounce" />
            <h4 className="font-pixel text-sm text-rose-300 mb-2">
              YOU KNOW MY HEART INSIDE OUT!
            </h4>
            <p className="text-slate-300 text-lg">
              Every memory question answered with pure love. The Trivia Key is now yours!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t-2 border-slate-800">
          {hasWon ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-500 hover:bg-rose-400 text-white border-2 border-rose-300 font-pixel text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Collect Key
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-pixel">
              Choose the memory that fits us best ❤️
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
