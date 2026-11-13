import { HttpError, NetworkError } from '@/shared/api/http';

const UNAVAILABLE = 'Authlyn is temporarily unavailable. Try again in a few minutes.';

const DEFAULT_MESSAGES: Record<number, string> = {
  429: 'Too many attempts. Wait 15 minutes, then try again.',
  // Gateway or proxy in front of the API could not reach it.
  502: UNAVAILABLE,
  503: UNAVAILABLE,
  504: UNAVAILABLE,
};

/**
 * Turns a failed auth call into a sentence for the user. Callers pass messages for the
 * statuses that mean something specific on their screen (e.g. 401 on sign-in).
 */
export function authErrorMessage(error: unknown, byStatus: Partial<Record<number, string>> = {}): string {
  if (error instanceof NetworkError) {
    return "Can't reach Authlyn. Check your connection and try again.";
  }
  if (error instanceof HttpError) {
    return byStatus[error.status] ?? DEFAULT_MESSAGES[error.status] ?? 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function hasStatus(error: unknown, status: number): boolean {
  return error instanceof HttpError && error.status === status;
}

/** Only same-app paths are allowed as a post-sign-in destination (no open redirects). */
export function safeReturnPath(path: string | undefined, fallback = '/account/profile'): string {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return fallback;
  if (path.startsWith('/auth/')) return fallback;
  return path;
}
