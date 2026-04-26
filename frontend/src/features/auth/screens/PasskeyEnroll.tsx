import { AuthShell } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const FEATURES = [
  'Private to this device — the key never leaves it',
  'Phishing-resistant by design',
  'Works offline after the first sign-in',
];

export function PasskeyEnroll() {
  return (
    <AuthShell
      subhead="PASSKEY"
      head={
        <>Register a <span className="font-display italic text-mint font-normal">passkey</span></>
      }
      className="w-[460px]"
    >
      <div className="p-7 text-center rounded-md bg-[radial-gradient(circle_at_center,rgba(108,208,176,0.12),transparent_60%)]">
        <div className="inline-flex items-center justify-center w-[88px] h-[88px] rounded-full bg-mint/10 border border-mint/30">
          <Icon name="passkey" size={44} className="text-mint" />
        </div>
        <div className="mt-[18px] text-[15px] text-fg-1">
          Use <b>Touch ID</b> or a security key
        </div>
        <div className="mt-1 text-[12.5px] text-fg-3 font-mono">
          rp: authlyn.dev · uv: required
        </div>
      </div>

      <ul className="m-0 p-0 list-none flex flex-col gap-[10px]">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-[10px] text-[13px] text-fg-2">
            <Icon name="check" size={14} className="text-mint shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button className="justify-center w-full" onClick={() => {}}>
        Continue
      </Button>

      <a href="#" className="text-fg-3 text-[12.5px] text-center no-underline block">
        Skip for now
      </a>
    </AuthShell>
  );
}
