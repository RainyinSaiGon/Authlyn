// screens-marketing.jsx — Public website: landing, pricing, docs home
const { useState: _msU } = React;

// ---------- Landing ----------
function MktLanding() {
  return (
    <BrowserChrome url="https://authlyn.dev" tabs={[{title:'Authlyn — Identity for humans & tokens', favicon:'shield'}]}>
      <div className="scr" style={{ overflow: 'auto' }}>
        <nav className="topnav">
          <Logo size={24} />
          <div className="links">
            <a className="active">Product</a>
            <a>Docs</a>
            <a>Pricing</a>
            <a>Customers</a>
            <a>Changelog</a>
            <a style={{color:'var(--fg-1)'}}>Sign in</a>
            <Btn size="sm" iconRight="arrowR">Get started</Btn>
          </div>
        </nav>

        <section style={{ padding: '80px 80px 60px', maxWidth: 1180, margin: '0 auto' }}>
          <p className="eye" style={{ marginBottom: 20 }}>IDENTITY INFRASTRUCTURE, REFACTORED WITH INTENTION</p>
          <h1 style={{ fontSize: 72, fontWeight: 500, lineHeight: 0.94, margin: 0, letterSpacing: '-0.015em', maxWidth: 13 + 'ch' }}>
            Auth that reads like<br/>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--brand-mint)', fontWeight: 400 }}>
              well-ordered code
            </span>.
          </h1>
          <p className="lead" style={{ marginTop: 28, maxWidth: 620 }}>
            Authlyn is a Spring + React identity platform with strict module boundaries, typed contracts,
            and every token surface documented. Drop it in as your resource server — or run the
            full console for organizations, RBAC, and passkeys.
          </p>
          <div className="row" style={{ gap: 12, marginTop: 36 }}>
            <Btn iconRight="arrowR">Start free</Btn>
            <Btn variant="ghost" icon="code">Read the spec</Btn>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-3)', marginLeft: 8, fontSize: 13 }}>
              npm i @authlyn/sdk
            </span>
          </div>

          <div className="row" style={{ gap: 40, marginTop: 72, color: 'var(--fg-3)', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            <span>Trusted by build-minded teams</span>
            <span style={{ color: 'var(--fg-2)', letterSpacing: 0, textTransform: 'none', fontFamily: 'var(--font-mono)' }}>
              Lumen · Pagoda · Kellwood · Orbitloom · Finchford · Tidepool
            </span>
          </div>
        </section>

        <section style={{ padding: '40px 80px 80px', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          {[
            { k: 'Sign in', t: 'Drop-in auth UI', d: 'Email, password, passkey, SSO, MFA. Ship the whole flow or just the hooks.', c: 'key' },
            { k: 'RBAC', t: 'Roles that nest', d: 'Org → Team → Member. Permission strings that never drift from your API.', c: 'shield' },
            { k: 'Sessions', t: 'Refresh-token chains', d: 'Reuse detection. Revoke a chain, kill the session — on every device.', c: 'activity' },
          ].map((f, i) => (
            <article key={i} className="glass" style={{ gridColumn: 'span 4', padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <p className="eye" style={{ margin: 0 }}>{f.k}</p>
                <Icon name={f.c} size={20} style={{ color: 'var(--brand-accent)' }} />
              </div>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: '-0.01em' }}>{f.t}</h2>
              <p style={{ margin: 0, color: 'var(--fg-2)', lineHeight: 1.6, fontSize: 14 }}>{f.d}</p>
            </article>
          ))}
        </section>

        <section style={{ padding: '0 80px 80px', maxWidth: 1180, margin: '0 auto' }}>
          <div className="glass accent" style={{ padding: 36, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40 }}>
            <div>
              <p className="eye">JWT / JWKS</p>
              <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em', margin: '6px 0 14px' }}>
                Tokens you can <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--brand-mint)' }}>verify anywhere</span>.
              </h2>
              <p className="lead" style={{ margin: 0, fontSize: 14.5, maxWidth: 440 }}>
                RS256 signing keys published at a stable JWKS URL. Rotate on a cron. Your resource
                server never calls Authlyn on the hot path.
              </p>
              <div className="row" style={{ gap: 10, marginTop: 22 }}>
                <Btn variant="ghost" size="sm" icon="code">JWKS docs</Btn>
                <Btn variant="link" size="sm" iconRight="arrowR">Verification guide</Btn>
              </div>
            </div>
            <pre className="codeblock" style={{ margin: 0 }}>
{`GET /.well-known/jwks.json
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
}`}
            </pre>
          </div>
        </section>

        <footer style={{ padding: '28px 80px 48px', borderTop: '1px solid var(--border)', maxWidth: 1180, margin: '0 auto' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <Logo size={20} />
            <div className="row" style={{ gap: 28, color: 'var(--fg-3)', fontSize: 12.5 }}>
              <a>Privacy</a><a>Terms</a><a>SOC 2</a><a>Status</a>
              <span style={{ fontFamily: 'var(--font-mono)' }}>v0.4.2</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserChrome>
  );
}

// ---------- Pricing ----------
function MktPricing() {
  const tiers = [
    { name: 'Build', price: 'Free', blurb: 'For prototypes and weekend projects.',
      feats: ['5,000 MAU', 'Email + password + passkey', '1 organization', 'Community support'], cta: 'Start free', variant: 'ghost' },
    { name: 'Team', price: '$0.012', unit: '/ MAU · month', blurb: 'Production auth for serious products.',
      feats: ['Unlimited MAU', 'SSO (SAML, OIDC)', 'Organizations & RBAC', 'SOC 2 report', 'Email support, 24h'], cta: 'Start 14-day trial', variant: 'primary', accent: true },
    { name: 'Scale', price: 'Custom', blurb: 'Dedicated region, SCIM, audit exports.',
      feats: ['Everything in Team', 'SCIM v2.0', 'Dedicated region / BYO-KMS', 'SLA 99.99%, 1h resp.', 'Shared Slack channel'], cta: 'Talk to us', variant: 'ghost' },
  ];
  return (
    <BrowserChrome url="https://authlyn.dev/pricing">
      <div className="scr" style={{ overflow: 'auto' }}>
        <nav className="topnav">
          <Logo size={24} />
          <div className="links">
            <a>Product</a><a>Docs</a><a className="active">Pricing</a><a>Customers</a><a>Changelog</a>
            <a style={{color:'var(--fg-1)'}}>Sign in</a>
            <Btn size="sm" iconRight="arrowR">Get started</Btn>
          </div>
        </nav>
        <section style={{ padding: '72px 80px 28px', maxWidth: 1180, margin: '0 auto', textAlign: 'center' }}>
          <p className="eye">PRICING</p>
          <h1 style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-0.01em', margin: '18px 0 14px', lineHeight: 1 }}>
            Priced per <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--brand-mint)', fontWeight: 400 }}>active user</span>. Nothing else.
          </h1>
          <p className="lead" style={{ margin: '0 auto', maxWidth: 560, fontSize: 15 }}>
            No seats, no premium feature paywall on security basics. MFA, passkeys, and audit log ship on every tier.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <Segmented options={['Monthly', 'Yearly · save 18%']} value="Monthly" />
          </div>
        </section>
        <section style={{ padding: '40px 80px 80px', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {tiers.map(t => (
            <article key={t.name} className={`glass${t.accent ? ' accent' : ''}`} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <p className="eye" style={{ margin: 0 }}>{t.name}</p>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>{t.price}</span>
                  {t.unit && <span style={{ color: 'var(--fg-3)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{t.unit}</span>}
                </div>
                <p style={{ margin: '10px 0 0', color: 'var(--fg-2)', fontSize: 13.5 }}>{t.blurb}</p>
              </div>
              <Btn variant={t.variant} style={{ justifyContent: 'center' }} iconRight={t.variant === 'primary' ? 'arrowR' : null}>{t.cta}</Btn>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.feats.map(f => (
                  <div key={f} className="row" style={{ gap: 10, fontSize: 13, color: 'var(--fg-2)' }}>
                    <Icon name="check" size={14} style={{ color: 'var(--brand-mint)' }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </BrowserChrome>
  );
}

// ---------- Docs home ----------
function MktDocs() {
  return (
    <BrowserChrome url="https://authlyn.dev/docs">
      <div className="scr">
        <nav className="topnav">
          <Logo size={22} />
          <div className="links">
            <a>Product</a><a className="active">Docs</a><a>Pricing</a>
            <Btn size="sm" variant="ghost" icon="search">Search docs</Btn>
          </div>
        </nav>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 260px', height: 'calc(100% - 66px)' }}>
          <aside style={{ borderRight: '1px solid var(--border)', padding: '24px 18px', overflow: 'auto', background: 'rgba(9,19,29,0.35)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {[
                { s: 'Get started', items: ['Introduction', 'Quickstart', 'Architecture'] },
                { s: 'Auth', items: ['Sign in', 'Sign up', 'Passkeys', 'MFA & TOTP', 'Sessions'] },
                { s: 'Orgs & RBAC', items: ['Organizations', 'Teams', 'Roles', 'Permissions'] },
                { s: 'API reference', items: ['REST', 'Webhooks', 'JWKS', 'SCIM'] },
              ].map(g => (
                <div key={g.s}>
                  <div className="cap" style={{ margin: '0 0 8px 8px' }}>{g.s}</div>
                  {g.items.map(i => (
                    <a key={i} style={{
                      display: 'block', padding: '6px 10px', borderRadius: 8,
                      color: i === 'Quickstart' ? 'var(--fg-bright)' : 'var(--fg-2)',
                      background: i === 'Quickstart' ? 'rgba(248,125,73,0.12)' : 'transparent',
                      fontSize: 13, textDecoration: 'none',
                      borderLeft: i === 'Quickstart' ? '2px solid var(--brand-accent)' : '2px solid transparent',
                    }}>{i}</a>
                  ))}
                </div>
              ))}
            </div>
          </aside>
          <main style={{ padding: '48px 56px', overflow: 'auto' }}>
            <div className="crumb" style={{ color: 'var(--fg-3)', fontSize: 12.5, marginBottom: 10 }}>
              Docs <span style={{ opacity: 0.5, margin: '0 6px' }}>/</span> Get started <span style={{ opacity: 0.5, margin: '0 6px' }}>/</span> <span style={{ color: 'var(--fg-1)' }}>Quickstart</span>
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.01em', margin: '0 0 8px', color: 'var(--brand-accent)' }}>Quickstart</h1>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, maxWidth: 620, lineHeight: 1.65 }}>
              Add Authlyn to an existing Node or Spring app in under ten minutes. We assume you have
              an account and a tenant already provisioned.
            </p>
            <h2 style={{ marginTop: 36, fontSize: 20, fontWeight: 600 }}>1. Install the SDK</h2>
            <pre className="codeblock" style={{ marginTop: 12 }}>
{`$ npm install @authlyn/sdk
$ npm install @authlyn/react    # optional UI`}
            </pre>
            <h2 style={{ marginTop: 32, fontSize: 20, fontWeight: 600 }}>2. Configure your tenant</h2>
            <pre className="codeblock" style={{ marginTop: 12 }}>
{`import { Authlyn } from '@authlyn/sdk';

export const authlyn = new Authlyn({
  tenant:    'pagoda-prod',
  publicKey: process.env.AUTHLYN_PUBLIC_KEY,
  jwks:      'https://authlyn.dev/.well-known/jwks.json'
});`}
            </pre>
            <h2 style={{ marginTop: 32, fontSize: 20, fontWeight: 600 }}>3. Protect a route</h2>
            <pre className="codeblock" style={{ marginTop: 12 }}>
{`app.get('/billing', authlyn.require('billing:read'), (req, res) => {
  res.json({ user: req.auth.sub, org: req.auth.org });
});`}
            </pre>
          </main>
          <aside style={{ borderLeft: '1px solid var(--border)', padding: '48px 24px', fontSize: 12 }}>
            <div className="cap" style={{ marginBottom: 10 }}>On this page</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--fg-2)' }}>
              <a style={{ color: 'var(--brand-accent)', textDecoration: 'none' }}>Install the SDK</a>
              <a style={{ color: 'inherit', textDecoration: 'none' }}>Configure your tenant</a>
              <a style={{ color: 'inherit', textDecoration: 'none' }}>Protect a route</a>
            </div>
            <div className="glass xs" style={{ marginTop: 28, padding: 14, background: 'rgba(108,208,176,0.06)', borderColor: 'rgba(108,208,176,0.24)' }}>
              <div className="cap" style={{ color: 'var(--brand-mint)', fontSize: 10.5 }}>TIP</div>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.55 }}>
                Run <span className="mono" style={{ color: 'var(--brand-accent-soft)' }}>authlyn doctor</span> to validate keys and JWKS reachability.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </BrowserChrome>
  );
}

Object.assign(window, { MktLanding, MktPricing, MktDocs });
