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

## Key Implementation Details

Accelerometer Gestures
- Tilt up > 30° = Mark correct, show next card
- Tilt down < -30° = Skip card
- Debounce: 500ms between gestures to prevent accidental triggers

## Tech Stack
- **Framework**: Expo SDK 54
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.9.2
- **Navigation**: Expo Router 6.0.22 with file-based routing
- **UI**: React Native 0.81.5
- **Animations**: React Native Reanimated 4.1.1
- **Gestures**: React Native Gesture Handler 2.28.0
- **Orientation**: Expo Screen Orientation (for landscape lock)

## Current State
The app now has a functional gameplay flow:
- Category selection screen as the main landing page (portrait mode)
- Single "Animals" category available with 50 animal cards
- Gameplay screen with card display (10 cards per game, landscape mode)
- Landscape orientation lock on game screen
- Score tracking and game over screen
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
│   ├── game.tsx             # Gameplay screen with card display
│   ├── _layout.tsx          # Root layout
│   └── modal.tsx            # Example modal
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   └── themed-*.tsx         # Theme-aware components
├── constants/               # App constants
│   ├── categories.ts        # Category definitions
│   ├── cards.ts             # Card data and utilities (50 animals)
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

### Card
```typescript
interface Card {
  id: string;
  text: string;
  categoryId: string;
}
```

## Implementation Progress

### Completed
- ✅ Category selection landing page (portrait)
- ✅ Category data structure (Animals category)
- ✅ 50 animal cards with shuffle functionality
- ✅ Gameplay screen with card display (landscape mode)
- ✅ Landscape orientation lock for game screen
- ✅ "Correct" and "Skip" buttons for navigation
- ✅ Score tracking (correct answers counted)
- ✅ Game over screen with final score and percentage
- ✅ Play again functionality (reshuffles cards)
- ✅ Navigation flow: Categories → Game → Game Over
- ✅ Hidden navigation header on game screen
- ✅ Optimized layout for landscape orientation

### In Progress
- None

### Todo
- Timer functionality (30s/60s/90s options)
- Tilt gesture detection (up = correct, down = skip)
- Game setup screen (timer selection, player management)
- Additional categories

## Development Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Development Notes
- Using Expo Router for file-based navigation with query params
- Tab navigation structure exists but only home tab is actively used
- Game displays 10 randomly selected cards per round (from 50 available)
- Cards are shuffled using Fisher-Yates algorithm
- Score tracking counts only "Correct" button presses, not skips
- Theme system (ThemedView, ThemedText) provides dark/light mode support
- Building features incrementally - one category, one feature at a time

## Orientation Handling
- **Category selection**: Portrait mode (default)
- **Game screen**: Locked to landscape orientation using `expo-screen-orientation`
- Orientation automatically unlocks when user leaves game screen
- Layout optimized for landscape with reduced margins and compact card design

## Current Gameplay Flow
1. User opens app → Category selection screen (portrait)
2. User taps "Animals" → Screen rotates to landscape, game starts with 10 shuffled cards
3. User presses "Correct" (adds point) or "Skip" (no point)
4. After 10 cards → Game over screen with score (landscape)
5. User can "Play Again" (new 10 cards) or "Back to Categories" (returns to portrait)
