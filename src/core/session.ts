import { AttemptResult, SessionSummary, Zone, Category } from './types';

type ZoneCounts = Record<Zone, number>;

function generateInsight(
  attempts: AttemptResult[],
  counts: ZoneCounts,
  averageRelativeError: number,
  greenOrBetterRate: number,
): string {
  const totalQuestions = attempts.length;

  if (averageRelativeError < 0.05) {
    return 'Exceptional precision — nearly every answer landed within 5%.';
  }

  if (counts.bullseye / totalQuestions >= 0.5) {
    return "You're hitting bullseye on more than half your answers — elite intuition.";
  }

  const categories = [...new Set(attempts.map((a) => a.question.category))] as Category[];
  for (const category of categories) {
    const categoryAttempts = attempts.filter((a) => a.question.category === category);
    if (categoryAttempts.length >= 3) {
      const highCount = categoryAttempts.filter((a) => a.errorDirection === 'high').length;
      const lowCount = categoryAttempts.filter((a) => a.errorDirection === 'low').length;
      if (highCount >= 2 * lowCount && highCount > 0) {
        return `You consistently overshoot ${category} — try anchoring your estimate lower.`;
      }
      if (lowCount >= 2 * highCount && lowCount > 0) {
        return `You consistently undershoot ${category} — your estimates tend to be conservative.`;
      }
    }
  }

  if (counts.red / totalQuestions >= 0.4) {
    return 'High red-zone rate — focus on getting the order of magnitude right first.';
  }

  if (greenOrBetterRate >= 0.7) {
    return `Strong session — you hit green-or-better on ${Math.round(greenOrBetterRate * 100)}% of questions.`;
  }

  return 'Keep practicing — consistency builds numerical intuition.';
}

export function computeSessionSummary(attempts: AttemptResult[]): SessionSummary {
  if (attempts.length === 0) {
    return {
      totalQuestions: 0,
      totalScore: 0,
      averageRelativeError: 0,
      bullseyeCount: 0,
      greenCount: 0,
      yellowCount: 0,
      orangeCount: 0,
      redCount: 0,
      greenOrBetterRate: 0,
      insight: 'No questions answered.',
      attempts: [],
    };
  }

  const counts: ZoneCounts = { bullseye: 0, green: 0, yellow: 0, orange: 0, red: 0 };
  let totalScore = 0;
  let totalRelativeError = 0;

  for (const attempt of attempts) {
    counts[attempt.zone]++;
    totalScore += attempt.points;
    totalRelativeError += attempt.relativeError;
  }

  const totalQuestions = attempts.length;
  const averageRelativeError = totalRelativeError / totalQuestions;
  const greenOrBetterRate = (counts.bullseye + counts.green) / totalQuestions;
  const insight = generateInsight(attempts, counts, averageRelativeError, greenOrBetterRate);

  return {
    totalQuestions,
    totalScore,
    averageRelativeError,
    bullseyeCount: counts.bullseye,
    greenCount: counts.green,
    yellowCount: counts.yellow,
    orangeCount: counts.orange,
    redCount: counts.red,
    greenOrBetterRate,
    insight,
    attempts,
  };
}
