import { Question, Difficulty } from '../types';
import { randomFrom } from '../utils';

function generatePricePerItem(difficulty: Difficulty): Question {
  let count: number;
  let total: number;

  if (difficulty === 'easy') {
    count = randomFrom([2, 4, 5, 10]);
    total = randomFrom([10, 20, 40, 50, 80, 100]);
  } else if (difficulty === 'medium') {
    count = randomFrom([3, 6, 7, 8]);
    total = randomFrom([15, 21, 42, 56, 84, 96, 120]);
  } else {
    count = randomFrom([7, 9, 11, 13]);
    total = randomFrom([63, 99, 117, 143]);
  }

  const trueAnswer = Math.round((total / count) * 100) / 100;

  return {
    category: 'ratio',
    subcategory: 'price-per-item',
    difficulty,
    prompt: `${count} items cost $${total.toFixed(2)} total. Cost per item?`,
    trueAnswer,
    problemData: { type: 'price-per-item', count, total },
    heuristicText: 'Unit rate: total ÷ count. Round to estimate.',
  };
}

function generateSpeedDistanceTime(difficulty: Difficulty): Question {
  let speed: number;
  let minutes: number;

  if (difficulty === 'easy') {
    speed = randomFrom([30, 40, 60]);
    minutes = randomFrom([15, 20, 30, 60]);
  } else if (difficulty === 'medium') {
    speed = randomFrom([35, 45, 55, 65]);
    minutes = randomFrom([10, 20, 45]);
  } else {
    speed = randomFrom([37, 52, 68]);
    minutes = randomFrom([17, 23, 38]);
  }

  const trueAnswer = Math.round((speed * minutes / 60) * 10) / 10;

  return {
    category: 'ratio',
    subcategory: 'speed-distance-time',
    difficulty,
    prompt: `At ${speed} mph for ${minutes} minutes, how many miles?`,
    trueAnswer,
    problemData: { type: 'speed-distance-time', speed, minutes },
    heuristicText: 'Miles = mph × (minutes/60). Convert minutes to fraction of hour first.',
  };
}

export function generateRatio(difficulty: Difficulty = 'medium'): Question {
  if (Math.random() < 0.5) {
    return generatePricePerItem(difficulty);
  }
  return generateSpeedDistanceTime(difficulty);
}

export const ratioModule = { generate: generateRatio };
