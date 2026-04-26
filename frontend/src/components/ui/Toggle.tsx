interface ToggleProps {
  on?: boolean;
  onChange?: (on: boolean) => void;
}

export function Toggle({ on = false, onChange }: ToggleProps) {
  return (
    <span
      className={`toggle${on ? ' on' : ''}`}
      role="switch"
      aria-checked={on}
      onClick={() => onChange?.(!on)}
    />
  );
}
