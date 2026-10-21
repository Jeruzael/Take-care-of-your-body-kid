import React, { useState } from 'react';
import {
  WashHandsState,
  createInitialWashHandsState,
  stepWashHands,
  REQUIRED_HAND_BUBBLE_TAPS,
} from '../../game/routineState';
import { sound } from '../../utils/soundEffects';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface WashHandsGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const WashHandsGame: React.FC<WashHandsGameProps> = ({
  onComplete,
  onExit,
}) => {
  const [state, setState] = useState<WashHandsState>(createInitialWashHandsState());
  const [isWaterRunning, setIsWaterRunning] = useState(false);

  const handleSoapTap = () => {
    if (state.stage !== 'soap') return;
    sound.playPop();
    setState((prev) => stepWashHands(prev, 'tap_soap'));
  };

  const handleHandsTap = () => {
    if (state.stage !== 'bubbles') return;
    sound.playPop();
    const nextState = stepWashHands(state, 'tap_hands');
    setState(nextState);
    if (nextState.stage === 'rinse') {
      sound.playSuccess();
    }
  };

  const handleWaterTap = () => {
    if (state.stage !== 'rinse') return;
    sound.playWater();
    setIsWaterRunning(true);
    setTimeout(() => {
      sound.playSuccess();
      setState((prev) => stepWashHands(prev, 'tap_water'));
      setIsWaterRunning(false);
      onComplete();
    }, 900);
  };

  const handleRestart = () => {
    sound.playPop();
    setState(createInitialWashHandsState());
    setIsWaterRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-4 select-none">
      {/* Short Positive Instructional Guide */}
      <div className="w-full text-center py-2">
        {state.stage === 'soap' && (
          <div className="inline-block px-4 py-2 bg-sky-100 border border-sky-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-sky-900">
              🧼 Tap the soap to get bubbles!
            </p>
          </div>
        )}
        {state.stage === 'bubbles' && (
          <div className="inline-block px-4 py-2 bg-pink-100 border border-pink-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-pink-900">
              🫧 Tap hands to scrub bubbles! ({state.bubbleTaps}/{REQUIRED_HAND_BUBBLE_TAPS})
            </p>
          </div>
        )}
        {state.stage === 'rinse' && (
          <div className="inline-block px-4 py-2 bg-blue-100 border border-blue-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-blue-900">
              🚰 Tap the water tap to rinse!
            </p>
          </div>
        )}
        {state.stage === 'done' && (
          <div className="inline-block px-5 py-2.5 bg-emerald-100 border border-emerald-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-lg font-extrabold text-emerald-900 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              Clean hands! Good job!
            </p>
          </div>
        )}
      </div>

      {/* Main Interactive Sink & Hands Area */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2 min-h-[300px]">
        {/* Sink Basin SVG Graphic */}
        <div className="relative w-72 h-64 sm:w-80 sm:h-72 flex items-center justify-center">
          <svg
            viewBox="0 0 320 280"
            className="w-full h-full drop-shadow-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sink back wall */}
            <rect x="20" y="20" width="280" height="240" rx="30" fill="#E0F2FE" />
            <rect x="35" y="35" width="250" height="210" rx="24" fill="#F8FAFC" />

            {/* Sink Basin Bowl */}
            <ellipse cx="160" cy="165" rx="100" ry="65" fill="#E2E8F0" />
            <ellipse cx="160" cy="162" rx="94" ry="60" fill="#F1F5F9" />

            {/* Sink Drain */}
            <ellipse cx="160" cy="190" rx="16" ry="8" fill="#94A3B8" />
            <ellipse cx="160" cy="189" rx="12" ry="6" fill="#475569" />

            {/* Water Faucet */}
            <g id="faucet">
              <path
                d="M160 30 L160 70 Q160 85 160 95"
                stroke="#94A3B8"
                strokeWidth="22"
                strokeLinecap="round"
              />
              <path
                d="M160 30 L160 70 Q160 85 160 95"
                stroke="#CBD5E1"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Spout tip */}
              <ellipse cx="160" cy="95" rx="12" ry="5" fill="#64748B" />
            </g>

            {/* Flowing Water animation if rinsing */}
            {(isWaterRunning || state.stage === 'done') && (
              <g id="water-stream" className="animate-pulse">
                <path
                  d="M154 95 Q152 140 156 190 L164 190 Q168 140 166 95 Z"
                  fill="#38BDF8"
                  opacity="0.85"
                />
                <circle cx="152" cy="160" r="3" fill="#BAE6FD" />
                <circle cx="168" cy="170" r="3.5" fill="#BAE6FD" />
                <circle cx="160" cy="180" r="4" fill="#BAE6FD" />
              </g>
            )}

            {/* Interactive Faucet Tap Button indicator */}
            {state.stage === 'rinse' && (
              <circle
                cx="160"
                cy="35"
                r="18"
                fill="#38BDF8"
                className="animate-ping opacity-60"
              />
            )}
          </svg>

          {/* Interactive Tap Faucet Button (Touch target >= 64px) */}
          <button
            onClick={handleWaterTap}
            disabled={state.stage !== 'rinse'}
            className={`absolute top-2 left-1/2 -translate-x-1/2 w-20 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all ${
              state.stage === 'rinse'
                ? 'bg-blue-400 text-white shadow-lg shadow-blue-400/40 ring-4 ring-blue-300 active:scale-95 scale-105'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Turn on water faucet to rinse hands"
          >
            <span className="text-2xl">🚰</span>
            <span className="text-[10px] font-extrabold uppercase">Turn On</span>
          </button>

          {/* Soap Bar & Dish (Top Right of Sink) */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleSoapTap}
              disabled={state.stage !== 'soap'}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                state.stage === 'soap'
                  ? 'bg-gradient-to-tr from-pink-300 to-rose-200 shadow-lg ring-4 ring-pink-400 active:scale-95 scale-105'
                  : 'bg-pink-100 opacity-60'
              }`}
              aria-label="Tap soap to get lather"
            >
              <span className="text-3xl">🧼</span>
              <span className="text-[10px] font-bold text-pink-900 mt-0.5">
                {state.stage === 'soap' ? 'TAP ME!' : 'Soap'}
              </span>
            </button>
          </div>

          {/* Hands and Foam in Sink Center */}
          <div
            onClick={handleHandsTap}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-32 flex items-center justify-center cursor-pointer transition-transform ${
              state.stage === 'bubbles'
                ? 'active:scale-95 cursor-pointer ring-4 ring-pink-300 rounded-3xl bg-white/40'
                : ''
            }`}
            aria-label="Sunny's hands"
          >
            <svg
              viewBox="0 0 200 120"
              className="w-full h-full drop-shadow-md pointer-events-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Hand */}
              <g transform="translate(15, 20) rotate(-10 50 40)">
                <path
                  d="M30 75 C30 50, 40 25, 55 25 C65 25, 75 40, 75 75 Z"
                  fill="#FED7AA"
                />
                {/* Fingers */}
                <ellipse cx="40" cy="30" rx="6" ry="12" fill="#FED7AA" />
                <ellipse cx="50" cy="22" rx="6" ry="15" fill="#FED7AA" />
                <ellipse cx="60" cy="23" rx="6" ry="14" fill="#FED7AA" />
                <ellipse cx="70" cy="32" rx="5.5" ry="11" fill="#FED7AA" />
                {/* Thumb */}
                <ellipse cx="25" cy="50" rx="8" ry="10" fill="#FED7AA" />
              </g>

              {/* Right Hand */}
              <g transform="translate(85, 20) rotate(10 50 40)">
                <path
                  d="M30 75 C30 40, 40 25, 50 25 C65 25, 75 50, 75 75 Z"
                  fill="#FED7AA"
                />
                {/* Fingers */}
                <ellipse cx="35" cy="32" rx="5.5" ry="11" fill="#FED7AA" />
                <ellipse cx="45" cy="23" rx="6" ry="14" fill="#FED7AA" />
                <ellipse cx="55" cy="22" rx="6" ry="15" fill="#FED7AA" />
                <ellipse cx="65" cy="30" rx="6" ry="12" fill="#FED7AA" />
                {/* Thumb */}
                <ellipse cx="78" cy="50" rx="8" ry="10" fill="#FED7AA" />
              </g>

              {/* Bubbles on hands if lathering */}
              {(state.stage === 'bubbles' || state.stage === 'rinse') && (
                <g id="lather-foam" className="animate-float-bubble">
                  {/* Bubble clusters based on taps */}
                  {state.bubbleTaps >= 1 && (
                    <>
                      <circle cx="85" cy="50" r="12" fill="#FFFFFF" opacity="0.95" />
                      <circle cx="115" cy="52" r="10" fill="#FFFFFF" opacity="0.95" />
                      <circle cx="100" cy="65" r="14" fill="#FFFFFF" opacity="0.95" />
                    </>
                  )}
                  {state.bubbleTaps >= 2 && (
                    <>
                      <circle cx="70" cy="40" r="10" fill="#FFFFFF" opacity="0.95" />
                      <circle cx="130" cy="42" r="11" fill="#FFFFFF" opacity="0.95" />
                      <circle cx="95" cy="35" r="12" fill="#FFFFFF" opacity="0.95" />
                      <circle cx="110" cy="70" r="9" fill="#E0F2FE" />
                    </>
                  )}
                  {state.bubbleTaps >= 3 && (
                    <>
                      <circle cx="80" cy="65" r="13" fill="#FFFFFF" opacity="0.95" />
                      <circle cx="120" cy="65" r="12" fill="#FFFFFF" opacity="0.95" />
                      <circle cx="65" cy="55" r="8" fill="#E0F2FE" />
                      <circle cx="135" cy="55" r="9" fill="#E0F2FE" />
                      <circle cx="100" cy="48" r="15" fill="#FFFFFF" opacity="0.98" />
                    </>
                  )}
                </g>
              )}

              {/* Sparkles on clean hands */}
              {state.stage === 'done' && (
                <g className="animate-sparkle-spin origin-[100px_50px]">
                  <polygon
                    points="60,35 63,42 70,45 63,48 60,55 57,48 50,45 57,42"
                    fill="#38BDF8"
                  />
                  <polygon
                    points="140,35 143,42 150,45 143,48 140,55 137,48 130,45 137,42"
                    fill="#FBBF24"
                  />
                  <polygon
                    points="100,20 102,26 108,28 102,30 100,36 98,30 92,28 98,26"
                    fill="#34D399"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>
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
            aria-label="Restart hand wash activity"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
};
