import { SelectList } from '@/components/ui/SelectList';
import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatusPill } from '@/components/ui/StatusPill';

interface Endpoint {
  id: string;
  url: string;
  events: string[];
  last: string;
  ok: boolean;
}

const ENDPOINTS: Endpoint[] = [
  { id: 'wh_01HZX', url: 'https://pagoda.dev/api/hooks/auth',     events: ['user.created', 'user.suspended'],  last: '2 min',  ok: true  },
  { id: 'wh_01HZY', url: 'https://analytics.pagoda.dev/webhooks', events: ['session.started', 'session.ended'], last: '14 min', ok: true  },
  { id: 'wh_01HZZ', url: 'https://pagoda.dev/api/hooks/audit',    events: ['audit.*'],                          last: '3 days', ok: false },
];

const DELIVERY_LOGS = [
  `POST https://pagoda.dev/api/hooks/auth
Status: 200 OK · 84ms

{
  "event": "user.created",
  "data": { "id": "usr_01HZXQK4M7RB9TP" }
}`,
  `POST https://analytics.pagoda.dev/webhooks
Status: 200 OK · 62ms

{
  "event": "session.started",
  "data": { "session_id": "ses_01HZX" }
}`,
  `POST https://pagoda.dev/api/hooks/audit
Status: 503 Service Unavailable · 30012ms

Connection timed out after 30s`,
];

export function Webhooks() {
  const [selected, setSelected] = useState(0);

  return (
    <AdminShell
      active="webhooks"
      crumbs={['Pagoda', 'Webhooks']}
      title="Webhooks"
      actions={<Button size="sm" icon="plus">New endpoint</Button>}
    >
      <div className="grid grid-cols-[1fr_1.4fr] gap-[14px]">
        <div className="glass overflow-hidden h-fit">
          <SelectList
            label="Webhook endpoints"
            items={ENDPOINTS}
            selectedIndex={selected}
            onSelect={setSelected}
            getKey={(e) => e.id}
            itemClassName="px-[18px] py-[14px] flex items-start gap-3"
            renderItem={(e) => (
              <>
                <span className={`inline-block w-[7px] h-[7px] rounded-full mt-[5px] shrink-0 ${e.ok ? 'bg-mint' : 'bg-danger'}`} />
                <span className="flex-1 min-w-0">
                  <span className="block font-mono text-[12px] text-fg-bright truncate">{e.url}</span>
                  <span className="block text-fg-3 text-[11.5px] mt-[3px]">
                    {e.events.join(', ')}
                    <span className="sr-only">{e.ok ? ' (healthy)' : ' (failing)'}</span>
                  </span>
                </span>
              </>
            )}
          />
        </div>

        <div className="glass p-[22px] flex flex-col gap-[16px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="eye m-0">ENDPOINT</p>
              <div className="font-mono text-fg-bright text-[13px] mt-[6px] break-all">{ENDPOINTS[selected].url}</div>
              <div className="font-mono text-fg-3 text-[11.5px] mt-[3px]">{ENDPOINTS[selected].id}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <StatusPill tone={ENDPOINTS[selected].ok ? 'ok' : 'err'}>
                {ENDPOINTS[selected].ok ? 'Healthy' : 'Failing'}
              </StatusPill>
              <Button variant="ghost" size="sm" icon="dots" className="justify-center" aria-label="More actions for this endpoint" />
            </div>
          </div>

          <div>
            <div className="cap mb-[10px]">EVENTS SUBSCRIBED</div>
            <div className="flex flex-wrap gap-[6px]">
              {ENDPOINTS[selected].events.map((ev) => (
                <span key={ev} className="pill font-mono text-[11px]">{ev}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="cap mb-[10px]">LATEST DELIVERY</div>
            <pre className="codeblock text-[11px] whitespace-pre-wrap leading-[1.6]">{DELIVERY_LOGS[selected]}</pre>
            <div className="flex items-center gap-2 mt-[10px]">
              <Icon name="activity" size={12} className="text-fg-3" />
              <span className="text-fg-3 text-[12px]">Last delivery {ENDPOINTS[selected].last} ago</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
