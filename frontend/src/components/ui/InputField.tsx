import type { ReactNode } from 'react';

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
}: InputFieldProps) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div className="relative">
        <input
          type={type}
          value={value ?? ''}
          placeholder={placeholder}
          className={mono ? 'font-mono' : ''}
          onChange={(e) => onChange?.(e.target.value)}
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
