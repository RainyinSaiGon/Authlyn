import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';
import { expectNoA11yViolations } from '@/test/a11y';

/** An unsigned JWT whose payload grants the admin role, enough for RequireAdmin's client-side check. */
function fakeAdminToken(): string {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, '');
  return `${encode({ alg: 'none' })}.${encode({ sub: 'user-1', roles: ['admin'] })}.`;
}

const PAGES = [
  '/', '/pricing', '/docs',
  '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password?token=t',
  '/auth/verify-email', '/auth/mfa', '/auth/passkey-enroll', '/auth/sso', '/oauth/callback',
  '/account/profile', '/account/security', '/account/sessions', '/account/apps', '/account/keys',
  '/admin', '/admin/users', '/admin/users/usr_1', '/admin/roles', '/admin/orgs', '/admin/apps',
  '/admin/sessions', '/admin/audit', '/admin/settings', '/admin/keys', '/admin/webhooks',
  '/admin/jwks', '/admin/logs',
  '/onboarding', '/mobile/sign-in', '/mobile/mfa', '/mobile/passkey',
  '/500', '/maintenance', '/no-such-page',
];

describe('every page meets WCAG 2.2 A/AA (axe-core, contrast excluded)', () => {
  beforeEach(() => {
    localStorage.setItem('authlyn.token', fakeAdminToken());
    localStorage.setItem('authlyn.refreshToken', 'refresh-1');
  });

  it.each(PAGES)('%s', async (path) => {
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    const { container } = render(<RouterProvider router={router} />);

    // Let data-loading screens settle before auditing.
    await screen.findAllByRole('heading');
    await waitFor(() => expect(container.querySelector('[aria-busy="true"]')).toBeNull());

    await expectNoA11yViolations(container);
  });
});
