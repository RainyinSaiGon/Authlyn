import { Link } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

export function ForgotPassword() {
  return (
    <AuthShell head="Reset your password" centered>
      <p className="m-0 text-fg-2 text-[13.5px] leading-[1.6]">
        Enter the email on your account. We'll send a single-use link, signed with the tenant's
        recovery key, that expires in 30 minutes.
      </p>

      <InputField label="Email" value="maya@pagoda.dev" mono onChange={() => {}} />

      <Button className="justify-center w-full" onClick={() => {}}>
        Send reset link
      </Button>

      <p className="text-[12.5px] text-fg-3 text-center m-0">
        <Link to="/auth/sign-in" className="text-accent no-underline">← Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
