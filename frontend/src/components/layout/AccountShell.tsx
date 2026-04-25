import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type AccountNavId = 'profile' | 'security' | 'sessions' | 'apps' | 'keys' | 'notifications';

interface AccountShellProps {
  active: AccountNavId;
  children: ReactNode;
}

const NAV: { id: AccountNavId; label: string; path: string }[] = [
  { id: 'profile',       label: 'Profile',        path: '/account/profile' },
  { id: 'security',      label: 'Security',        path: '/account/security' },
  { id: 'sessions',      label: 'Sessions',        path: '/account/sessions' },
  { id: 'apps',          label: 'Connected apps',  path: '/account/apps' },
  { id: 'keys',          label: 'API keys',        path: '/account/keys' },
  { id: 'notifications', label: 'Notifications',   path: '/account/notifications' },
];

export function AccountShell({ active, children }: AccountShellProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="topnav">
        <div className="brand">
          <svg width={22} height={22} viewBox="0 0 48 48" fill="none">
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
          <span className="brand-name">Authlyn</span>
        </div>
        <span style={{ color: 'var(--fg-2)', fontSize: 13 }}>Account Settings</span>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{
          width: 220,
          flexShrink: 0,
          borderRight: '1px solid var(--border)',
          background: 'rgba(9,19,29,0.5)',
          padding: '24px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {NAV.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              style={{
                display: 'block',
                padding: '9px 12px',
                borderRadius: 10,
                color: active === item.id ? 'var(--fg-bright)' : 'var(--fg-2)',
                background: active === item.id
                  ? 'linear-gradient(160deg, rgba(248,125,73,0.18), rgba(248,125,73,0.03))'
                  : 'transparent',
                border: active === item.id
                  ? '1px solid rgba(248,125,73,0.28)'
                  : '1px solid transparent',
                textDecoration: 'none',
                fontSize: 13.5,
                fontWeight: active === item.id ? 500 : 400,
                transition: 'all var(--dur-fast)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
