import { test, expect } from '@playwright/test';

test.describe('Samarkand Text Converter E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Vite usually serves on 3000 in dev mode, but playwright runs against the preview or dev server.
    // We assume the user or the test runner will start the server.
    // For this environment, we should likely rely on `webServer` config or assume localhost:3000.
    // However, since I cannot easily "start" a background server and keep it running across tool calls
    // in a way guaranteed to be picked up by a separate tool call unless I use `run_in_bash_session` with `&`.
    // I will configure the Playwright config to launch the server.
    await page.goto('/');
  });

  test('App Loads and shows correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Samarkand/i); // Adjust based on actual title if different
    const header = page.getByRole('heading', { name: /MATN KONVERTORI/i });
    await expect(header).toBeVisible();
  });

  test('Transliteration Flow', async ({ page }) => {
    // 1. Clear input first (it has sample text)
    const clearBtn = page.getByRole('button', { name: /Kirishni Tozalash/i });
    await clearBtn.click();

    // 2. Type Cyrillic
    const inputArea = page.getByPlaceholder('// Matnni shu yerga kiriting...');
    await inputArea.fill('Салом Дунё');

    // 3. Check Output
    const outputArea = page.getByPlaceholder('// Natija shu yerda paydo bo\'ladi...');

    // Auto-conversion might be triggered. The roadmap said "Real-Time Trigger".
    // Let's wait for the value.
    await expect(outputArea).toHaveValue('Salom Dunyo');
  });

  test('Button Functionality - Copy and Clear', async ({ page }) => {
    const inputArea = page.getByPlaceholder('// Matnni shu yerga kiriting...');
    const clearBtn = page.getByRole('button', { name: /Kirishni Tozalash/i });

    // Clear
    await clearBtn.click();
    await expect(inputArea).toBeEmpty();

    // Type something
    await inputArea.fill('Test');

    // Copy button
    // The button text is "Chiqishni Nusxalash"
    // Since this requires clipboard permissions which might be flaky in headless,
    // we mostly check if the UI Feedback happens (Text changes to "Nusxalandi!").

    // Mock clipboard write if necessary, but browsers usually allow writeText in active tab.
    // However, in headless mode it can be restricted.
    // Let's try to click and see if the text changes.
    const copyBtn = page.getByRole('button', { name: /Chiqishni Nusxalash/i });
    await copyBtn.click();

    // Check for feedback text
    await expect(page.getByRole('button', { name: /Nusxalandi!/i })).toBeVisible();
  });

  test('Download Menu Toggles', async ({ page }) => {
    const downloadBtn = page.getByRole('button', { name: /Fayl Sifatida Yuklash/i });

    // It is disabled if input is empty?
    // Roadmap: "If input is empty, disable Export buttons"
    // So we need text.
    const inputArea = page.getByPlaceholder('// Matnni shu yerga kiriting...');
    const clearBtn = page.getByRole('button', { name: /Kirishni Tozalash/i });
    await clearBtn.click();
    await inputArea.fill('Content');

    // Click download menu trigger
    await downloadBtn.click();

    // Check if menu options appear
    await expect(page.getByRole('button', { name: /TXT \(\.txt\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /PDF \(\.pdf\)/i })).toBeVisible();

    // Click outside to close (simulated by clicking header)
    await page.locator('header').click();
    await expect(page.getByRole('button', { name: /TXT \(\.txt\)/i })).not.toBeVisible();
  });

  test('Mobile View Layout Check', async ({ page }) => {
    // Resize viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if Input and Output are stacked (visible)
    const inputArea = page.getByPlaceholder('// Matnni shu yerga kiriting...');
    const outputArea = page.getByPlaceholder('// Natija shu yerda paydo bo\'ladi...');

    await expect(inputArea).toBeVisible();
    await expect(outputArea).toBeVisible();

    // Check if title is visible (maybe smaller text, but present)
    await expect(page.getByRole('heading', { name: /MATN KONVERTORI/i })).toBeVisible();
  });
});
