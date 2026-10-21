import React, { useEffect } from 'react';
import { SunnyCharacter } from './SunnyCharacter';
import { sound } from '../utils/soundEffects';
import { RotateCcw, Sparkles } from 'lucide-react';

interface CelebrationScreenProps {
  onPlayAgain: () => void;
  onBackToActivities: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  onPlayAgain,
  onBackToActivities,
}) => {
  useEffect(() => {
    sound.playFanfare();
  }, []);

  // 24 decorative confetti pieces with varied colors and positions
  const confettiColors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

  return (
    <div className="relative flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-6 select-none text-center overflow-hidden">
      {/* Floating Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 24 }).map((_, i) => {
          const leftPercent = (i * 4.2) % 100;
          const delay = (i * 0.15) % 2;
          const duration = 2.5 + ((i * 0.25) % 2);
          const color = confettiColors[i % confettiColors.length];
          const isSquare = i % 2 === 0;

          return (
            <div
              key={i}
              className="absolute top-0 animate-bounce"
              style={{
                left: `${leftPercent}%`,
                width: isSquare ? '10px' : '14px',
                height: isSquare ? '10px' : '6px',
                backgroundColor: color,
                borderRadius: isSquare ? '2px' : '50%',
                animation: `floatBubble ${duration}s ease-in-out infinite alternate`,
                animationDelay: `${delay}s`,
                transform: `rotate(${i * 25}deg)`,
              }}
            />
          );
        })}
      </div>

      {/* Top Stars & Headline */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        {/* Five Golden Stars */}
        <div
          className="flex items-center justify-center gap-2 mb-3"
          aria-label="5 Gold Stars Earned"
        >
          {['⭐', '⭐', '⭐', '⭐', '⭐'].map((star, idx) => (
            <span
              key={idx}
              className="text-3xl sm:text-4xl animate-bounce"
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              {star}
            </span>
          ))}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Routine Champion!</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-sky-900 tracking-tight leading-tight">
          YAY!
        </h1>
        <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
          You took care of Sunny!
        </p>
        <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
          All 5 healthy habits completed today!
        </p>
      </div>

      {/* Sunny Cheering Joyfully */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center">
        <SunnyCharacter mood="cheer" size={230} sparkle={true} />
        <div className="mt-2 bg-white/95 px-5 py-2 rounded-2xl border-2 border-emerald-300 shadow-md animate-gentle-bounce">
          <p className="text-sm font-extrabold text-emerald-800">
            &ldquo;Thank you for being my best friend!&rdquo; ❤️
          </p>
        </div>
      </div>

      {/* Action Buttons: PLAY AGAIN or Back to Activities */}
      <div className="relative z-10 w-full pb-4 flex flex-col items-center gap-3">
        <button
          onClick={() => {
            sound.playPop();
            onPlayAgain();
          }}
          className="w-full max-w-xs py-4 px-8 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 active:scale-95 text-white font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/30 ring-4 ring-amber-200 cursor-pointer min-h-[64px] transition-all"
          aria-label="Play again and reset all activities"
        >
          <RotateCcw className="w-6 h-6" />
          <span>PLAY AGAIN</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            onBackToActivities();
          }}
          className="text-xs font-bold text-sky-700 underline hover:text-sky-900 p-2 cursor-pointer"
        >
          Review Activities
        </button>
      </div>
    </div>
  );
};
