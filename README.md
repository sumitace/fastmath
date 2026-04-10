# fastmath

A 2-minute daily terminal trainer for numerical intuition. Answer estimation questions as accurately as you can before the clock runs out. Each session is saved to a local SQLite database.

## How it works

Each round presents a randomly selected question from seven categories:

| Category | Examples |
|---|---|
| Percentage | 15% tip on $84.50, $120 + 17% tax |
| Arithmetic | 79 + 43, 152 − 67 |
| Multiplication | 23 × 7, 14 × 18 |
| Division | 152 ÷ 9, 84 ÷ 6 |
| Ratio | 6 items for $84 → cost per item? At 55 mph for 20 min, how many miles? |
| Exponent | 17², √169, 6³ |
| Growth | $5000 at 7%/yr for 5 years → final value? |

Your answer is scored by relative error and placed in a zone:

| Zone | Relative error | Points |
|---|---|---|
| BULLSEYE | ≤ 5% | 100 |
| GREEN | ≤ 10% | 80 |
| YELLOW | ≤ 20% | 60 |
| ORANGE | ≤ 30% | 40 |
| RED | > 30% | 10 |

After 2 minutes, you get a zone breakdown, green-or-better rate, average error, and a personalized insight based on your session.

## Setup

### With the dev container (recommended)

Requires Docker.

```bash
./dev up    # build image, start container, install deps
./dev play  # start a game session
```

On first run, initialize the database from inside the container:

```bash
./dev shell
npm run db:push
```

Other dev commands:

```bash
./dev nvim src/cli/gameloop.ts   # open a file in Neovim
./dev claude                     # run Claude Code inside the container
./dev down                       # stop the container
./dev clean                      # stop + wipe volumes (full reset)
```

### Without the container

Requires Node 20+ and a `DATABASE_URL` environment variable pointing to a SQLite file.

```bash
export DATABASE_URL="file:./fastmath.db"
npm install
npm run db:push   # create the database
npm start         # play
```

## Running tests

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```

## Database

Sessions and per-question attempts are stored in a local SQLite file via Prisma. The schema lives in `prisma/schema.prisma`. To reset the database, delete the `.db` file and re-run `npm run db:push`.
