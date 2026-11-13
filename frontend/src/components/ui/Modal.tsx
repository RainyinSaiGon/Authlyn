import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

interface ModalProps {
  title: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
  children?: ReactNode;
  /** Called on Escape. The parent decides whether to close. */
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal dialog (WAI-ARIA dialog pattern):
 * - `role="dialog"` + `aria-modal`, named by its title and described by its subtitle;
 * - focus moves into the dialog on open, Tab and Shift+Tab stay inside it;
 * - Escape calls `onClose`;
 * - focus goes back to whatever opened it when it closes.
 */
export function Modal({ title, subtitle, className = 'w-[460px]', actions, children, onClose }: ModalProps) {
  const titleId = useId();
  const subtitleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialogRef.current)?.focus();
    return () => opener?.focus();
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="absolute inset-0 bg-[rgba(5,12,20,0.55)] backdrop-blur-sm flex items-center justify-center z-20">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={`glass flex flex-col gap-4 p-6 ${className}`}
      >
        <div>
          <h2 id={titleId} className="m-0 text-xl font-semibold">{title}</h2>
          {subtitle && (
            <p id={subtitleId} className="mt-[6px] mb-0 text-fg-2 text-[13.5px]">{subtitle}</p>
          )}
        </div>
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
