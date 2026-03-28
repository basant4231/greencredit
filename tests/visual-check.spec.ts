import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test('homepage visual check', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'homepage_complete.png', fullPage: true });
});

test('take login screenshot', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForSelector('h1');
  await page.screenshot({ path: 'login.png', fullPage: true });
});

test('take signup screenshot', async ({ page }) => {
  await page.goto(`${BASE_URL}/signup`);
  await page.waitForSelector('h1');
  await page.screenshot({ path: 'signup.png', fullPage: true });
});

test('take dashboard screenshot (unauthenticated)', async ({ page }) => {
  await page.goto(`${BASE_URL}/dashboard`);
  await page.screenshot({ path: 'dashboard_debug.png', fullPage: true });
  // Should show the "Please log in" message
  await page.waitForSelector('text=Please log in', { timeout: 15000 });
  await page.screenshot({ path: 'dashboard_unauth.png', fullPage: true });
});

test('take activities screenshot (unauthenticated)', async ({ page }) => {
  await page.goto(`${BASE_URL}/dashboard/activities`);
  // Since dashboard/layout doesn't block children yet, check for h1
  await page.waitForSelector('h1', { timeout: 10000 });
  await page.screenshot({ path: 'activities.png', fullPage: true });
});

test('take marketplace screenshot', async ({ page }) => {
  await page.goto(`${BASE_URL}/marketplace`);
  await page.waitForSelector('h1');
  await page.screenshot({ path: 'marketplace.png', fullPage: true });
});

test('take my-credits screenshot', async ({ page }) => {
  await page.goto(`${BASE_URL}/my-credits`);
  await page.waitForSelector('h1');
  await page.screenshot({ path: 'my-credits.png', fullPage: true });
});

test('take analytics screenshot', async ({ page }) => {
  await page.goto(`${BASE_URL}/analytics`);
  await page.waitForSelector('h1');
  await page.screenshot({ path: 'analytics.png', fullPage: true });
});
