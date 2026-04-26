import type { ReactNode } from 'react';

interface AuthShellProps {
  head: ReactNode;
  subhead?: string;
  width?: number;
  children: ReactNode;
}

function LogoShield() {
  return (
    <div className="flex items-center gap-[10px]">
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
      <span className="font-semibold tracking-[-0.01em] text-[16px]">Authlyn</span>
    </div>
  );
}

export function AuthShell({ head, subhead, width = 400, children }: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 gap-6">
      <LogoShield />
      <div className="glass p-7 max-w-full flex flex-col gap-4" style={{ width }}>
        <div>
          {subhead && (
            <p
              className="m-0 mb-[10px] uppercase text-[11px] font-medium tracking-caps font-mono"
              style={{ color: 'var(--color-accent-soft)' }}
            >
              {subhead}
            </p>
          )}
          <h1 className="m-0 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">{head}</h1>
        </div>
        {children}
      </div>
      <p className="m-0 text-[11px] text-fg-3 font-mono">
        Authlyn · signed with RS256 · kid authlyn-01
      </p>
    </div>
  );
}
