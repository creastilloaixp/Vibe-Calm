import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../context/UserContext';
import { OnboardingWelcomeScreen } from '../screens/onboarding/OnboardingWelcomeScreen';
import { OnboardingGoalsScreen } from '../screens/onboarding/OnboardingGoalsScreen';
import { OnboardingExperienceScreen } from '../screens/onboarding/OnboardingExperienceScreen';
import { OnboardingTimeScreen } from '../screens/onboarding/OnboardingTimeScreen';
import { OnboardingNameScreen } from '../screens/onboarding/OnboardingNameScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MoodHistoryScreen } from '../screens/MoodHistoryScreen';
import { MeditationTimerScreen } from '../screens/MeditationTimerScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';
import { MeditationSession } from '../types/meditation';

export type RootStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingGoals: undefined;
  OnboardingExperience: undefined;
  OnboardingTime: undefined;
  OnboardingName: undefined;
  Welcome: undefined;
  Dashboard: undefined;
  MoodHistory: undefined;
  MeditationTimer: { session: MeditationSession };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { hasCompletedOnboarding, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName={hasCompletedOnboarding ? 'Dashboard' : 'OnboardingWelcome'}
      >
        {/* Onboarding Flow */}
        <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
        <Stack.Screen name="OnboardingGoals" component={OnboardingGoalsScreen} />
        <Stack.Screen name="OnboardingExperience" component={OnboardingExperienceScreen} />
        <Stack.Screen name="OnboardingTime" component={OnboardingTimeScreen} />
        <Stack.Screen name="OnboardingName" component={OnboardingNameScreen} />

        {/* Welcome & Main App */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="MoodHistory"
          component={MoodHistoryScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="MeditationTimer"
          component={MeditationTimerScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
