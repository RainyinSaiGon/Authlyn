/** A switch needs a name: visible text elsewhere (`labelledBy`) or its own `label`. */
type ToggleProps = {
  on?: boolean;
  onChange?: (on: boolean) => void;
  disabled?: boolean;
} & ({ label: string; labelledBy?: never } | { labelledBy: string; label?: never });

/**
 * On/off switch (WAI-ARIA switch pattern). A real `<button>`, so it is focusable and
 * Space/Enter toggle it with no extra key handling.
 */
export function Toggle({ on = false, onChange, disabled, label, labelledBy }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      aria-labelledby={labelledBy}
      disabled={disabled}
      className={`toggle${on ? ' on' : ''}`}
      onClick={() => onChange?.(!on)}
    />
  );
}
