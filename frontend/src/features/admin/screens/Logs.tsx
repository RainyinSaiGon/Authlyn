import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogLine {
  ts: string;
  level: LogLevel;
  msg: string;
  meta: string;
}

const LOGS: LogLine[] = [
  { ts: '09:14:22.301', level: 'INFO',  msg: 'Token issued',                meta: 'sub=usr_01HZX · exp=15m' },
  { ts: '09:14:20.114', level: 'INFO',  msg: 'User authenticated',          meta: 'method=passkey · ip=104.28.14.1' },
  { ts: '09:13:58.840', level: 'WARN',  msg: 'MFA bypass attempt detected', meta: 'usr=usr_01HZY · ip=195.24.201.8' },
  { ts: '09:13:44.512', level: 'INFO',  msg: 'JWKS fetched',                meta: 'client=app_01HZw7' },
  { ts: '09:13:22.099', level: 'ERROR', msg: 'Token validation failed',     meta: 'err=invalid_signature · kid=authlyn-01' },
  { ts: '09:13:11.330', level: 'DEBUG', msg: 'Rate limit check passed',     meta: 'key=ak_live_m2 · remaining=9983' },
  { ts: '09:12:48.771', level: 'INFO',  msg: 'Webhook delivered',           meta: 'wh=wh_01HZX · status=200 · 84ms' },
  { ts: '09:12:30.105', level: 'WARN',  msg: 'API key near rate limit',     meta: 'key=ak_live_n9 · remaining=142' },
  { ts: '09:11:59.882', level: 'INFO',  msg: 'Session created',             meta: 'ses=ses_01HZX · ttl=7d' },
  { ts: '09:11:40.200', level: 'ERROR', msg: 'Webhook delivery failed',     meta: 'wh=wh_01HZZ · status=503' },
];

const LEVEL_COLOR: Record<LogLevel, string> = {
  INFO:  'text-mint',
  WARN:  'text-warning',
  ERROR: 'text-danger',
  DEBUG: 'text-fg-3',
};

export function Logs() {
  return (
    <AdminShell
      active="logs"
      crumbs={['Pagoda', 'Logs']}
      title="Logs"
      actions={
        <>
          <span className="flex items-center gap-[6px] text-[12px] text-mint font-mono">
            <span className="w-[6px] h-[6px] rounded-full bg-mint animate-pulse" />
            Live
          </span>
          <Button variant="ghost" size="sm" icon="download">Export</Button>
        </>
      }
    >
      <div className="glass overflow-hidden">
        <div className="px-[18px] py-[12px] border-b border-border flex items-center gap-[6px]">
          <Button variant="ghost" size="sm">All</Button>
          <Button variant="ghost" size="sm">Errors</Button>
          <Button variant="ghost" size="sm">Warnings</Button>
          <Button variant="ghost" size="sm">Auth</Button>
          <Button variant="ghost" size="sm">Webhooks</Button>
        </div>
        <div className="divide-y divide-border">
          {LOGS.map((l, i) => (
            <div key={i} className="px-[18px] py-[10px] flex items-baseline gap-[12px] font-mono text-[12px]">
              <span className="text-fg-3 shrink-0">{l.ts}</span>
              <span className={`w-[42px] shrink-0 font-semibold ${LEVEL_COLOR[l.level]}`}>{l.level}</span>
              <span className="text-fg-bright flex-1">{l.msg}</span>
              <span className="text-fg-3 shrink-0">{l.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
