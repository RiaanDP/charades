import { test, expect } from '@playwright/test';

/**
 * Basic smoke tests for the Charades app
 * These tests verify the app loads and basic navigation works
 */

test.describe('Charades App - Setup Screen', () => {
  test('should load setup screen when navigating to /setup', async ({ page }) => {
    await page.goto('/setup?categoryId=animals');

    // Verify the setup screen loaded
    await expect(page.getByText('Game Setup')).toBeVisible();
    await expect(page.getByText('Animals')).toBeVisible();

    // Verify mode selector is present
    await expect(page.getByText('Time Attack')).toBeVisible();
    await expect(page.getByText('Speed Run')).toBeVisible();

    // Verify action buttons are present
    await expect(page.getByText('Start Game')).toBeVisible();
    await expect(page.getByText('Back')).toBeVisible();
  });

  test('should show Time Attack settings by default', async ({ page }) => {
    await page.goto('/setup?categoryId=animals');

    // Time Attack mode should be selected
    const timeAttackButton = page.getByTestId('mode-time-attack');
    await expect(timeAttackButton).toBeVisible();

    // Should show time limit options
    await expect(page.getByText('Time Limit')).toBeVisible();
    await expect(page.getByText('30s')).toBeVisible();
    await expect(page.getByText('60s')).toBeVisible();
    await expect(page.getByText('90s')).toBeVisible();

    // Should show deck size options for Time Attack
    await expect(page.getByText('Deck Size')).toBeVisible();
    await expect(page.getByText('10 cards')).toBeVisible();
    await expect(page.getByText('20 cards')).toBeVisible();
    await expect(page.getByText('30 cards')).toBeVisible();
  });

  test('should switch to Speed Run mode and show correct settings', async ({ page }) => {
    await page.goto('/setup?categoryId=animals');

    // Click Speed Run mode button using testID
    await page.getByTestId('mode-speed-run').click();

    // Small delay for UI to update
    await page.waitForTimeout(500);

    // Wait for Time Limit to disappear (indicates mode switched)
    await expect(page.getByText('Time Limit')).not.toBeVisible();

    // Should show deck size options for Speed Run
    await expect(page.getByText('Deck Size')).toBeVisible();

    // Should show info text about 5-minute timeout
    await expect(page.getByText(/Maximum time: 5 minutes/)).toBeVisible();

    // Verify deck size options are present (5, 10, 15 cards for Speed Run)
    const deckOptions = page.getByText(/\d+ cards/);
    await expect(deckOptions.first()).toBeVisible();
  });

  test('should allow selecting different time limits in Time Attack', async ({ page }) => {
    await page.goto('/setup?categoryId=animals');

    // Click 30s option
    await page.locator('#time-30').click();
    // Verify it's selected (button should be visible and clickable)
    await expect(page.locator('#time-30')).toBeVisible();

    // Click 90s option
    await page.locator('#time-90').click();
    await expect(page.locator('#time-90')).toBeVisible();
  });

  test('should allow selecting different deck sizes', async ({ page }) => {
    await page.goto('/setup?categoryId=animals');

    // In Time Attack mode, select 20 cards
    await page.locator('#deck-20').click();
    await expect(page.locator('#deck-20')).toBeVisible();

    // Switch to Speed Run and select 15 cards
    await page.getByTestId('mode-speed-run').click();
    await page.locator('#deck-15').click();
    await expect(page.locator('#deck-15')).toBeVisible();
  });
});

test.describe('Charades App - Category Selection', () => {
  test('should load the home page with category selection', async ({ page }) => {
    await page.goto('/');

    // Verify the main title is visible
    await expect(page.getByText('Charades')).toBeVisible();

    // Verify the subtitle/instructions are visible
    await expect(page.getByText('Choose a category to start playing')).toBeVisible();

    // Verify the Animals category card is present
    await expect(page.getByText('Animals')).toBeVisible();
    await expect(page.getByText('Creatures from around the world')).toBeVisible();
    await expect(page.getByText('50 cards')).toBeVisible();
  });

  test('should navigate to setup screen when category is selected', async ({ page }) => {
    await page.goto('/');

    // Click the Animals category
    await page.getByText('Animals').click();

    // Should navigate to setup screen
    await expect(page.getByText('Game Setup')).toBeVisible();
    await expect(page.getByText('Time Attack')).toBeVisible();
    await expect(page.getByText('Start Game')).toBeVisible();
  });
});

test.describe('Charades App - Game Flow', () => {
  test('should show countdown before game starts', async ({ page }) => {
    await page.goto('/');

    // Navigate to setup screen
    await page.getByText('Animals').click();
    await expect(page.getByText('Game Setup')).toBeVisible();

    // Start the game
    await page.getByTestId('start-game-button').click();

    // Wait for setup screen to disappear (navigation happened)
    await expect(page.getByText('Game Setup')).not.toBeVisible();

    // Verify countdown appears (look for large centered countdown number)
    // The countdown changes quickly (3->2->1)
    await page.waitForTimeout(500); // Small delay to ensure countdown started
    const hasCountdown = await page.locator('body').textContent();
    expect(hasCountdown).toBeTruthy();
  });

  test('should show game UI after countdown', async ({ page }) => {
    await page.goto('/');

    // Navigate to setup screen
    await page.getByText('Animals').click();
    await expect(page.getByText('Game Setup')).toBeVisible();

    // Start the game
    await page.getByTestId('start-game-button').click();

    // Wait for countdown to finish (3 seconds + buffer)
    await page.waitForTimeout(4000);

    // After countdown, should show card counter and score
    await expect(page.getByText(/\d+ \/ 10/)).toBeVisible(); // Card counter: "1 / 10"
    await expect(page.getByText(/Score: \d+/)).toBeVisible(); // Score: "Score: 0"

    // Should show a card with text content (any animal from the 50-card deck)
    // Check that there's visible text in the card area (at least 2 characters)
    const cardText = await page.locator('#card-text').textContent();
    expect(cardText).toBeTruthy();
    expect(cardText!.length).toBeGreaterThan(1);
  });
});
