import { describe, it, expect } from 'vitest';
import { generateMultiplication } from '../../src/core/generators/multiplication';
import { generateDivision } from '../../src/core/generators/division';

describe('Multiplication generator', () => {
  const difficulties = ['easy', 'medium', 'hard'] as const;

  for (const difficulty of difficulties) {
    describe(`difficulty: ${difficulty}`, () => {
      const questions = Array.from({ length: 30 }, () => generateMultiplication(difficulty));

      it('computes correct answer', () => {
        for (const q of questions) {
          const { a, b } = q.problemData as { a: number; b: number };
          expect(q.trueAnswer).toBe(a * b);
        }
      });

      it('prompt contains × symbol', () => {
        for (const q of questions) {
          expect(q.prompt).toContain('×');
        }
      });

      it('category is multiplication', () => {
        for (const q of questions) {
          expect(q.category).toBe('multiplication');
        }
      });

      it('heuristicText is non-empty', () => {
        for (const q of questions) {
          expect(q.heuristicText.length).toBeGreaterThan(0);
        }
      });

      if (difficulty === 'easy') {
        it('both operands are in [2..9]', () => {
          for (const q of questions) {
            const { a, b } = q.problemData as { a: number; b: number };
            expect(a).toBeGreaterThanOrEqual(2);
            expect(a).toBeLessThanOrEqual(9);
            expect(b).toBeGreaterThanOrEqual(2);
            expect(b).toBeLessThanOrEqual(9);
          }
        });
      }
    });
  }
});

describe('Division generator', () => {
  const difficulties = ['easy', 'medium', 'hard'] as const;

  for (const difficulty of difficulties) {
    describe(`difficulty: ${difficulty}`, () => {
      const questions = Array.from({ length: 30 }, () => generateDivision(difficulty));

      it('answer is close to dividend / divisor', () => {
        // easy: exact integer; medium: rounded to 1 decimal (max error 0.05); hard: 2 decimals (max error 0.005)
        const tolerance = difficulty === 'medium' ? 0.06 : 0.01;
        for (const q of questions) {
          const { dividend, divisor } = q.problemData as { dividend: number; divisor: number };
          expect(Math.abs(q.trueAnswer - dividend / divisor)).toBeLessThan(tolerance);
        }
      });

      it('prompt contains ÷ symbol', () => {
        for (const q of questions) {
          expect(q.prompt).toContain('÷');
        }
      });

      it('category is division', () => {
        for (const q of questions) {
          expect(q.category).toBe('division');
        }
      });

      it('heuristicText is non-empty', () => {
        for (const q of questions) {
          expect(q.heuristicText.length).toBeGreaterThan(0);
        }
      });

      it('divisor and dividend are positive', () => {
        for (const q of questions) {
          const { dividend, divisor } = q.problemData as { dividend: number; divisor: number };
          expect(divisor).toBeGreaterThan(0);
          expect(dividend).toBeGreaterThan(0);
        }
      });

      if (difficulty === 'easy') {
        it('result is an integer', () => {
          for (const q of questions) {
            expect(q.trueAnswer).toBe(Math.round(q.trueAnswer));
          }
        });
      }
    });
  }
});
