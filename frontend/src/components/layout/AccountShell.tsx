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
    <div className="min-h-screen flex flex-col">
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
        <span className="text-fg-2 text-[13px]">Account Settings</span>
      </nav>

      <div className="flex flex-1">
        <aside className="w-[220px] shrink-0 flex flex-col gap-[2px] p-[24px_12px] border-r border-border bg-[rgba(9,19,29,0.5)]">
          {NAV.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`block py-[9px] px-3 rounded-[10px] no-underline text-[13.5px] transition-all duration-fast border ${
                active === item.id
                  ? 'text-fg-bright bg-[linear-gradient(160deg,rgba(248,125,73,0.18),rgba(248,125,73,0.03))] border-[rgba(248,125,73,0.28)] font-medium'
                  : 'text-fg-2 bg-transparent border-transparent font-normal'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
