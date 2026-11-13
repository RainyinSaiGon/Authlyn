import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Profile } from './Profile';
import { server } from '@/test/msw/server';

beforeEach(() => {
  localStorage.setItem('authlyn.token', 'test-token');
});

afterEach(() => {
  localStorage.clear();
});

function renderProfile() {
  return render(
    <MemoryRouter initialEntries={['/account/profile']}>
      <Routes>
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/auth/sign-in" element={<p>Sign in page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Profile', () => {
  it('shows the signed-in user from /api/me', async () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 1, name: /loading your profile/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: /maya tran/i })).toBeInTheDocument();
    expect(screen.getByText(/maya\.tran@pagoda\.dev — since 12 Mar 2024/)).toBeInTheDocument();
  });

  it('shows an error when the profile cannot be loaded', async () => {
    server.use(http.get('*/api/me', () => new HttpResponse(null, { status: 500 })));
    renderProfile();
    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't load your profile/i);
  });

  it('signs out: calls the API, clears the session and goes to sign in', async () => {
    let logoutAuth: string | null = null;
    server.use(
      http.post('*/api/auth/logout', ({ request }) => {
        logoutAuth = request.headers.get('Authorization');
        return new HttpResponse(null, { status: 204 });
      })
    );
    const user = userEvent.setup();
    renderProfile();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(await screen.findByText('Sign in page')).toBeInTheDocument();
    expect(logoutAuth).toBe('Bearer test-token');
    expect(localStorage.getItem('authlyn.token')).toBeNull();
  });

  it('renders the PROFILE eyebrow', () => {
    renderProfile();
    expect(screen.getByText('PROFILE')).toBeInTheDocument();
  });

  it('renders the linked identities section', () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 2, name: /linked identities/i })).toBeInTheDocument();
  });

  it('renders all three identity providers', () => {
    renderProfile();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Slack')).toBeInTheDocument();
  });
});
