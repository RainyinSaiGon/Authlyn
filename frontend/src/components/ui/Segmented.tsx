type SegmentedOption = string | { value: string; label: string };

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="segmented">
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        return (
          <button
            key={v}
            type="button"
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
