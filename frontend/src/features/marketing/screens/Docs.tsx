import { MarketingNav } from '../components/MarketingNav';

const DOC_GROUPS = [
  { section: 'Get started', items: ['Introduction', 'Quickstart', 'Architecture'] },
  { section: 'Auth',         items: ['Sign in', 'Sign up', 'Passkeys', 'MFA & TOTP', 'Sessions'] },
  { section: 'Orgs & RBAC', items: ['Organizations', 'Teams', 'Roles', 'Permissions'] },
  { section: 'API reference', items: ['REST', 'Webhooks', 'JWKS', 'SCIM'] },
];

const ACTIVE_ITEM = 'Quickstart';

const SNIPPET_INSTALL = `$ npm install @authlyn/sdk
$ npm install @authlyn/react    # optional UI`;

const SNIPPET_CONFIG = `import { Authlyn } from '@authlyn/sdk';

export const authlyn = new Authlyn({
  tenant:    'pagoda-prod',
  publicKey: process.env.AUTHLYN_PUBLIC_KEY,
  jwks:      'https://authlyn.dev/.well-known/jwks.json'
});`;

const SNIPPET_PROTECT = `app.get('/billing', authlyn.require('billing:read'), (req, res) => {
  res.json({ user: req.auth.sub, org: req.auth.org });
});`;

export function Docs() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav active="docs" variant="docs" />

      <div className="grid grid-cols-[240px_1fr_260px] flex-1 overflow-hidden">

        {/* Left nav sidebar */}
        <aside className="border-r border-border px-[18px] py-6 overflow-auto bg-[rgba(9,19,29,0.35)] flex flex-col gap-[22px]">
          {DOC_GROUPS.map((group) => (
            <div key={group.section}>
              <div className="cap ml-2 mb-2">{group.section}</div>
              {group.items.map((item) => (
                <a
                  key={item}
                  className={`block py-[6px] px-[10px] rounded-lg no-underline text-[13px] border-l-2 cursor-pointer ${
                    item === ACTIVE_ITEM
                      ? 'text-fg-bright bg-[rgba(248,125,73,0.12)] border-accent'
                      : 'text-fg-2 bg-transparent border-transparent'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="px-[56px] py-12 overflow-auto">
          <div className="flex items-center text-fg-3 text-[12.5px] mb-[10px]">
            <span>Docs</span>
            <span className="opacity-50 mx-[6px]">/</span>
            <span>Get started</span>
            <span className="opacity-50 mx-[6px]">/</span>
            <span className="text-fg-1">Quickstart</span>
          </div>
          <h1 className="text-[40px] font-medium tracking-[-0.01em] m-0 mb-2 text-accent">Quickstart</h1>
          <p className="text-fg-2 text-[14px] max-w-[620px] leading-[1.65] mt-2">
            Add Authlyn to an existing Node or Spring app in under ten minutes. We assume you have
            an account and a tenant already provisioned.
          </p>

          <h2 className="text-[20px] font-semibold mt-9 mb-0">1. Install the SDK</h2>
          <pre className="codeblock mt-3">{SNIPPET_INSTALL}</pre>

          <h2 className="text-[20px] font-semibold mt-8 mb-0">2. Configure your tenant</h2>
          <pre className="codeblock mt-3">{SNIPPET_CONFIG}</pre>

          <h2 className="text-[20px] font-semibold mt-8 mb-0">3. Protect a route</h2>
          <pre className="codeblock mt-3">{SNIPPET_PROTECT}</pre>
        </main>

        {/* Right ToC sidebar */}
        <aside className="border-l border-border px-6 py-12 text-[12px] overflow-auto">
          <div className="cap mb-[10px]">On this page</div>
          <div className="flex flex-col gap-2">
            <a className="text-accent no-underline cursor-pointer">Install the SDK</a>
            <a className="text-fg-2 no-underline cursor-pointer">Configure your tenant</a>
            <a className="text-fg-2 no-underline cursor-pointer">Protect a route</a>
          </div>
          <div className="glass xs mt-7 p-[14px] bg-mint/[0.06] border-[rgba(108,208,176,0.24)]">
            <div className="cap text-mint text-[10.5px]">TIP</div>
            <p className="text-[12px] text-fg-2 leading-[1.55] mt-[6px] m-0">
              Run{' '}
              <span className="font-mono text-accent-soft">authlyn doctor</span>
              {' '}to validate keys and JWKS reachability.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
