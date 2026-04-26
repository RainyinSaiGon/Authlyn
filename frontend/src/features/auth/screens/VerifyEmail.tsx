import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function VerifyEmail() {
  return (
    <AuthShell
      head={
        <>Check your <span className="font-display italic text-mint font-normal">inbox</span></>
      } centered
    >
      <div className="p-[18px] rounded-md text-center border border-dashed border-border">
        <Icon name="mail" size={32} className="text-accent" />
        <div className="mt-3 font-mono text-[13px] text-fg-bright">maya@pagoda.dev</div>
        <div className="mt-[6px] text-fg-3 text-[12px]">Link expires in 30 minutes</div>
      </div>

      <p className="m-0 text-fg-2 text-[13px] leading-[1.6]">
        We sent a single-use verification link. Open it on any device — the session you started here
        will complete automatically.
      </p>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="flex-1 justify-center">Resend in 42s</Button>
        <Button variant="ghost" size="sm" className="flex-1 justify-center">Change email</Button>
      </div>
    </AuthShell>
  );
}
