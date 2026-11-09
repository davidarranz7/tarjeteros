import type { StudySession } from './models';

/** Parses saved sessions (also v1 sessions without the paused field). No browser dependency. */
export function parseSavedSession(raw: string | null, cardIds: ReadonlySet<string>, moduleIds: ReadonlySet<string>): StudySession | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const s = value as Partial<StudySession>;
    if (!s.moduleId || (s.moduleId !== 'all' && !moduleIds.has(s.moduleId))) return null;
    if (!Array.isArray(s.queue) || !s.queue.every((id: unknown) => typeof id === 'string' && cardIds.has(id))) return null;
    if (!Number.isInteger(s.pointer) || s.pointer! < 0 || s.pointer! > s.queue.length) return null;
    if (typeof s.revealed !== 'boolean' || typeof s.draft !== 'string' || typeof s.started !== 'string') return null;
    if (!Number.isInteger(s.completed) || s.completed! < 0) return null;
    if (!s.summary || !['bad', 'medium', 'good'].every(grade => Number.isInteger(s.summary?.[grade as 'bad' | 'medium' | 'good']) && (s.summary?.[grade as 'bad' | 'medium' | 'good'] ?? -1) >= 0)) return null;
    if (!s.repeatCounts || typeof s.repeatCounts !== 'object' || Array.isArray(s.repeatCounts)) return null;
    return { ...s, paused: s.paused === true, draft: s.draft.slice(0, 600) } as StudySession;
  } catch { return null; }
}
