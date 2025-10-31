import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, UserGoal, ExperienceLevel } from '../types/preferences';

interface UserContextType {
  userName: string | null;
  setUserName: (name: string) => Promise<void>;
  preferences: UserPreferences | null;
  setPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserNameState] = useState<string | null>(null);
  const [preferences, setPreferencesState] = useState<UserPreferences | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [name, onboardingComplete, prefsJson] = await Promise.all([
        AsyncStorage.getItem('userName'),
        AsyncStorage.getItem('hasCompletedOnboarding'),
        AsyncStorage.getItem('userPreferences'),
      ]);

      if (name) setUserNameState(name);
      if (onboardingComplete === 'true') setHasCompletedOnboarding(true);
      if (prefsJson) setPreferencesState(JSON.parse(prefsJson));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem('userName', name);
      setUserNameState(name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  const setPreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...preferences, ...newPreferences } as UserPreferences;
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updated));
      setPreferencesState(updated);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        preferences,
        setPreferences,
        hasCompletedOnboarding,
        completeOnboarding,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
