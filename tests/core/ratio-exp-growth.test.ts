import { describe, it, expect } from 'vitest';
import { generateRatio } from '../../src/core/generators/ratio';
import { generateExponents } from '../../src/core/generators/exponents';
import { generateGrowth } from '../../src/core/generators/growth';
import type { Difficulty } from '../../src/core/types';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

describe('ratio generator', () => {
  for (const diff of DIFFICULTIES) {
    describe(`difficulty: ${diff}`, () => {
      it('generates valid price-per-item questions', () => {
        let count = 0;
        let attempts = 0;
        while (count < 20 && attempts < 200) {
          attempts++;
          const q = generateRatio(diff);
          if (q.subcategory !== 'price-per-item') continue;
          count++;
          const { total, count: itemCount } = q.problemData as { total: number; count: number };
          expect(Math.abs(q.trueAnswer - total / itemCount)).toBeLessThan(0.01);
          expect(q.category).toBe('ratio');
          expect(q.heuristicText.length).toBeGreaterThan(0);
        }
        expect(count).toBe(20);
      });

      it('generates valid speed-distance-time questions', () => {
        let count = 0;
        let attempts = 0;
        while (count < 20 && attempts < 200) {
          attempts++;
          const q = generateRatio(diff);
          if (q.subcategory !== 'speed-distance-time') continue;
          count++;
          const { speed, minutes } = q.problemData as { speed: number; minutes: number };
          expect(Math.abs(q.trueAnswer - (speed * minutes) / 60)).toBeLessThan(0.1);
          expect(q.category).toBe('ratio');
          expect(q.heuristicText.length).toBeGreaterThan(0);
        }
        expect(count).toBe(20);
      });
    });
  }
});

describe('exponents generator', () => {
  for (const diff of DIFFICULTIES) {
    it(`generates 20 valid questions at difficulty: ${diff}`, () => {
      for (let i = 0; i < 20; i++) {
        const q = generateExponents(diff);
        expect(q.category).toBe('exponent');
        expect(q.heuristicText.length).toBeGreaterThan(0);

        const { n, operation } = q.problemData as { n: number; operation: string };

        if (operation === 'square') {
          expect(q.trueAnswer).toBe(n * n);
        } else if (operation === 'cube') {
          expect(q.trueAnswer).toBe(n * n * n);
        } else if (operation === 'sqrt') {
          expect(q.trueAnswer).toBe(Math.sqrt(n));
          expect(Number.isInteger(q.trueAnswer)).toBe(true);
        }
      }
    });
  }
});

describe('growth generator', () => {
  for (const diff of DIFFICULTIES) {
    it(`generates 20 valid questions at difficulty: ${diff}`, () => {
      for (let i = 0; i < 20; i++) {
        const q = generateGrowth(diff);
        expect(q.category).toBe('growth');
        expect(q.subcategory).toBe('compound-growth');
        expect(q.heuristicText.length).toBeGreaterThan(0);

        const { principal, rate, years } = q.problemData as {
          principal: number;
          rate: number;
          years: number;
        };

        const expected = principal * Math.pow(1 + rate / 100, years);
        expect(Math.abs(q.trueAnswer - expected)).toBeLessThan(1.0);
        expect(q.trueAnswer).toBeGreaterThan(principal);
      }
    });
  }
});
