import React, { useState, useEffect } from 'react';
import {
  ActivityId,
  GameScreen,
  RoutineProgress,
  createInitialProgress,
  markActivityCompleted,
  countCompletedActivities,
  areAllActivitiesCompleted,
} from './game/routineState';
import { sound } from './utils/soundEffects';
import { HeaderNav } from './components/HeaderNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ActivitySelectScreen } from './components/ActivitySelectScreen';
import { WashHandsGame } from './components/games/WashHandsGame';
import { EatFoodGame } from './components/games/EatFoodGame';
import { BrushTeethGame } from './components/games/BrushTeethGame';
import { TakeBathGame } from './components/games/TakeBathGame';
import { CombHairGame } from './components/games/CombHairGame';
import { CelebrationScreen } from './components/CelebrationScreen';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('WELCOME');
  const [progress, setProgress] = useState<RoutineProgress>(createInitialProgress());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Support ?autostart=1 query param per ultra-mode testability guidelines
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setScreen('SELECT');
      }
    }
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    sound.enabled = nextState;
    setSoundEnabled(nextState);
    if (nextState) {
      sound.playPop();
    }
  };

  const handleCompleteActivity = (id: ActivityId) => {
    setProgress((prev) => {
      const nextProgress = markActivityCompleted(prev, id);
      // If this was the last activity to complete, trigger celebration shortly
      if (areAllActivitiesCompleted(nextProgress)) {
        setTimeout(() => {
          setScreen('CELEBRATION');
        }, 1200);
      }
      return nextProgress;
    });
  };

  const handlePlayAgain = () => {
    setProgress(createInitialProgress());
    setScreen('SELECT');
  };

  const completedCount = countCompletedActivities(progress);

  // Screen-specific title mapping for Header
  const getScreenTitle = (): string | undefined => {
    switch (screen) {
      case 'WASH_HANDS':
        return 'Wash Hands 🧼';
      case 'EAT_FOOD':
        return 'Eat Food 🥣';
      case 'BRUSH_TEETH':
        return 'Brush Teeth 🪥';
      case 'TAKE_BATH':
        return 'Take a Bath 🛁';
      case 'COMB_HAIR':
        return 'Comb Hair 🪮';
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 flex items-center justify-center p-0 sm:p-4 text-slate-800">
      {/* Mobile Device Viewport Container (Portrait-first, 320px–430px max on mobile, styled phone canvas on desktop) */}
      <main
        className="w-full max-w-[430px] h-[100dvh] sm:h-[844px] bg-white sm:rounded-[40px] shadow-2xl sm:border-[8px] sm:border-sky-200/80 flex flex-col overflow-hidden relative"
        data-state={screen.toLowerCase()}
      >
        {/* Soft Background Clouds / Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
          <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-sky-200 blur-2xl" />
          <div className="absolute top-1/3 -right-12 w-48 h-48 rounded-full bg-amber-100 blur-2xl" />
          <div className="absolute -bottom-10 left-10 w-52 h-52 rounded-full bg-rose-100 blur-2xl" />
        </div>

        {/* Global Navigation Header (Shown on SELECT and Mini-Game Screens) */}
        {screen !== 'WELCOME' && screen !== 'CELEBRATION' && (
          <HeaderNav
            title={getScreenTitle()}
            showBack={screen !== 'SELECT'}
            onBack={() => setScreen('SELECT')}
            completedCount={completedCount}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Main Game Screen Router */}
        <div className="flex-1 w-full h-full relative z-10 overflow-y-auto overflow-x-hidden flex flex-col">
          {screen === 'WELCOME' && (
            <WelcomeScreen onStart={() => setScreen('SELECT')} />
          )}

          {screen === 'SELECT' && (
            <ActivitySelectScreen
              progress={progress}
              onSelectActivity={(id) => {
                switch (id) {
                  case 'wash_hands':
                    setScreen('WASH_HANDS');
                    break;
                  case 'eat_food':
                    setScreen('EAT_FOOD');
                    break;
                  case 'brush_teeth':
                    setScreen('BRUSH_TEETH');
                    break;
                  case 'take_bath':
                    setScreen('TAKE_BATH');
                    break;
                  case 'comb_hair':
                    setScreen('COMB_HAIR');
                    break;
                }
              }}
              onOpenCelebration={() => setScreen('CELEBRATION')}
            />
          )}

          {screen === 'WASH_HANDS' && (
            <WashHandsGame
              onComplete={() => handleCompleteActivity('wash_hands')}
              onExit={() => setScreen('SELECT')}
            />
          )}

          {screen === 'EAT_FOOD' && (
            <EatFoodGame
              onComplete={() => handleCompleteActivity('eat_food')}
              onExit={() => setScreen('SELECT')}
            />
          )}

          {screen === 'BRUSH_TEETH' && (
            <BrushTeethGame
              onComplete={() => handleCompleteActivity('brush_teeth')}
              onExit={() => setScreen('SELECT')}
            />
          )}

          {screen === 'TAKE_BATH' && (
            <TakeBathGame
              onComplete={() => handleCompleteActivity('take_bath')}
              onExit={() => setScreen('SELECT')}
            />
          )}

          {screen === 'COMB_HAIR' && (
            <CombHairGame
              onComplete={() => handleCompleteActivity('comb_hair')}
              onExit={() => setScreen('SELECT')}
            />
          )}

          {screen === 'CELEBRATION' && (
            <CelebrationScreen
              onPlayAgain={handlePlayAgain}
              onBackToActivities={() => setScreen('SELECT')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
