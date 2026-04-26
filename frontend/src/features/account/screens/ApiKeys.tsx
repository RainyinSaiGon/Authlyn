import { AccountShell } from '@/components/layout/AccountShell';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface ApiKey {
  label: string;
  prefix: string;
  scopes: string;
  lastUsed: string;
  created: string;
}

const KEYS: ApiKey[] = [
  { label: 'Local dev',            prefix: 'ak_live_h7Tz', scopes: 'identity:read',                       lastUsed: '4 min ago',   created: 'Today'        },
  { label: 'CI · GitHub Actions',  prefix: 'ak_live_m2Qr', scopes: 'identity:read · org:read',            lastUsed: '1 hour ago',  created: '18 Oct 2025'  },
  { label: 'Staging importer',     prefix: 'ak_test_b9Xp', scopes: 'identity:write · org:write',          lastUsed: 'Yesterday',   created: '02 Mar 2025'  },
];

const REVEAL_KEY = 'ak_live_h7Tz9fE2NpMk0QxLcRyA7bVwUjHdS4Gm';

export function ApiKeys() {
  return (
    <AccountShell active="keys">
      <div className="flex items-end justify-between mb-[22px]">
        <div>
          <p className="eye">PERSONAL API KEYS</p>
          <h1 className="text-[32px] font-medium tracking-[-0.01em] m-0 mt-2">3 keys issued</h1>
        </div>
        <Button icon="plus">New API key</Button>
      </div>

      <div className="glass overflow-hidden mb-[22px]">
        <table className="tbl">
          <thead>
            <tr>
              <th>Label</th>
              <th>Prefix</th>
              <th>Scopes</th>
              <th>Last used</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {KEYS.map((k) => (
              <tr key={k.label}>
                <td className="font-medium">{k.label}</td>
                <td><span className="mono">{k.prefix}·····················</span></td>
                <td><span className="mono">{k.scopes}</span></td>
                <td className="font-mono text-fg-3 text-[12px]">{k.lastUsed}</td>
                <td className="font-mono text-fg-3 text-[12px]">{k.created}</td>
                <td className="text-right">
                  <Icon name="dots" size={16} className="text-fg-3 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass accent p-6">
        <p className="eye">NEW KEY · ONE-TIME VIEW</p>
        <h2 className="text-[20px] font-medium m-0 mt-2 mb-[14px]">Copy before closing</h2>
        <div className="codeblock text-[13.5px] select-all">{REVEAL_KEY}</div>
        <div className="flex items-center justify-between mt-[14px]">
          <div className="text-[12px] text-fg-3">
            This value is shown once. Store it in your secret manager.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon="copy">Copy</Button>
            <Button size="sm">Done</Button>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
