import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function VerifyEmail() {
  return (
    <AuthShell
      subhead="VERIFY"
      head={
        <>Check your <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--color-mint)', fontWeight: 400 }}>inbox</span></>
      }
    >
      <div
        className="p-[18px] rounded-md text-center"
        style={{ border: '1px dashed var(--color-border)' }}
      >
        <Icon name="mail" size={32} style={{ color: 'var(--color-accent)' }} />
        <div className="mt-3 font-mono text-[13px] text-fg-bright">maya@pagoda.dev</div>
        <div className="mt-[6px] text-fg-3 text-[12px]">Link expires in 30 minutes</div>
      </div>

      <p className="m-0 text-fg-2 text-[13px] leading-[1.6]">
        We sent a single-use verification link. Open it on any device — the session you started here
        will complete automatically.
      </p>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Resend in 42s</Button>
        <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Change email</Button>
      </div>
    </AuthShell>
  );
}
