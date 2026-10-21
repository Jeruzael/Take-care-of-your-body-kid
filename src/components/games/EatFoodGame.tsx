import React, { useState } from 'react';
import {
  EatFoodState,
  createInitialEatFoodState,
  feedFoodItem,
  FoodItemKey,
} from '../../game/routineState';
import { SunnyCharacter } from '../SunnyCharacter';
import { sound } from '../../utils/soundEffects';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface EatFoodGameProps {
  onComplete: () => void;
  onExit: () => void;
}

export const EatFoodGame: React.FC<EatFoodGameProps> = ({
  onComplete,
  onExit,
}) => {
  const [state, setState] = useState<EatFoodState>(createInitialEatFoodState());
  const [isChewing, setIsChewing] = useState(false);
  const [lastFedItem, setLastFedItem] = useState<FoodItemKey | null>(null);

  const handleFeed = (item: FoodItemKey) => {
    if (state.eaten[item] || isChewing) return;

    if (item === 'water') {
      sound.playWater();
    } else {
      sound.playChew();
    }

    setLastFedItem(item);
    setIsChewing(true);

    const nextState = feedFoodItem(state, item);
    setState(nextState);

    setTimeout(() => {
      setIsChewing(false);
      if (nextState.isDone) {
        sound.playSuccess();
        onComplete();
      }
    }, 700);
  };

  const handleRestart = () => {
    sound.playPop();
    setState(createInitialEatFoodState());
    setIsChewing(false);
    setLastFedItem(null);
  };

  const remainingCount = Object.values(state.eaten).filter((v) => !v).length;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-4 select-none">
      {/* Short Positive Instructional Guide */}
      <div className="w-full text-center py-2">
        {!state.isDone ? (
          <div className="inline-block px-4 py-2 bg-amber-100 border border-amber-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-base sm:text-lg font-bold text-amber-900">
              🥣 Tap food to feed Sunny! ({remainingCount} left)
            </p>
          </div>
        ) : (
          <div className="inline-block px-5 py-2.5 bg-emerald-100 border border-emerald-300 rounded-2xl shadow-xs animate-gentle-bounce">
            <p className="text-lg font-extrabold text-emerald-900 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              Yummy! Thank you!
            </p>
          </div>
        )}
      </div>

      {/* Center Scene: Sunny at the Table */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
        {/* Sunny Character with Eating Reaction */}
        <div className="relative z-10 transition-transform duration-300">
          <SunnyCharacter
            mood={state.isDone ? 'cheer' : isChewing ? 'eating' : 'idle'}
            size={200}
            sparkle={state.isDone}
          />

          {/* Floating Hearts/Yum reaction when chewing */}
          {isChewing && (
            <div className="absolute top-2 right-4 flex items-center gap-1 animate-bounce">
              <span className="text-2xl">💖</span>
              <span className="text-xs font-bold text-rose-600 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
                {lastFedItem === 'water' ? 'Gulp!' : 'Nom!'}
              </span>
            </div>
          )}
        </div>

        {/* Dining Table Surface */}
        <div className="w-full max-w-xs -mt-6 z-20">
          <div className="w-full h-16 sm:h-20 bg-gradient-to-b from-amber-200 to-amber-300 border-t-4 border-amber-400 rounded-3xl shadow-md p-2 flex items-center justify-around">
            {/* Food Option 1: Banana */}
            {!state.eaten.banana ? (
              <button
                onClick={() => handleFeed('banana')}
                className="w-16 h-16 rounded-2xl bg-white/90 border-2 border-amber-200 flex flex-col items-center justify-center cursor-pointer hover:bg-white active:scale-90 transition-transform shadow-xs"
                aria-label="Feed banana to Sunny"
              >
                <span className="text-3xl">🍌</span>
                <span className="text-[10px] font-bold text-amber-800">Banana</span>
              </button>
            ) : (
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-300/60 flex items-center justify-center opacity-40">
                <span className="text-xs font-bold text-amber-700">All gone!</span>
              </div>
            )}

            {/* Food Option 2: Rice Bowl with Vegetables */}
            {!state.eaten.rice ? (
              <button
                onClick={() => handleFeed('rice')}
                className="w-16 h-16 rounded-2xl bg-white/90 border-2 border-amber-200 flex flex-col items-center justify-center cursor-pointer hover:bg-white active:scale-90 transition-transform shadow-xs"
                aria-label="Feed rice with vegetables to Sunny"
              >
                <span className="text-3xl">🍛</span>
                <span className="text-[10px] font-bold text-amber-800">Rice</span>
              </button>
            ) : (
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-300/60 flex items-center justify-center opacity-40">
                <span className="text-xs font-bold text-amber-700">All gone!</span>
              </div>
            )}

            {/* Food Option 3: Glass of Fresh Water */}
            {!state.eaten.water ? (
              <button
                onClick={() => handleFeed('water')}
                className="w-16 h-16 rounded-2xl bg-white/90 border-2 border-sky-200 flex flex-col items-center justify-center cursor-pointer hover:bg-white active:scale-90 transition-transform shadow-xs"
                aria-label="Give glass of water to Sunny"
              >
                <span className="text-3xl">🥛</span>
                <span className="text-[10px] font-bold text-sky-800">Water</span>
              </button>
            ) : (
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-sky-300/60 flex items-center justify-center opacity-40">
                <span className="text-xs font-bold text-sky-700">All gone!</span>
              </div>
            )}
          </div>
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
            aria-label="Restart eating activity"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
};
