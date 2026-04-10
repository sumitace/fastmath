import { describe, it, expect } from 'vitest';
import { computeSessionSummary } from '../../src/core/session';
import { AttemptResult } from '../../src/core/types';

function makeAttempt(overrides: Partial<AttemptResult> = {}): AttemptResult {
  const defaultQ = {
    category: 'arithmetic' as const,
    subcategory: 'addition',
    difficulty: 'medium' as const,
    prompt: '5+3=?',
    trueAnswer: 8,
    problemData: {},
    heuristicText: 'count up',
  };
  return {
    question: defaultQ,
    userAnswer: 8,
    absoluteError: 0,
    relativeError: 0,
    errorDirection: 'exact' as const,
    zone: 'bullseye' as const,
    points: 100,
    responseTimeMs: 1000,
    presentedAt: new Date(),
    answeredAt: new Date(),
    ...overrides,
  };
}

describe('computeSessionSummary', () => {
  it('empty array returns summary with all zeros and non-empty insight', () => {
    const summary = computeSessionSummary([]);
    expect(summary.totalQuestions).toBe(0);
    expect(summary.totalScore).toBe(0);
    expect(summary.averageRelativeError).toBe(0);
    expect(summary.bullseyeCount).toBe(0);
    expect(summary.greenCount).toBe(0);
    expect(summary.yellowCount).toBe(0);
    expect(summary.orangeCount).toBe(0);
    expect(summary.redCount).toBe(0);
    expect(summary.greenOrBetterRate).toBe(0);
    expect(typeof summary.insight).toBe('string');
    expect(summary.insight.length).toBeGreaterThan(0);
  });

  it('five bullseye attempts → totalScore 500, bullseyeCount 5, greenOrBetterRate 1.0', () => {
    const attempts = Array.from({ length: 5 }, () =>
      makeAttempt({ zone: 'bullseye', points: 100 }),
    );
    const summary = computeSessionSummary(attempts);
    expect(summary.totalScore).toBe(500);
    expect(summary.bullseyeCount).toBe(5);
    expect(summary.greenOrBetterRate).toBe(1.0);
  });

  it('mixed zones → correct zone counts, greenOrBetterRate 0.4, totalScore 290', () => {
    const attempts = [
      makeAttempt({ zone: 'bullseye', points: 100 }),
      makeAttempt({ zone: 'green', points: 80 }),
      makeAttempt({ zone: 'yellow', points: 60 }),
      makeAttempt({ zone: 'orange', points: 40 }),
      makeAttempt({ zone: 'red', points: 10 }),
    ];
    const summary = computeSessionSummary(attempts);
    expect(summary.bullseyeCount).toBe(1);
    expect(summary.greenCount).toBe(1);
    expect(summary.yellowCount).toBe(1);
    expect(summary.orangeCount).toBe(1);
    expect(summary.redCount).toBe(1);
    expect(summary.greenOrBetterRate).toBe(0.4);
    expect(summary.totalScore).toBe(290);
  });

  it('averageRelativeError is correctly computed', () => {
    const attempts = [
      makeAttempt({ relativeError: 0.1 }),
      makeAttempt({ relativeError: 0.2 }),
      makeAttempt({ relativeError: 0.3 }),
    ];
    const summary = computeSessionSummary(attempts);
    expect(summary.averageRelativeError).toBeCloseTo(0.2, 5);
  });

  it('category bias high → insight mentions "percentage" and "overshoot"', () => {
    const attempts = Array.from({ length: 4 }, () =>
      makeAttempt({
        question: {
          category: 'percentage' as const,
          subcategory: 'of',
          difficulty: 'medium' as const,
          prompt: '10% of 200?',
          trueAnswer: 20,
          problemData: {},
          heuristicText: 'move decimal',
        },
        errorDirection: 'high' as const,
        zone: 'yellow' as const,
        relativeError: 0.2,
      }),
    );
    const summary = computeSessionSummary(attempts);
    expect(summary.insight).toContain('percentage');
    expect(summary.insight).toContain('overshoot');
  });

  it('category bias low → insight mentions "division" and "undershoot"', () => {
    const attempts = Array.from({ length: 4 }, () =>
      makeAttempt({
        question: {
          category: 'division' as const,
          subcategory: 'simple',
          difficulty: 'medium' as const,
          prompt: '100/4=?',
          trueAnswer: 25,
          problemData: {},
          heuristicText: 'halve twice',
        },
        errorDirection: 'low' as const,
        zone: 'yellow' as const,
        relativeError: 0.2,
      }),
    );
    const summary = computeSessionSummary(attempts);
    expect(summary.insight).toContain('division');
    expect(summary.insight).toContain('undershoot');
  });

  it('high red rate → insight mentions "red-zone" or "order of magnitude"', () => {
    const attempts = Array.from({ length: 5 }, () =>
      makeAttempt({ zone: 'red', points: 10, relativeError: 0.6 }),
    );
    const summary = computeSessionSummary(attempts);
    expect(
      summary.insight.includes('red-zone') || summary.insight.includes('order of magnitude'),
    ).toBe(true);
  });

  it('bullseye rate >= 50% → insight mentions "bullseye"', () => {
    const attempts = [
      makeAttempt({ zone: 'bullseye', relativeError: 0.1 }),
      makeAttempt({ zone: 'bullseye', relativeError: 0.1 }),
      makeAttempt({ zone: 'bullseye', relativeError: 0.1 }),
      makeAttempt({ zone: 'green', relativeError: 0.1 }),
      makeAttempt({ zone: 'red', relativeError: 0.1 }),
    ];
    const summary = computeSessionSummary(attempts);
    expect(summary.insight).toContain('bullseye');
  });

  it('greenOrBetterRate is always between 0 and 1 inclusive', () => {
    const allGreen = Array.from({ length: 5 }, () => makeAttempt({ zone: 'green' }));
    const allRed = Array.from({ length: 5 }, () => makeAttempt({ zone: 'red' }));
    const mixed = [makeAttempt({ zone: 'bullseye' }), makeAttempt({ zone: 'red' })];

    for (const attempts of [allGreen, allRed, mixed]) {
      const summary = computeSessionSummary(attempts);
      expect(summary.greenOrBetterRate).toBeGreaterThanOrEqual(0);
      expect(summary.greenOrBetterRate).toBeLessThanOrEqual(1);
    }
  });

  it('totalQuestions equals attempts.length', () => {
    const sizes = [1, 3, 7, 10];
    for (const size of sizes) {
      const attempts = Array.from({ length: size }, () => makeAttempt());
      const summary = computeSessionSummary(attempts);
      expect(summary.totalQuestions).toBe(size);
    }
  });
});
