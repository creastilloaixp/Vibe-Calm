import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry, MoodType, MOOD_DEFINITIONS } from '../types/mood';

const MOOD_STORAGE_KEY = '@vibe_calm:moods';

export class MoodService {
  /**
   * Save a new mood entry
   */
  static async saveMood(type: MoodType, note?: string): Promise<MoodEntry> {
    try {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        type,
        timestamp: Date.now(),
        note,
      };

      const existingMoods = await this.getAllMoods();
      const updatedMoods = [newEntry, ...existingMoods];

      await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedMoods));
      return newEntry;
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  }

  /**
   * Get all mood entries
   */
  static async getAllMoods(): Promise<MoodEntry[]> {
    try {
      const moodsJson = await AsyncStorage.getItem(MOOD_STORAGE_KEY);
      if (!moodsJson) return [];

      const moods: MoodEntry[] = JSON.parse(moodsJson);
      return moods.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting moods:', error);
      return [];
    }
  }

  /**
   * Get moods for a specific date range
   */
  static async getMoodsInRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    try {
      const allMoods = await this.getAllMoods();
      return allMoods.filter(
        (mood) =>
          mood.timestamp >= startDate.getTime() &&
          mood.timestamp <= endDate.getTime()
      );
    } catch (error) {
      console.error('Error getting moods in range:', error);
      return [];
    }
  }

  /**
   * Get moods for the last N days
   */
  static async getRecentMoods(days: number = 7): Promise<MoodEntry[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await this.getMoodsInRange(startDate, endDate);
    } catch (error) {
      console.error('Error getting recent moods:', error);
      return [];
    }
  }

  /**
   * Get today's moods
   */
  static async getTodaysMoods(): Promise<MoodEntry[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return await this.getMoodsInRange(today, tomorrow);
    } catch (error) {
      console.error('Error getting today\'s moods:', error);
      return [];
    }
  }

  /**
   * Delete a mood entry
   */
  static async deleteMood(id: string): Promise<void> {
    try {
      const moods = await this.getAllMoods();
      const filteredMoods = moods.filter((mood) => mood.id !== id);
      await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(filteredMoods));
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw error;
    }
  }

  /**
   * Get statistics about moods
   */
  static async getMoodStats(days: number = 7): Promise<{
    totalEntries: number;
    mostFrequent: MoodType | null;
    currentStreak: number;
    averageMoodValue: number;
  }> {
    try {
      const moods = await this.getRecentMoods(days);

      if (moods.length === 0) {
        return {
          totalEntries: 0,
          mostFrequent: null,
          currentStreak: 0,
          averageMoodValue: 0,
        };
      }

      // Most frequent mood
      const moodCounts: Record<string, number> = {};
      moods.forEach((mood) => {
        moodCounts[mood.type] = (moodCounts[mood.type] || 0) + 1;
      });

      const mostFrequent = Object.keys(moodCounts).reduce((a, b) =>
        moodCounts[a] > moodCounts[b] ? a : b
      ) as MoodType;

      // Calculate streak (consecutive days with at least one entry)
      const currentStreak = await this.calculateStreak();

      // Average mood value
      const totalValue = moods.reduce(
        (sum, mood) => sum + MOOD_DEFINITIONS[mood.type].value,
        0
      );
      const averageMoodValue = totalValue / moods.length;

      return {
        totalEntries: moods.length,
        mostFrequent,
        currentStreak,
        averageMoodValue,
      };
    } catch (error) {
      console.error('Error getting mood stats:', error);
      return {
        totalEntries: 0,
        mostFrequent: null,
        currentStreak: 0,
        averageMoodValue: 0,
      };
    }
  }

  /**
   * Calculate consecutive days streak
   */
  private static async calculateStreak(): Promise<number> {
    try {
      const allMoods = await this.getAllMoods();
      if (allMoods.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let checkDate = new Date(today);

      // Check if there's an entry for each consecutive day going backwards
      while (true) {
        const nextDay = new Date(checkDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const moodsOnDay = allMoods.filter((mood) => {
          const moodDate = new Date(mood.timestamp);
          moodDate.setHours(0, 0, 0, 0);
          return moodDate.getTime() === checkDate.getTime();
        });

        if (moodsOnDay.length > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }

        // Safety check to prevent infinite loops
        if (streak > 365) break;
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  /**
   * Get mood distribution for charts
   */
  static async getMoodDistribution(days: number = 7): Promise<Array<{ type: MoodType; count: number }>> {
    try {
      const moods = await this.getRecentMoods(days);
      const distribution: Record<MoodType, number> = {
        happy: 0,
        calm: 0,
        sad: 0,
        anxious: 0,
        tired: 0,
        stressed: 0,
      };

      moods.forEach((mood) => {
        distribution[mood.type]++;
      });

      return Object.entries(distribution).map(([type, count]) => ({
        type: type as MoodType,
        count,
      }));
    } catch (error) {
      console.error('Error getting mood distribution:', error);
      return [];
    }
  }
}
