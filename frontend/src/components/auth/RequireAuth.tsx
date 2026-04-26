import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('authlyn.token');
  if (!token) return <Navigate to="/auth/sign-in" replace />;
  return <>{children}</>;
}
