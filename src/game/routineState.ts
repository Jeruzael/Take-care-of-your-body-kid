/**
 * Pure game state and routine management logic for Little Care Club.
 * Decoupled from UI for deterministic testing and predictable gameplay.
 */

export type ActivityId = 'wash_hands' | 'eat_food' | 'brush_teeth' | 'take_bath' | 'comb_hair';

export type GameScreen =
  | 'WELCOME'
  | 'SELECT'
  | 'WASH_HANDS'
  | 'EAT_FOOD'
  | 'BRUSH_TEETH'
  | 'TAKE_BATH'
  | 'COMB_HAIR'
  | 'CELEBRATION';

export interface ActivityMeta {
  id: ActivityId;
  title: string;
  shortDesc: string;
  iconName: string;
  colorBg: string;
  accentColor: string;
}

export const ACTIVITIES: ActivityMeta[] = [
  {
    id: 'wash_hands',
    title: 'Wash Hands',
    shortDesc: 'Soap, scrub & rinse!',
    iconName: 'Droplets',
    colorBg: 'bg-sky-100 border-sky-300 text-sky-700',
    accentColor: '#38bdf8',
  },
  {
    id: 'eat_food',
    title: 'Eat Food',
    shortDesc: 'Yummy healthy snacks!',
    iconName: 'Utensils',
    colorBg: 'bg-amber-100 border-amber-300 text-amber-800',
    accentColor: '#f59e0b',
  },
  {
    id: 'brush_teeth',
    title: 'Brush Teeth',
    shortDesc: 'Sparkly clean smile!',
    iconName: 'Sparkles',
    colorBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    accentColor: '#10b981',
  },
  {
    id: 'take_bath',
    title: 'Take a Bath',
    shortDesc: 'Splash & soapy bubbles!',
    iconName: 'Bath',
    colorBg: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    accentColor: '#6366f1',
  },
  {
    id: 'comb_hair',
    title: 'Comb Hair',
    shortDesc: 'Smooth & neat style!',
    iconName: 'Smile',
    colorBg: 'bg-rose-100 border-rose-300 text-rose-800',
    accentColor: '#f43f5e',
  },
];

export interface RoutineProgress {
  completed: Record<ActivityId, boolean>;
}

export function createInitialProgress(): RoutineProgress {
  return {
    completed: {
      wash_hands: false,
      eat_food: false,
      brush_teeth: false,
      take_bath: false,
      comb_hair: false,
    },
  };
}

export function countCompletedActivities(progress: RoutineProgress): number {
  return Object.values(progress.completed).filter(Boolean).length;
}

export function areAllActivitiesCompleted(progress: RoutineProgress): boolean {
  return countCompletedActivities(progress) === ACTIVITIES.length;
}

export function markActivityCompleted(
  progress: RoutineProgress,
  activityId: ActivityId
): RoutineProgress {
  return {
    completed: {
      ...progress.completed,
      [activityId]: true,
    },
  };
}

/* Wash Hands Mini-game State Rules */
export type WashHandsStage = 'soap' | 'bubbles' | 'rinse' | 'done';

export interface WashHandsState {
  stage: WashHandsStage;
  bubbleTaps: number; // target: 3
}

export const REQUIRED_HAND_BUBBLE_TAPS = 3;

export function createInitialWashHandsState(): WashHandsState {
  return {
    stage: 'soap',
    bubbleTaps: 0,
  };
}

export function stepWashHands(
  current: WashHandsState,
  action: 'tap_soap' | 'tap_hands' | 'tap_water'
): WashHandsState {
  if (current.stage === 'done') return current;

  if (action === 'tap_soap' && current.stage === 'soap') {
    return { ...current, stage: 'bubbles', bubbleTaps: 0 };
  }

  if (action === 'tap_hands' && current.stage === 'bubbles') {
    const nextTaps = current.bubbleTaps + 1;
    if (nextTaps >= REQUIRED_HAND_BUBBLE_TAPS) {
      return { stage: 'rinse', bubbleTaps: nextTaps };
    }
    return { ...current, bubbleTaps: nextTaps };
  }

  if (action === 'tap_water' && current.stage === 'rinse') {
    return { ...current, stage: 'done' };
  }

  return current;
}

/* Eat Food Mini-game State Rules */
export type FoodItemKey = 'banana' | 'rice' | 'water';

export interface EatFoodState {
  eaten: Record<FoodItemKey, boolean>;
  isDone: boolean;
}

export function createInitialEatFoodState(): EatFoodState {
  return {
    eaten: {
      banana: false,
      rice: false,
      water: false,
    },
    isDone: false,
  };
}

export function feedFoodItem(
  current: EatFoodState,
  item: FoodItemKey
): EatFoodState {
  if (current.isDone || current.eaten[item]) return current;

  const nextEaten = { ...current.eaten, [item]: true };
  const allEaten = nextEaten.banana && nextEaten.rice && nextEaten.water;

  return {
    eaten: nextEaten,
    isDone: allEaten,
  };
}

/* Brush Teeth Mini-game State Rules */
export interface BrushTeethState {
  brushCount: number; // target: 5
  isDone: boolean;
}

export const REQUIRED_TEETH_BRUSH_TAPS = 5;

export function createInitialBrushTeethState(): BrushTeethState {
  return {
    brushCount: 0,
    isDone: false,
  };
}

export function tapBrushTeeth(current: BrushTeethState): BrushTeethState {
  if (current.isDone) return current;
  const nextCount = current.brushCount + 1;
  return {
    brushCount: nextCount,
    isDone: nextCount >= REQUIRED_TEETH_BRUSH_TAPS,
  };
}

/* Take a Bath Mini-game State Rules */
export type BathStage = 'sponge' | 'bubbles' | 'rinse' | 'done';

export interface BathState {
  stage: BathStage;
  bubbleTaps: number; // target: 4
}

export const REQUIRED_BATH_BUBBLE_TAPS = 4;

export function createInitialBathState(): BathState {
  return {
    stage: 'sponge',
    bubbleTaps: 0,
  };
}

export function stepBath(
  current: BathState,
  action: 'tap_sponge' | 'tap_bubbles' | 'tap_rinse'
): BathState {
  if (current.stage === 'done') return current;

  if (action === 'tap_sponge' && current.stage === 'sponge') {
    return { ...current, stage: 'bubbles', bubbleTaps: 0 };
  }

  if (action === 'tap_bubbles' && current.stage === 'bubbles') {
    const nextTaps = current.bubbleTaps + 1;
    if (nextTaps >= REQUIRED_BATH_BUBBLE_TAPS) {
      return { stage: 'rinse', bubbleTaps: nextTaps };
    }
    return { ...current, bubbleTaps: nextTaps };
  }

  if (action === 'tap_rinse' && current.stage === 'rinse') {
    return { ...current, stage: 'done' };
  }

  return current;
}

/* Comb Hair Mini-game State Rules */
export interface CombHairState {
  combCount: number; // target: 3
  isDone: boolean;
}

export const REQUIRED_COMB_TAPS = 3;

export function createInitialCombHairState(): CombHairState {
  return {
    combCount: 0,
    isDone: false,
  };
}

export function tapCombHair(current: CombHairState): CombHairState {
  if (current.isDone) return current;
  const nextCount = current.combCount + 1;
  return {
    combCount: nextCount,
    isDone: nextCount >= REQUIRED_COMB_TAPS,
  };
}
