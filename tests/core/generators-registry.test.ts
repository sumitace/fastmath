import { generateQuestion, GENERATORS, pickGenerator } from '../../src/core/generators';

describe('generator registry', () => {
  it('generateQuestion returns valid Question shape 100 times without throwing', () => {
    for (let i = 0; i < 100; i++) {
      const q = generateQuestion('medium');
      expect(typeof q.prompt).toBe('string');
      expect(q.prompt.length).toBeGreaterThan(0);
      expect(typeof q.trueAnswer).toBe('number');
      expect(isFinite(q.trueAnswer)).toBe(true);
      expect(typeof q.category).toBe('string');
      expect(typeof q.heuristicText).toBe('string');
    }
  });

  it('GENERATORS has 7 entries with correct categories', () => {
    expect(GENERATORS).toHaveLength(7);
    const categories = GENERATORS.map(g => g.category);
    expect(categories).toContain('percentage');
    expect(categories).toContain('arithmetic');
    expect(categories).toContain('multiplication');
    expect(categories).toContain('division');
    expect(categories).toContain('ratio');
    expect(categories).toContain('exponent');
    expect(categories).toContain('growth');
  });

  it('total weight is 100', () => {
    const total = GENERATORS.reduce((sum, g) => sum + g.weight, 0);
    expect(total).toBe(100);
  });

  it('pickGenerator always returns a valid entry', () => {
    for (let i = 0; i < 50; i++) {
      const entry = pickGenerator();
      expect(entry.category).toBeTruthy();
      expect(typeof entry.module.generate).toBe('function');
    }
  });

  it('all difficulties work', () => {
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const q = generateQuestion(diff);
      expect(q).toBeTruthy();
    }
  });
});
