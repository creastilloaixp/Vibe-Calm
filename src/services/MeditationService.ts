import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompletedSession, SessionStats, MEDITATION_SESSIONS } from '../types/meditation';

const SESSIONS_STORAGE_KEY = '@vibe_calm:meditation_sessions';
const FAVORITES_STORAGE_KEY = '@vibe_calm:favorite_sessions';

export class MeditationService {
  /**
   * Save a completed meditation session
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number,
    ambientSound?: string
  ): Promise<CompletedSession> {
    try {
      const session = MEDITATION_SESSIONS.find(s => s.id === sessionId);
      if (!session) throw new Error('Session not found');

      const completed: CompletedSession = {
        id: Date.now().toString(),
        sessionId,
        sessionTitle: session.title,
        duration: durationSeconds,
        completedAt: Date.now(),
        ambientSound: ambientSound as any,
      };

      const existing = await this.getAllSessions();
      const updated = [completed, ...existing];

      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
      return completed;
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }

  /**
   * Get all completed sessions
   */
  static async getAllSessions(): Promise<CompletedSession[]> {
    try {
      const data = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
      if (!data) return [];

      const sessions: CompletedSession[] = JSON.parse(data);
      return sessions.sort((a, b) => b.completedAt - a.completedAt);
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  /**
   * Get sessions for today
   */
  static async getTodaysSessions(): Promise<CompletedSession[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const allSessions = await this.getAllSessions();
      return allSessions.filter(
        session =>
          session.completedAt >= today.getTime() &&
          session.completedAt < tomorrow.getTime()
      );
    } catch (error) {
      console.error('Error getting today\'s sessions:', error);
      return [];
    }
  }

  /**
   * Get session statistics
   */
  static async getStats(): Promise<SessionStats> {
    try {
      const sessions = await this.getAllSessions();
      const favorites = await this.getFavorites();

      if (sessions.length === 0) {
        return {
          totalSessions: 0,
          totalMinutes: 0,
          currentStreak: 0,
          longestStreak: 0,
          favoriteSessions: favorites,
        };
      }

      const totalMinutes = sessions.reduce(
        (sum, session) => sum + Math.floor(session.duration / 60),
        0
      );

      const currentStreak = await this.calculateCurrentStreak();
      const longestStreak = await this.calculateLongestStreak();

      return {
        totalSessions: sessions.length,
        totalMinutes,
        currentStreak,
        longestStreak,
        favoriteSessions: favorites,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteSessions: [],
      };
    }
  }

  /**
   * Calculate current meditation streak (consecutive days)
   */
  private static async calculateCurrentStreak(): Promise<number> {
    try {
      const sessions = await this.getAllSessions();
      if (sessions.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let checkDate = new Date(today);

      while (true) {
        const nextDay = new Date(checkDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const sessionsOnDay = sessions.filter(session => {
          const sessionDate = new Date(session.completedAt);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === checkDate.getTime();
        });

        if (sessionsOnDay.length > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }

        if (streak > 365) break; // Safety check
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  /**
   * Calculate longest meditation streak
   */
  private static async calculateLongestStreak(): Promise<number> {
    try {
      const sessions = await this.getAllSessions();
      if (sessions.length === 0) return 0;

      // Get unique dates
      const dates = Array.from(
        new Set(
          sessions.map(session => {
            const date = new Date(session.completedAt);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
          })
        )
      ).sort((a, b) => a - b);

      let longestStreak = 1;
      let currentStreak = 1;

      for (let i = 1; i < dates.length; i++) {
        const dayDiff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      return longestStreak;
    } catch (error) {
      console.error('Error calculating longest streak:', error);
      return 0;
    }
  }

  /**
   * Toggle favorite status for a session
   */
  static async toggleFavorite(sessionId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const index = favorites.indexOf(sessionId);

      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(sessionId);
      }

      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      return index === -1; // Returns true if added, false if removed
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  /**
   * Get favorite session IDs
   */
  static async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Check if a session is favorited
   */
  static async isFavorite(sessionId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.includes(sessionId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }
}
