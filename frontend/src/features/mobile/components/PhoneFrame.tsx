import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative w-[375px] h-[812px] rounded-[48px] border-[2px] border-white/[0.12] bg-bg overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-[#0a0f18] rounded-b-[18px] z-10 flex items-end justify-center pb-[5px]">
        <div className="w-[10px] h-[10px] rounded-full bg-white/[0.08] border border-white/[0.12]" />
      </div>
      <div className="w-full h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
