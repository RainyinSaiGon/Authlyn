import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

interface BrowserTab {
  title: string;
  favicon?: boolean;
}

interface BrowserChromeProps {
  url: string;
  tabs?: BrowserTab[];
  children?: ReactNode;
  className?: string;
}

export function BrowserChrome({
  url,
  tabs = [{ title: 'Authlyn', favicon: true }],
  children,
  className = '',
}: BrowserChromeProps) {
  return (
    <div className={`h-full w-full flex flex-col bg-[#171a1f] ${className}`}>
      {/* Tab strip */}
      <div className="flex items-center h-[38px] px-[10px] gap-2 bg-[#0f1216] border-b border-white/[0.06]">
        <div className="flex gap-[7px]">
          <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57] inline-block" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e] inline-block" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#28c840] inline-block" />
        </div>
        <div className="flex gap-1 ml-3 items-end h-full">
          {tabs.map((tab, i) => (
            <div
              key={i}
              className={`flex items-center gap-[7px] px-3 h-[28px] min-w-[140px] max-w-[220px] rounded-t-lg self-end font-[system-ui,sans-serif] text-[11.5px] ${
                i === 0 ? 'bg-[#1b1f24] text-[#e8eaed]' : 'bg-transparent text-[#9aa0a6]'
              }`}
            >
              {tab.favicon && (
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#6cd0b0" strokeWidth={2}>
                  <path d="M12 3 L20 6 V12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 V6 Z" />
                </svg>
              )}
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {tab.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-[10px] h-[36px] px-3 bg-[#1b1f24] border-b border-white/[0.06]">
        <div className="flex gap-[14px] text-[#9aa0a6]">
          <Icon name="chevL" size={14} />
          <Icon name="chevR" size={14} className="opacity-40" />
          <Icon name="refresh" size={14} />
        </div>
        <div className="flex-1 h-[22px] rounded-full bg-[#0f1216] flex items-center gap-2 px-3 font-[system-ui,sans-serif] text-[11.5px] text-[#bcc0c7]">
          <Icon name="lock" size={11} className="opacity-70" />
          <span>{url}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
