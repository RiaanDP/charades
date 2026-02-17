# E2E Tests - Playwright (Browser)

## Overview

This directory contains Playwright E2E tests for the Charades app running in the browser. These tests are **fast** and run against the Expo web build.

## Why Playwright?

- **Fast execution** - No emulator/device needed
- **Easy debugging** - UI mode and debug tools
- **Reliable** - Auto-waits for elements
- **Cross-browser** - Test on Chrome, Firefox, Safari (if needed)

## Running Tests

### Run all tests (headless)
```bash
npm run test:e2e
```

### Run with UI mode (visual, interactive)
```bash
npm run test:e2e:ui
```

### Run with browser visible (headed mode)
```bash
npm run test:e2e:headed
```

### Debug mode (step-by-step)
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:e2e:report
```

## Test Structure

```
e2e/
├── app.spec.ts          # Main app flow tests
└── README.md           # This file
```

## What Can Be Tested in Browser

✅ **Navigation**
- Category selection
- Screen transitions
- Back navigation
- Play again functionality

✅ **UI Elements**
- Text visibility
- Button interactions
- Card display
- Countdown timer
- Score display

✅ **Game Flow**
- Category → Countdown → Game
- Game Over screen
- State management

## What CANNOT Be Tested in Browser

❌ **Device-specific features:**
- Accelerometer gestures (tilt backward/forward)
- Haptic feedback
- Device orientation locking
- Native device APIs

**For device-specific testing**, use Maestro:
```bash
npm run test:e2e:device:studio
```

## Writing Tests

Playwright tests use a simple, intuitive API:

```typescript
import { test, expect } from '@playwright/test';

test('should load the home page', async ({ page }) => {
  await page.goto('/');

  // Wait for and verify elements
  await expect(page.getByText('Charades')).toBeVisible();

  // Click elements
  await page.getByText('Animals').click();

  // Check for patterns
  await expect(page.getByText(/Score: \d+/)).toBeVisible();
});
```

## Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:8081`
- **Browser**: Chromium (Chrome)
- **Timeout**: 30 seconds per test
- **Auto-start server**: Expo web server starts automatically

## Debugging Failed Tests

1. **View screenshots**: Captured automatically on failure in `test-results/`
2. **View traces**: Click through test execution in UI mode
3. **Watch video**: Failed test recordings saved automatically
4. **Use UI mode**: `npm run test:e2e:ui` for visual debugging

## CI/CD Integration

Tests run automatically in CI when configured. The Expo web server starts automatically, runs tests, then shuts down.

Example GitHub Actions:
```yaml
- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

## Tips

- **Fast feedback**: Use `test.only()` to run a single test during development
- **Debug specific test**: `npx playwright test app.spec.ts:10 --debug` (line 10)
- **Update snapshots**: `npm run test:e2e -- --update-snapshots`
- **Parallel execution**: Tests run in parallel by default for speed

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
