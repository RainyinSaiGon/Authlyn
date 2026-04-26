import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';

const OTP_DIGITS = ['4', '7', '2', '9', '1', '8'];

export function MFAChallenge() {
  return (
    <AuthShell head="Enter your code" centered>
      <div className="flex items-center gap-[10px] justify-center">
        {OTP_DIGITS.map((digit, i) => (
          <div
            key={i}
            className={`flex items-center justify-center font-mono text-[24px] text-fg-bright font-medium w-[48px] h-[56px] rounded-[14px] bg-black/25 border ${
              i === 5
                ? 'border-accent shadow-[0_0_0_3px_rgba(248,125,73,0.2)]'
                : 'border-border'
            }`}
          >
            {digit}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[12.5px]">
        <a href="#" className="text-accent no-underline">Use a backup code</a>
        <span className="text-fg-3 font-mono">Rotates in 0:22</span>
      </div>

      <Button className="justify-center w-full" onClick={() => {}}>
        Verify
      </Button>
    </AuthShell>
  );
}
