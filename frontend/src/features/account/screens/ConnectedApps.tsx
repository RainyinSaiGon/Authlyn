import { AccountShell } from '@/components/layout/AccountShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

interface App {
  name: string;
  icon: IconName;
  clientSuffix: string;
  scopes: string;
  connected: string;
}

const APPS: App[] = [
  { name: 'Figma',      icon: 'figma',  clientSuffix: '01', scopes: 'profile · email',               connected: 'Mar 12, 2024'  },
  { name: 'Raycast',    icon: 'app',    clientSuffix: '02', scopes: 'profile · offline_access',       connected: 'Sep 02, 2024'  },
  { name: 'Linear CLI', icon: 'code',   clientSuffix: '03', scopes: 'profile · email · org:read',     connected: 'Nov 18, 2025'  },
  { name: 'Notion',     icon: 'folder', clientSuffix: '04', scopes: 'profile',                        connected: 'Apr 03, 2026'  },
];

export function ConnectedApps() {
  return (
    <AccountShell active="apps">
      <p className="eye">CONNECTED APPS</p>
      <h1 className="text-[32px] font-medium tracking-[-0.01em] m-0 mt-2 mb-6">
        Apps with{' '}
        <span className="font-display italic text-mint font-normal">access tokens</span>
      </h1>

      <div className="glass overflow-hidden">
        <table className="tbl">
          <thead>
            <tr>
              <th>Application</th>
              <th>Scopes</th>
              <th>Connected</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {APPS.map((app) => (
              <tr key={app.name}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-[32px] h-[32px] rounded-lg bg-white/[0.04] border border-border flex items-center justify-center shrink-0">
                      <Icon name={app.icon} size={15} />
                    </div>
                    <div>
                      <div className="font-medium">{app.name}</div>
                      <div className="sub">client_{app.clientSuffix}HZXQK…</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono">{app.scopes}</span></td>
                <td className="font-mono text-fg-3 text-[12px]">{app.connected}</td>
                <td className="text-right">
                  <Button variant="ghost" size="sm">Revoke</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountShell>
  );
}
