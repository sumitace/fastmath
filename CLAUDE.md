# CLAUDE.md

## Project overview

`fastmath` is a 2-minute terminal game that trains numerical intuition. It generates math questions, scores answers by relative error, and persists sessions to SQLite via Prisma.

Entry point: `src/index.ts` → `runGameLoop()` in `src/cli/gameloop.ts`.

## Project structure

```
src/
  index.ts                  # entry point
  cli/
    gameloop.ts             # main loop: generate → prompt → score → feedback → repeat
    display.ts              # pure formatting functions (formatQuestion, formatFeedback, formatSummary)
    input.ts                # readline wrapper (promptNumericAnswer returns Promise<number>)
  core/
    types.ts                # shared types: Question, AttemptResult, SessionSummary, Zone, etc.
    zones.ts                # ZONE_TABLE (thresholds + points) and ANSI color map
    scoring.ts              # computeRelativeError, classifyZone, scoreAttempt
    session.ts              # computeSessionSummary + insight generation
    hints.ts                # CATEGORY_HINTS fallback hints (not used in generators directly)
    utils.ts                # randomInt, randomFrom
    generators/
      index.ts              # GENERATORS registry + pickGenerator (weighted random) + generateQuestion
      arithmetic.ts         # addition / subtraction
      multiplication.ts     # integer multiplication
      division.ts           # integer and decimal division
      percentage.ts         # tip / tax / discount
      ratio.ts              # price-per-item / speed-distance-time
      exponents.ts          # squares / cubes / square roots
      growth.ts             # compound growth (Rule of 72)
      utils.ts              # randomInt (duplicated from core/utils — minor inconsistency)
  db/
    client.ts               # singleton PrismaClient
    repository.ts           # saveSession, saveAttempt, saveFullSession
prisma/
  schema.prisma             # Session and Attempt models (SQLite)
tests/                      # mirrors src/ structure
```

## Key conventions

- **Generators** all implement `GeneratorModule` (`{ generate(difficulty?): Question }`).
- **Scoring** is purely functional — `scoreAttempt` takes a `Question`, a user answer, and timestamps; returns a full `AttemptResult`.
- **DB errors are non-fatal** — `saveFullSession` is called with `.catch()` in `gameloop.ts`; a warning goes to stderr but the game continues.
- **Display functions are pure** — `formatQuestion`, `formatFeedback`, `formatSummary` return strings and are tested directly. `print*` wrappers write to stdout.

## Running and testing

```bash
npm start              # run the game
npm test               # run all 147 tests
npm run db:push        # create / sync the SQLite database
```

`DATABASE_URL` must be set before running (set automatically in the dev container; set it manually otherwise, e.g. `export DATABASE_URL="file:./fastmath.db"`).

## Adding a new question category

1. Create `src/core/generators/<category>.ts` implementing `GeneratorModule`.
2. Add the category literal to the `Category` union in `src/core/types.ts`.
3. Register it in `src/core/generators/index.ts` with a weight.
4. Add fallback hints to `src/core/hints.ts` under `CATEGORY_HINTS`.
5. Write tests in `tests/core/<category>.test.ts`.

## Test structure

Tests are in `tests/` and use Vitest. Key files:
- `tests/core/scoring.test.ts` — zone classification and point assignment
- `tests/core/session.test.ts` — summary computation and insight logic
- `tests/core/arithmetic.test.ts`, `mult-div.test.ts`, `percentage.test.ts`, `ratio-exp-growth.test.ts` — generator output validation
- `tests/core/generators-registry.test.ts` — weighted picker distribution
- `tests/cli/display.test.ts` — output formatting
- `tests/cli/gameloop.test.ts` — loop-level behavior (mocked I/O and timers)
