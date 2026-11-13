import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SignUp, AFTER_SIGN_UP_PATH } from './SignUp';
import { server } from '@/test/msw/server';
import { ACCESS_TOKEN_KEY } from '@/features/auth/session';

function renderSignUp() {
  return render(
    <MemoryRouter initialEntries={['/auth/sign-up']}>
      <Routes>
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path={AFTER_SIGN_UP_PATH} element={<p>Profile page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

const passwordInput = () => screen.getByLabelText(/^password$/i);

describe('SignUp', () => {
  it('renders the form and links', () => {
    renderSignUp();
    expect(screen.getByRole('heading', { level: 1, name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('autocomplete', 'email');
    expect(passwordInput()).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up with a passkey/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('ticks off password rules as the user types', async () => {
    const user = userEvent.setup();
    renderSignUp();
    const rules = screen.getByRole('list', { name: 'Requirements' });

    expect(within(rules).getByText(/an uppercase letter/i)).toHaveTextContent('(not met)');

    await user.type(passwordInput(), 'Ab1!');

    expect(within(rules).getByText(/an uppercase letter/i)).toHaveTextContent('(met)');
    expect(within(rules).getByText(/a symbol/i)).toHaveTextContent('(met)');
    expect(within(rules).getByText(/8 to 128 characters/i)).toHaveTextContent('(not met)');
  });

  it('creates the account, stores the session and goes to the profile', async () => {
    let body: unknown;
    server.use(
      http.post('*/api/public/auth/signup', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(
          { userId: 'u', sessionId: 's', accessToken: 'new-access', refreshToken: 'new-refresh', createdAt: '2026-11-14T00:00:00Z' },
          { status: 201 }
        );
      })
    );
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/email/i), 'new@pagoda.dev');
    await user.type(passwordInput(), 'Str0ng-pass');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Profile page')).toBeInTheDocument();
    // A blank display name is left out rather than sent as "".
    expect(body).toEqual({ email: 'new@pagoda.dev', password: 'Str0ng-pass' });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('new-access');
  });

  it('rejects a weak password without calling the API', async () => {
    let called = false;
    server.use(http.post('*/api/public/auth/signup', () => { called = true; return HttpResponse.json({}); }));
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/email/i), 'new@pagoda.dev');
    await user.type(passwordInput(), 'password');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Password does not meet all the requirements')).toBeInTheDocument();
    expect(called).toBe(false);
  });

  it('marks the email field when the account already exists', async () => {
    server.use(http.post('*/api/public/auth/signup', () => new HttpResponse(null, { status: 409 })));
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/email/i), 'taken@pagoda.dev');
    await user.type(passwordInput(), 'Str0ng-pass');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/an account with this email already exists/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/email/i)).toHaveFocus();
  });
});
