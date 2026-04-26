import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="glass p-[56px] flex flex-col items-center justify-center gap-3 text-center">
      {icon && <div className="text-fg-3 mb-[4px]">{icon}</div>}
      <h3 className="m-0 text-[16px] font-semibold">{title}</h3>
      {body && <p className="m-0 text-fg-3 text-[13px] max-w-[320px]">{body}</p>}
      {action && <div className="mt-[8px]">{action}</div>}
    </div>
  );
}
