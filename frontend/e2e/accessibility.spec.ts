import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './support/fixtures';

/**
 * The unit suite already runs axe on every route in jsdom. This runs it in a real browser,
 * on the real CSS and layout, for the public auth pages a customer sees first.
 * (Colour contrast still comes back "incomplete" here because of the gradient background;
 * see CLAUDE.md, Frontend Accessibility.)
 */
const PAGES = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password?token=t'];

for (const path of PAGES) {
  test(`${path} has no WCAG 2.2 A/AA violations in a real browser`, async ({ page, backend }) => {
    void backend; // installed so any stray API call is caught
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}
