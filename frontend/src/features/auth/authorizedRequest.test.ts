import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { testUser } from '@/test/msw/handlers';
import { HttpError } from '@/shared/api/http';
import { authorizedRequest } from './authorizedRequest';
import { getSession, saveSession } from './session';

function signIn(accessToken = 'access-1', refreshToken = 'refresh-1') {
  saveSession({ userId: 'user-1', sessionId: 'session-1', accessToken, refreshToken });
}

/** /api/me that accepts only `validToken`, and records the Authorization headers it saw. */
function meAccepting(validToken: string) {
  const seen: (string | null)[] = [];
  server.use(
    http.get('*/api/me', ({ request }) => {
      const auth = request.headers.get('Authorization');
      seen.push(auth);
      return auth === `Bearer ${validToken}`
        ? HttpResponse.json(testUser)
        : new HttpResponse(null, { status: 401 });
    })
  );
  return seen;
}

describe('authorizedRequest', () => {
  it('sends the stored access token', async () => {
    signIn();
    const seen = meAccepting('access-1');

    await expect(authorizedRequest('/api/me')).resolves.toEqual(testUser);
    expect(seen).toEqual(['Bearer access-1']);
  });

  it('fails with 401 without calling the API when signed out', async () => {
    const seen = meAccepting('access-1');
    await expect(authorizedRequest('/api/me')).rejects.toMatchObject({ status: 401 });
    expect(seen).toEqual([]);
  });

  it('refreshes once on 401, stores the rotated tokens and retries', async () => {
    signIn('expired', 'refresh-1');
    const seen = meAccepting('access-2');
    const refreshBodies: unknown[] = [];
    server.use(
      http.post('*/api/public/auth/refresh', async ({ request }) => {
        refreshBodies.push(await request.json());
        return HttpResponse.json({ accessToken: 'access-2', refreshToken: 'refresh-2', accessTokenExpiresAt: 'x' });
      })
    );

    await expect(authorizedRequest('/api/me')).resolves.toEqual(testUser);

    expect(seen).toEqual(['Bearer expired', 'Bearer access-2']);
    expect(refreshBodies).toEqual([{ refreshToken: 'refresh-1' }]);
    expect(getSession()).toMatchObject({ accessToken: 'access-2', refreshToken: 'refresh-2' });
  });

  it('shares one refresh between concurrent requests, so a refresh token is never replayed', async () => {
    signIn('expired', 'refresh-1');
    meAccepting('access-2');
    let refreshCalls = 0;
    server.use(
      http.post('*/api/public/auth/refresh', async () => {
        refreshCalls += 1;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return HttpResponse.json({ accessToken: 'access-2', refreshToken: 'refresh-2', accessTokenExpiresAt: 'x' });
      })
    );

    const results = await Promise.all([
      authorizedRequest('/api/me'),
      authorizedRequest('/api/me'),
      authorizedRequest('/api/me'),
    ]);

    expect(results).toEqual([testUser, testUser, testUser]);
    expect(refreshCalls).toBe(1);
  });

  it('does not refresh again when the tokens were already rotated after the request was sent', async () => {
    // Another tab refreshed between this request going out and its 401 coming back.
    signIn('expired', 'refresh-1');
    let refreshCalls = 0;
    server.use(
      http.get('*/api/me', ({ request }) => {
        if (request.headers.get('Authorization') === 'Bearer expired') {
          saveSession({ userId: 'user-1', sessionId: 'session-1', accessToken: 'from-other-tab', refreshToken: 'refresh-2' });
          return new HttpResponse(null, { status: 401 });
        }
        return HttpResponse.json(testUser);
      }),
      http.post('*/api/public/auth/refresh', () => { refreshCalls += 1; return HttpResponse.json({}); })
    );

    await expect(authorizedRequest('/api/me')).resolves.toEqual(testUser);
    expect(refreshCalls).toBe(0);
  });

  it('clears the session when the refresh token is rejected', async () => {
    signIn('expired', 'revoked');
    meAccepting('never');
    server.use(http.post('*/api/public/auth/refresh', () => new HttpResponse(null, { status: 401 })));

    const error = await authorizedRequest('/api/me').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(401);
    expect(getSession()).toBeNull();
  });

  it('keeps the session when the refresh fails for another reason', async () => {
    signIn('expired', 'refresh-1');
    meAccepting('never');
    server.use(http.post('*/api/public/auth/refresh', () => new HttpResponse(null, { status: 503 })));

    await expect(authorizedRequest('/api/me')).rejects.toMatchObject({ status: 503 });
    expect(getSession()).toMatchObject({ refreshToken: 'refresh-1' });
  });

  it('does not refresh on errors other than 401', async () => {
    signIn();
    let refreshCalls = 0;
    server.use(
      http.get('*/api/me', () => new HttpResponse(null, { status: 403 })),
      http.post('*/api/public/auth/refresh', () => { refreshCalls += 1; return HttpResponse.json({}); })
    );

    await expect(authorizedRequest('/api/me')).rejects.toMatchObject({ status: 403 });
    expect(refreshCalls).toBe(0);
  });
});
