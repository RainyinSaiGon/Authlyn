import { HttpError, request, type RequestOptions } from "@/shared/api/http";
import { authApi } from "@/features/auth/api/authApi";
import { clearSession, getSession, updateTokens } from "@/features/auth/session";

const REFRESH_LOCK = "authlyn-token-refresh";

let refreshInFlight: Promise<string> | null = null;

/**
 * Returns an access token newer than `rejectedAccessToken`, rotating the refresh token
 * only if nobody has done it yet.
 *
 * Refresh tokens are single use and the backend revokes the whole session when one is
 * replayed (reuse detection), so refreshes must never race, and should not repeat:
 * - within a tab, concurrent callers share one in-flight promise;
 * - across tabs, a Web Lock serialises refreshes;
 * - inside the lock, if storage already holds a token other than the one the server
 *   rejected, another tab (or an earlier refresh here) already rotated: reuse it.
 */
export function refreshAccessToken(rejectedAccessToken: string): Promise<string> {
  refreshInFlight ??= withRefreshLock(() => rotate(rejectedAccessToken)).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function rotate(rejectedAccessToken: string): Promise<string> {
  const session = getSession();
  if (!session) throw new HttpError(401);
  if (session.accessToken !== rejectedAccessToken) {
    return session.accessToken; // already refreshed by another tab or an earlier call
  }
  if (!session.refreshToken) {
    clearSession();
    throw new HttpError(401);
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

function withRefreshLock(task: () => Promise<string>): Promise<string> {
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  return locks ? locks.request(REFRESH_LOCK, task) : task();
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
    const accessToken = await refreshAccessToken(session.accessToken);
    return request<T>(path, { ...options, accessToken });
  }
}
