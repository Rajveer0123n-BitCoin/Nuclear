import { DifficultyConfig, DifficultyId, RatingDetail } from '../types';

export const DIFFICULTY_CONFIGS: Record<DifficultyId, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    min: 1,
    max: 100,
    description: '1 to 100',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    badgeText: 'Quick & Fun',
    borderColor: 'border-emerald-300 hover:border-emerald-500',
    optimalGuesses: 7
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    min: 1,
    max: 1000,
    description: '1 to 1,000',
    color: 'blue',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
    badgeText: 'Classic Challenge',
    borderColor: 'border-blue-300 hover:border-blue-500',
    optimalGuesses: 10
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    min: 1,
    max: 10000,
    description: '1 to 10,000',
    color: 'amber',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    badgeText: 'Serious Focus',
    borderColor: 'border-amber-300 hover:border-amber-500',
    optimalGuesses: 14
  },
  extreme: {
    id: 'extreme',
    name: 'Extreme',
    min: 1,
    max: 100000,
    description: '1 to 100,000',
    color: 'purple',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
    badgeText: 'Expert Master',
    borderColor: 'border-purple-300 hover:border-purple-500',
    optimalGuesses: 17
  }
};

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function calculateRating(guesses: number, difficulty: DifficultyId): RatingDetail {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const opt = config.optimalGuesses;

  if (guesses <= opt) {
    return {
      rating: 'Excellent',
      stars: 4,
      message: `Outstanding! You found it in ${guesses} ${guesses === 1 ? 'guess' : 'guesses'} (optimal target is ≤ ${opt}).`,
      color: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-50/90 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800'
    };
  } else if (guesses <= opt + 3) {
    return {
      rating: 'Great',
      stars: 3,
      message: `Great efficiency! Just a few steps beyond optimal (${opt}).`,
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-50/90 border-blue-200 dark:bg-blue-950/60 dark:border-blue-800'
    };
  } else if (guesses <= opt + 6) {
    return {
      rating: 'Good',
      stars: 2,
      message: 'Good game! Solid range closing strategy.',
      color: 'text-amber-700 dark:text-amber-300',
      bgColor: 'bg-amber-50/90 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800'
    };
  } else {
    return {
      rating: 'Average',
      stars: 1,
      message: 'You got there! Try bisecting the remaining range in half on each step.',
      color: 'text-slate-700 dark:text-slate-300',
      bgColor: 'bg-slate-100/90 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700'
    };
  }
}
