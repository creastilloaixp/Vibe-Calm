export type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'tired' | 'stressed';

export interface MoodEntry {
  id: string;
  type: MoodType;
  timestamp: number; // Unix timestamp
  note?: string;
}

export interface MoodData {
  emoji: string;
  label: string;
  color: string;
  value: number; // Numeric value for charting (1-6)
}

export const MOOD_DEFINITIONS: Record<MoodType, MoodData> = {
  happy: { emoji: '😊', label: 'Happy', color: '#7EC8B8', value: 6 },
  calm: { emoji: '😌', label: 'Calm', color: '#8B7FD8', value: 5 },
  sad: { emoji: '😔', label: 'Sad', color: '#E8A5C5', value: 2 },
  anxious: { emoji: '😰', label: 'Anxious', color: '#F5C98D', value: 3 },
  tired: { emoji: '😴', label: 'Tired', color: '#7EC8B8', value: 4 },
  stressed: { emoji: '😤', label: 'Stressed', color: '#E89B9B', value: 1 },
};
