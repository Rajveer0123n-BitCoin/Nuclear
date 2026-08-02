export type DifficultyId = 'easy' | 'medium' | 'hard' | 'extreme';

export interface DifficultyConfig {
  id: DifficultyId;
  name: string;
  min: number;
  max: number;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  optimalGuesses: number; // Binary search theoretical max
}

export type FeedbackType = 'higher' | 'lower' | 'correct' | null;

export interface GuessEntry {
  id: string;
  guessNumber: number;
  feedback: 'higher' | 'lower' | 'correct';
  timestamp: number;
  minBoundAtTime: number;
  maxBoundAtTime: number;
}

export type PerformanceRating = 'Excellent' | 'Great' | 'Good' | 'Average';

export interface RatingDetail {
  rating: PerformanceRating;
  stars: number;
  message: string;
  color: string;
  bgColor: string;
}

export interface BestScoreRecord {
  guesses: number;
  timestamp: number;
}

export type BestScoresMap = Record<DifficultyId, BestScoreRecord | null>;
