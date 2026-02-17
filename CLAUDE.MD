# Charades App

## Project Overview
A mobile charades game built with React Native and Expo. The app is being developed incrementally with features added step-by-step.

> **Note**: For current implementation status, progress tracking, and gameplay flow, see [STATUS.MD](./STATUS.MD)

## Project Description
A mobile charades game where players act out words/phrases while teammates guess. The game features two distinct game modes that offer different challenges: Time Attack (maximize correct answers within a time limit) and Speed Run (complete all cards as quickly as possible).

## Core Features

### MVP (Version 1.0)

1. **Game Modes**

   **Time Attack Mode (Default)**
   - Objective: Get as many correct answers as possible within a time limit
   - Time limit options: 30s / 60s / 90s (default: 60s)
   - Deck size options: 10 / 20 / 30 cards (default: 10)
   - Tilt backward = correct (adds point, next card)
   - Tilt forward = skip (no point, next card)
   - Result: "X correct out of Y attempted"

   **Speed Run Mode**
   - Objective: Complete all cards as fast as possible
   - Deck size options: 5 / 10 / 15 cards (default: 10)
   - Maximum time limit: 5 minutes (timeout)
   - Tilt backward = correct (next card)
   - No skipping allowed (tilt forward disabled)
   - Result: Total time elapsed (e.g., "1:23.45") or "Timeout - X cards completed"

2. **Basic Gameplay**
   - Display cards one at a time
   - Phone held vertically in landscape mode against forehead (Heads Up style)
   - Accelerometer-based tilt gestures
   - Visual feedback (green flash = correct, orange flash = skip)
   - Haptic feedback for gesture confirmation
   - 3-second countdown before game starts
   - Score tracking

3. **Bundled Content**
   - Two categories available:
     - **Animals**: 50 animal cards (text-only)
     - **Family**: 250 family-friendly cards for ages 5+ with SVG images
       - Objects (72%): household items, toys, vehicles, food, nature, clothing
       - Actions (28%): daily activities, play/movement, emotions, animal sounds
       - Each card includes a simple white SVG icon for non-readers
   - Will expand to more categories incrementally

4. **Game Setup**
   - Select category
   - Choose game mode (Time Attack / Speed Run)
   - Configure mode settings (time limit and/or deck size)
   - Setup screen prepopulated with defaults

## Game Flow

1. **Category Selection** (Portrait)
   - User selects a category (e.g., Animals)

2. **Game Setup Screen** (Portrait)
   - Mode selection: Time Attack or Speed Run
   - Settings configuration based on selected mode:
     - Time Attack: Time limit (30s/60s/90s) + Deck size (10/20/30)
     - Speed Run: Deck size (5/10/15)
   - Settings prepopulated with defaults
   - User can customize or proceed with defaults

3. **Countdown** (Landscape)
   - Screen rotates to landscape
   - 3-second countdown (3... 2... 1...)
   - Gives players time to position phone against forehead

4. **Gameplay** (Landscape)
   - Cards displayed one at a time
   - Tilt gestures to interact with cards
   - Visual and haptic feedback
   - Timer/progress tracking based on mode

5. **Game Over Screen** (Landscape)
   - Results displayed based on mode:
     - Time Attack: "X correct out of Y attempted" + percentage
     - Speed Run: Total time or timeout message
   - Options: "Play Again" or "Back to Categories"

## Key Implementation Details

### Accelerometer Gestures (Heads Up Style)
The phone is held vertically in landscape mode against the player's forehead with the screen facing outward:
- **Tilt backward** (top edge away from face, z > 0.5) = Mark correct, show next card
- **Tilt forward** (top edge toward face, z < -0.5) = Skip card (Time Attack only)
- **Neutral position reset**: User must return phone to upright position (|z| < 0.3) before next gesture is recognized
- **Gesture cooldown**: 2-second delay between gestures to prevent accidental triggers during phone readjustment
- Uses z-axis of accelerometer for tilt detection
- When held vertical against forehead: z ≈ 0
- Combined state machine + time-based cooldown approach for reliable gesture recognition

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
- **SVG Rendering**: React Native SVG (for inline SVG icons)

## Project Structure
```
charades/
├── app/                      # Expo Router screens
│   ├── index.tsx            # Category selection screen (landing page)
│   ├── setup.tsx            # Game setup screen (mode + settings)
│   ├── game.tsx             # Gameplay screen with card display
│   └── _layout.tsx          # Root layout with stack navigation
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   └── themed-*.tsx         # Theme-aware components
├── constants/               # App constants
│   ├── categories.ts        # Category definitions (Animals, Family)
│   ├── cards.ts             # Card data and utilities (50 animals, 250 family)
│   ├── game-modes.ts        # Game mode definitions and settings
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
  svgData?: string; // Optional inline SVG string for visual representation
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
- Three-screen flow: Category selection → Setup screen → Game screen (with countdown)
- 3-second countdown gives players preparation time before cards appear
- Deck size configurable per game mode (5-30 cards depending on mode)
- Cards randomly selected from category pool and shuffled using Fisher-Yates algorithm
- Two categories available: Animals (50 cards), Family (250 cards)
- Score tracking counts only tilt backward gestures (correct), not tilt forward (skip)
- Accelerometer updates every 100ms for responsive tilt detection
- Accelerometer disabled during countdown to prevent accidental triggers
- Gesture recognition uses state machine + cooldown: neutral → tilted → back to neutral + 2-second delay
- Thresholds: Neutral zone |z| < 0.3, Action triggers at |z| > 0.5
- 2-second cooldown between gestures prevents accidental triggers during phone readjustment
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
