import { Category } from './types';

export const CATEGORY_HINTS: Record<Category, string[]> = {
  percentage: [
    '10% = move decimal left one place',
    '5% = half of 10%',
    '25% = divide by 4',
    '1% = move decimal left two places, then scale',
  ],
  arithmetic: [
    'Round to nearest 10, then adjust',
    'Left-to-right addition is faster for mental math',
    'Subtract by counting up from the smaller number',
  ],
  multiplication: [
    'Decompose: 23×7 = 20×7 + 3×7',
    '×9 trick: ×10 then subtract the number',
    '×11 for two-digit: add digits, place in middle',
    '×5 = ×10 ÷ 2',
  ],
  division: [
    'Think: what times the divisor gets close?',
    '÷5 = ×2 ÷10',
    '÷4 = ÷2 twice',
    '÷8 = ÷2 three times',
  ],
  ratio: [
    'Unit rate: total ÷ count',
    'For speed: miles = mph × hours',
    'Convert minutes to fraction of hour first',
  ],
  exponent: [
    'Know squares to 25²: build from (n-1)² + 2n - 1',
    'Cube: n³ = n² × n',
    'Square root: bracket between known perfect squares',
  ],
  growth: [
    'Rule of 72: divide 72 by rate to get doubling time',
    'For small rates: (1+r)^n ≈ 1 + nr for n=1 or 2',
    'First year growth = principal × rate%',
  ],
};

export function getHintForCategory(category: Category): string {
  const hints = CATEGORY_HINTS[category];
  return hints[Math.floor(Math.random() * hints.length)];
}

export function getHintForQuestion(category: Category, questionHint: string): string {
  if (questionHint.trim().length > 0) {
    return questionHint;
  }
  return getHintForCategory(category);
}
