import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface HeaderNavProps {
  title?: string;
  onBack?: () => void;
  completedCount: number;
  totalActivities?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showBack?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title,
  onBack,
  completedCount,
  totalActivities = 5,
  soundEnabled,
  onToggleSound,
  showBack = false,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-xs z-30 select-none">
      {/* Left Slot: Back Button or Brand */}
      <div className="flex items-center min-w-[70px]">
        {showBack && onBack ? (
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-sky-100 text-sky-700 font-bold text-sm hover:bg-sky-200 active:scale-95 transition-all shadow-xs cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label="Go back to activity list"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sky-800 font-extrabold text-base">Sunny</span>
          </div>
        )}
      </div>

      {/* Center Slot: Page Title or Routine Progress */}
      <div className="flex items-center justify-center flex-1 px-2">
        {title ? (
          <h1 className="text-base sm:text-lg font-bold text-sky-900 truncate text-center">
            {title}
          </h1>
        ) : (
          <div
            className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full"
            aria-label={`${completedCount} of ${totalActivities} activities completed`}
          >
            <span className="text-amber-500 text-sm">⭐</span>
            <span className="text-xs sm:text-sm font-bold text-amber-800">
              {completedCount} / {totalActivities} Done
            </span>
          </div>
        )}
      </div>

      {/* Right Slot: Sound Toggle */}
      <div className="flex items-center justify-end min-w-[70px]">
        <button
          onClick={onToggleSound}
          className="p-2.5 rounded-2xl bg-sky-100 text-sky-700 hover:bg-sky-200 active:scale-95 transition-all shadow-xs cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          title={soundEnabled ? 'Sound is on' : 'Sound is muted'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-sky-700" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>
    </header>
  );
};
