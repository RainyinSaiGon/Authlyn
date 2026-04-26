import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function getAdminRoles(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return Array.isArray(payload.roles) ? payload.roles : [];
  } catch {
    return [];
  }
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('authlyn.token');
  if (!token || !getAdminRoles(token).includes('admin')) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
