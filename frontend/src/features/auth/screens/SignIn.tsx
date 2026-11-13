import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/form/FormTextField';
import type { ReturnToState } from '@/components/auth/RequireAuth';
import { authApi } from '@/features/auth/api/authApi';
import { socialLoginUrl } from '@/features/auth/api/socialLogin';
import { FormAlert } from '@/features/auth/components/FormAlert';
import { authErrorMessage, safeReturnPath } from '@/features/auth/errors';
import { signInSchema, type SignInValues } from '@/features/auth/schemas';
import { saveSession } from '@/features/auth/session';

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToState | null)?.from;
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);
    try {
      saveSession(await authApi.login(values));
      navigate(safeReturnPath(returnTo), { replace: true });
    } catch (error) {
      // 401 never says whether the email exists.
      setFormError(authErrorMessage(error, { 401: 'Email or password is incorrect.' }));
    }
  };

  return (
    <AuthShell head="Sign in" centered>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" aria-label="Sign in">
        {formError && <FormAlert>{formError}</FormAlert>}
        <FormTextField control={control} name="email" label="Email" type="email" autoComplete="username" mono />
        <FormTextField
          control={control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end text-[12.5px]">
          <Link to="/auth/forgot-password" className="text-accent no-underline">Forgot password</Link>
        </div>

        <Button type="submit" className="justify-center w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="divider">OR CONTINUE WITH</div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" icon="passkey" className="flex-1 justify-center">Passkey</Button>
        <Button variant="ghost" size="sm" icon="google" className="flex-1 justify-center" onClick={() => window.location.assign(socialLoginUrl('google'))}>Google</Button>
        <Button variant="ghost" size="sm" icon="github" className="flex-1 justify-center" onClick={() => window.location.assign(socialLoginUrl('github'))}>GitHub</Button>
      </div>

      <p className="text-[12.5px] text-fg-3 text-center m-0">
        No account? <Link to="/auth/sign-up" className="text-accent no-underline">Create one</Link>
      </p>
    </AuthShell>
  );
}
