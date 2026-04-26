import { Link } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Icon } from '@/components/ui/Icon';

export function SignIn() {
  return (
    <AuthShell head="Sign in" centered>
      <InputField label="Email" value="maya.tran@pagoda.dev" mono onChange={() => {}} />
      <InputField label="Password" type="password" value="············" onChange={() => {}} />

      <div className="flex items-center justify-between text-[12.5px]">
        <label className="flex items-center gap-[7px] text-fg-2 cursor-pointer">
          <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-[4px] border border-border bg-accent shrink-0">
            <Icon name="check" size={10} style={{ color: '#1a0f08' }} />
          </span>
          Remember this device
        </label>
        <Link to="/auth/forgot-password" className="text-accent no-underline">Forgot password</Link>
      </div>

      <Button style={{ justifyContent: 'center', width: '100%' }} onClick={() => {}}>Sign in</Button>

      <div className="divider">OR CONTINUE WITH</div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" icon="passkey" style={{ flex: 1, justifyContent: 'center' }}>Passkey</Button>
        <Button variant="ghost" size="sm" icon="google" style={{ flex: 1, justifyContent: 'center' }}>Google</Button>
        <Button variant="ghost" size="sm" icon="github" style={{ flex: 1, justifyContent: 'center' }}>GitHub</Button>
      </div>

      <p className="text-[12.5px] text-fg-3 text-center m-0">
        No account? <Link to="/auth/sign-up" className="text-accent no-underline">Create one</Link>
      </p>
    </AuthShell>
  );
}
