import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialProgress,
  countCompletedActivities,
  areAllActivitiesCompleted,
  markActivityCompleted,
  createInitialWashHandsState,
  stepWashHands,
  createInitialEatFoodState,
  feedFoodItem,
  createInitialBrushTeethState,
  tapBrushTeeth,
  createInitialBathState,
  stepBath,
  createInitialCombHairState,
  tapCombHair,
} from './routineState';

test('routine progress tracking starts at zero and tracks all 5 activities', () => {
  let progress = createInitialProgress();
  assert.equal(countCompletedActivities(progress), 0);
  assert.equal(areAllActivitiesCompleted(progress), false);

  progress = markActivityCompleted(progress, 'wash_hands');
  assert.equal(countCompletedActivities(progress), 1);
  assert.equal(progress.completed.wash_hands, true);

  progress = markActivityCompleted(progress, 'eat_food');
  progress = markActivityCompleted(progress, 'brush_teeth');
  progress = markActivityCompleted(progress, 'take_bath');
  assert.equal(countCompletedActivities(progress), 4);
  assert.equal(areAllActivitiesCompleted(progress), false);

  progress = markActivityCompleted(progress, 'comb_hair');
  assert.equal(countCompletedActivities(progress), 5);
  assert.equal(areAllActivitiesCompleted(progress), true);
});

test('wash hands sequence progresses from soap -> 3 bubble taps -> rinse -> done', () => {
  let state = createInitialWashHandsState();
  assert.equal(state.stage, 'soap');

  // Attempting to tap hands or water before soap does nothing
  state = stepWashHands(state, 'tap_hands');
  assert.equal(state.stage, 'soap');

  // 1. Tap soap
  state = stepWashHands(state, 'tap_soap');
  assert.equal(state.stage, 'bubbles');
  assert.equal(state.bubbleTaps, 0);

  // 2. Tap hands 3 times
  state = stepWashHands(state, 'tap_hands');
  assert.equal(state.bubbleTaps, 1);
  assert.equal(state.stage, 'bubbles');

  state = stepWashHands(state, 'tap_hands');
  assert.equal(state.bubbleTaps, 2);
  assert.equal(state.stage, 'bubbles');

  state = stepWashHands(state, 'tap_hands');
  assert.equal(state.bubbleTaps, 3);
  assert.equal(state.stage, 'rinse');

  // 3. Tap water to rinse
  state = stepWashHands(state, 'tap_water');
  assert.equal(state.stage, 'done');
});

test('eat food requires feeding all 3 items (banana, rice, water)', () => {
  let state = createInitialEatFoodState();
  assert.equal(state.isDone, false);

  state = feedFoodItem(state, 'banana');
  assert.equal(state.eaten.banana, true);
  assert.equal(state.isDone, false);

  // Re-tapping eaten banana has no adverse effect
  state = feedFoodItem(state, 'banana');
  assert.equal(state.isDone, false);

  state = feedFoodItem(state, 'rice');
  assert.equal(state.eaten.rice, true);
  assert.equal(state.isDone, false);

  state = feedFoodItem(state, 'water');
  assert.equal(state.eaten.water, true);
  assert.equal(state.isDone, true);
});

test('brush teeth requires 5 taps to become sparkly clean', () => {
  let state = createInitialBrushTeethState();
  assert.equal(state.brushCount, 0);
  assert.equal(state.isDone, false);

  for (let i = 1; i <= 4; i++) {
    state = tapBrushTeeth(state);
    assert.equal(state.brushCount, i);
    assert.equal(state.isDone, false);
  }

  state = tapBrushTeeth(state);
  assert.equal(state.brushCount, 5);
  assert.equal(state.isDone, true);
});

test('take a bath follows sponge -> 4 bubbles -> rinse -> done', () => {
  let state = createInitialBathState();
  assert.equal(state.stage, 'sponge');

  state = stepBath(state, 'tap_sponge');
  assert.equal(state.stage, 'bubbles');

  for (let i = 1; i <= 3; i++) {
    state = stepBath(state, 'tap_bubbles');
    assert.equal(state.bubbleTaps, i);
    assert.equal(state.stage, 'bubbles');
  }

  state = stepBath(state, 'tap_bubbles');
  assert.equal(state.bubbleTaps, 4);
  assert.equal(state.stage, 'rinse');

  state = stepBath(state, 'tap_rinse');
  assert.equal(state.stage, 'done');
});

test('comb hair requires 3 taps to become neat', () => {
  let state = createInitialCombHairState();
  assert.equal(state.combCount, 0);
  assert.equal(state.isDone, false);

  state = tapCombHair(state);
  assert.equal(state.combCount, 1);
  assert.equal(state.isDone, false);

  state = tapCombHair(state);
  assert.equal(state.combCount, 2);
  assert.equal(state.isDone, false);

  state = tapCombHair(state);
  assert.equal(state.combCount, 3);
  assert.equal(state.isDone, true);
});
