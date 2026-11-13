import { useId, type HTMLInputAutoCompleteAttribute, type ReactNode, type Ref } from 'react';

interface InputFieldProps {
  label?: string;
  value?: string;
  type?: string;
  hint?: ReactNode;
  error?: string;
  mono?: boolean;
  suffix?: ReactNode;
  placeholder?: string;
  name?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  required?: boolean;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: (value: string) => void;
  onBlur?: () => void;
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
  name,
  autoComplete,
  required,
  disabled,
  inputRef,
  onChange,
  onBlur,
}: InputFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          name={name}
          type={type}
          value={value ?? ''}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={mono ? 'font-mono' : ''}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-3 text-[12px]">
            {suffix}
          </span>
        )}
      </div>
      {message && (
        <div id={messageId} className={`hint${error ? ' err' : ''}`}>{message}</div>
      )}
    </div>
  );
}
