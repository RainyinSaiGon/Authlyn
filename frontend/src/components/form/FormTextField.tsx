import type { HTMLInputAutoCompleteAttribute, ReactNode } from 'react';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { InputField } from '@/components/ui/InputField';

interface FormTextFieldProps<TValues extends FieldValues> {
  control: Control<TValues>;
  name: FieldPath<TValues>;
  label: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: HTMLInputAutoCompleteAttribute;
  hint?: ReactNode;
  mono?: boolean;
}

/**
 * `InputField` bound to a react-hook-form field. `name` is checked against the form's
 * value type, so a typo is a compile error rather than a silently unbound input.
 */
export function FormTextField<TValues extends FieldValues>({
  control,
  name,
  ...inputProps
}: FormTextFieldProps<TValues>) {
  const { field, fieldState } = useController({ control, name });
  return (
    <InputField
      {...inputProps}
      name={field.name}
      value={typeof field.value === 'string' ? field.value : ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={field.ref}
      disabled={field.disabled}
      error={fieldState.error?.message}
    />
  );
}
