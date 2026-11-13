import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/form/FormTextField';
import { authApi } from '@/features/auth/api/authApi';
import { FormAlert } from '@/features/auth/components/FormAlert';
import { PasswordRules } from '@/features/auth/components/PasswordRules';
import { authErrorMessage, hasStatus } from '@/features/auth/errors';
import { resetPasswordSchema, type ResetPasswordValues } from '@/features/auth/schemas';
import { clearSession } from '@/features/auth/session';

type Outcome = 'idle' | 'done' | 'link-invalid';

export function ResetPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Read the token once, then drop it from the address bar so it doesn't linger in
  // history or leak through the Referer header.
  const [resetToken] = useState(() => searchParams.get('token'));
  const [outcome, setOutcome] = useState<Outcome>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.has('token')) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });
  const newPassword = useWatch({ control, name: 'newPassword' });

  if (!resetToken || outcome === 'link-invalid') {
    return (
      <AuthShell head="This link isn't valid" centered>
        <p role="alert" className="m-0 text-fg-2 text-[13.5px] leading-[1.6]">
          The reset link is missing, has expired, or was already used. Request a new one.
        </p>
        <p className="text-[12.5px] text-fg-3 text-center m-0">
          <Link to="/auth/forgot-password" className="text-accent no-underline">Request a new link</Link>
        </p>
      </AuthShell>
    );
  }

  if (outcome === 'done') {
    return (
      <AuthShell head="Password updated" centered>
        <p role="status" className="m-0 text-fg-2 text-[13.5px] leading-[1.6]">
          You've been signed out on all your devices. Sign in with your new password.
        </p>
        <p className="text-[12.5px] text-fg-3 text-center m-0">
          <Link to="/auth/sign-in" className="text-accent no-underline">Sign in</Link>
        </p>
      </AuthShell>
    );
  }

  const onSubmit = async ({ newPassword }: ResetPasswordValues) => {
    setFormError(null);
    try {
      await authApi.confirmPasswordReset({ resetToken, newPassword });
      clearSession(); // the server revoked every session for this user
      setOutcome('done');
    } catch (error) {
      if (hasStatus(error, 401)) {
        setOutcome('link-invalid');
        return;
      }
      setFormError(authErrorMessage(error, { 400: 'That password was not accepted. Check the requirements.' }));
    }
  };

  return (
    <AuthShell head="Choose a new password" centered>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" aria-label="Choose a new password">
        {formError && <FormAlert>{formError}</FormAlert>}
        <FormTextField control={control} name="newPassword" label="New password" type="password" autoComplete="new-password" />
        <PasswordRules password={newPassword} />
        <FormTextField
          control={control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />
        <Button type="submit" className="justify-center w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
  );
}
