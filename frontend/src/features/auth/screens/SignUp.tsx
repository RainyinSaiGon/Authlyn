import { Link } from 'react-router-dom';
import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

export function SignUp() {
  return (
    <AuthShell
      subhead="CREATE ACCOUNT"
      head={
        <>Create an <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--color-mint)', fontWeight: 400 }}>Authlyn</span> account</>
      }
    >
      <InputField label="Display name" value="Maya Tran" onChange={() => {}} />
      <InputField label="Email" value="maya@pagoda.dev" mono onChange={() => {}} />
      <InputField label="Password" type="password" value="·············" hint="12+ chars · stored as BCrypt · check: 4/5" onChange={() => {}} />

      <div className="flex items-center gap-1">
        {[1, 1, 1, 1, 0].map((filled, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-pill"
            style={{ background: filled ? 'var(--color-mint)' : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>

      <p className="m-0 text-[12px] text-fg-2 leading-[1.55]">
        By continuing you accept the{' '}
        <a href="#" className="text-accent no-underline">Terms</a> and{' '}
        <a href="#" className="text-accent no-underline">Privacy</a>.
        {' '}We'll issue an RS256 JWT on first sign-in.
      </p>

      <Button style={{ justifyContent: 'center', width: '100%' }} onClick={() => {}}>
        Create account
      </Button>

      <div className="divider">OR</div>

      <Button variant="ghost" icon="passkey" style={{ justifyContent: 'center', width: '100%' }}>
        Sign up with a passkey
      </Button>

      <p className="text-[12.5px] text-fg-3 text-center m-0">
        Already registered? <Link to="/auth/sign-in" className="text-accent no-underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
