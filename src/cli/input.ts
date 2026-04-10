import * as readline from 'readline';

export function createInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function promptNumericAnswer(
  rl: readline.Interface,
  promptStr: string,
): Promise<number> {
  return new Promise((resolve, reject) => {
    rl.question(promptStr, (answer) => {
      const trimmed = answer.trim();
      const parsed = parseFloat(trimmed);
      if (isNaN(parsed) || !isFinite(parsed)) {
        reject(new Error(`"${trimmed}" is not a number`));
      } else {
        resolve(parsed);
      }
    });
  });
}

export function closeInterface(rl: readline.Interface): void {
  rl.close();
}
