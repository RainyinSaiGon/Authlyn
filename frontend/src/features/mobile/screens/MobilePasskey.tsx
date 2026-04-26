import { PhoneFrame } from '../components/PhoneFrame';
import { Button } from '@/components/ui/Button';

export function MobilePasskey() {
  return (
    <div className="min-h-screen bg-[#070d14] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <PhoneFrame>
          <div className="pt-[60px] px-[28px] pb-[40px] flex flex-col gap-[28px]">
            <div className="mt-[8px] text-center">
              <div className="w-[72px] h-[72px] rounded-[22px] bg-[rgba(248,125,73,0.1)] border border-[rgba(248,125,73,0.2)] flex items-center justify-center mx-auto mb-[16px]">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
                </svg>
              </div>
              <h1 className="m-0 text-[22px] font-semibold">Save a passkey</h1>
              <p className="m-0 mt-[6px] text-fg-3 text-[13px] max-w-[260px] mx-auto">
                Passkeys use Face ID or Touch ID — no password needed next time.
              </p>
            </div>

            <div className="glass p-[16px] flex flex-col gap-[10px]">
              {['Faster sign-in', 'Phishing-resistant', 'No password to forget'].map((f) => (
                <div key={f} className="flex items-center gap-[10px] text-[13px]">
                  <span className="w-[18px] h-[18px] rounded-full bg-[rgba(108,208,176,0.15)] border border-[rgba(108,208,176,0.25)] flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#6cd0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-fg-2">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-[10px]">
              <Button className="justify-center w-full" icon="passkey">Create passkey</Button>
              <Button variant="ghost" className="justify-center w-full">Skip for now</Button>
            </div>
          </div>
        </PhoneFrame>
        <p className="text-fg-3 text-[12px] font-mono">Mobile · Passkey Enroll</p>
      </div>
    </div>
  );
}
