import { AccountShell } from '@/components/layout/AccountShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { StatusPill } from '@/components/ui/StatusPill';

interface Session {
  deviceIcon: IconName;
  browser: string;
  location: string;
  ip: string;
  refreshed: string;
  current: boolean;
}

const SESSIONS: Session[] = [
  { deviceIcon: 'desktop', browser: 'Chrome 125 · macOS 14',      location: 'Ho Chi Minh City, VN', ip: '203.162.44.18', refreshed: 'This device',    current: true  },
  { deviceIcon: 'device',  browser: 'Safari · iPhone 15 Pro',     location: 'Ho Chi Minh City, VN', ip: '203.162.44.18', refreshed: '2 hours ago',     current: false },
  { deviceIcon: 'desktop', browser: 'Firefox 128 · Ubuntu 24.04', location: 'Singapore, SG',        ip: '139.162.11.90', refreshed: 'Yesterday 19:12', current: false },
  { deviceIcon: 'desktop', browser: 'Edge 126 · Windows 11',      location: 'Bangkok, TH',          ip: '184.22.161.5',  refreshed: '3 days ago',      current: false },
];

export function Sessions() {
  return (
    <AccountShell active="sessions">
      <div className="flex items-end justify-between mb-[22px]">
        <div>
          <p className="eye">SESSIONS</p>
          <h1 className="text-[32px] font-medium tracking-[-0.01em] m-0 mt-2">
            {SESSIONS.length} active{' '}
            <span className="font-display italic text-mint font-normal">devices</span>
          </h1>
        </div>
        <Button variant="danger" icon="x">Sign out all others</Button>
      </div>

      <div className="glass overflow-hidden">
        {SESSIONS.map((s, i) => (
          <div key={i} className="flex items-center gap-[18px] px-[22px] py-[18px] border-b border-border last:border-b-0">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-white/[0.04] border border-border flex items-center justify-center shrink-0">
              <Icon name={s.deviceIcon} size={18} />
            </div>
            <div className="flex-1">
              <div className="text-[14.5px] font-medium flex items-center gap-[10px]">
                {s.browser}
                {s.current && <StatusPill tone="ok">This device</StatusPill>}
              </div>
              <div className="text-fg-3 text-[12px] font-mono mt-[3px]">
                {s.location} · {s.ip} · refreshed {s.refreshed}
              </div>
            </div>
            <Button variant={s.current ? 'ghost' : 'link'} size="sm">
              {s.current ? 'Active' : 'Revoke'}
            </Button>
          </div>
        ))}
      </div>

      <h2 className="text-[18px] font-semibold mt-8 mb-[14px]">Refresh-token chain</h2>
      <div className="glass p-[22px]">
        <p className="m-0 text-fg-2 text-[13.5px] leading-[1.65]">
          This device rotates refresh tokens every 15 minutes. Reuse detection is on — if a
          rotated token is replayed, the chain is revoked and every session from this device
          is ended.
        </p>
        <div className="flex items-start gap-[40px] mt-[18px]">
          <div>
            <div className="cap">CHAIN ID</div>
            <div className="font-mono text-accent-soft text-[13px] mt-1">chn_01HZXQR2KT…</div>
          </div>
          <div>
            <div className="cap">ISSUED</div>
            <div className="font-mono text-fg-1 text-[13px] mt-1">2 min ago</div>
          </div>
          <div>
            <div className="cap">NEXT ROTATE</div>
            <div className="font-mono text-fg-1 text-[13px] mt-1">in 12:47</div>
          </div>
          <div>
            <div className="cap">ROTATIONS</div>
            <div className="font-mono text-fg-1 text-[13px] mt-1">147</div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
