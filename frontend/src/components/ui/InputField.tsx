import type { CSSProperties, ReactNode } from 'react';

interface InputFieldProps {
  label?: string;
  value?: string;
  type?: string;
  hint?: string;
  error?: string;
  mono?: boolean;
  suffix?: ReactNode;
  placeholder?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

export function InputField({
  label,
  value,
  type = 'text',
  hint,
  error,
  mono,
  suffix,
  placeholder,
  onChange,
  style,
}: InputFieldProps) {
  return (
    <div className="field" style={style}>
      {label && <label>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          style={mono ? { fontFamily: 'var(--font-mono)' } : undefined}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-3 text-[12px]">
            {suffix}
          </span>
        )}
      </div>
      {(hint || error) && (
        <div className={`hint${error ? ' err' : ''}`}>{error ?? hint}</div>
      )}
    </div>
  );
}
