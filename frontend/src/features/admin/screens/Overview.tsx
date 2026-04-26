import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';

const STATS = [
  { k: 'ACTIVE USERS',  v: '1,247', d: '+42 this week',      ok: true  },
  { k: 'ORGANIZATIONS', v: '84',    d: '+3 this week',        ok: true  },
  { k: 'SIGN-INS · 24H', v: '9,814', d: '98.2% success',    ok: true  },
  { k: 'MFA COVERAGE',  v: '86%',   d: '174 users without',  ok: false },
];

const EVENTS = [
  { t: 'Role updated · admin → owner',        u: 'Thi Nguyen', w: '4 min' },
  { t: 'Passkey registered',                  u: 'Alex Kim',   w: '18 min' },
  { t: 'API key created · ak_live_m2…',       u: 'Maya Tran',  w: '1h' },
  { t: 'SSO configured · Pagoda HR',          u: 'System',     w: '3h' },
  { t: 'Impossible travel · rejected',        u: 'Jon Park',   w: '5h' },
];

export function Overview() {
  const [period, setPeriod] = useState('14d');

  return (
    <AdminShell
      active="overview"
      crumbs={['Pagoda', 'Overview']}
      title="Overview"
      actions={
        <>
          <Button variant="ghost" size="sm" icon="download">Export</Button>
          <Button size="sm" icon="plus">Invite</Button>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-[14px] mb-[22px]">
        {STATS.map((s) => (
          <div key={s.k} className="glass p-[18px]">
            <div className="cap">{s.k}</div>
            <div className="text-[32px] font-medium mt-[6px] tracking-[-0.02em]">{s.v}</div>
            <div className={`text-[12px] mt-1 font-mono ${s.ok ? 'text-mint' : 'text-warning'}`}>{s.d}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-[14px]">
        <div className="glass p-[22px]">
          <div className="flex items-center justify-between mb-[18px]">
            <h2 className="m-0 text-[16px] font-semibold">Sign-ins · last 14 days</h2>
            <Segmented options={['24h', '14d', '30d']} value={period} onChange={setPeriod} />
          </div>
          <svg viewBox="0 0 500 140" className="w-full h-[140px]">
            <defs>
              <linearGradient id="signinGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f87d49" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f87d49" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,110 L35,95 L70,100 L105,70 L140,80 L175,58 L210,62 L245,45 L280,50 L315,34 L350,40 L385,28 L420,36 L455,22 L500,30 L500,140 L0,140 Z"
              fill="url(#signinGrad)"
            />
            <path
              d="M0,110 L35,95 L70,100 L105,70 L140,80 L175,58 L210,62 L245,45 L280,50 L315,34 L350,40 L385,28 L420,36 L455,22 L500,30"
              fill="none"
              stroke="#f87d49"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="glass p-[22px]">
          <h2 className="m-0 text-[16px] font-semibold mb-[14px]">Recent events</h2>
          <div className="flex flex-col">
            {EVENTS.map((e, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 py-[10px] ${i < EVENTS.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className="w-[4px] h-[4px] rounded-full bg-accent shrink-0 mt-[6px]" />
                <div className="flex-1 text-[13px]">
                  <div>{e.t}</div>
                  <div className="text-fg-3 text-[11.5px] font-mono mt-[2px]">by {e.u} · {e.w} ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
