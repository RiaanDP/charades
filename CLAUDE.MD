# Charades App

## Project Overview
A mobile charades game built with React Native and Expo. The app is being developed incrementally with features added step-by-step.

## Tech Stack
- **Framework**: Expo SDK 54
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.9.2
- **Navigation**: Expo Router 6.0.22 with file-based routing
- **UI**: React Native 0.81.5
- **Animations**: React Native Reanimated 4.1.1
- **Gestures**: React Native Gesture Handler 2.28.0

## Current State
This is a fresh Expo project with the default template structure:
- Tab-based navigation (`app/(tabs)/`)
- Default home and explore screens
- Basic themed components (ThemedView, ThemedText)
- Example components (HelloWave, Collapsible, ParallaxScrollView)
- Dark/light theme support

## Project Structure
```
charades/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home tab
│   │   ├── explore.tsx      # Explore tab
│   │   └── _layout.tsx      # Tab layout
│   ├── _layout.tsx          # Root layout
│   └── modal.tsx            # Example modal
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   └── themed-*.tsx         # Theme-aware components
├── constants/               # App constants
│   └── theme.ts            # Theme configuration
└── hooks/                  # Custom React hooks
    └── use-*.ts            # Theme and color scheme hooks
```

## Development Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Features to Build
The app will be built incrementally. Features will be added one at a time as guided by the developer.

## Development Notes
- Using Expo Router for file-based navigation
- Tab navigation is already set up in `app/(tabs)/`
- Default theme system is in place
- Remove or modify default components as needed when building features
