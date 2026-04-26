import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface Org {
  n: string;
  slug: string;
  m: number;
  t: string;
  r: string;
}

const ORGS: Org[] = [
  { n: 'Pagoda',       slug: 'pagoda-prod',    m: 412, t: 'Team',  r: '12 teams'          },
  { n: 'Lumen Labs',   slug: 'lumen-labs',     m: 87,  t: 'Team',  r: '4 teams'           },
  { n: 'Orbitloom',    slug: 'orbitloom-io',   m: 38,  t: 'Build', r: '2 teams'           },
  { n: 'Tidepool HQ',  slug: 'tidepool',       m: 16,  t: 'Build', r: '1 team'            },
  { n: 'Finchford',    slug: 'finchford-co',   m: 64,  t: 'Scale', r: '6 teams · SCIM'   },
  { n: 'Kellwood',     slug: 'kellwood',       m: 211, t: 'Team',  r: '9 teams'           },
];

export function Organizations() {
  return (
    <AdminShell
      active="orgs"
      crumbs={['Pagoda', 'Organizations']}
      title="Organizations"
      actions={<Button size="sm" icon="plus">New org</Button>}
    >
      <div className="grid grid-cols-3 gap-[14px]">
        {ORGS.map((o) => (
          <article key={o.n} className="glass p-5 flex flex-col gap-[14px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-[linear-gradient(135deg,rgba(248,125,73,0.25),rgba(108,208,176,0.15))] flex items-center justify-center text-fg-bright font-semibold text-[14px] border border-border shrink-0">
                  {o.n[0]}
                </div>
                <div>
                  <div className="font-medium text-[14px]">{o.n}</div>
                  <div className="font-mono text-fg-3 text-[11.5px]">{o.slug}</div>
                </div>
              </div>
              <span className="pill accent">{o.t}</span>
            </div>

            <div className="flex items-center gap-[14px] text-[12px] text-fg-2">
              <span className="flex items-center gap-1">
                <Icon name="users" size={12} className="text-fg-3" />
                {o.m} members
              </span>
              <span className="text-fg-3">{o.r}</span>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <Button variant="ghost" size="sm" className="flex-1 justify-center">Manage</Button>
              <Button variant="ghost" size="sm" icon="dots" className="justify-center" />
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
