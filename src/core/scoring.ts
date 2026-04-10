import { Zone, AttemptResult, Question } from './types';
import { ZONE_TABLE } from './zones';

export function computeRelativeError(userAnswer: number, trueAnswer: number): number {
  if (trueAnswer === 0) {
    return userAnswer === 0 ? 0 : Infinity;
  }
  return Math.abs(userAnswer - trueAnswer) / Math.abs(trueAnswer);
}

export function classifyZone(relativeError: number): Zone {
  for (const entry of ZONE_TABLE) {
    if (entry.maxRelativeError !== null && relativeError <= entry.maxRelativeError) {
      return entry.zone;
    }
  }
  return 'red';
}

export function pointsForZone(zone: Zone): number {
  const entry = ZONE_TABLE.find((z) => z.zone === zone);
  if (!entry) throw new Error(`Unknown zone: ${zone}`);
  return entry.points;
}

export function scoreAttempt(
  question: Question,
  userAnswer: number,
  presentedAt: Date,
  answeredAt: Date,
): AttemptResult {
  const { trueAnswer } = question;
  const absoluteError = Math.abs(userAnswer - trueAnswer);
  const relativeError = computeRelativeError(userAnswer, trueAnswer);
  const zone = classifyZone(relativeError);
  const points = pointsForZone(zone);
  const responseTimeMs = answeredAt.getTime() - presentedAt.getTime();

  let errorDirection: 'high' | 'low' | 'exact';
  if (userAnswer === trueAnswer) {
    errorDirection = 'exact';
  } else if (userAnswer > trueAnswer) {
    errorDirection = 'high';
  } else {
    errorDirection = 'low';
  }

  return {
    question,
    userAnswer,
    absoluteError,
    relativeError,
    errorDirection,
    zone,
    points,
    responseTimeMs,
    presentedAt,
    answeredAt,
  };
}
