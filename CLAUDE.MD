# Charades App

## Project Overview
A mobile charades game built with React Native and Expo. The app is being developed incrementally with features added step-by-step.

> **Note**: For current implementation status, progress tracking, and gameplay flow, see [STATUS.MD](./STATUS.MD)

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

### Accelerometer Gestures (Heads Up Style)
The phone is held vertically in landscape mode against the player's forehead with the screen facing outward:
- **Tilt backward** (top edge away from face, z > 0.7) = Mark correct, show next card
- **Tilt forward** (top edge toward face, z < -0.7) = Skip card
- **Neutral position reset**: User must return phone to upright position (|z| < 0.3) before next gesture is recognized
- Uses z-axis of accelerometer for tilt detection
- When held vertical against forehead: z ≈ 0
- State machine approach prevents accidental multiple triggers without time-based debouncing

### Countdown Timer
- 3-second countdown (3, 2, 1) before game starts
- Large centered display (fontSize: 120)
- Gives players time to prepare before first card
- Accelerometer gestures disabled during countdown
- Countdown resets when "Play Again" is pressed

### Visual & Haptic Feedback
- **Correct gesture**: Card flashes green (#34C759) + success haptic feedback
- **Skip gesture**: Card flashes orange (#FF9500) + warning haptic feedback
- Flash duration: 300ms
- Provides immediate confirmation of gesture recognition

### Immersive Mode
- Status bar hidden on all platforms
- Android navigation buttons hidden with overlay-swipe behavior
- Full-screen gameplay experience

## Tech Stack
- **Framework**: Expo SDK 54
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.9.2
- **Navigation**: Expo Router 6.0.22 with file-based routing (stack navigation)
- **UI**: React Native 0.81.5
- **Animations**: React Native Reanimated 4.1.1
- **Gestures**: React Native Gesture Handler 2.28.0
- **Orientation**: Expo Screen Orientation (for landscape lock)
- **Sensors**: Expo Sensors (accelerometer for tilt detection)
- **Haptics**: Expo Haptics (for tactile feedback)
- **Navigation Bar**: Expo Navigation Bar (for immersive mode on Android)

## Project Structure
```
charades/
├── app/                      # Expo Router screens
│   ├── index.tsx            # Category selection screen (landing page)
│   ├── game.tsx             # Gameplay screen with card display
│   └── _layout.tsx          # Root layout with stack navigation
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

## Development Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Development Notes
- Using Expo Router for file-based navigation with query params and stack navigation
- Simple two-screen flow: Landing page → Game screen (with countdown)
- 3-second countdown gives players preparation time before cards appear
- Game displays 10 randomly selected cards per round (from 50 available)
- Cards are shuffled using Fisher-Yates algorithm
- Score tracking counts only tilt backward gestures (correct), not tilt forward (skip)
- Accelerometer updates every 100ms for responsive tilt detection
- Accelerometer disabled during countdown to prevent accidental triggers
- Gesture recognition uses state machine: neutral → tilted → back to neutral (no time-based debouncing)
- Thresholds: Neutral zone |z| < 0.3, Action triggers at |z| > 0.5
- Visual flash (300ms) and haptic feedback provide immediate gesture confirmation
- Immersive mode configured in root layout (_layout.tsx)
- Theme system (ThemedView, ThemedText) provides dark/light mode support
- Building features incrementally - one category, one feature at a time
- Tilt gestures and haptics only work on physical devices (not web or some emulators)

## Orientation Handling
- **Category selection**: Portrait mode (default)
- **Game screen**: Locked to landscape orientation using `expo-screen-orientation`
- Orientation automatically unlocks when user leaves game screen
- Layout optimized for landscape with reduced margins and compact card design
