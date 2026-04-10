import { Question, Difficulty } from '../types';
import { randomInt, randomFrom } from '../utils';

const PERFECT_SQUARES = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];

function generateSquare(minBase: number, maxBase: number, difficulty: Difficulty): Question {
  const n = randomInt(minBase, maxBase);
  return {
    category: 'exponent',
    subcategory: 'squares',
    difficulty,
    prompt: `${n}² = ?`,
    trueAnswer: n * n,
    problemData: { n, operation: 'square' },
    heuristicText: '(n±k)² = n² ± 2nk + k². Build from nearest easy square.',
  };
}

function generateCube(difficulty: Difficulty): Question {
  const n = randomInt(2, 9);
  return {
    category: 'exponent',
    subcategory: 'cubes',
    difficulty,
    prompt: `${n}³ = ?`,
    trueAnswer: n * n * n,
    problemData: { n, operation: 'cube' },
    heuristicText: 'n³ = n² × n. Know your squares first.',
  };
}

function generateSqrt(difficulty: Difficulty): Question {
  const n = randomFrom(PERFECT_SQUARES);
  return {
    category: 'exponent',
    subcategory: 'square-roots',
    difficulty,
    prompt: `√${n} = ?`,
    trueAnswer: Math.sqrt(n),
    problemData: { n, operation: 'sqrt' },
    heuristicText: 'Bracket between known perfect squares. √n is between √a and √b.',
  };
}

export function generateExponents(difficulty: Difficulty = 'medium'): Question {
  if (difficulty === 'easy') {
    return generateSquare(2, 12, difficulty);
  } else if (difficulty === 'medium') {
    if (Math.random() < 0.5) {
      return generateSquare(13, 25, difficulty);
    }
    return generateSqrt(difficulty);
  } else {
    if (Math.random() < 0.5) {
      return generateCube(difficulty);
    }
    return generateSqrt(difficulty);
  }
}

export const exponentsModule = { generate: generateExponents };
