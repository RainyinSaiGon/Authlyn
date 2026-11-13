import type { LoginResponse } from "@/shared/types/auth";

// `authlyn.token` is the key RequireAuth and RequireAdmin read.
export const ACCESS_TOKEN_KEY = "authlyn.token";
export const REFRESH_TOKEN_KEY = "authlyn.refreshToken";
export const SESSION_ID_KEY = "authlyn.sessionId";

/**
 * Stores the tokens from a successful login.
 * localStorage is a stopgap until the planned BFF moves tokens into HttpOnly cookies.
 */
export function saveSession(session: LoginResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(SESSION_ID_KEY, session.sessionId);
}
