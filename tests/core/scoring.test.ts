import { computeRelativeError, classifyZone, pointsForZone, scoreAttempt } from '../../src/core/scoring';
import type { Question } from '../../src/core/types';

const mockQuestion: Question = {
  category: 'arithmetic',
  subcategory: 'addition',
  difficulty: 'easy',
  prompt: 'What is 100 + 50?',
  trueAnswer: 150,
  problemData: {},
  heuristicText: 'Round to nearest hundred',
};

describe('computeRelativeError', () => {
  it('computes relative error for normal values', () => {
    expect(computeRelativeError(15, 14.37)).toBeCloseTo(0.0438, 3);
  });

  it('returns 0 when both user and true answer are 0', () => {
    expect(computeRelativeError(0, 0)).toBe(0);
  });

  it('returns Infinity when true answer is 0 but user answer is not', () => {
    expect(computeRelativeError(5, 0)).toBe(Infinity);
  });

  it('returns 0 when user and true answer match exactly', () => {
    expect(computeRelativeError(100, 100)).toBe(0);
  });
});

describe('classifyZone', () => {
  it('classifies 0 as bullseye', () => {
    expect(classifyZone(0)).toBe('bullseye');
  });

  it('classifies 0.05 as bullseye (inclusive boundary)', () => {
    expect(classifyZone(0.05)).toBe('bullseye');
  });

  it('classifies 0.051 as green', () => {
    expect(classifyZone(0.051)).toBe('green');
  });

  it('classifies 0.10 as green (inclusive boundary)', () => {
    expect(classifyZone(0.10)).toBe('green');
  });

  it('classifies 0.101 as yellow', () => {
    expect(classifyZone(0.101)).toBe('yellow');
  });

  it('classifies 0.20 as yellow (inclusive boundary)', () => {
    expect(classifyZone(0.20)).toBe('yellow');
  });

  it('classifies 0.201 as orange', () => {
    expect(classifyZone(0.201)).toBe('orange');
  });

  it('classifies 0.30 as orange (inclusive boundary)', () => {
    expect(classifyZone(0.30)).toBe('orange');
  });

  it('classifies 0.301 as red', () => {
    expect(classifyZone(0.301)).toBe('red');
  });

  it('classifies Infinity as red', () => {
    expect(classifyZone(Infinity)).toBe('red');
  });
});

describe('pointsForZone', () => {
  it('returns 100 for bullseye', () => {
    expect(pointsForZone('bullseye')).toBe(100);
  });

  it('returns 80 for green', () => {
    expect(pointsForZone('green')).toBe(80);
  });

  it('returns 60 for yellow', () => {
    expect(pointsForZone('yellow')).toBe(60);
  });

  it('returns 40 for orange', () => {
    expect(pointsForZone('orange')).toBe(40);
  });

  it('returns 10 for red', () => {
    expect(pointsForZone('red')).toBe(10);
  });
});

describe('scoreAttempt', () => {
  it('scores an attempt slightly above trueAnswer correctly', () => {
    const presentedAt = new Date('2024-01-01T10:00:00.000Z');
    const answeredAt = new Date('2024-01-01T10:00:05.000Z');
    const userAnswer = 155;

    const result = scoreAttempt(mockQuestion, userAnswer, presentedAt, answeredAt);

    expect(result.userAnswer).toBe(155);
    expect(result.absoluteError).toBeCloseTo(5, 5);
    expect(result.relativeError).toBeCloseTo(0.0333, 3);
    expect(result.zone).toBe('bullseye');
    expect(result.points).toBe(100);
    expect(result.errorDirection).toBe('high');
    expect(result.responseTimeMs).toBe(5000);
    expect(result.presentedAt).toBe(presentedAt);
    expect(result.answeredAt).toBe(answeredAt);
  });

  it('scores exact match as bullseye with errorDirection exact', () => {
    const presentedAt = new Date('2024-01-01T10:00:00.000Z');
    const answeredAt = new Date('2024-01-01T10:00:03.000Z');
    const userAnswer = 150;

    const result = scoreAttempt(mockQuestion, userAnswer, presentedAt, answeredAt);

    expect(result.relativeError).toBe(0);
    expect(result.zone).toBe('bullseye');
    expect(result.points).toBe(100);
    expect(result.errorDirection).toBe('exact');
    expect(result.absoluteError).toBe(0);
  });

  it('scores a low guess correctly', () => {
    const presentedAt = new Date('2024-01-01T10:00:00.000Z');
    const answeredAt = new Date('2024-01-01T10:00:04.000Z');
    const userAnswer = 100;

    const result = scoreAttempt(mockQuestion, userAnswer, presentedAt, answeredAt);

    expect(result.errorDirection).toBe('low');
    expect(result.zone).toBe('red');
    expect(result.points).toBe(10);
    expect(result.absoluteError).toBeCloseTo(50, 5);
  });
});
