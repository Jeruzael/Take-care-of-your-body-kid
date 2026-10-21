import React, { useState } from 'react';
import {
  BathState,
  createInitialBathState,
  stepBath,
  REQUIRED_BATH_BUBBLE_TAPS,
} from '../../game/routineState';
import { SunnyCharacter } from '../SunnyCharacter';
import { sound } from '../../utils/soundEffects';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface TakeBathGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const TakeBathGame: React.FC<TakeBathGameProps> = ({
  onComplete,
  onExit,
}) => {
  const [state, setState] = useState<BathState>(createInitialBathState());
  const [isRinsing, setIsRinsing] = useState(false);

  const handleSpongeTap = () => {
    if (state.stage !== 'sponge') return;
    sound.playPop();
    setState((prev) => stepBath(prev, 'tap_sponge'));
  };

  const handleBubbleTap = () => {
    if (state.stage !== 'bubbles') return;
    sound.playPop();
    const nextState = stepBath(state, 'tap_bubbles');
    setState(nextState);
    if (nextState.stage === 'rinse') {
      sound.playSuccess();
    }
  };

  const handleRinseTap = () => {
    if (state.stage !== 'rinse') return;
    sound.playWater();
    setIsRinsing(true);
    setTimeout(() => {
      sound.playSuccess();
      setState((prev) => stepBath(prev, 'tap_rinse'));
      setIsRinsing(false);
      onComplete();
    }, 900);
  };

  const handleRestart = () => {
    sound.playPop();
    setState(createInitialBathState());
    setIsRinsing(false);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-4 select-none">
      {/* Short Positive Instructional Guide */}
      <div className="w-full text-center py-2">
        {state.stage === 'sponge' && (
          <div className="inline-block px-4 py-2 bg-indigo-100 border border-indigo-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-indigo-900">
              🧽 Tap the bath sponge!
            </p>
          </div>
        )}
        {state.stage === 'bubbles' && (
          <div className="inline-block px-4 py-2 bg-purple-100 border border-purple-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-purple-900">
              🫧 Tap Sunny to wash with bubbles! ({state.bubbleTaps}/{REQUIRED_BATH_BUBBLE_TAPS})
            </p>
          </div>
        )}
        {state.stage === 'rinse' && (
          <div className="inline-block px-4 py-2 bg-sky-100 border border-sky-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-sky-900">
              🚿 Tap the shower to rinse away soap!
            </p>
          </div>
        )}
        {state.stage === 'done' && (
          <div className="inline-block px-5 py-2.5 bg-emerald-100 border border-emerald-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-lg font-extrabold text-emerald-900 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              All clean!
            </p>
          </div>
        )}
      </div>

      {/* Main Bathtub Scene */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
        {/* Sunny in the Bathtub */}
        <div
          className={`relative z-10 transition-transform ${
            state.stage === 'bubbles' ? 'cursor-pointer active:scale-95' : ''
          }`}
          onClick={handleBubbleTap}
          aria-label="Sunny in bathtub"
        >
          <SunnyCharacter
            mood={state.stage === 'done' ? 'bathing_clean' : 'bathing'}
            size={210}
            sparkle={state.stage === 'done'}
          />

          {/* Dynamic Bubble Foam on Sunny */}
          {(state.stage === 'bubbles' || state.stage === 'rinse') && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 pointer-events-none">
              <div className="relative w-full h-full animate-float-bubble">
                {state.bubbleTaps >= 1 && (
                  <span className="absolute top-8 left-6 text-2xl">🫧</span>
                )}
                {state.bubbleTaps >= 2 && (
                  <span className="absolute top-6 right-6 text-3xl">🫧</span>
                )}
                {state.bubbleTaps >= 3 && (
                  <span className="absolute bottom-6 left-12 text-2xl">🫧</span>
                )}
                {state.bubbleTaps >= 4 && (
                  <span className="absolute bottom-4 right-10 text-3xl">🫧</span>
                )}
              </div>
            </div>
          )}

          {/* Tap Prompt over Sunny during bubble stage */}
          {state.stage === 'bubbles' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-white/90 rounded-full border border-purple-300 shadow-md animate-pulse">
              <span className="text-xs font-black text-purple-800">TAP SUNNY!</span>
            </div>
          )}
        </div>

        {/* Bathtub SVG Vessel */}
        <div className="w-72 sm:w-80 -mt-16 z-20 pointer-events-none">
          <svg viewBox="0 0 300 120" className="w-full h-auto drop-shadow-md" fill="none">
            {/* Tub Water Surface */}
            <ellipse cx="150" cy="35" rx="130" ry="22" fill="#BAE6FD" />
            <ellipse cx="150" cy="33" rx="120" ry="18" fill="#E0F2FE" />
            {/* Floating toy duck */}
            <g transform="translate(60, 16) scale(0.9)">
              <ellipse cx="15" cy="15" rx="12" ry="8" fill="#FBBF24" />
              <circle cx="21" cy="9" r="6" fill="#FBBF24" />
              <ellipse cx="27" cy="10" rx="3" ry="1.5" fill="#F97316" />
              <circle cx="23" cy="8" r="1" fill="#1E293B" />
            </g>
            {/* Tub Outer Shell */}
            <path
              d="M15 35 C15 35, 30 110, 150 110 C270 110, 285 35, 285 35 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="4"
            />
            {/* Tub Rim Highlight */}
            <ellipse cx="150" cy="35" rx="136" ry="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
            {/* Tub Feet */}
            <rect x="55" y="105" width="16" height="10" rx="4" fill="#94A3B8" />
            <rect x="230" y="105" width="16" height="10" rx="4" fill="#94A3B8" />
          </svg>
        </div>

        {/* Interactive Side Tools: Sponge & Shower */}
        <div className="w-full flex items-center justify-between px-4 mt-2 z-30">
          {/* Sponge Button */}
          <button
            onClick={handleSpongeTap}
            disabled={state.stage !== 'sponge'}
            className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              state.stage === 'sponge'
                ? 'bg-amber-100 border-4 border-amber-400 shadow-lg ring-4 ring-amber-200 active:scale-95 scale-105'
                : 'bg-amber-50/60 border border-amber-200 opacity-60'
            }`}
            aria-label="Tap bath sponge"
          >
            <span className="text-3xl">🧽</span>
            <span className="text-[10px] font-extrabold text-amber-900 mt-0.5">
              {state.stage === 'sponge' ? 'TAP ME!' : 'Sponge'}
            </span>
          </button>

          {/* Water Shower Rinse Button */}
          <button
            onClick={handleRinseTap}
            disabled={state.stage !== 'rinse'}
            className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              state.stage === 'rinse'
                ? 'bg-sky-400 text-white border-4 border-sky-300 shadow-lg shadow-sky-400/40 ring-4 ring-sky-200 active:scale-95 scale-105'
                : 'bg-sky-50 border border-sky-200 text-sky-800 opacity-60'
            }`}
            aria-label="Rinse with shower water"
          >
            <span className="text-3xl">🚿</span>
            <span className="text-[10px] font-extrabold mt-0.5">
              {state.stage === 'rinse' ? 'RINSE!' : 'Shower'}
            </span>
          </button>
        </div>

        {/* Water shower spray overlay during rinse */}
        {(isRinsing || state.stage === 'done') && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center animate-pulse">
            <span className="text-4xl text-sky-400">💧 💧 💧</span>
          </div>
        )}
      </div>

      {/* Action / Completion Controls */}
      <div className="w-full flex items-center justify-center gap-3 pt-2">
        {state.stage === 'done' ? (
          <button
            onClick={() => {
              sound.playSuccess();
              onExit();
            }}
            className="flex-1 max-w-xs py-3.5 px-6 rounded-3xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer min-h-[56px] transition-transform"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Yay, Done!</span>
            <span className="text-xl">⭐</span>
          </button>
        ) : (
          <button
            onClick={handleRestart}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
            aria-label="Restart bath activity"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
};
