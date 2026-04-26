import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatusPill } from '@/components/ui/StatusPill';

const STATS = [
  { k: 'TOTAL KEYS',    v: '12',   d: '8 live · 4 test' },
  { k: 'REQUESTS · 24H', v: '204k', d: '↑ 18.3%' },
  { k: 'ERROR RATE',    v: '0.12%', d: '< 1% threshold' },
  { k: 'RATE LIMIT',    v: '10k/m', d: 'Shared across keys' },
];

interface ApiKey {
  n: string;
  prefix: string;
  env: 'live' | 'test';
  last: string;
  created: string;
}

const API_KEYS: ApiKey[] = [
  { n: 'Production backend',  prefix: 'ak_live_m2…', env: 'live', last: '2 min',  created: '2024-01-15' },
  { n: 'CI pipeline',         prefix: 'ak_test_k7…', env: 'test', last: '6h',     created: '2024-02-01' },
  { n: 'Analytics worker',    prefix: 'ak_live_n9…', env: 'live', last: '1 day',  created: '2024-01-20' },
  { n: 'Staging environment', prefix: 'ak_test_p3…', env: 'test', last: '3 days', created: '2024-03-08' },
];

export function DevApiKeys() {
  return (
    <AdminShell
      active="keys"
      crumbs={['Pagoda', 'API Keys']}
      title="API Keys"
      actions={<Button size="sm" icon="plus">New API key</Button>}
    >
      <div className="grid grid-cols-4 gap-[14px] mb-[22px]">
        {STATS.map((s) => (
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
              <th>Name</th>
              <th>Key</th>
              <th>Environment</th>
              <th>Last used</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {API_KEYS.map((k) => (
              <tr key={k.prefix}>
                <td className="font-medium">{k.n}</td>
                <td><span className="font-mono text-[12px] text-accent-soft">{k.prefix}</span></td>
                <td>
                  <span className={`pill font-mono text-[11px] ${k.env === 'live' ? 'ok' : 'accent'}`}>
                    {k.env}
                  </span>
                </td>
                <td className="font-mono text-fg-3 text-[12px]">{k.last} ago</td>
                <td className="font-mono text-fg-3 text-[12px]">{k.created}</td>
                <td><StatusPill tone="ok">Active</StatusPill></td>
                <td><Icon name="dots" size={16} className="text-fg-3 cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
