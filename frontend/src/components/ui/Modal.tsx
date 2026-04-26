import type { ReactNode } from 'react';

interface ModalProps {
  title?: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function Modal({ title, subtitle, className = 'w-[460px]', actions, children }: ModalProps) {
  return (
    <div className="absolute inset-0 bg-[rgba(5,12,20,0.55)] backdrop-blur-sm flex items-center justify-center z-20">
      <div className={`glass flex flex-col gap-4 p-6 ${className}`}>
        {title && (
          <div>
            <h2 className="m-0 text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="mt-[6px] mb-0 text-fg-2 text-[13.5px]">{subtitle}</p>
            )}
          </div>
        )}
        {children}
        {actions && (
          <div className="flex items-center gap-[10px] justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
