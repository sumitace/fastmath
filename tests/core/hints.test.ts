import { CATEGORY_HINTS, getHintForCategory, getHintForQuestion } from '../../src/core/hints';
import type { Category } from '../../src/core/types';

const ALL_CATEGORIES = Object.keys(CATEGORY_HINTS) as Category[];

describe('getHintForCategory', () => {
  it('returns a non-empty string for all category values', () => {
    for (const category of ALL_CATEGORIES) {
      const hint = getHintForCategory(category);
      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(0);
    }
  });

  it('returns non-empty strings across 10 calls per category', () => {
    for (const category of ALL_CATEGORIES) {
      for (let i = 0; i < 10; i++) {
        const hint = getHintForCategory(category);
        expect(typeof hint).toBe('string');
        expect(hint.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('CATEGORY_HINTS', () => {
  it('has an entry for every category (7 keys)', () => {
    expect(Object.keys(CATEGORY_HINTS).length).toBe(7);
    for (const category of ALL_CATEGORIES) {
      expect(CATEGORY_HINTS[category]).toBeDefined();
    }
  });

  it('each category has at least 3 hints', () => {
    for (const category of ALL_CATEGORIES) {
      expect(CATEGORY_HINTS[category].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('all hints are non-empty strings', () => {
    for (const category of ALL_CATEGORIES) {
      for (const hint of CATEGORY_HINTS[category]) {
        expect(typeof hint).toBe('string');
        expect(hint.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('getHintForQuestion', () => {
  it('returns the questionHint when it is non-empty', () => {
    const result = getHintForQuestion('percentage', 'Move the decimal');
    expect(result).toBe('Move the decimal');
  });

  it('falls back to category hint when questionHint is empty string', () => {
    const result = getHintForQuestion('arithmetic', '');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('falls back to category hint when questionHint is whitespace only', () => {
    const result = getHintForQuestion('arithmetic', '   ');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
