type TabOption = string | { value: string; label: string };

interface TabsProps {
  options: TabOption[];
  value: string;
  onChange?: (value: string) => void;
}

export function Tabs({ options, value, onChange }: TabsProps) {
  return (
    <div className="tabs">
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
