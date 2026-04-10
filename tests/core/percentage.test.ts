import { generatePercentage, percentageModule, round2 } from '../../src/core/generators/percentage';

const SUBCATEGORIES = ['tip', 'tax', 'discount'];
const EASY_PCTS = [10, 15, 20, 25];

describe('generatePercentage', () => {
  describe('bulk generation — all difficulties', () => {
    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      describe(`difficulty: ${difficulty}`, () => {
        const questions = Array.from({ length: 50 }, () => generatePercentage(difficulty));

        it('all questions have trueAnswer > 0', () => {
          for (const q of questions) {
            expect(q.trueAnswer).toBeGreaterThan(0);
          }
        });

        it('all questions have category === "percentage"', () => {
          for (const q of questions) {
            expect(q.category).toBe('percentage');
          }
        });

        it('all questions have non-empty heuristicText', () => {
          for (const q of questions) {
            expect(q.heuristicText.length).toBeGreaterThan(0);
          }
        });

        it('all questions have a valid subcategory', () => {
          for (const q of questions) {
            expect(SUBCATEGORIES).toContain(q.subcategory);
          }
        });

        it('all prompts contain "%"', () => {
          for (const q of questions) {
            expect(q.prompt).toContain('%');
          }
        });

        it('trueAnswer is always a finite number', () => {
          for (const q of questions) {
            expect(Number.isFinite(q.trueAnswer)).toBe(true);
          }
        });
      });
    }
  });

  describe('answer correctness from problemData', () => {
    it('tip answer matches formula', () => {
      let q = generatePercentage('medium');
      for (let i = 0; i < 200 && q.subcategory !== 'tip'; i++) {
        q = generatePercentage('medium');
      }
      if (q.subcategory !== 'tip') return; // skip if never hit (extremely unlikely)

      const { base, pct } = q.problemData as { base: number; pct: number };
      const expected = round2(base * pct / 100);
      expect(Math.abs(q.trueAnswer - expected)).toBeLessThan(0.01);
    });

    it('tax answer matches formula', () => {
      let q = generatePercentage('medium');
      for (let i = 0; i < 200 && q.subcategory !== 'tax'; i++) {
        q = generatePercentage('medium');
      }
      if (q.subcategory !== 'tax') return;

      const { base, pct } = q.problemData as { base: number; pct: number };
      const expected = round2(base + base * pct / 100);
      expect(Math.abs(q.trueAnswer - expected)).toBeLessThan(0.01);
    });

    it('discount answer matches formula', () => {
      let q = generatePercentage('medium');
      for (let i = 0; i < 200 && q.subcategory !== 'discount'; i++) {
        q = generatePercentage('medium');
      }
      if (q.subcategory !== 'discount') return;

      const { base, pct } = q.problemData as { base: number; pct: number };
      const expected = round2(base - base * pct / 100);
      expect(Math.abs(q.trueAnswer - expected)).toBeLessThan(0.01);
    });
  });

  describe('easy difficulty constraints', () => {
    const questions = Array.from({ length: 100 }, () => generatePercentage('easy'));

    it('pct is always one of [10, 15, 20, 25]', () => {
      for (const q of questions) {
        const { pct } = q.problemData as { pct: number };
        expect(EASY_PCTS).toContain(pct);
      }
    });

    it('base is always an integer', () => {
      for (const q of questions) {
        const { base } = q.problemData as { base: number };
        expect(Number.isInteger(base)).toBe(true);
      }
    });
  });

  describe('percentageModule', () => {
    it('generate function works the same as generatePercentage', () => {
      const q = percentageModule.generate('easy');
      expect(q.category).toBe('percentage');
      expect(SUBCATEGORIES).toContain(q.subcategory);
      expect(Number.isFinite(q.trueAnswer)).toBe(true);
    });

    it('defaults to medium difficulty', () => {
      const q = percentageModule.generate();
      expect(q.category).toBe('percentage');
    });
  });

  describe('heuristic text rules', () => {
    it('pct 10 gets decimal-move hint', () => {
      const q = generatePercentage('easy');
      const { pct } = q.problemData as { pct: number };
      if (pct % 10 === 0) {
        expect(q.heuristicText).toContain('decimal');
      }
    });

    it('generates questions covering all three subcategories within 300 attempts', () => {
      const seen = new Set<string>();
      for (let i = 0; i < 300 && seen.size < 3; i++) {
        seen.add(generatePercentage('medium').subcategory);
      }
      expect(seen.size).toBe(3);
    });
  });
});
