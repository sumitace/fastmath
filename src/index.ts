import { runGameLoop } from './cli/gameloop';

async function main(): Promise<void> {
  process.stdout.write('\nFastmath — 2-minute numerical intuition trainer\n');
  process.stdout.write('Answer as accurately as you can. Timer starts now.\n\n');
  await runGameLoop('medium');
  process.stdout.write('\nGoodbye!\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
