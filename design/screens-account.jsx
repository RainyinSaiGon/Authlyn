// screens-account.jsx — End-user account surfaces
function AccountShell({ active, children }) {
  const nav = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'sessions', label: 'Sessions', icon: 'activity' },
    { id: 'apps', label: 'Connected apps', icon: 'app' },
    { id: 'keys', label: 'API keys', icon: 'key' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
  ];
  return (
    <BrowserChrome url="https://authlyn.dev/account" tabs={[{title:'Account — Authlyn', favicon:'shield'}]}>
      <div className="scr">
        <nav className="topnav">
          <Logo size={22} />
          <div className="row" style={{ gap: 16 }}>
            <StatusPill tone="ok">Active · Pagoda</StatusPill>
            <Avatar name="Maya Tran" size="md" />
          </div>
        </nav>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', height: 'calc(100% - 66px)' }}>
          <aside style={{ padding: '28px 16px', borderRight: '1px solid var(--border)', background: 'rgba(9,19,29,0.35)' }}>
            <div className="cap" style={{ padding: '0 10px 10px' }}>ACCOUNT</div>
            {nav.map(n => (
              <a key={n.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 10, fontSize: 13.5,
                color: n.id === active ? 'var(--fg-bright)' : 'var(--fg-2)',
                background: n.id === active ? 'linear-gradient(160deg, rgba(248,125,73,0.18), rgba(248,125,73,0.03))' : 'transparent',
                border: n.id === active ? '1px solid rgba(248,125,73,0.28)' : '1px solid transparent',
                cursor: 'pointer', textDecoration: 'none',
              }}>
                <Icon name={n.icon} size={15} style={{ color: n.id === active ? 'var(--brand-accent)' : undefined }} />
                <span>{n.label}</span>
              </a>
            ))}
          </aside>
          <main style={{ padding: '36px 44px', overflow: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </BrowserChrome>
  );
}

function AcctProfile() {
  return (
    <AccountShell active="profile">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 24 }}>
        <div>
          <p className="eye" style={{ margin: 0 }}>PROFILE</p>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em', margin: '8px 0 0' }}>Maya Tran</h1>
          <div style={{ color: 'var(--fg-3)', fontSize: 12.5, fontFamily: 'var(--font-mono)', marginTop: 4 }}>usr_01HZXQK4M7RB9TP — since 12 Mar 2024</div>
        </div>
        <Btn variant="ghost" icon="edit">Edit profile</Btn>
      </div>
      <div className="glass" style={{ padding: 24, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 28 }}>
        <div>
          <Avatar name="Maya Tran" size="xl" />
          <Btn variant="link" size="xs" style={{ marginTop: 10, padding: 0 }}>Change</Btn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Field label="Display name" value="Maya Tran" />
          <Field label="Pronouns" value="she/her" />
          <Field label="Email" value="maya.tran@pagoda.dev" mono />
          <Field label="Phone" value="+84 90 123 4567" mono />
          <Field label="Time zone" value="Asia/Ho_Chi_Minh · UTC+7" mono />
          <Field label="Language" value="English (US)" />
        </div>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 600, margin: '32px 0 14px' }}>Linked identities</h2>
      <div className="glass" style={{ padding: 6 }}>
        {[
          { p: 'Google', ic: 'google', sub: 'maya.tran@pagoda.dev · primary', linked: true },
          { p: 'GitHub', ic: 'github', sub: 'mayatran · 2 repos', linked: true },
          { p: 'Slack', ic: 'slack', sub: 'Pagoda workspace', linked: false },
        ].map(x => (
          <div key={x.p} className="row" style={{ justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <div className="row" style={{ gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name={x.ic} size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{x.p}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{x.sub}</div>
              </div>
            </div>
            {x.linked ? <Btn variant="ghost" size="sm">Unlink</Btn> : <Btn variant="ghost" size="sm" icon="plus">Connect</Btn>}
          </div>
        ))}
      </div>
    </AccountShell>
  );
}

function AcctSecurity() {
  return (
    <AccountShell active="security">
      <p className="eye" style={{ margin: 0 }}>SECURITY</p>
      <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em', margin: '8px 0 24px' }}>
        Your <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)'}}>credentials</span>
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { t: 'Password', s: 'Updated 38 days ago', p: 'ok', ic: 'lock', action: 'Change' },
          { t: 'Two-step', s: '1Password · TOTP', p: 'ok', ic: 'key', action: 'Manage' },
          { t: 'Passkeys', s: '2 registered · MacBook, iPhone', p: 'ok', ic: 'passkey', action: 'Manage' },
          { t: 'Backup codes', s: '7 of 10 remaining', p: 'warn', ic: 'refresh', action: 'Regenerate' },
        ].map(b => (
          <article key={b.t} className="glass" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <Icon name={b.ic} size={22} style={{ color: 'var(--brand-accent)' }} />
              <StatusPill tone={b.p}>{b.p === 'ok' ? 'Active' : 'Low'}</StatusPill>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{b.t}</div>
              <div style={{ color: 'var(--fg-3)', fontSize: 12.5, fontFamily: 'var(--font-mono)', marginTop: 4 }}>{b.s}</div>
            </div>
            <Btn variant="ghost" size="sm" style={{ alignSelf: 'flex-start' }}>{b.action}</Btn>
          </article>
        ))}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 600, margin: '32px 0 14px' }}>Recent security events</h2>
      <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead><tr><th>Event</th><th>Where</th><th>When</th><th>IP</th></tr></thead>
          <tbody>
            {[
              ['Sign in', 'Chrome · macOS · HCMC', '00:12 ago', '203.162.44.18'],
              ['Passkey used', 'Chrome · macOS · HCMC', '00:12 ago', '203.162.44.18'],
              ['Password changed', 'Safari · iOS · HCMC', '38d ago', '203.162.44.18'],
              ['Sign in failed · wrong password', 'Firefox · Ubuntu · Singapore', '41d ago', '139.162.11.90'],
            ].map((r,i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{r[0]}</td>
                <td className="muted">{r[1]}</td>
                <td><span className="mono dim" style={{fontSize:12}}>{r[2]}</span></td>
                <td><span className="mono" style={{color:'var(--brand-accent-soft)',fontSize:12}}>{r[3]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountShell>
  );
}

function AcctSessions() {
  const sessions = [
    { d: 'desktop', w: 'Chrome 125 · macOS 14', loc: 'Ho Chi Minh City, VN', ip: '203.162.44.18', t: 'This device', active: true },
    { d: 'device',  w: 'Safari · iPhone 15 Pro', loc: 'Ho Chi Minh City, VN', ip: '203.162.44.18', t: '2 hours ago' },
    { d: 'desktop', w: 'Firefox 128 · Ubuntu 24.04', loc: 'Singapore, SG', ip: '139.162.11.90', t: 'Yesterday 19:12' },
    { d: 'desktop', w: 'Edge 126 · Windows 11', loc: 'Bangkok, TH', ip: '184.22.161.5', t: '3 days ago' },
  ];
  return (
    <AccountShell active="sessions">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <p className="eye" style={{ margin: 0 }}>SESSIONS</p>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em', margin: '8px 0 0' }}>
            {sessions.length} active <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)'}}>devices</span>
          </h1>
        </div>
        <Btn variant="danger" icon="x">Sign out all others</Btn>
      </div>
      <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
        {sessions.map((s, i) => (
          <div key={i} className="row" style={{ padding: '18px 22px', gap: 18, borderBottom: i < sessions.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={s.d} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
                {s.w}
                {s.active && <StatusPill tone="ok">This device</StatusPill>}
              </div>
              <div style={{ color: 'var(--fg-3)', fontSize: 12, fontFamily: 'var(--font-mono)', marginTop: 3 }}>
                {s.loc} · {s.ip} · refreshed {s.t}
              </div>
            </div>
            <Btn variant={s.active ? 'ghost' : 'link'} size="sm">{s.active ? 'Active' : 'Revoke'}</Btn>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 600, margin: '32px 0 14px' }}>Refresh-token chain</h2>
      <div className="glass" style={{ padding: 22 }}>
        <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.65 }}>
          This device rotates refresh tokens every 15 minutes. Reuse detection is on — if a rotated token
          is replayed, the chain is revoked and every session from this device is ended.
        </p>
        <div className="row" style={{ gap: 16, marginTop: 18 }}>
          <div><div className="cap">CHAIN ID</div><div className="mono" style={{color:'var(--brand-accent-soft)', fontSize: 13, marginTop: 4}}>chn_01HZXQR2KT…</div></div>
          <div><div className="cap">ISSUED</div><div className="mono emph" style={{fontSize: 13, marginTop: 4}}>2 min ago</div></div>
          <div><div className="cap">NEXT ROTATE</div><div className="mono emph" style={{fontSize: 13, marginTop: 4}}>in 12:47</div></div>
          <div><div className="cap">ROTATIONS</div><div className="mono emph" style={{fontSize: 13, marginTop: 4}}>147</div></div>
        </div>
      </div>
    </AccountShell>
  );
}

function AcctApps() {
  const apps = [
    { n: 'Figma', s: 'figma', scopes: 'profile · email', first: 'Mar 12, 2024' },
    { n: 'Raycast', s: 'app', scopes: 'profile · offline_access', first: 'Sep 02, 2024' },
    { n: 'Linear CLI', s: 'code', scopes: 'profile · email · org:read', first: 'Nov 18, 2025' },
    { n: 'Notion', s: 'folder', scopes: 'profile', first: 'Apr 03, 2026' },
  ];
  return (
    <AccountShell active="apps">
      <p className="eye" style={{ margin: 0 }}>CONNECTED APPS</p>
      <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em', margin: '8px 0 24px' }}>
        Apps with <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)'}}>access tokens</span>
      </h1>
      <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead><tr><th>Application</th><th>Scopes</th><th>Connected</th><th></th></tr></thead>
          <tbody>
            {apps.map((a,i) => (
              <tr key={i}>
                <td>
                  <div className="row" style={{gap:12}}>
                    <div style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Icon name={a.s} size={15}/>
                    </div>
                    <div>
                      <div style={{fontWeight:500}}>{a.n}</div>
                      <div className="sub">client_{('0'+(i+1)).slice(-2)}HZXQK…</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono" style={{color:'var(--brand-accent-soft)', fontSize:12}}>{a.scopes}</span></td>
                <td className="mono dim" style={{fontSize:12}}>{a.first}</td>
                <td style={{textAlign:'right'}}><Btn variant="ghost" size="sm">Revoke</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountShell>
  );
}

function AcctKeys() {
  const keys = [
    { n: 'Local dev', pf: 'ak_live_h7Tz', sc: 'identity:read', last: '4 min ago', created: 'Today' },
    { n: 'CI · GitHub Actions', pf: 'ak_live_m2Qr', sc: 'identity:read · org:read', last: '1 hour ago', created: '18 Oct 2025' },
    { n: 'Staging importer', pf: 'ak_test_b9Xp', sc: 'identity:write · org:write', last: 'Yesterday', created: '02 Mar 2025' },
  ];
  return (
    <AccountShell active="keys">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <p className="eye" style={{ margin: 0 }}>PERSONAL API KEYS</p>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em', margin: '8px 0 0' }}>3 keys issued</h1>
        </div>
        <Btn icon="plus">New API key</Btn>
      </div>
      <div className="glass" style={{ padding: 0, overflow: 'hidden', marginBottom: 22 }}>
        <table className="tbl">
          <thead><tr><th>Label</th><th>Prefix</th><th>Scopes</th><th>Last used</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {keys.map((k,i)=>(
              <tr key={i}>
                <td style={{fontWeight:500}}>{k.n}</td>
                <td><span className="mono" style={{color:'var(--brand-accent-soft)', fontSize:12}}>{k.pf}·····················</span></td>
                <td><span className="mono" style={{color:'var(--brand-accent-soft)', fontSize:12}}>{k.sc}</span></td>
                <td className="mono dim" style={{fontSize:12}}>{k.last}</td>
                <td className="mono dim" style={{fontSize:12}}>{k.created}</td>
                <td style={{textAlign:'right'}}><Icon name="dots" size={16} style={{color:'var(--fg-3)',cursor:'pointer'}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="glass accent" style={{ padding: 24 }}>
        <p className="eye" style={{margin:0}}>NEW KEY · ONE-TIME VIEW</p>
        <h2 style={{margin:'8px 0 14px', fontSize: 20, fontWeight: 500}}>Copy before closing</h2>
        <div className="codeblock" style={{fontSize:13.5,userSelect:'all'}}>
          ak_live_h7Tz9fE2NpMk0QxLcRyA7bVwUjHdS4Gm
        </div>
        <div className="row" style={{justifyContent:'space-between',marginTop:14}}>
          <div style={{fontSize:12,color:'var(--fg-3)'}}>This value is shown once. Store it in your secret manager.</div>
          <div className="row" style={{gap:8}}>
            <Btn variant="ghost" size="sm" icon="copy">Copy</Btn>
            <Btn size="sm">Done</Btn>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

Object.assign(window, { AcctProfile, AcctSecurity, AcctSessions, AcctApps, AcctKeys });
