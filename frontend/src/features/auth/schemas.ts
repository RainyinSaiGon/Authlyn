import { z } from 'zod';

/**
 * Mirrors the backend's `@StrongPassword` (StrongPasswordValidator): 8–128 characters with
 * an uppercase letter, a lowercase letter, a digit and a non-alphanumeric character.
 * Keep the two in sync; the backend stays the authority and rejects anything this misses.
 */
export const PASSWORD_RULES = [
  { id: 'length', label: '8 to 128 characters', test: (v: string) => v.length >= 8 && v.length <= 128 },
  { id: 'upper', label: 'An uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'A lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { id: 'digit', label: 'A number', test: (v: string) => /[0-9]/.test(v) },
  { id: 'special', label: 'A symbol (!, #, …)', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export type PasswordRuleId = (typeof PASSWORD_RULES)[number]['id'];

const email = z
  .string()
  .trim()
  .min(1, { error: 'Enter your email address' })
  .pipe(z.email({ error: 'Enter a valid email address' }));

const strongPassword = z
  .string()
  .refine((value) => PASSWORD_RULES.every((rule) => rule.test(value)), {
    error: 'Password does not meet all the requirements',
  });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, { error: 'Enter your password' }),
});

export const signUpSchema = z.object({
  displayName: z.string().trim().max(120, { error: 'Use 120 characters or fewer' }),
  email,
  password: strongPassword,
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, { error: 'Confirm your new password' }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
