import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OAuthCallback, AFTER_SIGN_IN_PATH } from './OAuthCallback';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SESSION_ID_KEY } from '@/features/auth/session';
import { server } from '@/test/msw/server';

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

/** Records every call to the exchange endpoint and answers with `response`. */
function exchangeReturning(response: () => Response) {
  const bodies: unknown[] = [];
  server.use(
    http.post('*/api/public/auth/oauth/exchange', async ({ request }) => {
      bodies.push(await request.json());
      return response();
    })
  );
  return bodies;
}

describe('OAuthCallback', () => {
  it('exchanges the one-time code once, stores the session and goes to the profile', async () => {
    const bodies = exchangeReturning(() =>
      HttpResponse.json({
        userId: 'u-1', sessionId: 's-1', accessToken: 'access.jwt.token', refreshToken: 'refresh-token',
        expiresAt: '2026-11-14T00:15:00Z',
      })
    );

    renderAt('/oauth/callback?code=abc123');

    expect(await screen.findByText('Profile page')).toBeInTheDocument();
    expect(bodies).toEqual([{ code: 'abc123' }]);
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('access.jwt.token');
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('refresh-token');
    expect(localStorage.getItem(SESSION_ID_KEY)).toBe('s-1');
  });

  it('shows an error when the code was rejected', async () => {
    exchangeReturning(() => new HttpResponse(null, { status: 401 }));

    renderAt('/oauth/callback?code=used-code');

    expect(await screen.findByRole('alert')).toHaveTextContent(/expired or was already used/i);
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
  });

  it('explains account_link_required without calling the backend', () => {
    const bodies = exchangeReturning(() => HttpResponse.json({}));

    renderAt('/oauth/callback?error=account_link_required');

    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);
    expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument();
    expect(bodies).toEqual([]);
  });

  it('shows an error when the code is missing', () => {
    renderAt('/oauth/callback');
    expect(screen.getByRole('alert')).toHaveTextContent(/incomplete/i);
  });

  it('falls back to a generic message for unknown errors', () => {
    renderAt('/oauth/callback?error=something_new');
    expect(screen.getByRole('alert')).toHaveTextContent(/sign-in failed/i);
  });
});
