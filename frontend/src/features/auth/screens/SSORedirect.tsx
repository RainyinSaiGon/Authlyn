import { AuthShell } from '@/components/layout/AuthShell';

export function SSORedirect() {
  return (
    <AuthShell subhead="SSO" head="Signing you in…" width={440}>
      <div className="p-7 text-center">
        <div
          className="inline-flex items-center justify-center w-[68px] h-[68px] text-[28px] font-bold rounded-[14px]"
          style={{ background: 'linear-gradient(135deg, #f87d49, #ffb089)', color: '#1a0f08' }}
        >
          P
        </div>
        <div className="mt-[14px] text-[18px] font-medium">Pagoda Inc.</div>
        <div className="mt-[2px] text-fg-3 text-[12px] font-mono">pagoda-prod · SAML 2.0</div>
      </div>

      <div className="progress">
        <i style={{ width: '62%' }} />
      </div>

      <p className="m-0 text-[12px] text-fg-3 font-mono text-center">
        Redirecting to idp.pagoda.dev/saml/sso…
      </p>

      <div
        className="pt-[14px] text-[12.5px] text-fg-2 text-center"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        Not your organization?{' '}
        <a href="#" className="text-accent no-underline">Use a different account</a>
      </div>
    </AuthShell>
  );
}
