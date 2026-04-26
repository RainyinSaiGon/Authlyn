import { AdminShell } from '@/components/layout/AdminShell';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { StatusPill } from '@/components/ui/StatusPill';

const MINI_STATS = [
  { k: 'ACTIVE NOW',        v: '214',   d: '↑ 23 from 1h ago' },
  { k: 'SESSIONS · 24H',    v: '9,814', d: '↑ 12.4%' },
  { k: 'ANOMALIES FLAGGED', v: '3',     d: '2 pending review' },
  { k: 'AVG DURATION',      v: '38m',   d: 'Median 14m' },
];

interface Session {
  n: string;
  ip: string;
  loc: string;
  ua: string;
  dur: string;
  anomaly: boolean;
}

const SESSIONS: Session[] = [
  { n: 'Maya Tran',     ip: '104.28.14.1',  loc: 'San Jose, US',  ua: 'Chrome 123 · macOS',    dur: '12m',  anomaly: false },
  { n: 'Thi Nguyen',    ip: '82.41.7.209',  loc: 'London, GB',    ua: 'Firefox 124 · Windows', dur: '8m',   anomaly: false },
  { n: 'Jon Park',      ip: '195.24.201.8', loc: 'Moscow, RU',    ua: 'Chrome 122 · Win',      dur: '3m',   anomaly: true  },
  { n: 'Alex Kim',      ip: '172.16.0.8',   loc: 'Seattle, US',   ua: 'Safari 17 · iOS 17',    dur: '42m',  anomaly: false },
  { n: 'Ravi Shah',     ip: '104.18.25.1',  loc: 'Mumbai, IN',    ua: 'Chrome 123 · Android',  dur: '2m',   anomaly: false },
  { n: 'Chloé Bernard', ip: '31.7.48.121',  loc: 'Paris, FR',     ua: 'Chrome 123 · macOS',    dur: '28m',  anomaly: false },
];

export function AdminSessions() {
  return (
    <AdminShell
      active="sessions"
      crumbs={['Pagoda', 'Sessions']}
      title="Sessions"
    >
      <div className="grid grid-cols-4 gap-[14px] mb-[22px]">
        {MINI_STATS.map((s) => (
          <div key={s.k} className="glass p-[16px]">
            <div className="cap">{s.k}</div>
            <div className="text-[28px] font-medium mt-[6px] tracking-[-0.02em]">{s.v}</div>
            <div className="text-[11.5px] mt-1 font-mono text-fg-3">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="glass overflow-hidden">
        <table className="tbl">
          <thead>
            <tr>
              <th className="w-[28px]"><input type="checkbox" /></th>
              <th>User</th>
              <th>IP address</th>
              <th>Location</th>
              <th>Browser · OS</th>
              <th>Duration</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((s) => (
              <tr key={s.n + s.ip}>
                <td><input type="checkbox" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={s.n} />
                    <span className="font-medium">{s.n}</span>
                  </div>
                </td>
                <td><span className="font-mono text-[12px] text-fg-2">{s.ip}</span></td>
                <td className="text-fg-2 text-[13px]">{s.loc}</td>
                <td className="font-mono text-fg-3 text-[12px]">{s.ua}</td>
                <td className="font-mono text-fg-3 text-[12px]">{s.dur}</td>
                <td>
                  {s.anomaly
                    ? <StatusPill tone="err">Anomaly</StatusPill>
                    : <StatusPill tone="ok">Active</StatusPill>
                  }
                </td>
                <td><Icon name="dots" size={16} className="text-fg-3 cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
