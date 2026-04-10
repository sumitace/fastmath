import { describe, it, expect } from 'vitest';
import { formatQuestion, formatFeedback, formatSummary } from '../../src/cli/display';
import { AttemptResult, SessionSummary, Zone } from '../../src/core/types';

function makeAttempt(zone: Zone, direction: 'high' | 'low' | 'exact', relError: number): AttemptResult {
  return {
    question: {
      category: 'percentage', subcategory: 'tip', difficulty: 'medium',
      prompt: '17% of 84.50 = ?', trueAnswer: 14.37,
      problemData: {}, heuristicText: 'Move decimal',
    },
    userAnswer: direction === 'high' ? 15 : direction === 'low' ? 13 : 14.37,
    absoluteError: Math.abs(14.37 - (direction === 'exact' ? 14.37 : direction === 'high' ? 15 : 13)),
    relativeError: relError, errorDirection: direction,
    zone, points: zone === 'bullseye' ? 100 : zone === 'green' ? 80 : zone === 'yellow' ? 60 : zone === 'orange' ? 40 : 10,
    responseTimeMs: 1200, presentedAt: new Date(), answeredAt: new Date(),
  };
}

function makeSummary(): SessionSummary {
  return {
    totalQuestions: 10, totalScore: 750, averageRelativeError: 0.08,
    bullseyeCount: 3, greenCount: 4, yellowCount: 2, orangeCount: 1, redCount: 0,
    greenOrBetterRate: 0.7, insight: 'Strong session.', attempts: [],
  };
}

describe('formatQuestion', () => {
  it('contains Q number, time, prompt, and ends with "> "', () => {
    const result = formatQuestion(7, 41, '17% of 84.50 = ?');
    expect(result).toContain('Q7');
    expect(result).toContain('0:41');
    expect(result).toContain('17% of 84.50');
    expect(result.endsWith('> ')).toBe(true);
  });

  it('formats 125 seconds as 2:05', () => {
    expect(formatQuestion(3, 125, 'test')).toContain('2:05');
  });

  it('formats 60 seconds as 1:00', () => {
    expect(formatQuestion(1, 60, 'x')).toContain('1:00');
  });

  it('formats 7 seconds as 0:07', () => {
    expect(formatQuestion(5, 7, 'x')).toContain('0:07');
  });
});

describe('formatFeedback', () => {
  it('bullseye exact: contains BULLSEYE, trueAnswer, "exactly right", heuristicText', () => {
    const result = formatFeedback(makeAttempt('bullseye', 'exact', 0));
    expect(result).toContain('BULLSEYE');
    expect(result).toContain('14.37');
    expect(result).toContain('exactly right');
    expect(result).toContain('Move decimal');
  });

  it('green high: contains GREEN, high, 4.4%', () => {
    const result = formatFeedback(makeAttempt('green', 'high', 0.044));
    expect(result).toContain('GREEN');
    expect(result).toContain('high');
    expect(result).toContain('4.4%');
  });

  it('red low: contains RED and low', () => {
    const result = formatFeedback(makeAttempt('red', 'low', 0.35));
    expect(result).toContain('RED');
    expect(result).toContain('low');
  });

  it('contains ANSI escape character for color', () => {
    const result = formatFeedback(makeAttempt('green', 'high', 0.05));
    expect(result).toContain('\x1b');
  });
});

describe('formatSummary', () => {
  it('contains SESSION COMPLETE, score, questions, green-or-better rate, and insight', () => {
    const result = formatSummary(makeSummary(), 120);
    expect(result).toContain('SESSION COMPLETE');
    expect(result).toContain('750');
    expect(result).toContain('10');
    expect(result).toContain('70%');
    expect(result).toContain('Strong session');
  });

  it('formats 120 seconds as 2:00', () => {
    expect(formatSummary(makeSummary(), 120)).toContain('2:00');
  });
});

describe('return types', () => {
  it('all format* functions return strings', () => {
    expect(typeof formatQuestion(1, 30, 'x')).toBe('string');
    expect(typeof formatFeedback(makeAttempt('green', 'high', 0.05))).toBe('string');
    expect(typeof formatSummary(makeSummary(), 60)).toBe('string');
  });
});
