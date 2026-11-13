import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/form/FormTextField';
import { authApi } from '@/features/auth/api/authApi';
import { FormAlert } from '@/features/auth/components/FormAlert';
import { authErrorMessage } from '@/features/auth/errors';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/features/auth/schemas';

// Matches the backend default AUTHLYN_PASSWORD_RESET_TOKEN_MINUTES.
const RESET_LINK_MINUTES = 60;

export function ForgotPassword() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    setFormError(null);
    try {
      await authApi.requestPasswordReset(email);
      setSentTo(email);
    } catch (error) {
      setFormError(authErrorMessage(error));
    }
  };

  if (sentTo) {
    // Same message whether or not the account exists, like the API (no account enumeration).
    return (
      <AuthShell head="Check your email" centered>
        <p role="status" className="m-0 text-fg-2 text-[13.5px] leading-[1.6]">
          If an account exists for <span className="font-mono text-fg-1">{sentTo}</span>, we've sent a link to
          reset your password. The link works once and expires in {RESET_LINK_MINUTES} minutes.
        </p>
        <p className="text-[12.5px] text-fg-3 text-center m-0">
          <Link to="/auth/sign-in" className="text-accent no-underline">← Back to sign in</Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell head="Reset your password" centered>
      <p className="m-0 text-fg-2 text-[13.5px] leading-[1.6]">
        Enter the email on your account. We'll send a single-use link that expires in {RESET_LINK_MINUTES} minutes.
      </p>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" aria-label="Reset your password">
        {formError && <FormAlert>{formError}</FormAlert>}
        <FormTextField control={control} name="email" label="Email" type="email" autoComplete="email" mono />
        <Button type="submit" className="justify-center w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="text-[12.5px] text-fg-3 text-center m-0">
        <Link to="/auth/sign-in" className="text-accent no-underline">← Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
