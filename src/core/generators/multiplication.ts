import { Question, Difficulty } from '../types';
import { randomInt } from './utils';

function getHeuristic(a: number, b: number, difficulty: Difficulty): string {
  if (a === 9 || b === 9) return '×9 trick: multiply by 10 then subtract the number';
  if (a === 5 || b === 5) return '×5 = ×10 ÷ 2';
  if ((a === 11 && b < 10) || (b === 11 && a < 10)) return '×11 for single digit: just duplicate the digit (e.g. 7×11 = 77)';
  if (a === 25 || b === 25) return '×25 = ×100 ÷ 4';
  if (difficulty === 'easy') return 'Recall your times tables';
  if (difficulty === 'medium') return 'Decompose: (a)(b+c) = ab + ac';
  return 'FOIL or round one factor to nearest 10 and adjust';
}

export function generateMultiplication(difficulty: Difficulty = 'medium'): Question {
  let a: number;
  let b: number;

  if (difficulty === 'easy') {
    a = randomInt(2, 9);
    b = randomInt(2, 9);
  } else if (difficulty === 'medium') {
    if (Math.random() < 0.5) {
      a = randomInt(11, 19);
      b = randomInt(2, 9);
    } else {
      a = randomInt(12, 49);
      b = randomInt(2, 9);
    }
  } else {
    a = randomInt(12, 49);
    b = randomInt(12, 49);
  }

  return {
    category: 'multiplication',
    subcategory: 'integer-multiplication',
    difficulty,
    prompt: `${a} × ${b} = ?`,
    trueAnswer: a * b,
    problemData: { a, b },
    heuristicText: getHeuristic(a, b, difficulty),
  };
}

export const multiplicationModule = { generate: generateMultiplication };
