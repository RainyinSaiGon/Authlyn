import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';

interface Role { n: string; d: string; c: number }

const ROLES: Role[] = [
  { n: 'Owner',   d: 'Full control over the tenant',   c: 3    },
  { n: 'Admin',   d: 'Manage users and apps',           c: 8    },
  { n: 'Member',  d: 'Access their own account',        c: 1214 },
  { n: 'Guest',   d: 'Read-only, scoped to one org',    c: 22   },
  { n: 'Auditor', d: 'Read audit log and sessions',     c: 0    },
];

const PERM_GROUPS = [
  { g: 'identity', perms: ['identity:read', 'identity:write', 'identity:delete', 'identity:impersonate'] },
  { g: 'rbac',     perms: ['rbac:read', 'rbac:write', 'rbac:assign'] },
  { g: 'billing',  perms: ['billing:read', 'billing:write'] },
  { g: 'audit',    perms: ['audit:read', 'audit:export'] },
];

const OWNER_MEMBERS = ['Maya Tran', 'Thi Nguyen', 'Ravi Shah'];

export function Roles() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = ROLES[activeIdx];

  return (
    <AdminShell
      active="roles"
      crumbs={['Pagoda', 'Roles & permissions']}
      title="Roles & permissions"
      actions={<Button size="sm" icon="plus">New role</Button>}
    >
      <div className="grid grid-cols-[1fr_1.4fr] gap-[14px]">
        <div className="glass overflow-hidden">
          {ROLES.map((r, i) => (
            <div
              key={r.n}
              role="button"
              onClick={() => setActiveIdx(i)}
              className={`flex items-center px-[18px] py-[16px] gap-3 cursor-pointer border-l-2 ${
                i < ROLES.length - 1 ? 'border-b border-border' : ''
              } ${i === activeIdx
                ? 'bg-[rgba(248,125,73,0.06)] border-l-accent'
                : 'border-l-transparent'
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-[14px]">{r.n}</div>
                <div className="text-fg-3 text-[12px] mt-[2px]">{r.d}</div>
              </div>
              <span className="font-mono text-fg-3 text-[12px]">{r.c}</span>
              <Icon name="chevR" size={14} className="text-fg-3" />
            </div>
          ))}
        </div>

        <div className="glass p-[24px] flex flex-col gap-[18px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="eye m-0">ROLE</p>
              <h2 className="m-0 mt-[6px] text-[22px] font-medium">{active.n}</h2>
              <div className="font-mono text-fg-3 text-[12px] mt-1">
                rol_01HZW · {active.c} members
              </div>
            </div>
            <Button variant="ghost" size="sm" icon="edit">Edit</Button>
          </div>

          <div>
            <div className="cap mb-[10px]">PERMISSIONS</div>
            <div className="flex flex-col gap-px border border-border rounded-[12px] overflow-hidden">
              {PERM_GROUPS.map((gr) => (
                <div key={gr.g} className="px-[14px] py-[12px] bg-black/20">
                  <div className="cap mb-2">{gr.g}</div>
                  <div className="flex flex-wrap gap-[6px]">
                    {gr.perms.map((p) => (
                      <span key={p} className="pill ok font-mono text-[11px]">{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="cap mb-[10px]">MEMBERS</div>
            <div className="flex items-center">
              {OWNER_MEMBERS.map((n, i) => (
                <div key={n} className={i > 0 ? '-ml-2' : ''}>
                  <Avatar name={n} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
