import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import { MoodProvider } from './src/context/MoodContext';
import { MeditationProvider } from './src/context/MeditationContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <UserProvider>
      <MoodProvider>
        <MeditationProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </MeditationProvider>
      </MoodProvider>
    </UserProvider>
  );
}
