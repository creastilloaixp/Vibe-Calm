import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import { MoodProvider } from './src/context/MoodContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <UserProvider>
      <MoodProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </MoodProvider>
    </UserProvider>
  );
}
