import type { ReactNode } from 'react';

interface AuthShellProps {
  head: string;
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
      <div className="glass p-8 max-w-full" style={{ width }}>
        <div className="mb-6">
          <h1 className="m-0 text-xl font-semibold leading-snug">{head}</h1>
          {subhead && (
            <p className="mt-2 mb-0 text-fg-2 text-sm leading-relaxed">{subhead}</p>
          )}
        </div>
        {children}
      </div>
      <p className="m-0 text-[11px] text-fg-3">
        Protected by <span className="text-mint">Authlyn</span>
      </p>
    </div>
  );
}
