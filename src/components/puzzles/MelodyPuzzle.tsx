import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Music, Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface MelodyPuzzleProps {
  onSuccess: () => void;
  onClose: () => void;
  isAlreadySolved: boolean;
}

const BELLS = [
  { id: 0, name: 'Rose Note', freq: 523.25, color: 'bg-rose-500 hover:bg-rose-400 border-rose-700', activeColor: 'bg-rose-300 scale-95 shadow-[0_0_25px_#f43f5e]', label: '🌹 C' },
  { id: 1, name: 'Sky Note', freq: 659.25, color: 'bg-sky-500 hover:bg-sky-400 border-sky-700', activeColor: 'bg-sky-300 scale-95 shadow-[0_0_25px_#38bdf8]', label: '☁️ E' },
  { id: 2, name: 'Honey Note', freq: 783.99, color: 'bg-amber-500 hover:bg-amber-400 border-amber-700', activeColor: 'bg-amber-300 scale-95 shadow-[0_0_25px_#f59e0b]', label: '🍯 G' },
  { id: 3, name: 'Mint Note', freq: 880.00, color: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700', activeColor: 'bg-emerald-300 scale-95 shadow-[0_0_25px_#10b981]', label: '🍃 A' },
];

export const MelodyPuzzle: React.FC<MelodyPuzzleProps> = ({ onSuccess, onClose, isAlreadySolved }) => {
  const [round, setRound] = useState(1);
  const totalRounds = 3;
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeBell, setActiveBell] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('Listen to the melody of our song...');
  const [hasWon, setHasWon] = useState(isAlreadySolved);
  const timerRef = useRef<number[]>([]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      timerRef.current.forEach(id => window.clearTimeout(id));
    };
  }, []);

  // Generate sequence for current round
  const generateRoundSequence = (rnd: number) => {
    // 3 notes for round 1, 4 for round 2, 5 for round 3
    const len = rnd + 2;
    // Nostalgic predictable sweet chords
    const basePatterns = [
      [0, 1, 2],       // C E G
      [0, 2, 3, 1],    // C G A E
      [0, 1, 3, 2, 0], // C E A G C
    ];
    return basePatterns[rnd - 1] || [0, 1, 2];
  };

  const playSequence = (seqToPlay: number[]) => {
    setIsPlayingSeq(true);
    setFeedback('Memorize the chime melody...');
    setUserStep(0);

    timerRef.current.forEach(id => window.clearTimeout(id));
    timerRef.current = [];

    seqToPlay.forEach((bellIdx, i) => {
      const delay = (i + 0.6) * 600;
      const tId = window.setTimeout(() => {
        const bell = BELLS[bellIdx];
        sound.playNote(bell.freq, 0.4);
        setActiveBell(bellIdx);
        const offId = window.setTimeout(() => setActiveBell(null), 350);
        timerRef.current.push(offId);

        if (i === seqToPlay.length - 1) {
          const finishId = window.setTimeout(() => {
            setIsPlayingSeq(false);
            setFeedback('Now it is your turn! Tap the bells in order.');
          }, 450);
          timerRef.current.push(finishId);
        }
      }, delay);
      timerRef.current.push(tId);
    });
  };

  useEffect(() => {
    if (!isAlreadySolved) {
      const initialSeq = generateRoundSequence(1);
      setSequence(initialSeq);
      playSequence(initialSeq);
    }
  }, [isAlreadySolved]);

  const handleBellClick = (idx: number) => {
    if (isPlayingSeq || hasWon) return;

    const bell = BELLS[idx];
    sound.playNote(bell.freq, 0.3);
    setActiveBell(idx);
    setTimeout(() => setActiveBell(null), 200);

    // Check if match
    if (idx === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        // Round won!
        if (round < totalRounds) {
          sound.playPuzzleSuccess();
          setFeedback(`Sweet! Round ${round} complete! Get ready for Round ${round + 1}...`);
          setRound(r => r + 1);
          const nextSeq = generateRoundSequence(round + 1);
          setSequence(nextSeq);
          setTimeout(() => playSequence(nextSeq), 1200);
        } else {
          // All rounds won!
          setHasWon(true);
          sound.playPuzzleSuccess();
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          setFeedback('Perfect harmony! You restored our song!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        setFeedback(`Good note! (${nextStep}/${sequence.length})`);
      }
    } else {
      // Wrong note
      sound.playFootstep();
      setFeedback('Oops, that bell went off-key! Replaying melody...');
      setUserStep(0);
      setTimeout(() => playSequence(sequence), 1000);
    }
  };

  const handleReplay = () => {
    if (!isPlayingSeq && !hasWon) {
      playSequence(sequence);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border-4 border-amber-600 rounded-none p-5 text-slate-100 shadow-[8px_8px_0_0_#0f172a] font-vt text-lg">
        {/* Retro Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-amber-400" />
            <h3 className="font-pixel text-xs text-amber-300 tracking-wider">
              PUZZLE 1: MELODY OF US
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-slate-800 hover:bg-rose-900 border-2 border-slate-600 hover:border-rose-500 text-xs font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Status / Key indicator */}
        <div className="bg-slate-950 p-3 border-2 border-slate-800 mb-4 text-center">
          <p className="text-sm font-pixel text-amber-200 mb-1">
            {hasWon ? '🗝️ HARMONY KEY ACQUIRED!' : `Round ${round} of ${totalRounds}`}
          </p>
          <p className="text-amber-100/90 text-base">{feedback}</p>
        </div>

        {/* 4 Chime Bells */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {BELLS.map(bell => {
            const isActive = activeBell === bell.id;
            return (
              <button
                key={bell.id}
                onClick={() => handleBellClick(bell.id)}
                disabled={isPlayingSeq || hasWon}
                className={`h-24 flex flex-col items-center justify-center border-4 text-white font-pixel text-xs transition-all duration-100 select-none ${
                  isActive ? bell.activeColor : bell.color
                } ${isPlayingSeq ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
              >
                <span className="text-2xl mb-1">{bell.label.split(' ')[0]}</span>
                <span>{bell.name}</span>
                <span className="text-[10px] opacity-75 mt-0.5">{bell.label.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t-2 border-slate-800 text-sm">
          <button
            onClick={handleReplay}
            disabled={isPlayingSeq || hasWon}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-xs font-pixel disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Replay Chime
          </button>

          {hasWon ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 border-2 border-amber-300 font-pixel text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Collect Key
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-pixel">
              {isPlayingSeq ? 'Listening...' : 'Repeat Sequence'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
