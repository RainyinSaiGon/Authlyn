import type { BrowserContext, Route } from '@playwright/test';

/**
 * In-memory stand-in for the Authlyn identity API (docs/architecture/api-endpoints.md §2),
 * installed on a browser context with `context.route`. It keeps real state, so tests
 * exercise the frontend's real behaviour:
 * - access and refresh tokens are issued per session; refresh tokens are single use and
 *   rotate, and replaying one revokes the session (reuse detection, like the backend);
 * - `/api/me` only accepts a live access token for a live session;
 * - password reset issues a one-time token and revokes every session on success.
 */

type User = { userId: string; email: string; password: string; displayName: string | null; createdAt: string };
type Session = { sessionId: string; userId: string; revoked: boolean };

export class FakeBackend {
  private users = new Map<string, User>();
  private sessions = new Map<string, Session>();
  private accessTokens = new Map<string, string>(); // token -> sessionId
  private refreshTokens = new Map<string, { sessionId: string; used: boolean }>();
  private resetTokens = new Map<string, { email: string; used: boolean }>();
  private counter = 0;

  /** Calls by endpoint, e.g. calls['POST /api/public/auth/refresh']. */
  readonly calls: Record<string, number> = {};
  /** Requests the fake has no handler for. A test should end with this empty. */
  readonly unhandled: string[] = [];

  addUser(email: string, password: string, displayName: string | null = null): User {
    const user: User = {
      userId: `user-${++this.counter}`, email, password, displayName, createdAt: '2024-03-12T00:00:00Z',
    };
    this.users.set(email, user);
    return user;
  }

  /** Simulates every access token expiring (they keep working only after a refresh). */
  expireAccessTokens(): void {
    this.accessTokens.clear();
  }

  /** Simulates "sign out everywhere" from another device. */
  revokeAllSessions(): void {
    for (const session of this.sessions.values()) session.revoked = true;
  }

  /** The reset token the "email" would have contained. */
  lastResetTokenFor(email: string): string | undefined {
    return [...this.resetTokens.entries()].reverse().find(([, v]) => v.email === email)?.[0];
  }

  count(endpoint: string): number {
    return this.calls[endpoint] ?? 0;
  }

  async install(context: BrowserContext): Promise<void> {
    await context.route('**/api/**', (route) => this.handle(route));
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const key = `${request.method()} ${path}`;
    this.calls[key] = (this.calls[key] ?? 0) + 1;
    const body = request.postDataJSON() as Record<string, string> | null;

    switch (key) {
      case 'POST /api/public/auth/signup': {
        if (this.users.has(body?.email ?? '')) return status(route, 409);
        const user = this.addUser(body!.email!, body!.password!, body?.displayName ?? null);
        return json(route, 201, { ...this.startSession(user), createdAt: user.createdAt });
      }
      case 'POST /api/public/auth/login': {
        const user = this.users.get(body?.email ?? '');
        if (!user || user.password !== body?.password) return status(route, 401);
        return json(route, 200, { ...this.startSession(user), expiresAt: '2030-01-01T00:00:00Z' });
      }
      case 'POST /api/public/auth/refresh': {
        const entry = this.refreshTokens.get(body?.refreshToken ?? '');
        const session = entry && this.sessions.get(entry.sessionId);
        if (!entry || !session || session.revoked) return status(route, 401);
        if (entry.used) {
          session.revoked = true; // reuse detection
          return status(route, 401);
        }
        entry.used = true;
        const { accessToken, refreshToken } = this.issueTokens(session.sessionId);
        return json(route, 200, { accessToken, refreshToken, accessTokenExpiresAt: '2030-01-01T00:00:00Z' });
      }
      case 'GET /api/me': {
        const session = this.sessionFor(request.headers()['authorization']);
        if (!session) return status(route, 401);
        const user = [...this.users.values()].find((u) => u.userId === session.userId)!;
        return json(route, 200, {
          userId: user.userId, email: user.email, emailVerified: true,
          displayName: user.displayName, createdAt: user.createdAt,
        });
      }
      case 'POST /api/auth/logout': {
        const session = this.sessionFor(request.headers()['authorization']);
        if (!session) return status(route, 401);
        session.revoked = true;
        return status(route, 204);
      }
      case 'POST /api/public/auth/password-reset/request': {
        if (this.users.has(body?.email ?? '')) {
          this.resetTokens.set(`reset-${++this.counter}`, { email: body!.email!, used: false });
        }
        return status(route, 204); // same answer whether or not the account exists
      }
      case 'POST /api/public/auth/password-reset/confirm': {
        const entry = this.resetTokens.get(body?.resetToken ?? '');
        if (!entry || entry.used) return status(route, 401);
        entry.used = true;
        const user = this.users.get(entry.email)!;
        user.password = body!.newPassword!;
        for (const s of this.sessions.values()) if (s.userId === user.userId) s.revoked = true;
        return status(route, 204);
      }
      default:
        this.unhandled.push(key);
        return status(route, 404);
    }
  }

  private startSession(user: User) {
    const sessionId = `session-${++this.counter}`;
    this.sessions.set(sessionId, { sessionId, userId: user.userId, revoked: false });
    return { userId: user.userId, sessionId, ...this.issueTokens(sessionId) };
  }

  private issueTokens(sessionId: string) {
    const accessToken = `access-${++this.counter}`;
    const refreshToken = `refresh-${++this.counter}`;
    this.accessTokens.set(accessToken, sessionId);
    this.refreshTokens.set(refreshToken, { sessionId, used: false });
    return { accessToken, refreshToken };
  }

  private sessionFor(authorization: string | undefined): Session | undefined {
    const token = authorization?.replace(/^Bearer /, '') ?? '';
    const session = this.sessions.get(this.accessTokens.get(token) ?? '');
    return session && !session.revoked ? session : undefined;
  }
}

function json(route: Route, statusCode: number, body: unknown) {
  return route.fulfill({ status: statusCode, contentType: 'application/json', body: JSON.stringify(body) });
}

function status(route: Route, statusCode: number) {
  return route.fulfill({ status: statusCode, body: '' });
}
