import { Question, Difficulty } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const HEURISTICS: Record<string, Record<Difficulty, string>> = {
  addition: {
    easy: 'Count up from the larger number',
    medium: 'Round both to nearest 10, add, then adjust',
    hard: 'Add hundreds first, then tens, then units',
  },
  subtraction: {
    easy: 'Count up from the smaller to the larger',
    medium: 'Round the subtrahend to nearest 10, subtract, then adjust',
    hard: 'What gets you to the next round hundred? Work from there.',
  },
};

const RANGES: Record<Difficulty, [number, number]> = {
  easy: [1, 9],
  medium: [10, 99],
  hard: [100, 999],
};

export function generateArithmetic(difficulty: Difficulty = 'medium'): Question {
  const subcategory = Math.random() < 0.5 ? 'addition' : 'subtraction';
  const [min, max] = RANGES[difficulty];
  const a = randomInt(min, max);
  const b = randomInt(min, max);
  const isAddition = subcategory === 'addition';
  const prompt = isAddition ? `${a} + ${b} = ?` : `${a} - ${b} = ?`;
  const trueAnswer = isAddition ? a + b : a - b;

  return {
    category: 'arithmetic',
    subcategory,
    difficulty,
    prompt,
    trueAnswer,
    problemData: { a, b, subcategory },
    heuristicText: HEURISTICS[subcategory][difficulty],
  };
}

export const arithmeticModule = { generate: generateArithmetic };
