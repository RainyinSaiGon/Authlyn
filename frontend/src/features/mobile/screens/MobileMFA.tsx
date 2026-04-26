import { PhoneFrame } from '../components/PhoneFrame';
import { Button } from '@/components/ui/Button';

const CODE_CELLS = ['3', '7', '4', '·', '·', '·'];

export function MobileMFA() {
  return (
    <div className="min-h-screen bg-[#070d14] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <PhoneFrame>
          <div className="pt-[60px] px-[28px] pb-[40px] flex flex-col gap-[28px]">
            <div className="mt-[8px] text-center">
              <div className="w-[52px] h-[52px] rounded-[16px] bg-[rgba(108,208,176,0.12)] border border-[rgba(108,208,176,0.2)] flex items-center justify-center mx-auto mb-[16px]">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-mint">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
                </svg>
              </div>
              <h1 className="m-0 text-[22px] font-semibold">Two-factor auth</h1>
              <p className="m-0 mt-[6px] text-fg-3 text-[13px] max-w-[260px] mx-auto">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>

            <div className="flex items-center justify-center gap-[10px]">
              {CODE_CELLS.map((c, i) => (
                <div
                  key={i}
                  className={`w-[42px] h-[52px] rounded-[10px] border flex items-center justify-center font-mono text-[22px] font-semibold ${
                    c === '·'
                      ? 'border-border bg-white/[0.03] text-fg-3'
                      : 'border-accent bg-[rgba(248,125,73,0.08)] text-fg-bright'
                  }`}
                >
                  {c}
                </div>
              ))}
            </div>

            <Button className="justify-center w-full">Verify</Button>

            <p className="text-[12.5px] text-fg-3 text-center m-0">
              Lost access? <span className="text-accent cursor-pointer">Use a backup code</span>
            </p>
          </div>
        </PhoneFrame>
        <p className="text-fg-3 text-[12px] font-mono">Mobile · MFA Challenge</p>
      </div>
    </div>
  );
}
