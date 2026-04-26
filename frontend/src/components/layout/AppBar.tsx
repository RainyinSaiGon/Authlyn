import type { ReactNode } from 'react';

interface AppBarProps {
  crumbs?: string[];
  title?: string;
  actions?: ReactNode;
}

export function AppBar({ crumbs, title, actions }: AppBarProps) {
  return (
    <header className="appbar">
      <div>
        {crumbs && crumbs.length > 0 && (
          <div className="crumb">
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && (
                  <span style={{ opacity: 0.5, margin: '0 6px' }}>/</span>
                )}
                {i === crumbs.length - 1 ? <b>{c}</b> : c}
              </span>
            ))}
          </div>
        )}
        {title && (
          <h1 style={{ marginTop: crumbs && crumbs.length > 0 ? 2 : 0 }}>{title}</h1>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-[10px]">{actions}</div>
      )}
    </header>
  );
}
