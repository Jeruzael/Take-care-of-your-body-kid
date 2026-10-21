import React from 'react';
import { SunnyCharacter } from './SunnyCharacter';
import { sound } from '../utils/soundEffects';
import { Play, Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const handlePlayClick = () => {
    sound.playPop();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-6 select-none text-center">
      {/* Top Banner / Logo */}
      <div className="pt-6 sm:pt-8 flex flex-col items-center">
        {/* Cute Club Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-800 text-xs font-black tracking-wide uppercase shadow-xs mb-2 animate-gentle-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>My Happy Routine</span>
        </div>

        {/* Main Logo */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
          Little Care Club
        </h1>

        <p className="text-base sm:text-lg font-bold text-sky-700 mt-1 flex items-center justify-center gap-1.5">
          <span>Let&apos;s take care of Sunny!</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
        </p>
      </div>

      {/* Hero Cartoon Character Sunny Waving */}
      <div className="my-auto py-2 flex flex-col items-center">
        <SunnyCharacter mood="wave" size={230} sparkle={true} />
        {/* Speech Bubble */}
        <div className="mt-2 bg-white/95 px-4 py-1.5 rounded-2xl border-2 border-sky-200 shadow-md animate-gentle-bounce">
          <p className="text-sm font-bold text-sky-800">
            Hi! Ready to play together? ✨
          </p>
        </div>
      </div>

      {/* Large PLAY Button */}
      <div className="w-full pb-6 sm:pb-8 flex flex-col items-center">
        <button
          onClick={handlePlayClick}
          className="w-full max-w-xs py-4 px-8 rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white font-extrabold text-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/35 cursor-pointer ring-4 ring-emerald-200/80 transition-all min-h-[68px]"
          aria-label="Play Little Care Club"
        >
          <Play className="w-8 h-8 fill-white" />
          <span className="tracking-wide">PLAY</span>
        </button>

        <p className="text-xs font-bold text-sky-600/80 mt-3">
          Taps &amp; smiles · Easy for ages 3 to 6
        </p>
      </div>
    </div>
  );
};
