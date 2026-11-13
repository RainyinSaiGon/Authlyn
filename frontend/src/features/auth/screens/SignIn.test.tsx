import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SignIn } from './SignIn';
import { server } from '@/test/msw/server';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SESSION_ID_KEY } from '@/features/auth/session';

function renderSignIn(state?: { from?: string }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/auth/sign-in', state }]}>
      <Routes>
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/account/profile" element={<p>Profile page</p>} />
        <Route path="/account/sessions" element={<p>Sessions page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

async function fillAndSubmit(email = 'maya.tran@pagoda.dev', password = 'Correct-horse-1') {
  const user = userEvent.setup();
  if (email) await user.type(screen.getByLabelText(/email/i), email);
  if (password) await user.type(screen.getByLabelText(/password/i), password);
  await user.click(screen.getByRole('button', { name: /^sign in$/i }));
  return user;
}

describe('SignIn', () => {
  it('renders the form, providers and links', () => {
    renderSignIn();
    expect(screen.getByRole('heading', { level: 1, name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'username');
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('autocomplete', 'current-password');
    expect(screen.getByRole('button', { name: /^sign in$/i })).toHaveAttribute('type', 'submit');
    expect(screen.getByText(/or continue with/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /passkey/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create one/i })).toBeInTheDocument();
  });

  it('signs in, stores the session and goes to the profile', async () => {
    let body: unknown;
    server.use(
      http.post('*/api/public/auth/login', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({
          userId: 'user-1', sessionId: 'session-9', accessToken: 'access-9', refreshToken: 'refresh-9',
          expiresAt: '2026-11-14T00:15:00Z',
        });
      })
    );
    renderSignIn();

    await fillAndSubmit();

    expect(await screen.findByText('Profile page')).toBeInTheDocument();
    expect(body).toEqual({ email: 'maya.tran@pagoda.dev', password: 'Correct-horse-1' });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('access-9');
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('refresh-9');
    expect(localStorage.getItem(SESSION_ID_KEY)).toBe('session-9');
  });

  it('returns to the page the user was sent away from', async () => {
    renderSignIn({ from: '/account/sessions' });
    await fillAndSubmit();
    expect(await screen.findByText('Sessions page')).toBeInTheDocument();
  });

  it('ignores a return path that points off-site', async () => {
    renderSignIn({ from: '//evil.example/phish' });
    await fillAndSubmit();
    expect(await screen.findByText('Profile page')).toBeInTheDocument();
  });

  it('validates fields before calling the API', async () => {
    let called = false;
    server.use(http.post('*/api/public/auth/login', () => { called = true; return HttpResponse.json({}); }));
    renderSignIn();

    await fillAndSubmit('not-an-email', '');

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/email/i)).toHaveAccessibleDescription('Enter a valid email address');
    expect(called).toBe(false);
  });

  it('shows one message for wrong credentials, without saying which part was wrong', async () => {
    server.use(http.post('*/api/public/auth/login', () => new HttpResponse(null, { status: 401 })));
    renderSignIn();

    await fillAndSubmit();

    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
  });

  it('explains the rate limit', async () => {
    server.use(http.post('*/api/public/auth/login', () => new HttpResponse(null, { status: 429 })));
    renderSignIn();
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/too many attempts/i);
  });

  it('explains when the API is down behind the gateway', async () => {
    server.use(http.post('*/api/public/auth/login', () => new HttpResponse(null, { status: 502 })));
    renderSignIn();
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
  });

  it('explains a network failure', async () => {
    server.use(http.post('*/api/public/auth/login', () => HttpResponse.error()));
    renderSignIn();
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/can't reach authlyn/i);
  });

  it('disables the button while signing in', async () => {
    let release!: () => void;
    server.use(
      http.post('*/api/public/auth/login', async () => {
        await new Promise<void>((resolve) => { release = resolve; });
        return new HttpResponse(null, { status: 401 });
      })
    );
    renderSignIn();

    await fillAndSubmit();

    expect(await screen.findByRole('button', { name: /signing in/i })).toBeDisabled();
    release();
    expect(await screen.findByRole('button', { name: /^sign in$/i })).toBeEnabled();
  });
});
