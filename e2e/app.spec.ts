import { test, expect } from '@playwright/test';

/**
 * Basic smoke tests for the Charades app
 * These tests verify the app loads and basic navigation works
 */

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

  test('should navigate to game screen when category is selected', async ({ page }) => {
    await page.goto('/');

    // Click the Animals category
    await page.getByText('Animals').click();

    // Wait for navigation to game screen
    // The countdown should appear (3, 2, or 1)
    await expect(page.getByText(/[321]/)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Charades App - Game Flow', () => {
  test('should show countdown before game starts', async ({ page }) => {
    await page.goto('/');

    // Navigate to game
    await page.getByText('Animals').click();

    // Verify countdown appears
    // Note: The countdown changes quickly (3->2->1), so we just check for digits
    const countdownVisible = await page.getByText(/[321]/).isVisible({ timeout: 3000 });
    expect(countdownVisible).toBe(true);
  });

  test('should show game UI after countdown', async ({ page }) => {
    await page.goto('/');

    // Navigate to game
    await page.getByText('Animals').click();

    // Wait for countdown to finish (3 seconds + buffer)
    await page.waitForTimeout(4000);

    // After countdown, should show card counter and score
    await expect(page.getByText(/\d+ \/ 10/)).toBeVisible(); // Card counter: "1 / 10"
    await expect(page.getByText(/Score: \d+/)).toBeVisible(); // Score: "Score: 0"

    // Should show a card with an animal name
    // Check for any of the possible animal cards
    const hasAnimalCard = await page.locator('text=/Lion|Elephant|Giraffe|Monkey|Penguin/i').isVisible();
    expect(hasAnimalCard).toBe(true);
  });
});
