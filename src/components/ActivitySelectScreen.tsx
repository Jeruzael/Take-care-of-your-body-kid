import React from 'react';
import {
  ACTIVITIES,
  ActivityId,
  RoutineProgress,
  countCompletedActivities,
  areAllActivitiesCompleted,
} from '../game/routineState';
import { SunnyCharacter } from './SunnyCharacter';
import { sound } from '../utils/soundEffects';
import {
  Droplets,
  Utensils,
  Sparkles,
  Bath,
  Smile,
  PartyPopper,
  ChevronRight,
} from 'lucide-react';

interface ActivitySelectScreenProps {
  progress: RoutineProgress;
  onSelectActivity: (id: ActivityId) => void;
  onOpenCelebration: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Droplets: Droplets,
  Utensils: Utensils,
  Sparkles: Sparkles,
  Bath: Bath,
  Smile: Smile,
};

export const ActivitySelectScreen: React.FC<ActivitySelectScreenProps> = ({
  progress,
  onSelectActivity,
  onOpenCelebration,
}) => {
  const completedCount = countCompletedActivities(progress);
  const allDone = areAllActivitiesCompleted(progress);

  const handleItemClick = (id: ActivityId) => {
    sound.playPop();
    onSelectActivity(id);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-4 select-none">
      {/* Top Sunny Character & Cheerful Mood */}
      <div className="flex flex-col items-center pt-1 pb-2">
        <SunnyCharacter
          mood={allDone ? 'cheer' : 'idle'}
          size={165}
          sparkle={allDone}
        />
        <div className="mt-1 bg-white/90 border border-sky-200 px-3.5 py-1 rounded-2xl shadow-xs">
          <p className="text-xs sm:text-sm font-bold text-sky-800 text-center">
            {allDone
              ? '🎉 Sunny is happy & healthy!'
              : `What routine should we do next? (${completedCount}/5 stars)`}
          </p>
        </div>
      </div>

      {/* Celebration Banner if all completed */}
      {allDone && (
        <div className="w-full px-2 mb-2">
          <button
            onClick={() => {
              sound.playFanfare();
              onOpenCelebration();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md cursor-pointer animate-gentle-bounce ring-4 ring-amber-200"
          >
            <PartyPopper className="w-5 h-5" />
            <span>View Grand Celebration! ⭐⭐⭐⭐⭐</span>
          </button>
        </div>
      )}

      {/* 5 Large Activity Buttons */}
      <div className="w-full flex-1 flex flex-col justify-center gap-2.5 py-1">
        {ACTIVITIES.map((act) => {
          const isDone = progress.completed[act.id];
          const IconComp = ICON_MAP[act.iconName] || Sparkles;

          return (
            <button
              key={act.id}
              onClick={() => handleItemClick(act.id)}
              className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-3xl border-2 transition-all cursor-pointer shadow-xs min-h-[64px] active:scale-97 hover:shadow-md ${
                isDone
                  ? 'bg-white/95 border-amber-300 ring-2 ring-amber-200/50'
                  : 'bg-white/90 border-slate-200 hover:border-sky-300'
              }`}
              aria-label={`${act.title}${isDone ? ', completed with gold star' : ''}`}
            >
              {/* Left: Icon inside rounded colored circle */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0`}
                  style={{ backgroundColor: act.accentColor }}
                >
                  <IconComp className="w-6 h-6" />
                </div>

                {/* Center: Title & Short Desc */}
                <div className="text-left">
                  <h2 className="text-base font-extrabold text-slate-800 leading-snug">
                    {act.title}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    {act.shortDesc}
                  </p>
                </div>
              </div>

              {/* Right: Gold Star badge if done or friendly arrow */}
              <div className="flex items-center gap-1.5 pl-2 shrink-0">
                {isDone ? (
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 border border-amber-300 rounded-full"
                    title="Activity Completed!"
                  >
                    <span className="text-lg">⭐</span>
                    <span className="text-xs font-extrabold text-amber-800">Done</span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-500">
                    <ChevronRight className="w-5 h-5 text-sky-500" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
