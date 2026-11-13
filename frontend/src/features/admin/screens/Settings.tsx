import { SelectList } from '@/components/ui/SelectList';
import { useState } from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

const SUBNAV = ['General', 'Domains', 'SSO', 'Security', 'Branding', 'Danger'];

const DOMAINS = [
  { d: 'pagoda.dev', verified: true  },
  { d: 'pagoda.io',  verified: false },
];

const SSO_PROVIDERS = [
  { n: 'Google Workspace', id: 'google', enabled: true  },
  { n: 'Okta SAML',        id: 'okta',   enabled: false },
  { n: 'GitHub',           id: 'github', enabled: true  },
];

export function Settings() {
  const [section, setSection] = useState('General');
  const [ssoToggles, setSsoToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(SSO_PROVIDERS.map((p) => [p.id, p.enabled])),
  );

  return (
    <AdminShell
      active="settings"
      crumbs={['Pagoda', 'Settings']}
      title="Settings"
    >
      <div className="grid grid-cols-[200px_1fr] gap-[14px]">
        <nav className="glass overflow-hidden h-fit" aria-label="Settings sections">
          <SelectList
            label="Settings sections"
            items={SUBNAV}
            selectedIndex={SUBNAV.indexOf(section)}
            onSelect={(i) => setSection(SUBNAV[i] ?? 'General')}
            getKey={(s) => s}
            separated={false}
            itemClassName="px-[16px] py-[11px] text-[13.5px]"
            renderItem={(s, selected) => (
              <span className={selected ? 'text-fg-bright font-medium' : 'text-fg-2'}>{s}</span>
            )}
          />
        </nav>

        <div className="flex flex-col gap-[14px]">
          {section === 'General' && (
            <div className="glass p-[24px] flex flex-col gap-[18px]">
              <div>
                <label htmlFor="tenant-name" className="cap mb-[6px] block">TENANT NAME</label>
                <div className="glass xs p-[8px_12px]">
                  <input
                    id="tenant-name"
                    defaultValue="Pagoda"
                    className="bg-transparent border-0 outline-none text-fg-1 w-full text-[13px] font-sans"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="tenant-slug" className="cap mb-[6px] block">TENANT SLUG</label>
                <div className="glass xs p-[8px_12px] flex items-center gap-2">
                  <span className="text-fg-3 text-[13px] font-mono">authlyn.io/</span>
                  <input
                    id="tenant-slug"
                    defaultValue="pagoda-prod"
                    className="bg-transparent border-0 outline-none text-fg-1 flex-1 text-[13px] font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm">Save changes</Button>
              </div>
            </div>
          )}

          {section === 'Domains' && (
            <div className="glass overflow-hidden">
              <div className="p-[18px_22px] flex items-center justify-between border-b border-border">
                <h2 className="m-0 text-[15px] font-semibold">Custom domains</h2>
                <Button size="sm" icon="plus">Add domain</Button>
              </div>
              {DOMAINS.map((d) => (
                <div key={d.d} className="p-[16px_22px] flex items-center justify-between border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block w-[7px] h-[7px] rounded-full ${d.verified ? 'bg-mint' : 'bg-warning'}`} />
                    <span className="font-mono text-[13px]">{d.d}</span>
                    <span className={`pill ${d.verified ? 'ok' : 'warn'}`}>{d.verified ? 'Verified' : 'Pending'}</span>
                  </div>
                  <Button variant="ghost" size="sm" icon="dots" className="justify-center" aria-label={`More actions for ${d.d}`} />
                </div>
              ))}
            </div>
          )}

          {section === 'SSO' && (
            <div className="glass overflow-hidden">
              <div className="p-[18px_22px] border-b border-border">
                <h2 className="m-0 text-[15px] font-semibold">SSO providers</h2>
                <p className="m-0 mt-[4px] text-fg-3 text-[12.5px]">Enable single sign-on via OIDC or SAML providers.</p>
              </div>
              {SSO_PROVIDERS.map((p) => (
                <div key={p.id} className="p-[16px_22px] flex items-center justify-between border-b border-border last:border-0">
                  <div>
                    <div className="font-medium text-[14px]">{p.n}</div>
                    <div className="font-mono text-fg-3 text-[11.5px] mt-[2px]">{p.id}</div>
                  </div>
                  <Toggle
                    label={`Enable ${p.n}`}
                    on={ssoToggles[p.id]}
                    onChange={(v) => setSsoToggles((prev) => ({ ...prev, [p.id]: v }))}
                  />
                </div>
              ))}
            </div>
          )}

          {!['General', 'Domains', 'SSO'].includes(section) && (
            <div className="glass p-[48px] flex flex-col items-center justify-center gap-3 text-center">
              <div className="cap">{section.toUpperCase()}</div>
              <p className="text-fg-3 text-[13px] m-0">This section is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
