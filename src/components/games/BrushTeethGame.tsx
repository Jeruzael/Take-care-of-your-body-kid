import React, { useState } from 'react';
import {
  BrushTeethState,
  createInitialBrushTeethState,
  tapBrushTeeth,
  REQUIRED_TEETH_BRUSH_TAPS,
} from '../../game/routineState';
import { SunnyCharacter } from '../SunnyCharacter';
import { sound } from '../../utils/soundEffects';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface BrushTeethGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const BrushTeethGame: React.FC<BrushTeethGameProps> = ({
  onComplete,
  onExit,
}) => {
  const [state, setState] = useState<BrushTeethState>(createInitialBrushTeethState());
  const [isBrushingAnim, setIsBrushingAnim] = useState(false);

  const handleBrush = () => {
    if (state.isDone) return;

    sound.playSparkle();
    setIsBrushingAnim(true);

    const nextState = tapBrushTeeth(state);
    setState(nextState);

    setTimeout(() => {
      setIsBrushingAnim(false);
      if (nextState.isDone) {
        sound.playSuccess();
        onComplete();
      }
    }, 350);
  };

  const handleRestart = () => {
    sound.playPop();
    setState(createInitialBrushTeethState());
    setIsBrushingAnim(false);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-4 select-none">
      {/* Short Positive Instructional Guide */}
      <div className="w-full text-center py-2">
        {!state.isDone ? (
          <div className="inline-block px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-emerald-900">
              🪥 Tap to brush teeth! ({state.brushCount}/{REQUIRED_TEETH_BRUSH_TAPS})
            </p>
          </div>
        ) : (
          <div className="inline-block px-5 py-2.5 bg-emerald-100 border border-emerald-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-lg font-extrabold text-emerald-900 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              Sparkly clean teeth!
            </p>
          </div>
        )}
      </div>

      {/* Main Interactive Teeth & Brush Area */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
        {/* Sunny Character with Teeth Focus */}
        <div className="relative cursor-pointer" onClick={handleBrush}>
          <SunnyCharacter
            mood={state.isDone ? 'teeth_clean' : 'teeth_dirty'}
            size={220}
            sparkle={state.isDone}
          />

          {/* Interactive Tap Hint on Teeth Area */}
          {!state.isDone && (
            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-28 h-16 rounded-full border-2 border-dashed border-emerald-400 bg-emerald-50/40 flex items-center justify-center animate-pulse">
              <span className="text-[10px] font-black text-emerald-800 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
                TAP HERE!
              </span>
            </div>
          )}
        </div>

        {/* Big Interactive Toothbrush */}
        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={handleBrush}
            disabled={state.isDone}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-3xl font-extrabold text-base transition-all cursor-pointer shadow-md min-h-[64px] min-w-[200px] justify-center ${
              !state.isDone
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-emerald-400/40 ring-4 ring-emerald-200 active:scale-95'
                : 'bg-emerald-100 text-emerald-700 opacity-80 cursor-default'
            } ${isBrushingAnim ? '-translate-y-2 rotate-6' : ''}`}
            aria-label="Tap toothbrush to brush teeth"
          >
            {/* Toothbrush SVG graphic */}
            <svg viewBox="0 0 80 30" className="w-12 h-6" fill="none">
              {/* Handle */}
              <rect x="0" y="10" width="55" height="10" rx="5" fill="#FFFFFF" />
              <rect x="15" y="12" width="20" height="6" rx="3" fill="#34D399" />
              {/* Head & Bristles */}
              <rect x="52" y="8" width="26" height="14" rx="4" fill="#FFFFFF" />
              <rect x="55" y="2" width="20" height="8" rx="2" fill="#38BDF8" />
              {/* Bristle slits */}
              <line x1="59" y1="2" x2="59" y2="8" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="65" y1="2" x2="65" y2="8" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="71" y1="2" x2="71" y2="8" stroke="#FFFFFF" strokeWidth="1" />
            </svg>
            <span>{state.isDone ? 'Clean & Shiny!' : 'Brush Teeth!'}</span>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mt-3" aria-label={`Progress: ${state.brushCount} of 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i <= state.brushCount
                  ? 'bg-emerald-400 scale-110 shadow-xs'
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
            aria-label="Restart brushing activity"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
};
