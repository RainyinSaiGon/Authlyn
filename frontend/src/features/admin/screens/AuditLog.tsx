import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

type AuditTone = 'ok' | 'warn' | 'err';

interface AuditEvent {
  type: string;
  act: string;
  actor: string;
  ip: string;
  ts: string;
  tone: AuditTone;
}

const EVENTS: AuditEvent[] = [
  { type: 'user.suspended',     act: 'Darius Owens suspended',        actor: 'Maya Tran', ip: '104.28.14.1',  ts: '2 min ago',  tone: 'err'  },
  { type: 'role.assigned',      act: 'Owner assigned to Thi Nguyen',  actor: 'Maya Tran', ip: '104.28.14.1',  ts: '4 min ago',  tone: 'warn' },
  { type: 'passkey.registered', act: 'Passkey registered',            actor: 'Alex Kim',  ip: '172.16.0.8',   ts: '18 min ago', tone: 'ok'   },
  { type: 'apikey.created',     act: 'API key ak_live_m2… created',   actor: 'Maya Tran', ip: '104.28.14.1',  ts: '1h ago',     tone: 'ok'   },
  { type: 'sso.configured',     act: 'SSO provider Pagoda HR added',  actor: 'System',    ip: '—',            ts: '3h ago',     tone: 'ok'   },
  { type: 'login.blocked',      act: 'Impossible travel detected',    actor: 'Jon Park',  ip: '195.24.201.8', ts: '5h ago',     tone: 'err'  },
  { type: 'app.created',        act: 'App Pagoda iOS registered',     actor: 'Ravi Shah', ip: '104.18.25.1',  ts: '7h ago',     tone: 'ok'   },
  { type: 'mfa.disabled',       act: 'TOTP MFA removed',              actor: 'Jon Park',  ip: '10.0.0.22',    ts: '12h ago',    tone: 'warn' },
];

const TONE_BG: Record<AuditTone, string> = {
  ok:   'bg-mint',
  warn: 'bg-warning',
  err:  'bg-danger',
};

export function AuditLog() {
  return (
    <AdminShell
      active="audit"
      crumbs={['Pagoda', 'Audit Log']}
      title="Audit Log"
      actions={<Button size="sm" icon="download">Export CSV</Button>}
    >
      <div className="flex items-center gap-[10px] mb-[18px]">
        <div className="glass xs p-[8px_12px] flex items-center gap-2 flex-1 max-w-[360px]">
          <Icon name="search" size={14} className="text-fg-3 shrink-0" />
          <input
            className="bg-transparent border-0 outline-none text-fg-1 w-full text-[13px] font-sans"
            placeholder="Filter events, actors, IPs…"
          />
        </div>
        <Button variant="ghost" size="sm" icon="filter">Event type</Button>
        <Button variant="ghost" size="sm" icon="filter">Actor</Button>
        <span className="ml-auto text-fg-3 text-[12.5px] font-mono">8,441 events</span>
      </div>

      <div className="glass overflow-hidden">
        <table className="tbl">
          <thead>
            <tr>
              <th className="w-[28px]"></th>
              <th>Event type</th>
              <th>Action</th>
              <th>Actor</th>
              <th>IP</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((e) => (
              <tr key={e.type + e.ts}>
                <td>
                  <span className={`inline-block w-[7px] h-[7px] rounded-full ${TONE_BG[e.tone]}`} />
                </td>
                <td><span className="font-mono text-[12px] text-accent-soft">{e.type}</span></td>
                <td className="text-[13px]">{e.act}</td>
                <td className="text-fg-2 text-[13px]">{e.actor}</td>
                <td><span className="font-mono text-fg-3 text-[12px]">{e.ip}</span></td>
                <td className="font-mono text-fg-3 text-[12px]">{e.ts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
