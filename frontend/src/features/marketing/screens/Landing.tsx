import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { MarketingNav } from '../components/MarketingNav';

type Feature = { key: string; title: string; desc: string; icon: IconName };

const FEATURES: Feature[] = [
  { key: 'Sign in',  title: 'Drop-in auth UI',         desc: 'Email, password, passkey, SSO, MFA. Ship the whole flow or just the hooks.',          icon: 'key'      },
  { key: 'RBAC',     title: 'Roles that nest',          desc: 'Org → Team → Member. Permission strings that never drift from your API.',              icon: 'shield'   },
  { key: 'Sessions', title: 'Refresh-token chains',     desc: 'Reuse detection. Revoke a chain, kill the session — on every device.',                 icon: 'activity' },
];

const JWKS_SNIPPET = `GET /.well-known/jwks.json
{
  "keys": [
    {
      "kty": "RSA",
      "kid": "authlyn-01",
      "use": "sig",
      "alg": "RS256",
      "n":   "xz7k4…",
      "e":   "AQAB"
    }
  ]
}`;

export function Landing() {
  return (
    <div className="min-h-screen overflow-auto">
      <MarketingNav active="product" />

      {/* Hero */}
      <section className="px-[80px] pt-[80px] pb-[60px] max-w-[1180px] mx-auto">
        <p className="eye mb-5">IDENTITY INFRASTRUCTURE, REFACTORED WITH INTENTION</p>
        <h1 className="text-[72px] font-medium leading-[0.94] tracking-[-0.015em] m-0 max-w-[13ch]">
          Auth that reads like<br />
          <span className="font-display italic text-mint font-normal">well-ordered code</span>.
        </h1>
        <p className="lead mt-7 max-w-[620px]">
          Authlyn is a Spring + React identity platform with strict module boundaries, typed
          contracts, and every token surface documented. Drop it in as your resource server —
          or run the full console for organizations, RBAC, and passkeys.
        </p>
        <div className="flex items-center gap-3 mt-9">
          <Button iconRight="arrowR">Start free</Button>
          <Button variant="ghost" icon="code">Read the spec</Button>
          <span className="font-mono text-fg-3 text-[13px] ml-2">npm i @authlyn/sdk</span>
        </div>
        <div className="flex items-center gap-[40px] mt-[72px] text-fg-3 text-[11.5px] uppercase tracking-[0.14em]">
          <span>Trusted by build-minded teams</span>
          <span className="text-fg-2 normal-case tracking-normal font-mono">
            Lumen · Pagoda · Kellwood · Orbitloom · Finchford · Tidepool
          </span>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-[80px] pt-[40px] pb-[80px] max-w-[1180px] mx-auto grid grid-cols-12 gap-4">
        {FEATURES.map((f) => (
          <article key={f.key} className="glass col-span-4 p-7 flex flex-col gap-[14px]">
            <div className="flex items-center justify-between">
              <p className="eye">{f.key}</p>
              <Icon name={f.icon} size={20} className="text-accent" />
            </div>
            <h2 className="m-0 text-[26px] font-medium tracking-[-0.01em]">{f.title}</h2>
            <p className="m-0 text-fg-2 leading-[1.6] text-[14px]">{f.desc}</p>
          </article>
        ))}
      </section>

      {/* JWKS highlight */}
      <section className="px-[80px] pb-[80px] max-w-[1180px] mx-auto">
        <div className="glass accent p-9 grid grid-cols-[1.1fr_1fr] gap-[40px] items-center">
          <div>
            <p className="eye">JWT / JWKS</p>
            <h2 className="text-[32px] font-medium tracking-[-0.01em] mt-[6px] mb-[14px] m-0">
              Tokens you can{' '}
              <span className="font-display italic text-mint">verify anywhere</span>.
            </h2>
            <p className="lead m-0 max-w-[440px] text-[14.5px]">
              RS256 signing keys published at a stable JWKS URL. Rotate on a cron. Your resource
              server never calls Authlyn on the hot path.
            </p>
            <div className="flex items-center gap-[10px] mt-[22px]">
              <Button variant="ghost" size="sm" icon="code">JWKS docs</Button>
              <Button variant="link" size="sm" iconRight="arrowR">Verification guide</Button>
            </div>
          </div>
          <pre className="codeblock m-0">{JWKS_SNIPPET}</pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[80px] pt-7 pb-12 border-t border-border max-w-[1180px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width={18} height={18} viewBox="0 0 48 48" fill="none">
              <path d="M24 4 L40 9 V22 C40 32 33 40 24 44 C15 40 8 32 8 22 V9 Z" stroke="#6cd0b0" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
              <circle cx="22" cy="20" r="5" stroke="#6cd0b0" strokeWidth="1.8" fill="none" />
              <path d="M26 22 L32 28 M30 26 L32 28 M28 28 L30 30" stroke="#6cd0b0" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
            <span className="font-semibold text-[14px]">Authlyn</span>
          </div>
          <div className="flex items-center gap-7 text-fg-3 text-[12.5px]">
            <a className="text-fg-3 no-underline">Privacy</a>
            <a className="text-fg-3 no-underline">Terms</a>
            <a className="text-fg-3 no-underline">SOC 2</a>
            <a className="text-fg-3 no-underline">Status</a>
            <span className="font-mono">v0.4.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
