import { describe, it, expect } from 'vitest';
import { generateArithmetic } from '../../src/core/generators/arithmetic';
import type { Difficulty } from '../../src/core/types';

const SAMPLE_COUNT = 30;

function generateMany(difficulty: Difficulty) {
  return Array.from({ length: SAMPLE_COUNT }, () => generateArithmetic(difficulty));
}

describe('generateArithmetic', () => {
  for (const difficulty of ['easy', 'medium', 'hard'] as Difficulty[]) {
    describe(`difficulty: ${difficulty}`, () => {
      const questions = generateMany(difficulty);

      it('produces the correct category', () => {
        for (const q of questions) {
          expect(q.category).toBe('arithmetic');
        }
      });

      it('produces a valid subcategory', () => {
        for (const q of questions) {
          expect(['addition', 'subtraction']).toContain(q.subcategory);
        }
      });

      it('computes the correct trueAnswer', () => {
        for (const q of questions) {
          const { a, b, subcategory } = q.problemData as { a: number; b: number; subcategory: string };
          const expected = subcategory === 'addition' ? a + b : a - b;
          expect(q.trueAnswer).toBe(expected);
        }
      });

      it('has a non-empty heuristicText', () => {
        for (const q of questions) {
          expect(q.heuristicText.length).toBeGreaterThan(0);
        }
      });

      it('prompt contains + or -', () => {
        for (const q of questions) {
          expect(q.prompt).toMatch(/[+-]/);
        }
      });

      it('trueAnswer is finite', () => {
        for (const q of questions) {
          expect(isFinite(q.trueAnswer)).toBe(true);
        }
      });

      const ranges: Record<Difficulty, [number, number]> = {
        easy: [1, 9],
        medium: [10, 99],
        hard: [100, 999],
      };

      it(`operands are integers in [${ranges[difficulty][0]}..${ranges[difficulty][1]}]`, () => {
        const [lo, hi] = ranges[difficulty];
        for (const q of questions) {
          const { a, b } = q.problemData as { a: number; b: number };
          expect(Number.isInteger(a)).toBe(true);
          expect(Number.isInteger(b)).toBe(true);
          expect(a).toBeGreaterThanOrEqual(lo);
          expect(a).toBeLessThanOrEqual(hi);
          expect(b).toBeGreaterThanOrEqual(lo);
          expect(b).toBeLessThanOrEqual(hi);
        }
      });
    });
  }
});
