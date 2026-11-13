import { authorizedRequest } from "@/features/auth/authorizedRequest";
import { clearSession } from "@/features/auth/session";
import type { CurrentUser } from "@/shared/types/auth";

/** Bearer-authenticated identity endpoints (api-endpoints.md §2.4–2.6). */
export const accountApi = {
  me: (signal?: AbortSignal) => authorizedRequest<CurrentUser>("/api/me", { signal }),
  logout: () => authorizedRequest<void>("/api/auth/logout", { method: "POST", body: {} }),
  logoutAll: () => authorizedRequest<void>("/api/auth/logout-all", { method: "POST" }),
};

/**
 * Signs out of this session. The local session is cleared even when the server call
 * fails (offline, token already revoked): the user asked to be signed out here.
 */
export async function signOut(): Promise<void> {
  try {
    await accountApi.logout();
  } catch {
    // best effort
  } finally {
    clearSession();
  }
}
