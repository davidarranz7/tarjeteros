/** Algoritmo puro: fácil de probar y de trasladar a la API cuando exista. */
export type Assessment = 'bad' | 'medium' | 'good';
export type Level = 'basic' | 'intermediate' | 'advanced';

const GOOD_INTERVALS = [2, 5, 10, 21, 45, 90] as const;

/** Una autoevaluación no equivale a dominio: se exige repaso repetido. */
export function nextIntervalDays(grade: Assessment, nextGoodStreak: number): number {
  if (grade === 'bad') return 1;
  if (grade === 'medium') return 3;
  return GOOD_INTERVALS[Math.min(Math.max(1, nextGoodStreak), GOOD_INTERVALS.length) - 1];
}

export function nextGoodStreak(previous: number, grade: Assessment): number {
  return grade === 'good' ? previous + 1 : 0;
}

/**
 * Progresión orientativa: primero básicas, después intermedias y avanzadas.
 * No bloquea ninguna tarjeta: solo las prioriza. La dificultad también se
 * puede seleccionar manualmente, aunque el usuario esté en otra etapa.
 */
export function recommendedLevel(basicGoodRatio: number, intermediateGoodRatio: number): Level {
  if (basicGoodRatio < 0.65) return 'basic';
  if (intermediateGoodRatio < 0.55) return 'intermediate';
  return 'advanced';
}

export function levelRank(level: Level): number {
  return level === 'basic' ? 0 : level === 'intermediate' ? 1 : 2;
}
