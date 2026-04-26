import type { ReactNode } from 'react';

interface StatusPillProps {
  tone?: 'ok' | 'warn' | 'err' | 'accent';
  label?: string;
  children?: ReactNode;
}

export function StatusPill({ tone = 'ok', label, children }: StatusPillProps) {
  return (
    <span className={`pill ${tone}`}>
      <span className="dot" />
      {label && (
        <span className="text-fg-3 uppercase tracking-[0.08em] text-[10.5px] font-medium">
          {label}
        </span>
      )}
      {children}
    </span>
  );
}
