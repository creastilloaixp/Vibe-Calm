# Vibe Calm

A beautiful mental health, meditation, and calmness tracking app built with React Native and Expo.

## Features

### Current Implementation

- **Onboarding Flow**: Clean, single-page onboarding that collects the user's name with a beautiful gradient background
- **Welcome Screen**: Calming animation with a breathing effect that transitions users into the main app
- **Dashboard**: Two-tab interface featuring:
  - **Moods Tab**:
    - Track your emotional state with 6 mood options (Happy, Calm, Sad, Anxious, Tired, Stressed)
    - Save mood entries with timestamps
    - View today's mood history
    - See weekly statistics including current streak, total entries, and most frequent mood
  - **Vibes Tab**: Access curated meditation and relaxation experiences (coming soon)
- **Mood History**:
  - Interactive line chart showing mood trends over time
  - Bar chart displaying mood distribution
  - Toggle between week and month views
  - Complete list of all mood entries with dates and times

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
- **React Native Chart Kit**: Interactive charts and visualizations
- **React Native SVG**: SVG support for charts

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
│   ├── DashboardScreen.tsx
│   └── MoodHistoryScreen.tsx
├── navigation/        # Navigation configuration
│   └── AppNavigator.tsx
├── context/          # React context providers
│   ├── UserContext.tsx
│   └── MoodContext.tsx
├── services/         # Business logic services
│   └── MoodService.ts
├── types/            # TypeScript type definitions
│   └── mood.ts
├── constants/        # Design tokens and constants
│   └── theme.ts
└── components/       # Reusable components (future)
```

## Future Enhancements

- Multi-step onboarding with personalization questions
- ✅ ~~Mood tracking with history and insights~~ (Completed!)
- Add notes to mood entries
- Meditation sessions with audio and timers
- Mark favorite meditation sessions
- Customizable themes (light/dark mode)
- Motivational messages based on mood
- Push notifications and reminders
- Data export and sharing
- Cloud sync and backup
- Advanced analytics and mood patterns

## Key Features Breakdown

### Mood Tracking System

The mood tracking system allows users to:
- Record their emotional state at any time with a single tap
- View statistics including current tracking streak and most frequent mood
- Analyze mood trends with interactive line and bar charts
- Access complete history of all mood entries

**Data Structure:**
- Each mood entry includes: ID, type, timestamp, and optional note
- Moods are assigned numeric values (1-6) for charting purposes
- Data persists locally using AsyncStorage

**Analytics:**
- Weekly streak calculation (consecutive days with entries)
- Most frequent mood identification
- Average mood value computation
- Time-series visualization with customizable ranges

## Development Notes

- The app uses AsyncStorage to persist user data locally
- Navigation automatically routes users based on onboarding completion
- All design tokens are centralized in `src/constants/theme.ts`
- The app is fully typed with TypeScript for better developer experience
- Mood data is stored in JSON format for easy backup and portability

## License

Private project
