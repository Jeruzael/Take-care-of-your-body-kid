import React, { useState } from 'react';
import {
  CombHairState,
  createInitialCombHairState,
  tapCombHair,
  REQUIRED_COMB_TAPS,
} from '../../game/routineState';
import { SunnyCharacter } from '../SunnyCharacter';
import { sound } from '../../utils/soundEffects';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface CombHairGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const CombHairGame: React.FC<CombHairGameProps> = ({
  onComplete,
  onExit,
}) => {
  const [state, setState] = useState<CombHairState>(createInitialCombHairState());
  const [isCombingAnim, setIsCombingAnim] = useState(false);

  const handleComb = () => {
    if (state.isDone) return;

    sound.playSwoosh();
    setIsCombingAnim(true);

    const nextState = tapCombHair(state);
    setState(nextState);

    setTimeout(() => {
      setIsCombingAnim(false);
      if (nextState.isDone) {
        sound.playSuccess();
        onComplete();
      }
    }, 350);
  };

  const handleRestart = () => {
    sound.playPop();
    setState(createInitialCombHairState());
    setIsCombingAnim(false);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-4 select-none">
      {/* Short Positive Instructional Guide */}
      <div className="w-full text-center py-2">
        {!state.isDone ? (
          <div className="inline-block px-4 py-2 bg-rose-100 border border-rose-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-rose-900">
              🪮 Tap to comb Sunny&apos;s hair! ({state.combCount}/{REQUIRED_COMB_TAPS})
            </p>
          </div>
        ) : (
          <div className="inline-block px-5 py-2.5 bg-emerald-100 border border-emerald-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-lg font-extrabold text-emerald-900 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              Looking neat!
            </p>
          </div>
        )}
      </div>

      {/* Main Interactive Hair & Comb Area */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
        {/* Sunny Character with Messy -> Combed Hair */}
        <div className="relative cursor-pointer" onClick={handleComb}>
          <SunnyCharacter
            mood={state.isDone ? 'hair_combed' : 'hair_messy'}
            size={220}
            sparkle={state.isDone}
          />

          {/* Interactive Tap Hint on Hair */}
          {!state.isDone && (
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-32 h-16 rounded-full border-2 border-dashed border-rose-400 bg-rose-50/40 flex items-center justify-center animate-pulse">
              <span className="text-[10px] font-black text-rose-800 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
                TAP HAIR!
              </span>
            </div>
          )}
        </div>

        {/* Big Interactive Comb */}
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={handleComb}
            disabled={state.isDone}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-3xl font-extrabold text-base transition-all cursor-pointer shadow-md min-h-[64px] min-w-[200px] justify-center ${
              !state.isDone
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-rose-400/40 ring-4 ring-rose-200 active:scale-95'
                : 'bg-rose-100 text-rose-700 opacity-80 cursor-default'
            } ${isCombingAnim ? '-translate-y-3 -rotate-12' : ''}`}
            aria-label="Tap comb to comb hair"
          >
            {/* Comb SVG graphic */}
            <svg viewBox="0 0 80 32" className="w-12 h-6" fill="none">
              {/* Comb Spine */}
              <rect x="5" y="4" width="70" height="10" rx="4" fill="#FFFFFF" />
              {/* Comb Teeth */}
              {[12, 18, 24, 30, 36, 42, 48, 54, 60, 66].map((x) => (
                <rect key={x} x={x} y="14" width="3.5" height="14" rx="1.5" fill="#FFFFFF" />
              ))}
            </svg>
            <span>{state.isDone ? 'Neat & Shiny!' : 'Comb Hair!'}</span>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mt-3" aria-label={`Progress: ${state.combCount} of 3`}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i <= state.combCount
                  ? 'bg-rose-400 scale-110 shadow-xs'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action / Completion Controls */}
      <div className="w-full flex items-center justify-center gap-3 pt-2">
        {state.isDone ? (
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
            aria-label="Restart comb activity"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
};
