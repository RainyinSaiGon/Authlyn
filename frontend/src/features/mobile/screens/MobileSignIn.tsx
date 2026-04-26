import { PhoneFrame } from '../components/PhoneFrame';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

export function MobileSignIn() {
  return (
    <div className="min-h-screen bg-[#070d14] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <PhoneFrame>
          <div className="pt-[60px] px-[28px] pb-[40px] flex flex-col gap-[22px]">
            <div className="mt-[8px]">
              <div className="w-[40px] h-[40px] rounded-[12px] bg-[linear-gradient(135deg,#f87d49,#6cd0b0)] mb-[16px]" />
              <h1 className="m-0 text-[26px] font-semibold tracking-[-0.01em]">Welcome back</h1>
              <p className="m-0 mt-[4px] text-fg-3 text-[13.5px]">Sign in to Pagoda</p>
            </div>

            <div className="flex flex-col gap-[14px]">
              <InputField label="Email" value="maya.tran@pagoda.dev" mono onChange={() => {}} />
              <InputField label="Password" type="password" value="············" onChange={() => {}} />
            </div>

            <Button className="justify-center w-full">Sign in</Button>

            <div className="divider">OR CONTINUE WITH</div>

            <div className="flex flex-col gap-[10px]">
              <Button variant="ghost" className="justify-center w-full" icon="passkey">Continue with Passkey</Button>
              <Button variant="ghost" className="justify-center w-full" icon="google">Continue with Google</Button>
            </div>

            <p className="text-[12.5px] text-fg-3 text-center m-0">
              No account? <span className="text-accent cursor-pointer">Create one</span>
            </p>
          </div>
        </PhoneFrame>
        <p className="text-fg-3 text-[12px] font-mono">Mobile · Sign In</p>
      </div>
    </div>
  );
}
