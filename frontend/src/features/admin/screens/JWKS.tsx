import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/Button';

const KEYS = [
  {
    kid: 'authlyn-01',
    alg: 'RS256',
    use: 'sig',
    kty: 'RSA',
    exp: '2024-12-31',
    daysLeft: 80,
    active: true,
    n: 'pj…QVz (2048-bit)',
  },
  {
    kid: 'authlyn-00',
    alg: 'RS256',
    use: 'sig',
    kty: 'RSA',
    exp: '2024-09-01',
    daysLeft: 0,
    active: false,
    n: 'mK…8Yw (2048-bit)',
  },
];

const JWKS_PREVIEW = `{
  "keys": [
    {
      "kty": "RSA",
      "kid": "authlyn-01",
      "use": "sig",
      "alg": "RS256",
      "n": "pjQV…truncated",
      "e": "AQAB"
    }
  ]
}`;

export function JWKS() {
  return (
    <AdminShell
      active="jwks"
      crumbs={['Pagoda', 'JWKS']}
      title="JWKS"
      actions={<Button size="sm" icon="refresh">Rotate key</Button>}
    >
      <div className="grid grid-cols-2 gap-[14px] mb-[22px]">
        {KEYS.map((k) => (
          <div key={k.kid} className="glass p-[20px] flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[13px] font-medium">{k.kid}</div>
                <div className="text-fg-3 text-[12px] mt-[2px] font-mono">{k.alg} · {k.use} · {k.kty}</div>
              </div>
              <span className={`pill ${k.active ? 'ok' : 'err'}`}>{k.active ? 'Active' : 'Retired'}</span>
            </div>

            {k.active && (
              <div>
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="cap">EXPIRY</div>
                  <div className="font-mono text-[11.5px] text-fg-3">{k.exp} · {k.daysLeft}d left</div>
                </div>
                <div className="h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-mint"
                    style={{ width: `${Math.min((k.daysLeft / 365) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="font-mono text-fg-3 text-[11.5px]">n: {k.n}</div>
          </div>
        ))}
      </div>

      <div className="glass p-[22px]">
        <div className="flex items-center justify-between mb-[14px]">
          <h2 className="m-0 text-[15px] font-semibold">/.well-known/jwks.json</h2>
          <Button variant="ghost" size="sm" icon="download">Copy URL</Button>
        </div>
        <pre className="codeblock text-[11.5px] whitespace-pre leading-[1.65]">{JWKS_PREVIEW}</pre>
      </div>
    </AdminShell>
  );
}
