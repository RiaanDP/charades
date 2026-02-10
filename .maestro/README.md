# Maestro E2E Tests - Charades App

## Overview

This directory contains Maestro E2E (End-to-End) tests for the Charades mobile app. Maestro is a simple, declarative testing framework for mobile apps that uses YAML-based test flows.

## Installation

Maestro is already installed (version 2.1.0). If you need to reinstall or upgrade:

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Requirements:**
- Java (OpenJDK 11 or later)
- iOS Simulator (for iOS testing) or Android Emulator (for Android testing)

## Directory Structure

```
.maestro/
├── config.yaml           # Maestro configuration (app ID, environment variables)
├── flows/                # Test flow files (YAML)
│   └── (tests to be added incrementally)
└── README.md            # This file
```

## Running Tests

### Prerequisites

1. Build and install the app on a simulator/emulator:
   ```bash
   # iOS
   npx expo start --ios

   # Android
   npx expo start --android
   ```

2. Ensure the simulator/emulator is running and the app is installed

### Run All Tests

```bash
npm run test:e2e
```

This runs all test flows in the `.maestro/flows/` directory.

### Interactive Testing

Use Maestro Studio for interactive test development:

```bash
npm run test:e2e:studio
```

This opens an interactive UI where you can:
- See the current screen
- Tap elements to generate test commands
- Build flows visually

### Record Tests

Record your manual interactions to generate test flows:

```bash
npm run test:e2e:record
```

Follow the prompts, perform actions in your app, and Maestro will generate a YAML test flow.

## Configuration

The `config.yaml` file contains:

- **appId**: Bundle identifier for the app (`com.anonymous.charades`)
  - Update this if you've set a custom bundle identifier in `app.json`
- **includeTags**: Tags for organizing tests
- **env**: Environment variables accessible in test flows

## Test Flow Format

Test flows are written in YAML. Example:

```yaml
appId: com.anonymous.charades
tags:
  - smoke
  - automated

---
# Test: App launches successfully
- launchApp
- assertVisible: "Charades"
- assertVisible: "Animals"
- takeScreenshot: "home-screen"
```

Learn more: https://maestro.mobile.dev/getting-started/writing-your-first-flow

## Known Limitations

### ⚠️ Accelerometer Testing

**Maestro cannot simulate accelerometer sensor data.** This means:

- ❌ Cannot automatically test tilt gestures (backward = correct, forward = skip)
- ❌ Cannot fully automate gameplay that requires physical device movement

### Workarounds

1. **Manual Test Flows**: Create test flows that pause for manual gesture execution
2. **Debug Builds**: Add debug-only buttons that simulate gestures (optional future enhancement)
3. **UI-Only Testing**: Focus automated tests on navigation, UI states, and button interactions

## What Can Be Tested (Automatically)

✅ Category selection screen
✅ Navigation flows (category → game → game over → back)
✅ Countdown timer (3-2-1)
✅ UI state changes
✅ Button interactions ("Play Again", "Back to Categories")
✅ Text visibility and assertions
✅ Screen orientation changes

## What Requires Manual Testing

⚠️ Tilt backward gesture (mark correct)
⚠️ Tilt forward gesture (skip)
⚠️ Score increments from gestures
⚠️ Haptic feedback
⚠️ Visual flash effects (green/orange)
⚠️ Complete gameplay rounds

## Next Steps

Tests will be added incrementally:

1. **Smoke test** - Verify app launches and basic navigation
2. **Category selection** - Test category screen UI and navigation
3. **Countdown flow** - Test 3-2-1 countdown timer
4. **Game navigation** - Test full navigation flow
5. **Play again** - Test play again button (requires manual game completion)
6. **Back navigation** - Test back to categories button

## Debugging Tests

If a test fails:

1. **Run with verbose output:**
   ```bash
   maestro test --debug .maestro/flows/test-name.yaml
   ```

2. **Check screenshots:**
   Screenshots are saved to `~/.maestro/tests/<timestamp>/`

3. **Use interactive mode:**
   ```bash
   maestro studio
   ```
   Step through the flow and inspect element hierarchy

## Useful Commands

```bash
# Run a specific test flow
maestro test .maestro/flows/test-name.yaml

# Run multiple flows
maestro test .maestro/flows/01-*.yaml .maestro/flows/02-*.yaml

# Run with tags
maestro test --tags automated .maestro/flows/

# Generate HTML report
maestro test .maestro/flows/ --format junit --output test-results/

# List all connected devices
maestro devices
```

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Writing Test Flows](https://maestro.mobile.dev/getting-started/writing-your-first-flow)
- [Maestro API Reference](https://maestro.mobile.dev/api-reference/commands)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)

## Troubleshooting

### "App not found" error

Ensure the app is installed on the simulator:
```bash
xcrun simctl listapps booted | grep charades  # iOS
adb shell pm list packages | grep charades     # Android
```

### Java not found

Install OpenJDK:
```bash
sudo apt install default-jdk  # Linux
brew install openjdk          # macOS
```

### Maestro command not found

Add to your PATH:
```bash
export PATH="$PATH":"$HOME/.maestro/bin"
```

Or restart your terminal to load the updated `.bashrc`/`.zshrc`.
