import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { CompletedSession, SessionStats, MEDITATION_SESSIONS, MeditationSession } from '../types/meditation';
import { MeditationService } from '../services/MeditationService';

interface MeditationContextType {
  sessions: CompletedSession[];
  todaysSessions: CompletedSession[];
  stats: SessionStats;
  isLoading: boolean;
  completeSession: (sessionId: string, durationSeconds: number, ambientSound?: string) => Promise<void>;
  toggleFavorite: (sessionId: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
  getFavoriteStatus: (sessionId: string) => boolean;
  availableSessions: MeditationSession[];
}

const MeditationContext = createContext<MeditationContextType | undefined>(undefined);

export const MeditationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [todaysSessions, setTodaysSessions] = useState<CompletedSession[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteSessions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const [allSessions, todaySessions, sessionStats] = await Promise.all([
        MeditationService.getAllSessions(),
        MeditationService.getTodaysSessions(),
        MeditationService.getStats(),
      ]);

      setSessions(allSessions);
      setTodaysSessions(todaySessions);
      setStats(sessionStats);
    } catch (error) {
      console.error('Error loading meditation sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const completeSession = async (
    sessionId: string,
    durationSeconds: number,
    ambientSound?: string
  ) => {
    try {
      await MeditationService.completeSession(sessionId, durationSeconds, ambientSound);
      await loadSessions();
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  };

  const toggleFavorite = async (sessionId: string) => {
    try {
      await MeditationService.toggleFavorite(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const refreshSessions = async () => {
    await loadSessions();
  };

  const getFavoriteStatus = (sessionId: string): boolean => {
    return stats.favoriteSessions.includes(sessionId);
  };

  return (
    <MeditationContext.Provider
      value={{
        sessions,
        todaysSessions,
        stats,
        isLoading,
        completeSession,
        toggleFavorite,
        refreshSessions,
        getFavoriteStatus,
        availableSessions: MEDITATION_SESSIONS,
      }}
    >
      {children}
    </MeditationContext.Provider>
  );
};

export const useMeditation = () => {
  const context = useContext(MeditationContext);
  if (context === undefined) {
    throw new Error('useMeditation must be used within a MeditationProvider');
  }
  return context;
};
