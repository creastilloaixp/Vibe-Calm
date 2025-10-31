import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MoodEntry, MoodType } from '../types/mood';
import { MoodService } from '../services/MoodService';

interface MoodContextType {
  moods: MoodEntry[];
  todaysMoods: MoodEntry[];
  isLoading: boolean;
  saveMood: (type: MoodType, note?: string) => Promise<void>;
  deleteMood: (id: string) => Promise<void>;
  refreshMoods: () => Promise<void>;
  stats: {
    totalEntries: number;
    mostFrequent: MoodType | null;
    currentStreak: number;
    averageMoodValue: number;
  };
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [todaysMoods, setTodaysMoods] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    mostFrequent: null as MoodType | null,
    currentStreak: 0,
    averageMoodValue: 0,
  });

  const loadMoods = useCallback(async () => {
    try {
      setIsLoading(true);
      const [allMoods, todayMoods, moodStats] = await Promise.all([
        MoodService.getAllMoods(),
        MoodService.getTodaysMoods(),
        MoodService.getMoodStats(7),
      ]);

      setMoods(allMoods);
      setTodaysMoods(todayMoods);
      setStats(moodStats);
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMoods();
  }, [loadMoods]);

  const saveMood = async (type: MoodType, note?: string) => {
    try {
      await MoodService.saveMood(type, note);
      await loadMoods();
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  };

  const deleteMood = async (id: string) => {
    try {
      await MoodService.deleteMood(id);
      await loadMoods();
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw error;
    }
  };

  const refreshMoods = async () => {
    await loadMoods();
  };

  return (
    <MoodContext.Provider
      value={{
        moods,
        todaysMoods,
        isLoading,
        saveMood,
        deleteMood,
        refreshMoods,
        stats,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
