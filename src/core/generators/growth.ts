import { Question, Difficulty } from '../types';
import { randomFrom } from '../utils';

export function generateGrowth(difficulty: Difficulty = 'medium'): Question {
  let principal: number;
  let rate: number;
  let years: number;

  if (difficulty === 'easy') {
    principal = randomFrom([100, 500, 1000]);
    rate = randomFrom([5, 10]);
    years = randomFrom([1, 2, 3]);
  } else if (difficulty === 'medium') {
    principal = randomFrom([1000, 5000]);
    rate = randomFrom([5, 7, 10]);
    years = randomFrom([3, 5]);
  } else {
    principal = randomFrom([2500, 7500, 10000]);
    rate = randomFrom([6, 8, 12]);
    years = randomFrom([5, 7, 10]);
  }

  const trueAnswer = Math.round(principal * Math.pow(1 + rate / 100, years) * 100) / 100;

  let heuristicText: string;
  if (rate === 10) {
    heuristicText = 'Rule of 72: at 10%, money doubles in ~7.2 years.';
  } else if (rate === 7) {
    heuristicText = 'Rule of 72: at 7%, money doubles in ~10 years.';
  } else {
    heuristicText = 'Rule of 72: divide 72 by the rate to estimate doubling time.';
  }

  return {
    category: 'growth',
    subcategory: 'compound-growth',
    difficulty,
    prompt: `$${principal} grows at ${rate}% per year for ${years} year${years > 1 ? 's' : ''}. Final value?`,
    trueAnswer,
    problemData: { principal, rate, years },
    heuristicText,
  };
}

export const growthModule = { generate: generateGrowth };
