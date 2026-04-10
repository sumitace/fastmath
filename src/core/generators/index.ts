import { Question, Difficulty, Category, GeneratorModule } from '../types';
import { percentageModule }     from './percentage';
import { arithmeticModule }     from './arithmetic';
import { multiplicationModule } from './multiplication';
import { divisionModule }       from './division';
import { ratioModule }          from './ratio';
import { exponentsModule }      from './exponents';
import { growthModule }         from './growth';

interface GeneratorEntry {
  category: Category;
  module: GeneratorModule;
  weight: number;
}

export const GENERATORS: GeneratorEntry[] = [
  { category: 'percentage',     module: percentageModule,     weight: 20 },
  { category: 'arithmetic',     module: arithmeticModule,     weight: 20 },
  { category: 'multiplication', module: multiplicationModule, weight: 15 },
  { category: 'division',       module: divisionModule,       weight: 15 },
  { category: 'ratio',          module: ratioModule,          weight: 10 },
  { category: 'exponent',       module: exponentsModule,      weight: 10 },
  { category: 'growth',         module: growthModule,         weight: 10 },
];

const TOTAL_WEIGHT = GENERATORS.reduce((sum, g) => sum + g.weight, 0);

export function pickGenerator(): GeneratorEntry {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const g of GENERATORS) {
    r -= g.weight;
    if (r <= 0) return g;
  }
  return GENERATORS[GENERATORS.length - 1];
}

export function generateQuestion(difficulty?: Difficulty): Question {
  const entry = pickGenerator();
  return entry.module.generate(difficulty);
}
