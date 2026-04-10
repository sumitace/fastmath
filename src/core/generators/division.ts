import { Question, Difficulty } from '../types';
import { randomInt } from './utils';

function getHeuristic(divisor: number, dividend: number): string {
  if (divisor === 4) return '÷4 = ÷2 then ÷2';
  if (divisor === 8) return '÷8 = ÷2 three times';
  if (divisor === 5) return '÷5 = ×2 then ÷10';
  if (divisor === 25) return '÷25 = ×4 then ÷100';
  return `Think: what number × ${divisor} gets close to ${dividend}?`;
}

export function generateDivision(difficulty: Difficulty = 'medium'): Question {
  let divisor: number;
  let dividend: number;
  let trueAnswer: number;
  let subcategory: string;

  if (difficulty === 'easy') {
    divisor = randomInt(2, 9);
    dividend = divisor * randomInt(2, 12);
    trueAnswer = dividend / divisor;
    subcategory = 'integer-division';
  } else if (difficulty === 'medium') {
    divisor = randomInt(2, 12);
    if (Math.random() < 0.5) {
      // Clean division
      dividend = divisor * randomInt(2, 20);
    } else {
      // Result with 1 decimal: add a remainder that's a fraction of divisor
      const whole = randomInt(2, 20);
      const remainder = randomInt(1, divisor - 1);
      dividend = divisor * whole + remainder;
    }
    trueAnswer = Math.round((dividend / divisor) * 10) / 10;
    subcategory = 'decimal-division';
  } else {
    divisor = randomInt(7, 25);
    dividend = randomInt(50, 500);
    trueAnswer = Math.round((dividend / divisor) * 100) / 100;
    subcategory = 'decimal-division';
  }

  return {
    category: 'division',
    subcategory,
    difficulty,
    prompt: `${dividend} ÷ ${divisor} = ?`,
    trueAnswer,
    problemData: { dividend, divisor },
    heuristicText: getHeuristic(divisor, dividend),
  };
}

export const divisionModule = { generate: generateDivision };
