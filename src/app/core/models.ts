export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type CardKind = 'concept' | 'code' | 'pitfall' | 'mentor' | 'design';
export type Grade = 'bad' | 'medium' | 'good';
export type CardOrigin = 'plan' | 'conversation' | 'extension';
export type StudyMode = 'progressive' | 'balanced' | 'due' | 'bad' | 'medium' | 'weak' | 'unseen' | 'starred';

export interface Topic { id: string; name: string; shortName: string; description: string; order: number; }
export interface Flashcard {
  id: string;
  moduleId: string;
  topicId: string;
  difficulty: Difficulty;
  kind: CardKind;
  origin: CardOrigin;
  question: string;
  answer: string;
  explanation?: string;
  example?: string;
  context?: string;
  questionCode?: string;
  answerCode?: string;
  codeLanguage?: 'java' | 'bash' | 'text';
  focus?: string;
}
export interface TrainingModule {
  id: string;
  name: string;
  phase: string;
  available: boolean;
  topics?: Topic[];
  cards?: Flashcard[];
}
export interface ReviewEvent { cardId: string; moduleId: string; at: string; grade: Grade; draft?: string; }
export interface CardProgress {
  seen: number;
  goodStreak: number;
  lastGrade?: Grade;
  lastReviewed?: string;
  nextReview?: string;
  starred?: boolean;
  note?: string;
  lastDraft?: string;
}
export interface SavedProgress { version: 1; theme: 'light' | 'dark'; cards: Record<string, CardProgress>; events: ReviewEvent[]; }
export interface StudyFilters {
  mode: StudyMode;
  moduleId: string; // 'all' o identificador de módulo
  topicId: string;
  difficulty: Difficulty | 'all';
  kind: CardKind | 'all';
  count: number;
}
export interface StudySession {
  moduleId: string;
  queue: string[];
  pointer: number;
  revealed: boolean;
  paused?: boolean;
  draft: string;
  completed: number;
  repeatCounts: Record<string, number>;
  started: string;
  summary: { good: number; medium: number; bad: number };
}
export const GRADE_LABEL: Record<Grade, string> = { bad: 'Mal', medium: 'Regular', good: 'Bien' };
export const DIFFICULTY_LABEL: Record<Difficulty, string> = { basic: 'Básica', intermediate: 'Intermedia', advanced: 'Avanzada' };
export const KIND_LABEL: Record<CardKind, string> = { concept: 'Concepto', code: 'Interpretar código', pitfall: 'Error habitual', mentor: 'Pregunta del mentor', design: 'Decisión de diseño' };
