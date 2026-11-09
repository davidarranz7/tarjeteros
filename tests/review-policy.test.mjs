import test from 'node:test';
import assert from 'node:assert/strict';
import { nextIntervalDays, nextGoodStreak, recommendedLevel, levelRank } from '../src/app/core/review-policy.ts';

test('mal y regular se repasan antes', () => {
  assert.equal(nextIntervalDays('bad', 0), 1);
  assert.equal(nextIntervalDays('medium', 0), 3);
});
test('bien se espacia de forma progresiva y acotada', () => {
  assert.deepEqual([1,2,3,4,5,6,10].map(s => nextIntervalDays('good', s)), [2,5,10,21,45,90,90]);
});
test('mal o regular rompen una racha de respuestas buenas', () => {
  assert.equal(nextGoodStreak(4,'good'), 5);
  assert.equal(nextGoodStreak(4,'bad'), 0);
  assert.equal(nextGoodStreak(2,'medium'), 0);
});
test('dificultad adaptativa sin bloquear las tarjetas superiores', () => {
  assert.equal(recommendedLevel(0.4, 0), 'basic');
  assert.equal(recommendedLevel(0.7, 0.4), 'intermediate');
  assert.equal(recommendedLevel(0.8, 0.8), 'advanced');
  assert.deepEqual(['basic','intermediate','advanced'].map(levelRank), [0,1,2]);
});
