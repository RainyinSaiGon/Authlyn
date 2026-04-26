import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusPill } from '@/components/ui/StatusPill';
import { Tabs } from '@/components/ui/Tabs';

const IDENTITY = [
  ['USER ID',          'usr_01HZXQK4M7RB9TP'],
  ['TENANT',           'pagoda-prod'],
  ['EMAIL VERIFIED',   '2024-03-12 09:14 UTC'],
  ['SIGN-UP METHOD',   'email + password'],
  ['PASSWORD UPDATED', '38 days ago'],
  ['MFA',              'Passkey · TOTP'],
];

const JWT_SNIPPET = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6
ImF1dGhseW4tMDEifQ.eyJzdWIiOiJ1c3JfMDFIWlh…
signature: 8f3… (truncated)`;

export function UserDetail() {
  const [tab, setTab] = useState('Overview');

  return (
    <AdminShell
      active="users"
      crumbs={['Pagoda', 'Users', 'Maya Tran']}
      actions={
        <>
          <Button variant="ghost" size="sm" icon="mail">Email</Button>
          <Button variant="ghost" size="sm" icon="refresh">Reset password</Button>
          <Button variant="danger" size="sm">Suspend</Button>
        </>
      }
    >
      <div className="flex items-center gap-5 mb-[26px]">
        <Avatar name="Maya Tran" size="xl" />
        <div>
          <h1 className="m-0 text-[28px] font-medium tracking-[-0.01em] flex items-center gap-3">
            Maya Tran <StatusPill tone="ok">Active</StatusPill>
          </h1>
          <div className="font-mono text-fg-3 text-[12.5px] mt-1">
            usr_01HZXQK4M7RB9TP · maya.tran@pagoda.dev
          </div>
          <div className="flex items-center gap-2 mt-[10px]">
            <span className="pill accent">Owner</span>
            <span className="pill">identity:*</span>
            <span className="pill">billing:read</span>
            <span className="pill">+4 more</span>
          </div>
        </div>
      </div>

      <Tabs
        options={['Overview', 'Sessions', 'Roles', 'Apps', 'Events']}
        value={tab}
        onChange={setTab}
      />

      <div className="grid grid-cols-[1.6fr_1fr] gap-[14px] mt-[18px]">
        <div className="glass p-[22px]">
          <h2 className="m-0 text-[16px] font-semibold mb-[16px]">Identity</h2>
          <dl className="grid grid-cols-2 gap-[18px] m-0">
            {IDENTITY.map(([k, v]) => (
              <div key={k}>
                <div className="cap">{k}</div>
                <div className="font-mono text-fg-bright text-[13px] mt-1">{v}</div>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass p-[22px]">
          <h2 className="m-0 text-[16px] font-semibold mb-[14px]">Latest JWT</h2>
          <pre className="codeblock text-[11px] whitespace-pre-wrap break-all leading-[1.55]">
            {JWT_SNIPPET}
          </pre>
          <div className="flex items-start gap-[12px] mt-[14px] text-[12px]">
            <div>
              <div className="cap">EXP</div>
              <div className="font-mono text-fg-bright mt-[3px]">14m 17s</div>
            </div>
            <div>
              <div className="cap">CHAIN</div>
              <div className="font-mono text-fg-bright mt-[3px]">chn_01HZXQR2K…</div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
