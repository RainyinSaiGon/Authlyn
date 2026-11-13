import { useSyncExternalStore } from "react";
import type { StoredSession } from "@/shared/types/auth";

// `authlyn.token` is also read by RequireAdmin.
export const ACCESS_TOKEN_KEY = "authlyn.token";
export const REFRESH_TOKEN_KEY = "authlyn.refreshToken";
export const SESSION_ID_KEY = "authlyn.sessionId";
export const USER_ID_KEY = "authlyn.userId";

const KEYS = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SESSION_ID_KEY, USER_ID_KEY] as const;

/*
 * The session lives in localStorage so it survives reloads and is shared by tabs.
 * That is a stopgap: the planned backend-for-frontend moves tokens into HttpOnly cookies.
 *
 * Reads go straight to localStorage (so tests and other tabs can change it underneath),
 * but the same object is returned until the stored values change, which is what
 * useSyncExternalStore needs to avoid re-rendering forever.
 */

type Listener = () => void;
const listeners = new Set<Listener>();
let snapshotKey: string | null = null;
let snapshot: StoredSession | null = null;

function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // storage blocked (private mode, sandboxed iframe)
  }
}

export function getSession(): StoredSession | null {
  const [accessToken, refreshToken, sessionId, userId] = KEYS.map(readItem);
  const key = `${accessToken}|${refreshToken}|${sessionId}|${userId}`;
  if (key !== snapshotKey) {
    snapshotKey = key;
    // A session without a refresh token still works until its access token expires.
    snapshot = accessToken
      ? { accessToken, refreshToken: refreshToken ?? "", sessionId: sessionId ?? "", userId: userId ?? "" }
      : null;
  }
  return snapshot;
}

function write(values: Partial<Record<(typeof KEYS)[number], string>>): void {
  try {
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) localStorage.setItem(key, value);
    }
  } catch {
    // Storage unavailable: the session lasts only for this page load.
  }
  notify();
}

/** Stores the tokens from any successful sign-in (login, signup, OAuth exchange). */
export function saveSession(session: StoredSession): void {
  write({
    [ACCESS_TOKEN_KEY]: session.accessToken,
    [REFRESH_TOKEN_KEY]: session.refreshToken,
    [SESSION_ID_KEY]: session.sessionId,
    [USER_ID_KEY]: session.userId,
  });
}

/** Replaces the token pair after a refresh rotation. */
export function updateTokens(accessToken: string, refreshToken: string): void {
  write({ [ACCESS_TOKEN_KEY]: accessToken, [REFRESH_TOKEN_KEY]: refreshToken });
}

export function clearSession(): void {
  try {
    for (const key of KEYS) localStorage.removeItem(key);
  } catch {
    // nothing stored
  }
  notify();
}

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  // Another tab signed in, refreshed, or signed out.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || (KEYS as readonly string[]).includes(event.key)) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** The current session, re-rendering when it changes in this tab or another. */
export function useSession(): StoredSession | null {
  return useSyncExternalStore(subscribe, getSession, () => null);
}
