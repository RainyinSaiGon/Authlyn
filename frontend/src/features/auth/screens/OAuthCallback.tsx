import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { exchangeOAuthCode } from '@/features/auth/api/socialLogin';
import { saveSession } from '@/features/auth/session';

const ERROR_MESSAGES: Record<string, string> = {
  account_link_required:
    'An account with this email already exists. Sign in with your password first, then link this provider from your account settings.',
  account_disabled: 'This account is disabled.',
  missing_code: 'The sign-in link is incomplete. Please try again.',
  exchange_failed: 'This sign-in link has expired or was already used. Please try again.',
};

const FALLBACK_ERROR = 'Sign-in failed. Please try again.';

export const AFTER_SIGN_IN_PATH = '/account/profile';

export function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get('code');
  const redirectError = params.get('error') ?? (code ? null : 'missing_code');
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  // The code is single-use; StrictMode runs effects twice in development.
  const started = useRef(false);

  useEffect(() => {
    if (!code || redirectError || started.current) return;
    started.current = true;

    exchangeOAuthCode(code)
      .then((session) => {
        saveSession(session);
        navigate(AFTER_SIGN_IN_PATH, { replace: true });
      })
      .catch(() => setExchangeError('exchange_failed'));
  }, [code, redirectError, navigate]);

  const errorKey = redirectError ?? exchangeError;

  if (errorKey) {
    return (
      <AuthShell head="Sign-in failed" centered>
        <p role="alert" className="m-0 text-[13px] text-fg-2 text-center">
          {ERROR_MESSAGES[errorKey] ?? FALLBACK_ERROR}
        </p>
        <p className="text-[12.5px] text-fg-3 text-center m-0">
          <Link to="/auth/sign-in" className="text-accent no-underline">Back to sign in</Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell head="Signing you in…" centered>
      <div className="progress">
        <i className="w-[62%]" />
      </div>
      <p className="m-0 text-[12px] text-fg-3 font-mono text-center">Finishing sign-in…</p>
    </AuthShell>
  );
}
