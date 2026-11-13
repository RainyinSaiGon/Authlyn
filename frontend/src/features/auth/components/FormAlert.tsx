import type { ReactNode } from 'react';

/** Form-level error, announced by screen readers as soon as it appears. */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-[10px] border border-[rgba(241,93,120,0.28)] bg-[rgba(241,93,120,0.08)] px-[14px] py-[10px] text-[13px] text-danger-soft"
    >
      {children}
    </div>
  );
}
