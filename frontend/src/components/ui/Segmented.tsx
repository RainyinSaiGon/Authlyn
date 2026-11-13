type SegmentedOption = string | { value: string; label: string };

interface SegmentedProps {
  /** Names the group for screen readers, e.g. "Time range". */
  label: string;
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
}

/**
 * A row of mutually exclusive filter buttons. Each is a toggle button (`aria-pressed`), so
 * the selected one is announced, not only shown by colour.
 */
export function Segmented({ label, options, value, onChange }: SegmentedProps) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={v === value}
            className={v === value ? 'active' : ''}
            onClick={() => onChange?.(v)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
