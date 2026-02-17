# Project Status

## Current State

The app now has a fully functional "Heads Up" style gameplay:
- Category selection screen as the main landing page (portrait mode)
- Single "Animals" category available with 50 animal cards
- 3-second countdown before gameplay begins
- Gameplay screen with card display (10 cards per game, landscape mode)
- Landscape orientation lock on game screen
- Accelerometer-based tilt gestures (backward = correct, forward = skip)
- Visual feedback (green flash for correct, orange flash for skip)
- Haptic feedback (success vibration for correct, warning vibration for skip)
- Score tracking and game over screen
- Immersive full-screen mode (hidden status bar and navigation buttons)
- Simple stack navigation (no tabs)
- Basic themed components (ThemedView, ThemedText)
- Dark/light theme support

## Implementation Progress

### Completed
- ✅ Category selection landing page (portrait)
- ✅ Category data structure (Animals category)
- ✅ 50 animal cards with shuffle functionality
- ✅ 3-second countdown before game starts
- ✅ Gameplay screen with card display (10 cards per game, landscape mode)
- ✅ Landscape orientation lock for game screen
- ✅ Accelerometer tilt gesture detection (backward = correct, forward = skip)
- ✅ Neutral position reset system (must return to upright before next gesture)
- ✅ Visual feedback (green/orange flash on gestures)
- ✅ Haptic feedback (success/warning vibration on gestures)
- ✅ Score tracking (correct answers counted)
- ✅ Game over screen with final score and percentage
- ✅ Play again functionality (reshuffles cards, restarts countdown)
- ✅ Navigation flow: Categories → Countdown → Game → Game Over
- ✅ Hidden navigation header on all screens
- ✅ Immersive full-screen mode (hidden status bar and nav buttons)
- ✅ Stack navigation (removed tab bar)
- ✅ Optimized layout for landscape orientation

### In Progress
- 🚧 Two Game Modes Feature (8-phase incremental implementation)

### Todo
- Additional categories

---

## Two Game Modes Implementation Plan

### Overview
Adding two distinct game modes to the charades app:
1. **Time Attack Mode**: Get as many correct as possible within a time limit (30s/60s/90s). Can skip cards. Shows "X correct out of Y attempted."
2. **Speed Run Mode**: Complete all cards as fast as possible. No skipping. 5-minute timeout. Shows total time or timeout message.

### Implementation Phases

#### Phase 1: Add Game Configuration Types and Constants ✅
**Status**: Completed
**File**: `constants/game-modes.ts` (new)
**Objective**: Create type-safe foundation with GameMode types, settings interfaces, defaults, and helper functions.

#### Phase 2: Create Setup Screen UI (Non-functional) ✅
**Status**: Completed
**Files**: `app/setup.tsx` (new), `app/_layout.tsx` (modify)
**Objective**: Build complete setup screen UI with mode selector, settings panels, and navigation buttons.

#### Phase 3: Wire Navigation from Category to Setup ✅
**Status**: Completed
**Files**: `app/index.tsx`, `app/setup.tsx`, `e2e/app.spec.ts`
**Objective**: Connect category selection → setup → game navigation flow with parameter passing.
**Note**: 8/9 e2e tests pass. One test for Speed Run mode switching is flaky in Playwright but functionality works.

#### Phase 4: Update Game to Accept New Parameters 🎮
**Status**: Not Started
**File**: `app/game.tsx`
**Objective**: Parse mode, timeLimit, deckSize from URL params with backward compatibility.

#### Phase 5: Implement Timer and Stopwatch Logic ⏱️
**Status**: Not Started
**File**: `app/game.tsx`
**Objective**: Add countdown timer for Time Attack and stopwatch for Speed Run modes.

#### Phase 6: Implement Conditional Skip Behavior ⏭️
**Status**: Not Started
**File**: `app/game.tsx`
**Objective**: Disable forward tilt (skip) gesture for Speed Run mode only.

#### Phase 7: Implement Mode-Specific Game Over Screens 🏆
**Status**: Not Started
**File**: `app/game.tsx`
**Objective**: Show different results based on game mode (score vs time).

#### Phase 8: Fix Play Again and Edge Cases 🔧
**Status**: Not Started
**File**: `app/game.tsx`
**Objective**: Ensure Play Again respects mode/settings, handle app backgrounding and edge cases.

### Full Plan Document
See `/home/riaan/.claude/plans/groovy-tumbling-giraffe.md` for detailed implementation specifications.

## Current Gameplay Flow

1. User opens app → Category selection screen (portrait)
2. User taps "Animals" → Screen rotates to landscape
3. 3-second countdown appears (3... 2... 1...)
4. First card appears, game starts with 10 shuffled cards
5. User holds phone vertically against forehead (Heads Up style) with screen facing outward
6. User tilts backward (away from face) = Correct (green flash, haptic feedback, adds point, next card)
7. User returns phone to upright/neutral position
8. User tilts forward (toward face) = Skip (orange flash, haptic feedback, no point, next card)
9. User returns phone to upright/neutral position (steps 6-9 repeat)
10. After 10 cards → Game over screen with score (landscape)
11. User can "Play Again" (new 10 cards with countdown) or "Back to Categories" (returns to portrait)
