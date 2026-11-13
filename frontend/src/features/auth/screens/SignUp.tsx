import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/form/FormTextField';
import { authApi } from '@/features/auth/api/authApi';
import { FormAlert } from '@/features/auth/components/FormAlert';
import { PasswordRules } from '@/features/auth/components/PasswordRules';
import { authErrorMessage, hasStatus } from '@/features/auth/errors';
import { signUpSchema, type SignUpValues } from '@/features/auth/schemas';
import { saveSession } from '@/features/auth/session';

export const AFTER_SIGN_UP_PATH = '/account/profile';

export function SignUp() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });
  const password = useWatch({ control, name: 'password' });

  const onSubmit = async ({ displayName, email, password }: SignUpValues) => {
    setFormError(null);
    try {
      saveSession(await authApi.signup({ email, password, displayName: displayName || undefined }));
      navigate(AFTER_SIGN_UP_PATH, { replace: true });
    } catch (error) {
      if (hasStatus(error, 409)) {
        setError('email', { message: 'An account with this email already exists. Sign in instead.' }, { shouldFocus: true });
        return;
      }
      setFormError(
        authErrorMessage(error, { 400: 'Some details were not accepted. Check the fields and try again.' }),
      );
    }
  };

  return (
    <AuthShell head="Sign up" centered>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" aria-label="Sign up">
        {formError && <FormAlert>{formError}</FormAlert>}
        <FormTextField control={control} name="displayName" label="Display name (optional)" autoComplete="name" />
        <FormTextField control={control} name="email" label="Email" type="email" autoComplete="email" mono />
        <FormTextField control={control} name="password" label="Password" type="password" autoComplete="new-password" />
        <PasswordRules password={password} />

        <p className="m-0 text-[12px] text-fg-2 leading-[1.55]">
          By continuing you accept the{' '}
          <a href="#" className="text-accent no-underline">Terms</a> and{' '}
          <a href="#" className="text-accent no-underline">Privacy</a>.
        </p>

        <Button type="submit" className="justify-center w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <div className="divider">OR</div>

      <Button variant="ghost" icon="passkey" className="justify-center w-full">
        Sign up with a passkey
      </Button>

      <p className="text-[12.5px] text-fg-3 text-center m-0">
        Already registered? <Link to="/auth/sign-in" className="text-accent no-underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
