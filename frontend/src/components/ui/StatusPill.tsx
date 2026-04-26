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
        <span style={{
          color: 'var(--fg-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: 10.5,
          fontWeight: 500,
        }}>
          {label}
        </span>
      )}
      {children}
    </span>
  );
}
