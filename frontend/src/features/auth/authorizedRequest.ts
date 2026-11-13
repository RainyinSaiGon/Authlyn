import { HttpError, request, type RequestOptions } from "@/shared/api/http";
import { authApi } from "@/features/auth/api/authApi";
import { clearSession, getSession, updateTokens } from "@/features/auth/session";

const REFRESH_LOCK = "authlyn-token-refresh";

let refreshInFlight: Promise<string> | null = null;

/**
 * Rotates the refresh token and returns a fresh access token.
 *
 * Refresh tokens are single use and the backend revokes the whole session when one is
 * replayed (reuse detection), so two refreshes with the same token must never race:
 * - within a tab, concurrent callers share one in-flight promise;
 * - across tabs, a Web Lock serialises refreshes, and a tab that waited re-reads storage
 *   and reuses the tokens another tab already rotated.
 */
export function refreshAccessToken(): Promise<string> {
  refreshInFlight ??= withRefreshLock(rotate).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function rotate(staleAccessToken: string | undefined): Promise<string> {
  const session = getSession();
  if (!session) throw new HttpError(401);
  if (!session.refreshToken) {
    clearSession();
    throw new HttpError(401);
  }
  if (staleAccessToken && session.accessToken !== staleAccessToken) {
    return session.accessToken; // another tab refreshed while we waited for the lock
  }
  try {
    const rotated = await authApi.refresh(session.refreshToken);
    updateTokens(rotated.accessToken, rotated.refreshToken);
    return rotated.accessToken;
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) clearSession();
    throw error;
  }
}

function withRefreshLock(task: (staleAccessToken: string | undefined) => Promise<string>): Promise<string> {
  const staleAccessToken = getSession()?.accessToken;
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  if (!locks) return task(staleAccessToken);
  return locks.request(REFRESH_LOCK, () => task(staleAccessToken));
}

export type AuthorizedRequestOptions = Omit<RequestOptions, "accessToken">;

/**
 * `request` with the stored bearer token. On `401` it refreshes once and retries;
 * if the refresh is rejected the session is cleared and the `HttpError(401)` is rethrown.
 */
export async function authorizedRequest<T>(path: string, options: AuthorizedRequestOptions = {}): Promise<T> {
  const session = getSession();
  if (!session) throw new HttpError(401);

  try {
    return await request<T>(path, { ...options, accessToken: session.accessToken });
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 401) throw error;
    const accessToken = await refreshAccessToken();
    return request<T>(path, { ...options, accessToken });
  }
}
