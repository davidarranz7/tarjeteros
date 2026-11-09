import { Injectable, computed, signal } from '@angular/core';
import { CARDS } from './catalog';
import { CardProgress, Grade, ReviewEvent, SavedProgress } from './models';
import { nextGoodStreak, nextIntervalDays } from './review-policy';

const STORAGE_KEY = 'backend-lab:progress:v1';
const EMPTY: SavedProgress = { version: 1, theme: 'light', cards: {}, events: [] };
function loadProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(EMPTY);
    const value: unknown = JSON.parse(raw);
    if (!isSavedProgress(value)) return structuredClone(EMPTY);
    return value;
  } catch { return structuredClone(EMPTY); }
}
function isSavedProgress(value: unknown): value is SavedProgress {
  if (!value || typeof value !== 'object') return false;
  const object = value as Partial<SavedProgress>;
  return object.version === 1 && (object.theme === 'dark' || object.theme === 'light') &&
    typeof object.cards === 'object' && object.cards !== null && Array.isArray(object.events);
}
function afterDays(count: number): string {
  const date = new Date();
  date.setDate(date.getDate() + count);
  return date.toISOString();
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly data = signal<SavedProgress>(loadProgress());
  readonly theme = computed(() => this.data().theme);
  readonly totalReviewed = computed(() => this.data().events.length);
  readonly seenCount = computed(() => CARDS.filter(card => (this.data().cards[card.id]?.seen ?? 0) > 0).length);
  readonly dueCount = computed(() => CARDS.filter(card => this.isDue(card.id)).length);
  readonly starredCount = computed(() => CARDS.filter(card => this.data().cards[card.id]?.starred).length);
  readonly recentEvents = computed(() => this.data().events.filter(event => Date.now() - new Date(event.at).getTime() < 7 * 86400000));
  readonly weakCount = computed(() => CARDS.filter(card => ['bad', 'medium'].includes(this.data().cards[card.id]?.lastGrade ?? '')).length);

  get(cardId: string): CardProgress { return this.data().cards[cardId] ?? { seen: 0, goodStreak: 0 }; }
  isDue(cardId: string): boolean {
    const state = this.data().cards[cardId];
    return !!state?.nextReview && new Date(state.nextReview).getTime() <= Date.now();
  }
  isSolid(cardId: string): boolean {
    const state = this.get(cardId);
    return state.seen >= 3 && state.goodStreak >= 3 && state.lastGrade === 'good';
  }
  rate(cardId: string, moduleId: string, grade: Grade, draft = ''): void {
    const previous = this.get(cardId);
    const goodStreak = nextGoodStreak(previous.goodStreak, grade);
    const days = nextIntervalDays(grade, goodStreak);
    const now = new Date().toISOString();
    const trimmedDraft = draft.trim().slice(0, 600);
    const next: CardProgress = {
      ...previous, seen: previous.seen + 1, goodStreak,
      lastGrade: grade, lastReviewed: now, nextReview: afterDays(days),
      lastDraft: trimmedDraft || previous.lastDraft
    };
    this.update(current => ({ ...current,
      cards: { ...current.cards, [cardId]: next },
      events: [...current.events, { cardId, moduleId, grade, at: now, ...(trimmedDraft ? { draft: trimmedDraft } : {}) }].slice(-5000)
    }));
  }
  toggleStar(cardId: string): void {
    const previous = this.get(cardId);
    this.update(current => ({ ...current, cards: { ...current.cards, [cardId]: { ...previous, starred: !previous.starred } } }));
  }
  saveNote(cardId: string, note: string): void {
    const previous = this.get(cardId);
    this.update(current => ({ ...current, cards: { ...current.cards, [cardId]: { ...previous, note: note.slice(0, 3000) } } }));
  }
  toggleTheme(): void { this.update(state => ({ ...state, theme: state.theme === 'dark' ? 'light' : 'dark' })); }
  exportFile(): void {
    const json = JSON.stringify({ ...this.data(), exportedAt: new Date().toISOString() }, null, 2);
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'backend-lab-progreso.json'; a.click();
    URL.revokeObjectURL(url);
  }
  async importFile(file: File): Promise<void> {
    if (file.size > 5_000_000) throw new Error('El archivo es demasiado grande.');
    let data: unknown;
    try { data = JSON.parse(await file.text()); }
    catch { throw new Error('El archivo no es un JSON válido.'); }
    if (!isSavedProgress(data)) throw new Error('El archivo no es una copia compatible de Backend Lab.');
    const imported = data as SavedProgress;
    const known = new Set(CARDS.map(card => card.id));
    const cleanCards: Record<string, CardProgress> = {};
    for (const [id, raw] of Object.entries(imported.cards)) {
      if (!known.has(id) || !raw || typeof raw !== 'object') continue;
      const card = raw as CardProgress;
      cleanCards[id] = {
        seen: Number.isInteger(card.seen) && card.seen >= 0 ? Math.min(card.seen, 100000) : 0,
        goodStreak: Number.isInteger(card.goodStreak) && card.goodStreak >= 0 ? Math.min(card.goodStreak, 100000) : 0,
        lastGrade: ['good', 'bad', 'medium'].includes(card.lastGrade ?? '') ? card.lastGrade : undefined,
        lastReviewed: typeof card.lastReviewed === 'string' ? card.lastReviewed : undefined,
        nextReview: typeof card.nextReview === 'string' ? card.nextReview : undefined,
        starred: card.starred === true,
        note: typeof card.note === 'string' ? card.note.slice(0, 3000) : '',
        lastDraft: typeof card.lastDraft === 'string' ? card.lastDraft.slice(0, 600) : ''
      };
    }
    const events: ReviewEvent[] = imported.events.filter(event => event && known.has(event.cardId) &&
      CARDS.some(card => card.id === event.cardId && card.moduleId === event.moduleId) && ['good', 'medium', 'bad'].includes(event.grade) && typeof event.at === 'string').slice(-5000)
      .map(event => ({ cardId: event.cardId, moduleId: event.moduleId, grade: event.grade, at: event.at,
        ...(typeof event.draft === 'string' ? { draft: event.draft.slice(0, 600) } : {}) }));
    this.update(() => ({ version: 1, theme: imported.theme, cards: cleanCards, events }));
  }
  reset(): void { this.update(() => structuredClone(EMPTY)); }
  private update(fn: (current: SavedProgress) => SavedProgress): void {
    this.data.update(fn);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data())); }
    catch { console.warn('No se ha podido guardar el progreso en este navegador.'); }
  }
}
