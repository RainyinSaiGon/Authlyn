import { useEffect, useState } from 'react';
import { accountApi } from '@/features/auth/api/accountApi';
import { useSession } from '@/features/auth/session';
import type { CurrentUser } from '@/shared/types/auth';

export type CurrentUserState =
  | { status: 'loading' }
  | { status: 'ready'; user: CurrentUser }
  | { status: 'error' };

type Loaded = { sessionId: string | undefined; result: Exclude<CurrentUserState, { status: 'loading' }> };

/**
 * Loads `GET /api/me` for the signed-in user and reloads when the session changes.
 * If the session can't be refreshed it is cleared, and `RequireAuth` sends the user to sign in.
 */
export function useCurrentUser(): CurrentUserState {
  const sessionId = useSession()?.sessionId;
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    accountApi
      .me(controller.signal)
      .then((user) => setLoaded({ sessionId, result: { status: 'ready', user } }))
      .catch(() => {
        if (!controller.signal.aborted) setLoaded({ sessionId, result: { status: 'error' } });
      });
    return () => controller.abort();
  }, [sessionId]);

  // A result loaded for a previous session counts as still loading.
  return loaded && loaded.sessionId === sessionId ? loaded.result : { status: 'loading' };
}
