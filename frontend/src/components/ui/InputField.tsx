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
          <span style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--fg-3)',
            fontSize: 12,
          }}>
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
