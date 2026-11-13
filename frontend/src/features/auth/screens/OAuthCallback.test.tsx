import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OAuthCallback, AFTER_SIGN_IN_PATH } from './OAuthCallback';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SESSION_ID_KEY } from '@/features/auth/session';

const session = {
  userId: 'u-1',
  sessionId: 's-1',
  accessToken: 'access.jwt.token',
  refreshToken: 'refresh-token',
  expiresAt: '2026-11-14T00:15:00Z',
};

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path={AFTER_SIGN_IN_PATH} element={<p>Profile page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function mockFetch(response: Partial<Response>) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('OAuthCallback', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('exchanges the one-time code, stores the session and goes to the profile', async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, json: () => Promise.resolve(session) });

    renderAt('/oauth/callback?code=abc123');

    expect(await screen.findByText('Profile page')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/public\/auth\/oauth\/exchange$/);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ code: 'abc123' });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('access.jwt.token');
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('refresh-token');
    expect(localStorage.getItem(SESSION_ID_KEY)).toBe('s-1');
  });

  it('shows an error when the code was rejected', async () => {
    mockFetch({ ok: false, status: 401 });

    renderAt('/oauth/callback?code=used-code');

    expect(await screen.findByRole('alert')).toHaveTextContent(/expired or was already used/i);
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
  });

  it('explains account_link_required without calling the backend', async () => {
    const fetchMock = mockFetch({ ok: true });

    renderAt('/oauth/callback?error=account_link_required');

    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
    expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
  });

  it('shows an error when the code is missing', () => {
    mockFetch({ ok: true });

    renderAt('/oauth/callback');

    expect(screen.getByRole('alert')).toHaveTextContent(/incomplete/i);
  });

  it('falls back to a generic message for unknown errors', () => {
    mockFetch({ ok: true });

    renderAt('/oauth/callback?error=something_new');

    expect(screen.getByRole('alert')).toHaveTextContent(/sign-in failed/i);
  });
});
