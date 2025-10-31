export type MeditationCategory = 'stress' | 'sleep' | 'focus' | 'anxiety' | 'energy' | 'happiness';
export type AmbientSound = 'rain' | 'ocean' | 'forest' | 'fire' | 'wind' | 'none';

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  category: MeditationCategory;
  duration: number; // in minutes
  emoji: string;
  color: string;
  ambientSound?: AmbientSound;
  isFavorite?: boolean;
}

export interface CompletedSession {
  id: string;
  sessionId: string;
  sessionTitle: string;
  duration: number; // actual duration in seconds
  completedAt: number; // timestamp
  ambientSound?: AmbientSound;
}

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  favoriteSessions: string[];
}

export const AMBIENT_SOUNDS: Record<AmbientSound, { label: string; emoji: string; description: string }> = {
  none: { label: 'Silence', emoji: '🔇', description: 'Pure silence' },
  rain: { label: 'Rain', emoji: '🌧️', description: 'Gentle rainfall' },
  ocean: { label: 'Ocean', emoji: '🌊', description: 'Ocean waves' },
  forest: { label: 'Forest', emoji: '🌲', description: 'Birds & nature' },
  fire: { label: 'Fireplace', emoji: '🔥', description: 'Crackling fire' },
  wind: { label: 'Wind', emoji: '💨', description: 'Gentle breeze' },
};

export const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    id: 'morning-energy',
    title: 'Morning Energy',
    description: 'Start your day with renewed vitality and positive energy',
    category: 'energy',
    duration: 10,
    emoji: '🌅',
    color: '#F5C98D',
  },
  {
    id: 'night-calm',
    title: 'Night Calm',
    description: 'Wind down and prepare for restful, peaceful sleep',
    category: 'sleep',
    duration: 15,
    emoji: '🌙',
    color: '#8B7FD8',
  },
  {
    id: 'stress-relief',
    title: 'Stress Relief',
    description: 'Release tension and find your center of calm',
    category: 'stress',
    duration: 12,
    emoji: '😌',
    color: '#7EC8B8',
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    description: 'Enhance concentration and mental clarity',
    category: 'focus',
    duration: 20,
    emoji: '🎯',
    color: '#5BA895',
  },
  {
    id: 'anxiety-ease',
    title: 'Anxiety Ease',
    description: 'Gentle guidance to calm anxious thoughts',
    category: 'anxiety',
    duration: 15,
    emoji: '🧘',
    color: '#B8AEF0',
  },
  {
    id: 'joy-boost',
    title: 'Joy Boost',
    description: 'Cultivate gratitude and positive emotions',
    category: 'happiness',
    duration: 10,
    emoji: '😊',
    color: '#E8A5C5',
  },
  {
    id: 'quick-reset',
    title: 'Quick Reset',
    description: 'A brief moment to center yourself',
    category: 'stress',
    duration: 5,
    emoji: '⚡',
    color: '#F5C98D',
  },
  {
    id: 'evening-reflect',
    title: 'Evening Reflection',
    description: 'Process your day with mindful awareness',
    category: 'happiness',
    duration: 12,
    emoji: '🌆',
    color: '#E89B9B',
  },
];
