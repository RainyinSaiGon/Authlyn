import type { ReactNode } from 'react';

interface ModalProps {
  title?: string;
  subtitle?: string;
  width?: number;
  actions?: ReactNode;
  children?: ReactNode;
}

export function Modal({ title, subtitle, width = 460, actions, children }: ModalProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(5, 12, 20, 0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20,
    }}>
      <div
        className="glass"
        style={{ width, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {title && (
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h2>
            {subtitle && (
              <p style={{ margin: '6px 0 0', color: 'var(--fg-2)', fontSize: 13.5 }}>{subtitle}</p>
            )}
          </div>
        )}
        {children}
        {actions && (
          <div className="row" style={{ gap: 10, justifyContent: 'flex-end' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
