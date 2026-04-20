import type { PropsWithChildren } from "react";

type StatusTone = "success" | "danger" | "neutral";

type StatusPillProps = PropsWithChildren<{
  label: string;
  tone: StatusTone;
}>;

export function StatusPill({ children, label, tone }: StatusPillProps) {
  return (
    <div className={`status-pill status-pill-${tone}`}>
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}
