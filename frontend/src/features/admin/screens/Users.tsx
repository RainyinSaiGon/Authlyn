import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusPill } from '@/components/ui/StatusPill';
import { Icon } from '@/components/ui/Icon';
import { InviteModal } from '../components/InviteModal';

type StatusTone = 'ok' | 'warn' | 'err';

interface User {
  n: string;
  e: string;
  r: string;
  o: string;
  mfa: string;
  last: string;
  tone: StatusTone | null;
}

const USERS: User[] = [
  { n: 'Maya Tran',      e: 'maya.tran@pagoda.dev',   r: 'Owner',  o: 'Pagoda · Eng',    mfa: 'Passkey', last: '2 min',  tone: null   },
  { n: 'Thi Nguyen',     e: 'thi@pagoda.dev',          r: 'Admin',  o: 'Pagoda · Eng',    mfa: 'TOTP',    last: '14 min', tone: null   },
  { n: 'Alex Kim',       e: 'alex.kim@pagoda.dev',     r: 'Member', o: 'Pagoda · Design', mfa: 'Passkey', last: '1 h',    tone: null   },
  { n: 'Jon Park',       e: 'jon@pagoda.dev',          r: 'Member', o: 'Pagoda · Sales',  mfa: '—',       last: '3 d',    tone: 'warn' },
  { n: 'Sana Fernandes', e: 'sana@lumen.co',           r: 'Guest',  o: 'Lumen',           mfa: 'TOTP',    last: '5 d',    tone: null   },
  { n: 'Ravi Shah',      e: 'ravi.shah@pagoda.dev',    r: 'Member', o: 'Pagoda · Eng',    mfa: 'Passkey', last: 'now',    tone: null   },
  { n: 'Chloé Bernard',  e: 'chloe@orbitloom.io',      r: 'Member', o: 'Orbitloom',       mfa: 'TOTP',    last: '21 h',   tone: null   },
  { n: 'Darius Owens',   e: 'darius.owens@pagoda.dev', r: 'Member', o: 'Pagoda · Ops',    mfa: '—',       last: '12 d',   tone: 'err'  },
];

export function Users() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <AdminShell
      active="users"
      crumbs={['Pagoda', 'Users']}
      title="Users"
      actions={
        <>
          <Button variant="ghost" size="sm" icon="download">Export CSV</Button>
          <Button size="sm" icon="plus" onClick={() => setShowInvite(true)}>Invite user</Button>
        </>
      }
    >
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      <div className="flex items-center gap-[10px] mb-[18px]">
        <div className="glass xs p-[8px_12px] flex items-center gap-2 flex-1 max-w-[360px]">
          <Icon name="search" size={14} className="text-fg-3 shrink-0" />
          <input
            className="bg-transparent border-0 outline-none text-fg-1 w-full text-[13px] font-sans"
            placeholder="Search by name, email, or user ID"
          />
          <span className="kbd">⌘K</span>
        </div>
        <Button variant="ghost" size="sm" icon="filter">Role: all</Button>
        <Button variant="ghost" size="sm" icon="filter">Status: active</Button>
        <Button variant="ghost" size="sm" icon="filter">MFA: any</Button>
        <span className="ml-auto text-fg-3 text-[12.5px] font-mono">1,247 users · page 1 / 63</span>
      </div>

      <div className="glass overflow-hidden">
        <table className="tbl">
          <thead>
            <tr>
              <th className="w-[28px]"><input type="checkbox" /></th>
              <th>User</th>
              <th>Role</th>
              <th>Organization</th>
              <th>MFA</th>
              <th>Last active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.e}>
                <td><input type="checkbox" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={u.n} />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {u.n}
                        {u.tone === 'err'  && <StatusPill tone="err">Suspended</StatusPill>}
                        {u.tone === 'warn' && <StatusPill tone="warn">No MFA</StatusPill>}
                      </div>
                      <div className="text-fg-3 text-[12px] font-mono mt-[2px]">{u.e}</div>
                    </div>
                  </div>
                </td>
                <td><span className="pill accent">{u.r}</span></td>
                <td className="text-fg-3 text-[13px]">{u.o}</td>
                <td>
                  <span className={`font-mono text-[12px] ${u.mfa === '—' ? 'text-fg-3' : 'text-mint'}`}>
                    {u.mfa}
                  </span>
                </td>
                <td className="font-mono text-fg-3 text-[12px]">{u.last} ago</td>
                <td><Icon name="dots" size={16} className="text-fg-3 cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
