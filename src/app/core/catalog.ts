import { Flashcard, Topic, TrainingModule } from './models';
import module01 from '../../data/module-01.json';

interface ModuleData { id: string; name: string; phase: string; topics: Topic[]; cards: Flashcard[]; }
const first = module01 as unknown as ModuleData;
const future: Array<[string, string, string]> = [
  ['02', 'Maven y Spring Boot', 'Bases'],
  ['03', 'Spring Core', 'Bases'],
  ['04', 'REST con Spring MVC', 'Primera API'],
  ['05', 'SQL y Liquibase', 'Primera API'],
  ['06', 'JPA y Spring Data', 'Primera API'],
  ['07', 'Testing', 'Primera API'],
  ['08', 'SOLID, DDD y TDD', 'Diseño'],
  ['09', 'Hexagonal y mapeo', 'Diseño'],
  ['10', 'OpenAPI', 'Ecosistema'],
  ['11', 'OpenFeign', 'Ecosistema'],
  ['12', 'Seguridad y JWT', 'Ecosistema'],
  ['13', 'Docker', 'Ecosistema'],
  ['14', 'Proyecto final', 'Final']
];

export const MODULES: TrainingModule[] = [
  { id: first.id, name: first.name, phase: first.phase, available: true, topics: first.topics, cards: first.cards },
  ...future.map(([id, name, phase]) => ({ id, name, phase, available: false }))
];
export const ACTIVE_MODULE = MODULES[0];
export const AVAILABLE_MODULES = MODULES.filter(module => module.available);
export const TOPICS: Topic[] = AVAILABLE_MODULES.flatMap(module => module.topics ?? []);
export const CARDS: Flashcard[] = AVAILABLE_MODULES.flatMap(module => module.cards ?? []);
export function topicsForModule(moduleId: string): Topic[] {
  return moduleId === 'all' ? TOPICS : (MODULES.find(module => module.id === moduleId)?.topics ?? []);
}
export function moduleName(id: string): string { return MODULES.find(m => m.id === id)?.name ?? id; }
export const CARD_BY_ID = new Map<string, Flashcard>(CARDS.map(c => [c.id, c]));
export function topicName(id: string): string { return TOPICS.find(t => t.id === id)?.name ?? id; }
