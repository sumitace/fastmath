import { AttemptResult, SessionSummary } from '../core/types';
import { ZONE_COLORS, RESET, BOLD, ZONE_TABLE } from '../core/zones';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatQuestion(questionNumber: number, secondsLeft: number, prompt: string): string {
  return `Q${questionNumber} | ${formatTime(secondsLeft)} left\n${prompt}\n> `;
}

export function formatFeedback(attempt: AttemptResult): string {
  const label = ZONE_TABLE.find(z => z.zone === attempt.zone)?.label ?? attempt.zone.toUpperCase();
  const colored = ZONE_COLORS[attempt.zone] + BOLD + label + RESET;
  const pct = (attempt.relativeError * 100).toFixed(1);
  const direction = attempt.errorDirection === 'exact' ? 'exactly right' : attempt.errorDirection;
  return (
    `\n  [${colored}]\n` +
    `  Correct: ${attempt.question.trueAnswer.toFixed(2)}  |  Your answer: ${attempt.userAnswer.toFixed(2)}  |  ${pct}% ${direction}\n` +
    `  Hint: ${attempt.question.heuristicText}\n`
  );
}

export function formatSummary(summary: SessionSummary, durationSeconds: number): string {
  return (
    `\n=== SESSION COMPLETE ===\n` +
    `Duration: ${formatTime(durationSeconds)}\n` +
    `Questions: ${summary.totalQuestions}\n` +
    `Score: ${summary.totalScore}\n` +
    `\nZone breakdown:\n` +
    `  Bullseye: ${summary.bullseyeCount}\n` +
    `  Green:    ${summary.greenCount}\n` +
    `  Yellow:   ${summary.yellowCount}\n` +
    `  Orange:   ${summary.orangeCount}\n` +
    `  Red:      ${summary.redCount}\n` +
    `\nGreen-or-better: ${Math.round(summary.greenOrBetterRate * 100)}%\n` +
    `Avg error:       ${(summary.averageRelativeError * 100).toFixed(1)}%\n` +
    `\n  ${summary.insight}\n`
  );
}

export function printQuestion(questionNumber: number, secondsLeft: number, prompt: string): void {
  process.stdout.write(formatQuestion(questionNumber, secondsLeft, prompt));
}

export function printFeedback(attempt: AttemptResult): void {
  process.stdout.write(formatFeedback(attempt));
}

export function printSummary(summary: SessionSummary, durationSeconds: number): void {
  process.stdout.write(formatSummary(summary, durationSeconds));
}
