import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/features/auth/session';

/** Location state passed to the sign-in screen so it can send the user back afterwards. */
export type ReturnToState = { from?: string };

export function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession();
  const location = useLocation();
  if (!session) {
    const state: ReturnToState = { from: location.pathname + location.search };
    return <Navigate to="/auth/sign-in" replace state={state} />;
  }
  return <>{children}</>;
}
