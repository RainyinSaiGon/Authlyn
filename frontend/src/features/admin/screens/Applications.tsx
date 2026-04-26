import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatusPill } from '@/components/ui/StatusPill';

interface App {
  n: string;
  t: string;
  id: string;
  grant: string;
  cb: string;
}

const APPS: App[] = [
  { n: 'Pagoda Web',      t: 'SPA · PKCE',       id: 'app_01HZ…w7', grant: 'auth_code + pkce',      cb: 'https://pagoda.dev/cb' },
  { n: 'Pagoda API',      t: 'Resource server',  id: 'app_01HZ…x3', grant: 'client_credentials',    cb: '—' },
  { n: 'Pagoda iOS',      t: 'Native',           id: 'app_01HZ…q8', grant: 'auth_code + pkce',      cb: 'pagoda://auth' },
  { n: 'Analytics Cron',  t: 'Machine',          id: 'app_01HZ…k2', grant: 'client_credentials',    cb: '—' },
];

export function Applications() {
  return (
    <AdminShell
      active="apps"
      crumbs={['Pagoda', 'Applications']}
      title="Applications"
      actions={<Button size="sm" icon="plus">New application</Button>}
    >
      <div className="glass overflow-hidden">
        <table className="tbl">
          <thead>
            <tr>
              <th>Application</th>
              <th>Client ID</th>
              <th>Grant</th>
              <th>Callback</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {APPS.map((a) => (
              <tr key={a.n}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-[32px] h-[32px] rounded-[9px] bg-white/[0.05] border border-border flex items-center justify-center shrink-0">
                      <Icon name="app" size={14} />
                    </div>
                    <div>
                      <div className="font-medium">{a.n}</div>
                      <div className="text-fg-3 text-[12px] mt-[2px]">{a.t}</div>
                    </div>
                  </div>
                </td>
                <td><span className="font-mono text-[12px] text-accent-soft">{a.id}</span></td>
                <td><span className="font-mono text-[12px]">{a.grant}</span></td>
                <td className="font-mono text-fg-3 text-[12px]">{a.cb}</td>
                <td><StatusPill tone="ok">Live</StatusPill></td>
                <td className="text-right">
                  <Icon name="dots" size={16} className="text-fg-3 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
