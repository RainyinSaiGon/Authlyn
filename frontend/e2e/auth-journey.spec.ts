import type { Page } from '@playwright/test';
import { test, expect } from './support/fixtures';

const EMAIL = 'maya.tran@pagoda.dev';
const PASSWORD = 'Correct-horse-1';

async function signIn(page: Page, email = EMAIL, password = PASSWORD) {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

const profileHeading = (page: Page, name = 'Maya Tran') => page.getByRole('heading', { level: 1, name });

test('a new user signs up, lands on their profile and signs out', async ({ page, backend }) => {
  await page.goto('/auth/sign-up');
  await page.getByLabel('Display name (optional)').fill('Maya Tran');
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await expect(page.getByRole('list', { name: 'Requirements' }).getByText('(not met)')).toHaveCount(0);
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL(/\/account\/profile$/);
  await expect(profileHeading(page)).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/auth\/sign-in$/);
  expect(backend.count('POST /api/auth/logout')).toBe(1);

  // The session is gone: protected pages send the user back to sign in.
  await page.goto('/account/profile');
  await expect(page).toHaveURL(/\/auth\/sign-in$/);
});

test('signing up with a registered email marks the email field', async ({ page, backend }) => {
  backend.addUser(EMAIL, PASSWORD);
  await page.goto('/auth/sign-up');
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByText(/already exists/)).toBeVisible();
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Email')).toBeFocused();
});

test('a wrong password is refused, then the user signs in and returns to the page they wanted', async ({ page, backend }) => {
  backend.addUser(EMAIL, PASSWORD, 'Maya Tran');

  await page.goto('/account/sessions');
  await expect(page).toHaveURL(/\/auth\/sign-in$/);

  await signIn(page, EMAIL, 'wrong-password');
  await expect(page.getByRole('alert')).toHaveText('Email or password is incorrect.');

  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/account\/sessions$/);
});

test('sign-in works with the keyboard alone', async ({ page, backend }) => {
  backend.addUser(EMAIL, PASSWORD, 'Maya Tran');
  await page.goto('/auth/sign-in');

  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Email')).toBeFocused();
  await page.keyboard.type(EMAIL);
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Password')).toBeFocused();
  await page.keyboard.type(PASSWORD);
  await page.keyboard.press('Enter');

  await expect(profileHeading(page)).toBeVisible();
});

test('an expired access token is refreshed silently, once', async ({ page, backend }) => {
  backend.addUser(EMAIL, PASSWORD, 'Maya Tran');
  await page.goto('/auth/sign-in');
  await signIn(page);
  await expect(profileHeading(page)).toBeVisible();

  backend.expireAccessTokens();
  await page.reload();

  await expect(profileHeading(page)).toBeVisible();
  expect(backend.count('POST /api/public/auth/refresh')).toBe(1);
});

test('two tabs with an expired token share one refresh, so the session survives reuse detection', async ({ context, page, backend }) => {
  backend.addUser(EMAIL, PASSWORD, 'Maya Tran');
  await page.goto('/auth/sign-in');
  await signIn(page);
  await expect(profileHeading(page)).toBeVisible();

  backend.expireAccessTokens();
  const second = await context.newPage();
  await Promise.all([page.reload(), second.goto('/account/profile')]);

  await expect(profileHeading(page)).toBeVisible();
  await expect(profileHeading(second)).toBeVisible();
  // Without the cross-tab lock both tabs would send the same refresh token,
  // and the backend would treat the second as a replay and revoke the session.
  expect(backend.count('POST /api/public/auth/refresh')).toBe(1);
});

test('a session revoked elsewhere sends the user back to sign in', async ({ page, backend }) => {
  backend.addUser(EMAIL, PASSWORD, 'Maya Tran');
  await page.goto('/auth/sign-in');
  await signIn(page);
  await expect(profileHeading(page)).toBeVisible();

  backend.revokeAllSessions();
  backend.expireAccessTokens();
  await page.reload();

  await expect(page).toHaveURL(/\/auth\/sign-in$/);
  expect(await page.evaluate(() => localStorage.getItem('authlyn.token'))).toBeNull();
});

test('password reset: request a link, set a new password, sign in with it', async ({ page, backend }) => {
  backend.addUser(EMAIL, PASSWORD, 'Maya Tran');

  await page.goto('/auth/forgot-password');
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();

  const token = backend.lastResetTokenFor(EMAIL);
  expect(token).toBeDefined();
  await page.goto(`/auth/reset-password?token=${token}`);
  await expect(page).toHaveURL(/\/auth\/reset-password$/); // token removed from the address bar

  const NEW_PASSWORD = 'N3w-password!';
  await page.getByLabel('New password', { exact: true }).fill(NEW_PASSWORD);
  await page.getByLabel('Confirm password', { exact: true }).fill(NEW_PASSWORD);
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page.getByRole('heading', { name: 'Password updated' })).toBeVisible();

  await page.getByRole('link', { name: 'Sign in' }).click();
  await signIn(page, EMAIL, NEW_PASSWORD);
  await expect(profileHeading(page)).toBeVisible();

  // The link works once.
  await page.goto(`/auth/reset-password?token=${token}`);
  await page.getByLabel('New password', { exact: true }).fill('An0ther-pass!');
  await page.getByLabel('Confirm password', { exact: true }).fill('An0ther-pass!');
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page.getByRole('heading', { name: "This link isn't valid" })).toBeVisible();
});
