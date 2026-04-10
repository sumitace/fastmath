import { generateQuestion } from '../core/generators/index';
import { scoreAttempt } from '../core/scoring';
import { computeSessionSummary } from '../core/session';
import { printQuestion, printFeedback, printSummary } from './display';
import { createInterface, promptNumericAnswer, closeInterface } from './input';
import { saveFullSession } from '../db/repository';
import { disconnectClient } from '../db/client';
import { Difficulty, AttemptResult } from '../core/types';

const TIME_LIMIT_MS = 2 * 60 * 1000;

class TimeoutError extends Error {
  constructor() { super('Time is up'); }
}

function timeoutReject(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError()), Math.max(0, ms));
    // Unref so the timer doesn't keep the event loop alive if the race settles first
    if (typeof timer === 'object' && timer.unref) timer.unref();
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runGameLoop(difficulty: Difficulty = 'medium'): Promise<void> {
  const rl = createInterface();
  const startTime = new Date();
  const deadline = startTime.getTime() + TIME_LIMIT_MS;
  const attempts: AttemptResult[] = [];
  let questionIndex = 0;

  while (Date.now() < deadline) {
    const secondsLeft = Math.ceil((deadline - Date.now()) / 1000);
    if (secondsLeft <= 0) break;

    const question = generateQuestion(difficulty);
    const presentedAt = new Date();
    questionIndex++;

    printQuestion(questionIndex, secondsLeft, question.prompt);

    let userAnswer: number;
    try {
      userAnswer = await Promise.race([
        promptNumericAnswer(rl, ''),
        timeoutReject(deadline - Date.now()),
      ]);
    } catch (err: unknown) {
      if (err instanceof TimeoutError) break;
      process.stdout.write('  Please enter a number.\n\n');
      questionIndex--;
      continue;
    }

    const answeredAt = new Date();
    const attempt = scoreAttempt(question, userAnswer, presentedAt, answeredAt);
    attempts.push(attempt);

    printFeedback(attempt);
    await sleep(1200);
  }

  closeInterface(rl);

  const endTime = new Date();
  const durationSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
  const summary = computeSessionSummary(attempts);

  printSummary(summary, durationSeconds);

  if (attempts.length > 0) {
    await saveFullSession(summary, startTime, endTime, 120).catch((err: unknown) => {
      process.stderr.write(`Warning: session could not be saved: ${err instanceof Error ? err.message : String(err)}\n`);
    });
  }

  await disconnectClient();
}
