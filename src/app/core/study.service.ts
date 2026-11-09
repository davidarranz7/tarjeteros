import { Injectable, computed, inject, signal } from '@angular/core';
import { AVAILABLE_MODULES, CARDS, CARD_BY_ID } from './catalog';
import { parseSavedSession } from './session-storage';
import { Flashcard, Grade, StudyFilters, StudySession } from './models';
import { ProgressService } from './progress.service';
import { PreferencesService } from './preferences.service';
import { levelRank, recommendedLevel } from './review-policy';

const KEY = 'backend-lab:session:v1';
function restore(): StudySession | null {
  try {
    return parseSavedSession(localStorage.getItem(KEY), new Set(CARD_BY_ID.keys()), new Set(AVAILABLE_MODULES.map(m => m.id)));
  } catch { return null; }
}
function shuffled<T>(input: T[]): T[] {
  const result = [...input];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

@Injectable({ providedIn: 'root' })
export class StudyService {
  private readonly progress = inject(ProgressService);
  private readonly preferences = inject(PreferencesService);
  readonly session = signal<StudySession | null>(restore());
  readonly card = computed<Flashcard | null>(() => {
    const state = this.session();
    return state && state.pointer < state.queue.length ? CARD_BY_ID.get(state.queue[state.pointer]) ?? null : null;
  });
  readonly finished = computed(() => !!this.session() && !this.card());
  readonly left = computed(() => {
    const state = this.session();
    return state ? Math.max(0, state.queue.length - state.pointer) : 0;
  });
  readonly sessionPercent = computed(() => {
    const state = this.session();
    return state ? Math.round(100 * state.pointer / Math.max(1, state.queue.length)) : 0;
  });

  candidates(filters: StudyFilters): Flashcard[] {
    return CARDS.filter(card => {
      if (filters.moduleId !== 'all' && card.moduleId !== filters.moduleId) return false;
      if (filters.topicId !== 'all' && card.topicId !== filters.topicId) return false;
      if (filters.difficulty !== 'all' && card.difficulty !== filters.difficulty) return false;
      if (filters.kind !== 'all' && card.kind !== filters.kind) return false;
      const history = this.progress.get(card.id);
      switch (filters.mode) {
        case 'due': return this.progress.isDue(card.id);
        case 'bad': return history.lastGrade === 'bad';
        case 'medium': return history.lastGrade === 'medium';
        case 'weak': return history.lastGrade === 'medium' || history.lastGrade === 'bad';
        case 'unseen': return history.seen === 0;
        case 'starred': return !!history.starred;
        default: return true;
      }
    });
  }
  start(filters: StudyFilters): number {
    const candidates = this.candidates(filters);
    const pool = shuffled(candidates).sort((a, b) => this.priority(b, filters.mode) - this.priority(a, filters.mode));
    const chosen = pool.slice(0, filters.count === 0 ? pool.length : Math.min(filters.count, pool.length));
    if (!chosen.length) return 0;
    this.set({ moduleId: filters.moduleId, queue: chosen.map(c => c.id), pointer: 0, revealed: false, paused: false, draft: '',
      completed: 0, repeatCounts: {}, started: new Date().toISOString(), summary: { good: 0, medium: 0, bad: 0 } });
    return chosen.length;
  }
  startCard(cardId: string): void {
    if (!CARD_BY_ID.has(cardId)) return;
    this.set({ moduleId: CARD_BY_ID.get(cardId)!.moduleId, queue: [cardId], pointer: 0, revealed: false, paused: false, draft: '', completed: 0,
      repeatCounts: {}, started: new Date().toISOString(), summary: { good: 0, medium: 0, bad: 0 } });
  }
  reveal(): void { this.modify(state => ({ ...state, revealed: true })); }
  pause(): void { this.modify(state => ({ ...state, paused: true })); }
  resume(): void { this.modify(state => ({ ...state, paused: false })); }
  setDraft(draft: string): void { this.modify(state => ({ ...state, draft: draft.slice(0, 600) })); }
  rate(grade: Grade): void {
    const state = this.session(); const card = this.card();
    if (!state || !card || !state.revealed || state.paused) return;
    this.progress.rate(card.id, card.moduleId, grade, state.draft);
    const queue = [...state.queue];
    const repeatCounts = { ...state.repeatCounts };
    if (this.preferences.values().priority && grade !== 'good' && (repeatCounts[card.id] ?? 0) < 1 && queue.length > 1) {
      repeatCounts[card.id] = 1;
      const after = grade === 'bad' ? 3 : 5;
      queue.splice(Math.min(queue.length, state.pointer + after + 1), 0, card.id);
    }
    this.set({ ...state, queue, repeatCounts, pointer: state.pointer + 1, revealed: false, draft: '',
      completed: state.completed + 1, summary: { ...state.summary, [grade]: state.summary[grade] + 1 } });
  }
  skip(): void { this.modify(state => ({ ...state, pointer: state.pointer + 1, revealed: false, draft: '' })); }
  clear(): void { this.session.set(null); try { localStorage.removeItem(KEY); } catch {} }
  private priority(item: Flashcard, mode: StudyFilters['mode']): number {
    const history = this.progress.get(item.id);
    if (!this.preferences.values().priority) return mode === 'progressive' ? (item.difficulty === 'basic' ? 7 : item.difficulty === 'intermediate' ? 5 : 3) : 1;
    const base = history.lastGrade === 'bad' ? 10 : history.lastGrade === 'medium' ? 9 :
      this.progress.isDue(item.id) ? 8 : history.seen === 0 ? 6 : 3;
    if (mode !== 'progressive') return base;
    const topic = CARDS.filter(card => card.topicId === item.topicId);
    const ratio = (level: Flashcard['difficulty']): number => {
      const selected = topic.filter(card => card.difficulty === level);
      if (!selected.length) return 1;
      return selected.filter(card => this.progress.get(card.id).lastGrade === 'good').length / selected.length;
    };
    const stage = recommendedLevel(ratio('basic'), ratio('intermediate'));
    const delta = levelRank(item.difficulty) - levelRank(stage);
    return base + (delta === 0 ? 6 : delta < 0 ? 2 : -6 * delta);
  }
  private modify(fn: (state: StudySession) => StudySession): void {
    const state = this.session(); if (state) this.set(fn(state));
  }
  private set(value: StudySession): void {
    this.session.set(value);
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { console.warn('Sesión sin persistencia local.'); }
  }
}
