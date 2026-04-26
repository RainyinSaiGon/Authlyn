import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';

const OTP_DIGITS = ['4', '7', '2', '9', '1', '8'];

export function MFAChallenge() {
  return (
    <AuthShell subhead="TWO-STEP" head="Enter your code">
      <p className="m-0 text-fg-2 text-[13px] leading-[1.55]">
        From the authenticator for{' '}
        <span className="font-mono text-accent-soft">authlyn · pagoda-prod</span>.
      </p>

      <div className="flex items-center gap-[10px] justify-center">
        {OTP_DIGITS.map((digit, i) => (
          <div
            key={i}
            className="flex items-center justify-center font-mono text-[24px] text-fg-bright font-medium"
            style={{
              width: 48,
              height: 56,
              borderRadius: 14,
              border: `1px solid ${i === 5 ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: 'rgba(0,0,0,0.25)',
              boxShadow: i === 5 ? '0 0 0 3px rgba(248,125,73,0.2)' : 'none',
            }}
          >
            {digit}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[12.5px]">
        <a href="#" className="text-accent no-underline">Use a backup code</a>
        <span className="text-fg-3 font-mono">Rotates in 0:22</span>
      </div>

      <Button style={{ justifyContent: 'center', width: '100%' }} onClick={() => {}}>
        Verify
      </Button>
    </AuthShell>
  );
}
