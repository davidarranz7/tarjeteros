import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSavedSession } from '../src/app/core/session-storage.ts';

const ids = new Set(['M01-001','M01-002']);
const modules = new Set(['01']);
const session = {
  moduleId: 'all', queue: ['M01-001','M01-002'], pointer: 1, revealed: true,
  draft: 'Mi explicación personal', completed: 1, repeatCounts: {},
  started: '2026-11-09T12:00:00.000Z', summary: { bad: 0, medium: 0, good: 1 }
};

test('retoma la tarjeta exacta y conserva el borrador y la solución visible', () => {
  const restored = parseSavedSession(JSON.stringify({ ...session, paused: true }), ids, modules);
  assert.equal(restored?.pointer, 1);
  assert.equal(restored?.draft, 'Mi explicación personal');
  assert.equal(restored?.revealed, true);
  assert.equal(restored?.paused, true);
});

test('permite recuperar sesiones antiguas sin campo paused', () => {
  const restored = parseSavedSession(JSON.stringify(session), ids, modules);
  assert.equal(restored?.paused, false);
});

test('rechaza sesiones dañadas o tarjetas desconocidas', () => {
  assert.equal(parseSavedSession('{INVALID', ids, modules), null);
  assert.equal(parseSavedSession(JSON.stringify({ ...session, queue: ['M02-001'] }), ids, modules), null);
  assert.equal(parseSavedSession(JSON.stringify({ ...session, pointer: 100 }), ids, modules), null);
});
