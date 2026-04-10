import { Question, Difficulty } from '../types';

type Subcategory = 'tip' | 'tax' | 'discount';

const DIFFICULTY_CONFIG = {
  easy: {
    pcts: [10, 15, 20, 25],
    bases: [20, 25, 40, 50, 80, 100],
  },
  medium: {
    pcts: [12, 15, 17, 18, 20, 22, 25],
    bases: [24.50, 39.99, 47.00, 62.00, 84.50, 120.00],
  },
  hard: {
    pcts: [7, 8, 11, 13, 17, 19, 23],
    bases: [67.43, 84.99, 123.75, 148.00, 248.60],
  },
} as const;

const SUBCATEGORIES: Subcategory[] = ['tip', 'tax', 'discount'];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function getHeuristicText(pct: number): string {
  if (pct % 10 === 0) return 'Move the decimal left one place, then scale by the multiplier';
  if (pct === 15) return '15% = 10% + half of 10%';
  if (pct === 25) return '25% = divide by 4';
  if (pct % 5 === 0) return '5% = half of 10%';
  return 'Estimate 10% first, then scale up or down';
}

function buildQuestion(subcategory: Subcategory, base: number, pct: number, difficulty: Difficulty): Question {
  const pctOf = base * pct / 100;
  const [trueAnswer, prompt] = subcategory === 'tip'
    ? [round2(pctOf), `${pct}% tip on $${base.toFixed(2)} = ?`]
    : subcategory === 'tax'
      ? [round2(base + pctOf), `$${base.toFixed(2)} + ${pct}% tax = ?`]
      : [round2(base - pctOf), `$${base.toFixed(2)} minus ${pct}% off = ?`];

  return {
    category: 'percentage',
    subcategory,
    difficulty,
    prompt,
    trueAnswer,
    problemData: { base, pct, subcategory },
    heuristicText: getHeuristicText(pct),
  };
}

export function generatePercentage(difficulty: Difficulty = 'medium'): Question {
  const config = DIFFICULTY_CONFIG[difficulty];
  const pct = pick(config.pcts);
  const base = pick(config.bases);
  const subcategory = pick(SUBCATEGORIES);
  return buildQuestion(subcategory, base, pct, difficulty);
}

export const percentageModule = { generate: generatePercentage };
