// screens-auth.jsx — End-user auth flows
function AuthShell({ children, subhead, head, width = 420 }) {
  return (
    <div className="scr" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 56, overflow: 'auto' }}>
      <Logo size={28} />
      <div className="glass" style={{ width, padding: '28px 28px 26px', marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p className="eye" style={{ margin: 0 }}>{subhead || 'IDENTITY'}</p>
          <h1 style={{ margin: '10px 0 6px', fontSize: 26, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{head}</h1>
        </div>
        {children}
      </div>
      <div style={{ marginTop: 20, color: 'var(--fg-3)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
        Authlyn · signed with RS256 · kid authlyn-01
      </div>
    </div>
  );
}

function SignIn() {
  return (
    <AuthShell subhead="SIGN IN" head={<>Sign in to <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)',fontWeight:400}}>Authlyn</span></>}>
      <Field label="Email" value="maya.tran@pagoda.dev" mono />
      <Field label="Password" type="password" value="············" hint="12+ characters · BCrypt cost 12" />
      <div className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
        <label className="row" style={{ gap: 7, color: 'var(--fg-2)' }}>
          <span style={{width:14,height:14,borderRadius:4,border:'1px solid var(--border)',background:'var(--brand-accent)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name="check" size={10} style={{color:'#1a0f08'}}/>
          </span> Remember this device
        </label>
        <a style={{ color: 'var(--brand-accent)' }}>Forgot password</a>
      </div>
      <Btn style={{ justifyContent: 'center', width: '100%' }}>Sign in</Btn>
      <div className="divider">OR CONTINUE WITH</div>
      <div className="row" style={{ gap: 8 }}>
        <Btn variant="ghost" size="sm" icon="passkey" style={{ flex: 1, justifyContent: 'center' }}>Passkey</Btn>
        <Btn variant="ghost" size="sm" icon="google" style={{ flex: 1, justifyContent: 'center' }}>Google</Btn>
        <Btn variant="ghost" size="sm" icon="github" style={{ flex: 1, justifyContent: 'center' }}>GitHub</Btn>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-3)', textAlign: 'center' }}>
        No account? <a style={{ color: 'var(--brand-accent)' }}>Create one</a>
      </div>
    </AuthShell>
  );
}

function SignUp() {
  return (
    <AuthShell subhead="CREATE ACCOUNT" head={<>Create an <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)',fontWeight:400}}>Authlyn</span> account</>}>
      <Field label="Display name" value="Maya Tran" />
      <Field label="Email" value="maya@pagoda.dev" mono />
      <Field label="Password" type="password" value="·············" hint="12+ chars · stored as BCrypt · check: 4/5" />
      <div className="row" style={{ gap: 4 }}>
        {[1,1,1,1,0].map((v,i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: v ? 'var(--brand-mint)' : 'rgba(255,255,255,0.1)' }} />)}
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.55 }}>
        By continuing you accept the <a style={{color:'var(--brand-accent)'}}>Terms</a> and <a style={{color:'var(--brand-accent)'}}>Privacy</a>.
        We'll issue an RS256 JWT on first sign-in.
      </div>
      <Btn style={{ justifyContent: 'center', width: '100%' }}>Create account</Btn>
      <div className="divider">OR</div>
      <Btn variant="ghost" icon="passkey" style={{ justifyContent: 'center', width: '100%' }}>Sign up with a passkey</Btn>
      <div style={{ fontSize: 12.5, color: 'var(--fg-3)', textAlign: 'center' }}>
        Already registered? <a style={{ color: 'var(--brand-accent)' }}>Sign in</a>
      </div>
    </AuthShell>
  );
}

function ForgotPassword() {
  return (
    <AuthShell subhead="RECOVER" head="Reset your password">
      <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.6 }}>
        Enter the email on your account. We'll send a single-use link, signed with the tenant's
        recovery key, that expires in 30 minutes.
      </p>
      <Field label="Email" value="maya@pagoda.dev" mono />
      <Btn style={{ justifyContent: 'center', width: '100%' }}>Send reset link</Btn>
      <div style={{ fontSize: 12.5, color: 'var(--fg-3)', textAlign: 'center' }}>
        <a style={{ color: 'var(--brand-accent)' }}>← Back to sign in</a>
      </div>
    </AuthShell>
  );
}

function ResetPassword() {
  return (
    <AuthShell subhead="NEW PASSWORD" head="Choose a new password">
      <div className="glass xs" style={{ padding: 12, borderColor: 'rgba(108,208,176,0.24)', background: 'rgba(108,208,176,0.06)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon name="check" size={14} style={{ color: 'var(--brand-mint)', marginTop: 2 }} />
        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
          <div style={{ color: 'var(--brand-mint)', fontWeight: 500 }}>Token verified</div>
          <div style={{ color: 'var(--fg-2)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>rtk_01HZXQK4…pAJ · exp 27m</div>
        </div>
      </div>
      <Field label="New password" type="password" value="··············" hint="12+ chars. Mix upper, lower, number, symbol." />
      <Field label="Confirm password" type="password" value="··············" />
      <Btn style={{ justifyContent: 'center', width: '100%' }}>Update password</Btn>
    </AuthShell>
  );
}

function VerifyEmail() {
  return (
    <AuthShell subhead="VERIFY" head={<>Check your <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)',fontWeight:400}}>inbox</span></>}>
      <div style={{ padding: 18, border: '1px dashed var(--border)', borderRadius: 18, textAlign: 'center' }}>
        <Icon name="mail" size={32} style={{ color: 'var(--brand-accent)' }} />
        <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-bright)' }}>maya@pagoda.dev</div>
        <div style={{ marginTop: 6, color: 'var(--fg-3)', fontSize: 12 }}>Link expires in 30 minutes</div>
      </div>
      <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.6 }}>
        We sent a single-use verification link. Open it on any device — the session you started here
        will complete automatically.
      </p>
      <div className="row" style={{ gap: 8 }}>
        <Btn variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Resend in 42s</Btn>
        <Btn variant="ghost" size="sm" style={{ flex: 1, justifyContent: 'center' }}>Change email</Btn>
      </div>
    </AuthShell>
  );
}

function MFAChallenge() {
  return (
    <AuthShell subhead="TWO-STEP" head="Enter your code">
      <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>
        From the authenticator for <span className="mono" style={{color:'var(--brand-accent-soft)'}}>authlyn · pagoda-prod</span>.
      </div>
      <div className="row" style={{ gap: 10, justifyContent: 'center' }}>
        {['4','7','2','9','1','8'].map((d, i) => (
          <div key={i} style={{
            width: 48, height: 56, borderRadius: 14,
            border: `1px solid ${i === 5 ? 'var(--brand-accent)' : 'var(--border)'}`,
            background: 'rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--fg-bright)', fontWeight: 500,
            boxShadow: i === 5 ? '0 0 0 3px rgba(248,125,73,0.2)' : 'none',
          }}>{d}</div>
        ))}
      </div>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
        <a style={{ color: 'var(--brand-accent)' }}>Use a backup code</a>
        <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>Rotates in 0:22</span>
      </div>
      <Btn style={{ justifyContent: 'center', width: '100%' }}>Verify</Btn>
    </AuthShell>
  );
}

function PasskeyEnroll() {
  return (
    <AuthShell subhead="PASSKEY" head={<>Register a <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)',fontWeight:400}}>passkey</span></>} width={460}>
      <div style={{ padding: 28, textAlign: 'center', background: 'radial-gradient(circle at center, rgba(108,208,176,0.12), transparent 60%)', borderRadius: 18 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(108,208,176,0.1)', border: '1px solid rgba(108,208,176,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="passkey" size={44} style={{ color: 'var(--brand-mint)' }} />
        </div>
        <div style={{ marginTop: 18, fontSize: 15, color: 'var(--fg-1)' }}>
          Use <b>Touch ID</b> or a security key
        </div>
        <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
          rp: authlyn.dev · uv: required
        </div>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['Private to this device — the key never leaves it','Phishing-resistant by design','Works offline after the first sign-in'].map(x => (
          <li key={x} className="row" style={{ gap: 10, fontSize: 13, color: 'var(--fg-2)' }}>
            <Icon name="check" size={14} style={{ color: 'var(--brand-mint)' }} /> {x}
          </li>
        ))}
      </ul>
      <Btn style={{ justifyContent: 'center', width: '100%' }}>Continue</Btn>
      <a style={{ color: 'var(--fg-3)', fontSize: 12.5, textAlign: 'center' }}>Skip for now</a>
    </AuthShell>
  );
}

function SSORedirect() {
  return (
    <AuthShell subhead="SSO" head="Signing you in…" width={440}>
      <div style={{ padding: 28, textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: 14, background: 'linear-gradient(135deg, #f87d49, #ffb089)', color: '#1a0f08', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>P</div>
        <div style={{ marginTop: 14, fontSize: 18, fontWeight: 500 }}>Pagoda Inc.</div>
        <div style={{ color: 'var(--fg-3)', fontSize: 12, fontFamily: 'var(--font-mono)', marginTop: 2 }}>pagoda-prod · SAML 2.0</div>
      </div>
      <div className="progress"><i style={{ width: '62%' }} /></div>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
        Redirecting to idp.pagoda.dev/saml/sso…
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, fontSize: 12.5, color: 'var(--fg-2)', textAlign: 'center' }}>
        Not your organization? <a style={{ color: 'var(--brand-accent)' }}>Use a different account</a>
      </div>
    </AuthShell>
  );
}

Object.assign(window, { SignIn, SignUp, ForgotPassword, ResetPassword, VerifyEmail, MFAChallenge, PasskeyEnroll, SSORedirect });
