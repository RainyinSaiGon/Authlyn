import { AccountShell } from '@/components/layout/AccountShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { StatusPill } from '@/components/ui/StatusPill';

type PillTone = 'ok' | 'warn' | 'err' | 'accent';

interface Credential {
  title: string;
  sub: string;
  tone: PillTone;
  icon: IconName;
  action: string;
}

const CREDENTIALS: Credential[] = [
  { title: 'Password',     sub: 'Updated 38 days ago',              tone: 'ok',   icon: 'lock',    action: 'Change'     },
  { title: 'Two-step',     sub: '1Password · TOTP',                 tone: 'ok',   icon: 'key',     action: 'Manage'     },
  { title: 'Passkeys',     sub: '2 registered · MacBook, iPhone',   tone: 'ok',   icon: 'passkey', action: 'Manage'     },
  { title: 'Backup codes', sub: '7 of 10 remaining',                tone: 'warn', icon: 'refresh', action: 'Regenerate' },
];

const EVENTS = [
  ['Sign in',                            'Chrome · macOS · HCMC',        '00:12 ago', '203.162.44.18' ],
  ['Passkey used',                        'Chrome · macOS · HCMC',        '00:12 ago', '203.162.44.18' ],
  ['Password changed',                    'Safari · iOS · HCMC',          '38d ago',   '203.162.44.18' ],
  ['Sign in failed · wrong password',     'Firefox · Ubuntu · Singapore', '41d ago',   '139.162.11.90' ],
];

export function Security() {
  return (
    <AccountShell active="security">
      <p className="eye">SECURITY</p>
      <h1 className="text-[32px] font-medium tracking-[-0.01em] m-0 mt-2 mb-6">
        Your{' '}
        <span className="font-display italic text-mint font-normal">credentials</span>
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {CREDENTIALS.map((c) => (
          <article key={c.title} className="glass p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Icon name={c.icon} size={22} className="text-accent" />
              <StatusPill tone={c.tone}>{c.tone === 'ok' ? 'Active' : 'Low'}</StatusPill>
            </div>
            <div>
              <div className="text-[18px] font-medium">{c.title}</div>
              <div className="text-fg-3 text-[12.5px] font-mono mt-1">{c.sub}</div>
            </div>
            <Button variant="ghost" size="sm" className="self-start">{c.action}</Button>
          </article>
        ))}
      </div>

      <h2 className="text-[18px] font-semibold mt-8 mb-[14px]">Recent security events</h2>
      <div className="glass overflow-hidden">
        <table className="tbl">
          <thead>
            <tr>
              <th>Event</th>
              <th>Where</th>
              <th>When</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((row, i) => (
              <tr key={i}>
                <td className="font-medium">{row[0]}</td>
                <td className="text-fg-3">{row[1]}</td>
                <td><span className="font-mono text-fg-3 text-[12px]">{row[2]}</span></td>
                <td><span className="mono text-[12px]">{row[3]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountShell>
  );
}
