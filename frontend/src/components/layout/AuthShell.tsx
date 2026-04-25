import type { ReactNode } from 'react';

interface AuthShellProps {
  head: string;
  subhead?: string;
  width?: number;
  children: ReactNode;
}

function LogoShield() {
  return (
    <div className="logo-shield">
      <svg width={28} height={28} viewBox="0 0 48 48" fill="none">
        <path
          d="M24 4 L40 9 V22 C40 32 33 40 24 44 C15 40 8 32 8 22 V9 Z"
          stroke="#6cd0b0"
          strokeWidth="2.2"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="22" cy="20" r="5" stroke="#6cd0b0" strokeWidth="1.8" fill="none" />
        <path
          d="M26 22 L32 28 M30 26 L32 28 M28 28 L30 30"
          stroke="#6cd0b0"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="word">Authlyn</span>
    </div>
  );
}

export function AuthShell({ head, subhead, width = 400, children }: AuthShellProps) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      gap: 24,
    }}>
      <LogoShield />
      <div className="glass" style={{ width, maxWidth: '100%', padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            margin: 0,
            fontSize: 'var(--fs-xl)',
            fontWeight: 600,
            lineHeight: 'var(--lh-snug)',
          }}>
            {head}
          </h1>
          {subhead && (
            <p style={{
              margin: '8px 0 0',
              color: 'var(--fg-2)',
              fontSize: 'var(--fs-sm)',
              lineHeight: 'var(--lh-relaxed)',
            }}>
              {subhead}
            </p>
          )}
        </div>
        {children}
      </div>
      <p style={{ margin: 0, fontSize: 11, color: 'var(--fg-3)' }}>
        Protected by <span style={{ color: 'var(--brand-mint)' }}>Authlyn</span>
      </p>
    </div>
  );
}
