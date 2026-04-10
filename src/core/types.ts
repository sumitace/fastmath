export type Zone = 'bullseye' | 'green' | 'yellow' | 'orange' | 'red';

export type Category =
  | 'percentage'
  | 'arithmetic'
  | 'multiplication'
  | 'division'
  | 'ratio'
  | 'exponent'
  | 'growth';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  category: Category;
  subcategory: string;
  difficulty: Difficulty;
  prompt: string;
  trueAnswer: number;
  problemData: Record<string, unknown>;
  heuristicText: string;
}

export interface AttemptResult {
  question: Question;
  userAnswer: number;
  absoluteError: number;
  relativeError: number;
  errorDirection: 'high' | 'low' | 'exact';
  zone: Zone;
  points: number;
  responseTimeMs: number;
  presentedAt: Date;
  answeredAt: Date;
}

export interface ZoneScore {
  zone: Zone;
  points: number;
  label: string;
  maxRelativeError: number | null;
}

export interface SessionSummary {
  totalQuestions: number;
  totalScore: number;
  averageRelativeError: number;
  bullseyeCount: number;
  greenCount: number;
  yellowCount: number;
  orangeCount: number;
  redCount: number;
  greenOrBetterRate: number;
  insight: string;
  attempts: AttemptResult[];
}

export interface GeneratorModule {
  generate(difficulty?: Difficulty): Question;
}
