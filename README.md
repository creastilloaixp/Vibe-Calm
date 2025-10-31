# Vibe Calm

A beautiful mental health, meditation, and calmness tracking app built with React Native and Expo.

## Features

### Current Implementation

- **Onboarding Flow**: Clean, single-page onboarding that collects the user's name with a beautiful gradient background
- **Welcome Screen**: Calming animation with a breathing effect that transitions users into the main app
- **Dashboard**: Two-tab interface featuring:
  - **Moods Tab**: Track your emotional state with an intuitive mood selector
  - **Vibes Tab**: Access curated meditation and relaxation experiences

### Design System

The app features a carefully crafted design system focused on calm and mindfulness:

- **Color Palette**: Soft purples, teals, and warm grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth, calming transitions using React Native Reanimated
- **Spacing**: Consistent spacing scale for visual harmony

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development toolchain and runtime
- **TypeScript**: Type-safe code
- **React Navigation**: Screen navigation
- **React Native Reanimated**: Smooth animations
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **AsyncStorage**: Data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo Go app (for testing on physical devices)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Project Structure

```
src/
├── screens/           # App screens
│   ├── OnboardingScreen.tsx
│   ├── WelcomeScreen.tsx
│   └── DashboardScreen.tsx
├── navigation/        # Navigation configuration
│   └── AppNavigator.tsx
├── context/          # React context providers
│   └── UserContext.tsx
├── constants/        # Design tokens and constants
│   └── theme.ts
└── components/       # Reusable components (future)
```

## Future Enhancements

- Multi-step onboarding with personalization questions
- Mood tracking with history and insights
- Meditation sessions with audio
- Progress tracking and streaks
- Customizable themes
- Notifications and reminders
- Data export and sharing

## Development Notes

- The app uses AsyncStorage to persist user data locally
- Navigation automatically routes users based on onboarding completion
- All design tokens are centralized in `src/constants/theme.ts`
- The app is fully typed with TypeScript for better developer experience

## License

Private project
