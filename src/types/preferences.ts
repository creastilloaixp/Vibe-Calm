export type UserGoal = 'stress' | 'sleep' | 'focus' | 'anxiety' | 'happiness' | 'energy';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserPreferences {
  goals: UserGoal[];
  experienceLevel: ExperienceLevel;
  dailyMinutes: number;
  reminderTime?: string;
  hasCompletedOnboarding: boolean;
}

export const GOAL_DEFINITIONS: Record<UserGoal, { emoji: string; label: string; description: string }> = {
  stress: {
    emoji: '😌',
    label: 'Reduce Stress',
    description: 'Find calm in daily chaos',
  },
  sleep: {
    emoji: '😴',
    label: 'Better Sleep',
    description: 'Improve sleep quality',
  },
  focus: {
    emoji: '🎯',
    label: 'Improve Focus',
    description: 'Enhance concentration',
  },
  anxiety: {
    emoji: '🧘',
    label: 'Manage Anxiety',
    description: 'Build emotional resilience',
  },
  happiness: {
    emoji: '😊',
    label: 'Boost Happiness',
    description: 'Cultivate joy and positivity',
  },
  energy: {
    emoji: '⚡',
    label: 'Increase Energy',
    description: 'Feel more vibrant',
  },
};
