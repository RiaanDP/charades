# Charades App

## Project Overview
A mobile charades game built with React Native and Expo. The app is being developed incrementally with features added step-by-step.

## Project Description
A mobile charades game where players act out words/phrases while teammates guess. Think "Heads Up" style gameplay with custom content creation.

## Core Features

### MVP (Version 1.0)

1. Basic Gameplay
 - Display cards one at a time
 - Tilt phone up = correct (next card)
 - Tilt phone down = skip
 - Countdown timer (30s/60s/90s options)
 - Score tracking

2. Bundled Content
 - Starting with single category (Animals)
 - Will expand to more categories incrementally
 - 50+ cards per category
 - Text-only cards initially

3. Game Setup
 - Select category
 - Choose timer duration
 - Add players

## Tech Stack
- **Framework**: Expo SDK 54
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.9.2
- **Navigation**: Expo Router 6.0.22 with file-based routing
- **UI**: React Native 0.81.5
- **Animations**: React Native Reanimated 4.1.1
- **Gestures**: React Native Gesture Handler 2.28.0

## Current State
The app now has a functional category selection landing page:
- Category selection screen as the main landing page
- Single "Animals" category available (50 cards)
- Tab-based navigation structure exists (only home tab in use)
- Basic themed components (ThemedView, ThemedText)
- Dark/light theme support

## Project Structure
```
charades/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Category selection screen (landing page)
│   │   ├── explore.tsx      # Explore tab (unused)
│   │   └── _layout.tsx      # Tab layout
│   ├── _layout.tsx          # Root layout
│   └── modal.tsx            # Example modal
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   └── themed-*.tsx         # Theme-aware components
├── constants/               # App constants
│   ├── categories.ts        # Category definitions
│   └── theme.ts            # Theme configuration
└── hooks/                  # Custom React hooks
    └── use-*.ts            # Theme and color scheme hooks
```

## Data Models

### Category
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  cardCount: number;
}
```

## Implementation Progress

### Completed
- ✅ Category selection landing page
- ✅ Category data structure (Animals category with 50 cards)

### In Progress
- None

### Todo
- Game setup screen (timer selection, player management)
- Gameplay screen with card display
- Tilt gesture detection (up = correct, down = skip)
- Timer functionality
- Score tracking
- Animal category card content (50+ animal names)

## Development Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Development Notes
- Using Expo Router for file-based navigation
- Tab navigation structure exists but only home tab is actively used
- Category selection uses TouchableOpacity with console logging (ready for navigation hookup)
- Theme system (ThemedView, ThemedText) provides dark/light mode support
- Building features incrementally - one category, one feature at a time
