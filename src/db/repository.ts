import { getClient } from './client';
import { AttemptResult, SessionSummary } from '../core/types';

export async function saveSession(
  summary: SessionSummary,
  startTime: Date,
  endTime: Date,
  timeLimitSeconds: number = 120,
): Promise<number> {
  const client = getClient();
  const session = await client.session.create({
    data: {
      session_type: 'standard',
      start_time: startTime,
      end_time: endTime,
      time_limit_seconds: timeLimitSeconds,
      questions_answered: summary.totalQuestions,
      total_score: summary.totalScore,
      average_relative_error: summary.averageRelativeError,
      bullseye_count: summary.bullseyeCount,
      green_count: summary.greenCount,
      yellow_count: summary.yellowCount,
      orange_count: summary.orangeCount,
      red_count: summary.redCount,
    },
  });
  return session.id;
}

export async function saveAttempt(
  sessionId: number,
  questionIndex: number,
  attempt: AttemptResult,
): Promise<void> {
  const client = getClient();
  await client.attempt.create({
    data: {
      session_id: sessionId,
      question_index: questionIndex,
      category: attempt.question.category,
      subcategory: attempt.question.subcategory,
      difficulty: attempt.question.difficulty,
      prompt_text: attempt.question.prompt,
      problem_data_json: JSON.stringify(attempt.question.problemData),
      true_answer: attempt.question.trueAnswer,
      user_answer: attempt.userAnswer,
      absolute_error: attempt.absoluteError,
      relative_error: attempt.relativeError,
      error_direction: attempt.errorDirection,
      zone: attempt.zone,
      points: attempt.points,
      heuristic_text: attempt.question.heuristicText,
      response_time_ms: attempt.responseTimeMs,
      presented_at: attempt.presentedAt,
      answered_at: attempt.answeredAt,
    },
  });
}

export async function saveFullSession(
  summary: SessionSummary,
  startTime: Date,
  endTime: Date,
  timeLimitSeconds?: number,
): Promise<number> {
  const sessionId = await saveSession(summary, startTime, endTime, timeLimitSeconds);
  await Promise.all(summary.attempts.map((attempt, i) => saveAttempt(sessionId, i, attempt)));
  return sessionId;
}
