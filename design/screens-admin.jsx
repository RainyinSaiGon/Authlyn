// screens-admin.jsx — Admin console: users, RBAC, orgs, apps, sessions, settings
const ADMIN_NAV = [
  { title: 'WORKSPACE', items: [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'users', label: 'Users', icon: 'users', count: '1,247' },
    { id: 'orgs', label: 'Organizations', icon: 'building', count: '84' },
    { id: 'roles', label: 'Roles & permissions', icon: 'shield' },
    { id: 'apps', label: 'Applications', icon: 'app' },
  ]},
  { title: 'SECURITY', items: [
    { id: 'sessions', label: 'Sessions', icon: 'activity' },
    { id: 'audit', label: 'Audit log', icon: 'logs' },
  ]},
  { title: 'DEVELOPER', items: [
    { id: 'keys', label: 'API keys', icon: 'key' },
    { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
    { id: 'jwks', label: 'JWKS', icon: 'code' },
  ]},
  { title: 'SETUP', items: [
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]},
];

function AdminShell({ active, crumbs, title, actions, children }) {
  return (
    <BrowserChrome url="https://authlyn.dev/admin" tabs={[{title:'Admin — Authlyn', favicon:'shield'}]}>
      <div className="scr">
        <div className="app">
          <Sidebar nav={ADMIN_NAV} active={active} />
          <div className="appmain">
            <AppBar crumbs={crumbs} title={title} actions={actions} />
            <div className="appbody">{children}</div>
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

function AdmOverview() {
  return (
    <AdminShell active="overview" crumbs={['Pagoda', 'Overview']} title="Overview"
      actions={<><Btn variant="ghost" size="sm" icon="download">Export</Btn><Btn size="sm" icon="plus">Invite</Btn></>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { k: 'ACTIVE USERS', v: '1,247', d: '+42 this week', tone: 'ok' },
          { k: 'ORGANIZATIONS', v: '84', d: '+3 this week', tone: 'ok' },
          { k: 'SIGN-INS · 24H', v: '9,814', d: '98.2% success', tone: 'ok' },
          { k: 'MFA COVERAGE', v: '86%', d: '174 users without', tone: 'warn' },
        ].map(s => (
          <div key={s.k} className="glass" style={{ padding: 18 }}>
            <div className="cap">{s.k}</div>
            <div style={{ fontSize: 32, fontWeight: 500, marginTop: 6, letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)' }}>{s.v}</div>
            <div style={{ color: s.tone === 'warn' ? 'var(--warning)' : 'var(--brand-mint)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-mono)' }}>{s.d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div className="glass" style={{ padding: 22 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Sign-ins · last 14 days</h2>
            <Segmented options={['24h', '14d', '30d']} value="14d" />
          </div>
          <svg viewBox="0 0 500 140" style={{ width: '100%', height: 140 }}>
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f87d49" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#f87d49" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,110 L35,95 L70,100 L105,70 L140,80 L175,58 L210,62 L245,45 L280,50 L315,34 L350,40 L385,28 L420,36 L455,22 L500,30 L500,140 L0,140 Z" fill="url(#g1)" />
            <path d="M0,110 L35,95 L70,100 L105,70 L140,80 L175,58 L210,62 L245,45 L280,50 L315,34 L350,40 L385,28 L420,36 L455,22 L500,30" fill="none" stroke="#f87d49" strokeWidth="1.5"/>
            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => (
              <line key={i} x1={i*36+18} x2={i*36+18} y1={130} y2={134} stroke="rgba(255,255,255,0.12)"/>
            ))}
          </svg>
        </div>
        <div className="glass" style={{ padding: 22 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recent events</h2>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            {[
              { t: 'Role updated · admin → owner', u: 'Thi Nguyen', w: '4 min' },
              { t: 'Passkey registered', u: 'Alex Kim', w: '18 min' },
              { t: 'API key created · ak_live_m2…', u: 'Maya Tran', w: '1h' },
              { t: 'SSO configured · Pagoda HR', u: 'System', w: '3h' },
              { t: 'Impossible travel · rejected', u: 'Jon Park', w: '5h' },
            ].map((e,i) => (
              <div key={i} className="row" style={{ gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--brand-accent)', flexShrink: 0 }}/>
                <div style={{ flex: 1, fontSize: 13 }}>
                  <div>{e.t}</div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>by {e.u} · {e.w} ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function AdmUsers() {
  const users = [
    { n: 'Maya Tran', e: 'maya.tran@pagoda.dev', r: 'Owner', o: 'Pagoda · Eng', mfa: 'Passkey', last: '2 min', status: 'ok' },
    { n: 'Thi Nguyen', e: 'thi@pagoda.dev', r: 'Admin', o: 'Pagoda · Eng', mfa: 'TOTP', last: '14 min', status: 'ok' },
    { n: 'Alex Kim', e: 'alex.kim@pagoda.dev', r: 'Member', o: 'Pagoda · Design', mfa: 'Passkey', last: '1 h', status: 'ok' },
    { n: 'Jon Park', e: 'jon@pagoda.dev', r: 'Member', o: 'Pagoda · Sales', mfa: '—', last: '3 d', status: 'warn' },
    { n: 'Sana Fernandes', e: 'sana@lumen.co', r: 'Guest', o: 'Lumen', mfa: 'TOTP', last: '5 d', status: 'ok' },
    { n: 'Ravi Shah', e: 'ravi.shah@pagoda.dev', r: 'Member', o: 'Pagoda · Eng', mfa: 'Passkey', last: 'now', status: 'ok' },
    { n: 'Chloé Bernard', e: 'chloe@orbitloom.io', r: 'Member', o: 'Orbitloom', mfa: 'TOTP', last: '21 h', status: 'ok' },
    { n: 'Darius Owens', e: 'darius.owens@pagoda.dev', r: 'Member', o: 'Pagoda · Ops', mfa: '—', last: '12 d', status: 'err' },
  ];
  return (
    <AdminShell active="users" crumbs={['Pagoda', 'Users']} title="Users"
      actions={<><Btn variant="ghost" size="sm" icon="download">Export CSV</Btn><Btn size="sm" icon="plus">Invite user</Btn></>}>
      <div className="row" style={{ gap: 10, marginBottom: 18 }}>
        <div className="glass xs" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 360 }}>
          <Icon name="search" size={14} style={{ color: 'var(--fg-3)' }} />
          <input style={{ background:'transparent', border:0, outline:'none', color:'var(--fg-1)', width:'100%', fontSize:13, fontFamily:'var(--font-sans)' }} defaultValue="" placeholder="Search by name, email, or user ID" />
          <span className="kbd">⌘K</span>
        </div>
        <Btn variant="ghost" size="sm" icon="filter">Role: all</Btn>
        <Btn variant="ghost" size="sm" icon="filter">Status: active</Btn>
        <Btn variant="ghost" size="sm" icon="filter">MFA: any</Btn>
        <div style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontSize: 12.5, fontFamily: 'var(--font-mono)' }}>1,247 users · page 1 / 63</div>
      </div>
      <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead><tr>
            <th style={{ width: 28 }}><input type="checkbox" /></th>
            <th>User</th><th>Role</th><th>Organization</th><th>MFA</th><th>Last active</th><th></th>
          </tr></thead>
          <tbody>
            {users.map((u,i)=>(
              <tr key={i}>
                <td><input type="checkbox" /></td>
                <td>
                  <div className="row" style={{gap:12}}>
                    <Avatar name={u.n} />
                    <div>
                      <div style={{fontWeight:500, display:'flex',alignItems:'center',gap:8}}>
                        {u.n}
                        {u.status === 'err' && <StatusPill tone="err">Suspended</StatusPill>}
                        {u.status === 'warn' && <StatusPill tone="warn">No MFA</StatusPill>}
                      </div>
                      <div className="sub mono">{u.e}</div>
                    </div>
                  </div>
                </td>
                <td><span className="pill accent">{u.r}</span></td>
                <td className="muted">{u.o}</td>
                <td><span className="mono" style={{fontSize:12,color: u.mfa === '—' ? 'var(--fg-3)' : 'var(--brand-mint)'}}>{u.mfa}</span></td>
                <td className="mono dim" style={{fontSize:12}}>{u.last} ago</td>
                <td><Icon name="dots" size={16} style={{color:'var(--fg-3)',cursor:'pointer'}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function AdmUserDetail() {
  return (
    <AdminShell active="users" crumbs={['Pagoda','Users','Maya Tran']} title={null}
      actions={<><Btn variant="ghost" size="sm" icon="mail">Email</Btn><Btn variant="ghost" size="sm" icon="refresh">Reset password</Btn><Btn variant="danger" size="sm">Suspend</Btn></>}>
      <div className="row" style={{ gap: 20, marginBottom: 26 }}>
        <Avatar name="Maya Tran" size="xl" />
        <div>
          <h1 style={{margin:0,fontSize:28,fontWeight:500,letterSpacing:'-0.01em'}}>Maya Tran <StatusPill tone="ok">Active</StatusPill></h1>
          <div className="mono" style={{color:'var(--fg-3)',fontSize:12.5,marginTop:4}}>usr_01HZXQK4M7RB9TP · maya.tran@pagoda.dev</div>
          <div className="row" style={{gap:8,marginTop:10}}>
            <span className="pill accent">Owner</span>
            <span className="pill">identity:*</span>
            <span className="pill">billing:read</span>
            <span className="pill">+4 more</span>
          </div>
        </div>
      </div>
      <Tabs options={['Overview','Sessions','Roles','Apps','Events']} value="Overview" />
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginTop: 18 }}>
        <div className="glass" style={{ padding: 22 }}>
          <h2 style={{margin:0,fontSize:16,fontWeight:600}}>Identity</h2>
          <dl style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,margin:'16px 0 0'}}>
            {[
              ['USER ID','usr_01HZXQK4M7RB9TP'],
              ['TENANT','pagoda-prod'],
              ['EMAIL VERIFIED','2024-03-12 09:14 UTC'],
              ['SIGN-UP METHOD','email + password'],
              ['PASSWORD UPDATED','38 days ago'],
              ['MFA','Passkey · TOTP'],
            ].map(([k,v])=>(
              <div key={k}>
                <div className="cap">{k}</div>
                <div className="mono emph" style={{fontSize:13,marginTop:4}}>{v}</div>
              </div>
            ))}
          </dl>
        </div>
        <div className="glass" style={{ padding: 22 }}>
          <h2 style={{margin:0,fontSize:16,fontWeight:600}}>Latest JWT</h2>
          <pre className="codeblock" style={{marginTop:14,fontSize:11,whiteSpace:'pre-wrap',wordBreak:'break-all',lineHeight:1.55}}>
{`eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6
ImF1dGhseW4tMDEifQ.eyJzdWIiOiJ1c3JfMDFIWlh…
signature: 8f3… (truncated)`}
          </pre>
          <div className="row" style={{gap:12,marginTop:14,fontSize:12}}>
            <div><div className="cap">EXP</div><div className="mono emph" style={{marginTop:3}}>14m 17s</div></div>
            <div><div className="cap">CHAIN</div><div className="mono emph" style={{marginTop:3}}>chn_01HZXQR2K…</div></div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function AdmInviteUser() {
  return (
    <AdminShell active="users" crumbs={['Pagoda','Users','Invite']} title="Invite users">
      <div style={{position:'absolute',inset:0}}><AdmUsersList/></div>
      <Modal title="Invite to Pagoda"
        subtitle="Each invitee receives a signed link, valid 72 hours. They choose their own password or passkey."
        width={520}
        actions={<><Btn variant="ghost" size="sm">Cancel</Btn><Btn size="sm" icon="mail">Send 3 invites</Btn></>}>
        <div className="glass xs" style={{padding:12,background:'rgba(0,0,0,0.25)',display:'flex',flexWrap:'wrap',gap:8,minHeight:48,alignItems:'center'}}>
          {['oli@pagoda.dev','hina.sato@pagoda.dev','wes@pagoda.dev'].map(e => (
            <span key={e} className="pill" style={{background:'rgba(248,125,73,0.1)',borderColor:'rgba(248,125,73,0.28)'}}>
              {e} <Icon name="x" size={11} />
            </span>
          ))}
          <span style={{color:'var(--fg-3)',fontSize:13}}>+</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <Field label="Organization" value="Pagoda · Eng" />
          <Field label="Default role" value="Member" />
        </div>
        <div style={{fontSize:12,color:'var(--fg-2)',display:'flex',alignItems:'center',gap:10}}>
          <Toggle on={true}/> Require MFA on first sign-in
        </div>
        <div style={{fontSize:12,color:'var(--fg-2)',display:'flex',alignItems:'center',gap:10}}>
          <Toggle on={false}/> Force password change on first sign-in
        </div>
      </Modal>
    </AdminShell>
  );
}
function AdmUsersList(){ return <AdmUsers/>; }

function AdmRoles() {
  const roles = [
    { n: 'Owner', d: 'Full control over the tenant', c: 3, perms: 'identity:* · billing:* · rbac:*' },
    { n: 'Admin', d: 'Manage users and apps', c: 8, perms: 'identity:write · rbac:write' },
    { n: 'Member', d: 'Access their own account', c: 1214, perms: 'identity:self' },
    { n: 'Guest', d: 'Read-only, scoped to one org', c: 22, perms: 'identity:self · org:{id}:read' },
    { n: 'Auditor', d: 'Read audit log and sessions', c: 0, perms: 'audit:read · session:read' },
  ];
  return (
    <AdminShell active="roles" crumbs={['Pagoda','Roles & permissions']} title="Roles & permissions"
      actions={<Btn size="sm" icon="plus">New role</Btn>}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:14}}>
        <div className="glass" style={{padding:0,overflow:'hidden'}}>
          {roles.map((r,i)=>(
            <div key={i} className="row" style={{padding:'16px 18px',gap:12,borderBottom: i<roles.length-1 ? '1px solid var(--border)' : 'none', background: i === 0 ? 'rgba(248,125,73,0.06)' : 'transparent', borderLeft: i === 0 ? '2px solid var(--brand-accent)' : '2px solid transparent'}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:14}}>{r.n}</div>
                <div style={{color:'var(--fg-3)',fontSize:12,marginTop:2}}>{r.d}</div>
              </div>
              <span className="mono dim" style={{fontSize:12}}>{r.c}</span>
              <Icon name="chevR" size={14} style={{color:'var(--fg-3)'}}/>
            </div>
          ))}
        </div>
        <div className="glass" style={{padding:24,display:'flex',flexDirection:'column',gap:18}}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div>
              <p className="eye" style={{margin:0}}>ROLE</p>
              <h2 style={{margin:'6px 0 0',fontSize:22,fontWeight:500}}>Owner</h2>
              <div className="mono dim" style={{fontSize:12,marginTop:4}}>rol_01HZW · 3 members</div>
            </div>
            <Btn variant="ghost" size="sm" icon="edit">Edit</Btn>
          </div>
          <div>
            <div className="cap" style={{marginBottom:10}}>PERMISSIONS</div>
            <div style={{display:'flex',flexDirection:'column',gap:1,border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
              {[
                { g: 'identity', perms: ['identity:read','identity:write','identity:delete','identity:impersonate'] },
                { g: 'rbac', perms: ['rbac:read','rbac:write','rbac:assign'] },
                { g: 'billing', perms: ['billing:read','billing:write'] },
                { g: 'audit', perms: ['audit:read','audit:export'] },
              ].map(gr => (
                <div key={gr.g} style={{padding:'12px 14px',background:'rgba(0,0,0,0.2)'}}>
                  <div className="cap" style={{marginBottom:8}}>{gr.g}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {gr.perms.map(p => (
                      <span key={p} className="pill ok" style={{fontFamily:'var(--font-mono)'}}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="cap" style={{marginBottom:10}}>MEMBERS</div>
            <div className="row" style={{gap:-8}}>
              {['Maya Tran','Thi Nguyen','Ravi Shah'].map(n => (
                <div key={n} style={{marginRight:-8,border:'2px solid var(--bg-0)',borderRadius:999}}><Avatar name={n}/></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function AdmOrgs() {
  const orgs = [
    { n:'Pagoda', slug:'pagoda-prod', m:412, t:'Team', r:'12 teams', status:'ok' },
    { n:'Lumen Labs', slug:'lumen-labs', m:87, t:'Team', r:'4 teams', status:'ok' },
    { n:'Orbitloom', slug:'orbitloom-io', m:38, t:'Build', r:'2 teams', status:'ok' },
    { n:'Tidepool HQ', slug:'tidepool', m:16, t:'Build', r:'1 team', status:'warn' },
    { n:'Finchford', slug:'finchford-co', m:64, t:'Scale', r:'6 teams · SCIM', status:'ok' },
    { n:'Kellwood', slug:'kellwood', m:211, t:'Team', r:'9 teams', status:'ok' },
  ];
  return (
    <AdminShell active="orgs" crumbs={['Pagoda','Organizations']} title="Organizations"
      actions={<Btn size="sm" icon="plus">New org</Btn>}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {orgs.map(o => (
          <article key={o.n} className="glass" style={{padding:20,display:'flex',flexDirection:'column',gap:14}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div className="row" style={{gap:12}}>
                <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,rgba(248,125,73,0.25),rgba(108,208,176,0.15))',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--fg-bright)',fontWeight:600,fontSize:14,border:'1px solid var(--border)'}}>{o.n[0]}</div>
                <div>
                  <div style={{fontWeight:500}}>{o.n}</div>
                  <div className="mono dim" style={{fontSize:11.5}}>{o.slug}</div>
                </div>
              </div>
              <span className="pill accent">{o.t}</span>
            </div>
            <div className="row" style={{gap:14,fontSize:12,color:'var(--fg-2)'}}>
              <span><Icon name="users" size={12} style={{verticalAlign:-2,marginRight:4}}/>{o.m} members</span>
              <span style={{color:'var(--fg-3)'}}>{o.r}</span>
            </div>
            <div className="row" style={{gap:8,marginTop:'auto'}}>
              <Btn variant="ghost" size="sm" style={{flex:1, justifyContent:'center'}}>Manage</Btn>
              <Btn variant="ghost" size="sm" icon="dots" style={{justifyContent:'center'}}/>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}

function AdmApps() {
  const apps = [
    { n:'Pagoda Web', t:'SPA · PKCE', id:'app_01HZ…w7', grant:'auth_code + pkce', cb:'https://pagoda.dev/cb' },
    { n:'Pagoda API', t:'Resource server', id:'app_01HZ…x3', grant:'client_credentials', cb:'—' },
    { n:'Pagoda iOS', t:'Native', id:'app_01HZ…q8', grant:'auth_code + pkce', cb:'pagoda://auth' },
    { n:'Analytics Cron', t:'Machine', id:'app_01HZ…k2', grant:'client_credentials', cb:'—' },
  ];
  return (
    <AdminShell active="apps" crumbs={['Pagoda','Applications']} title="Applications"
      actions={<Btn size="sm" icon="plus">New application</Btn>}>
      <div className="glass" style={{padding:0,overflow:'hidden'}}>
        <table className="tbl">
          <thead><tr><th>Application</th><th>Client ID</th><th>Grant</th><th>Callback</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {apps.map((a,i)=>(
              <tr key={i}>
                <td>
                  <div className="row" style={{gap:12}}>
                    <div style={{width:32,height:32,borderRadius:9,background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Icon name="app" size={14}/>
                    </div>
                    <div>
                      <div style={{fontWeight:500}}>{a.n}</div>
                      <div className="sub">{a.t}</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono" style={{fontSize:12,color:'var(--brand-accent-soft)'}}>{a.id}</span></td>
                <td><span className="mono" style={{fontSize:12}}>{a.grant}</span></td>
                <td className="mono dim" style={{fontSize:12}}>{a.cb}</td>
                <td><StatusPill tone="ok">Live</StatusPill></td>
                <td style={{textAlign:'right'}}><Icon name="dots" size={16} style={{color:'var(--fg-3)',cursor:'pointer'}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function AdmSessions() {
  return (
    <AdminShell active="sessions" crumbs={['Pagoda','Sessions']} title="Sessions"
      actions={<><Btn variant="ghost" size="sm" icon="filter">Filter</Btn><Btn variant="danger" size="sm">Revoke selected</Btn></>}>
      <div className="row" style={{gap:14,marginBottom:18}}>
        {[
          { k:'LIVE', v:'847' }, { k:'MFA · 24H', v:'612' }, { k:'ANOMALIES', v:'3' }, { k:'AVG DURATION', v:'6h 14m' },
        ].map(s => (
          <div key={s.k} className="glass" style={{flex:1,padding:16}}>
            <div className="cap">{s.k}</div>
            <div style={{fontSize:24,fontWeight:500,marginTop:4}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="glass" style={{padding:0,overflow:'hidden'}}>
        <table className="tbl">
          <thead><tr><th style={{width:28}}><input type="checkbox"/></th><th>User</th><th>Device</th><th>Location</th><th>Started</th><th>Rotations</th><th></th></tr></thead>
          <tbody>
            {[
              { n:'Maya Tran', d:'Chrome · macOS', l:'HCMC, VN', s:'2m', r:147, warn:false },
              { n:'Jon Park', d:'Firefox · Ubuntu', l:'Singapore, SG', s:'11m', r:4, warn:true },
              { n:'Thi Nguyen', d:'Safari · iOS', l:'HCMC, VN', s:'44m', r:3 },
              { n:'Ravi Shah', d:'Chrome · Windows', l:'Bangalore, IN', s:'1h 22m', r:22 },
              { n:'Sana Fernandes', d:'Safari · macOS', l:'Lisbon, PT', s:'2h 08m', r:14 },
              { n:'Chloé Bernard', d:'Firefox · macOS', l:'Paris, FR', s:'3h 45m', r:22 },
            ].map((r,i)=>(
              <tr key={i}>
                <td><input type="checkbox"/></td>
                <td><div className="row" style={{gap:10}}><Avatar name={r.n}/><span style={{fontWeight:500}}>{r.n}</span>{r.warn && <StatusPill tone="warn">Anomaly</StatusPill>}</div></td>
                <td className="muted">{r.d}</td>
                <td><span className="mono" style={{fontSize:12}}>{r.l}</span></td>
                <td className="mono dim" style={{fontSize:12}}>{r.s} ago</td>
                <td className="mono" style={{fontSize:12,color:'var(--brand-accent-soft)'}}>{r.r}</td>
                <td style={{textAlign:'right'}}><Btn variant="ghost" size="xs">Revoke</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function AdmAudit() {
  const rows = [
    { t:'user.role.updated', who:'maya@pagoda.dev', tgt:'thi@pagoda.dev · admin → owner', ip:'203.162.44.18', when:'4 min ago', st:'ok'},
    { t:'auth.signin.success', who:'alex.kim@pagoda.dev', tgt:'passkey', ip:'118.71.8.22', when:'18 min', st:'ok'},
    { t:'auth.mfa.challenge.failed', who:'jon@pagoda.dev', tgt:'TOTP · 3rd attempt', ip:'139.162.11.90', when:'32 min', st:'warn'},
    { t:'apikey.created', who:'maya@pagoda.dev', tgt:'ak_live_h7Tz · identity:read', ip:'203.162.44.18', when:'1h', st:'ok'},
    { t:'sso.configured', who:'system', tgt:'SAML · idp.pagoda.dev', ip:'—', when:'3h', st:'ok'},
    { t:'auth.signin.blocked', who:'unknown', tgt:'impossible_travel · jon@pagoda.dev', ip:'41.77.12.5', when:'5h', st:'err'},
    { t:'org.created', who:'maya@pagoda.dev', tgt:'Tidepool HQ', ip:'203.162.44.18', when:'yesterday', st:'ok'},
  ];
  return (
    <AdminShell active="audit" crumbs={['Pagoda','Audit log']} title="Audit log"
      actions={<><Btn variant="ghost" size="sm" icon="filter">Event: all</Btn><Btn variant="ghost" size="sm" icon="download">Export</Btn></>}>
      <div className="glass" style={{padding:0,overflow:'hidden'}}>
        <table className="tbl">
          <thead><tr><th>Event</th><th>Actor</th><th>Target</th><th>IP</th><th>When</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td>
                  <div className="row" style={{gap:10}}>
                    <span style={{width:6,height:6,borderRadius:999,background: r.st==='err' ? 'var(--brand-danger)' : r.st==='warn' ? 'var(--warning)' : 'var(--brand-mint)'}}/>
                    <span className="mono" style={{fontSize:12.5,color:'var(--fg-bright)'}}>{r.t}</span>
                  </div>
                </td>
                <td className="muted">{r.who}</td>
                <td><span className="mono" style={{fontSize:12,color:'var(--brand-accent-soft)'}}>{r.tgt}</span></td>
                <td className="mono dim" style={{fontSize:12}}>{r.ip}</td>
                <td className="mono dim" style={{fontSize:12}}>{r.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function AdmSettings() {
  const sub = ['General','Branding','Domains','SSO','SCIM','Webhooks','Billing'];
  return (
    <AdminShell active="settings" crumbs={['Pagoda','Settings']} title="Settings">
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:28}}>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {sub.map((s,i) => (
            <a key={s} style={{
              padding:'8px 12px', borderRadius:8, fontSize:13.5, cursor:'pointer',
              color: i === 2 ? 'var(--fg-bright)' : 'var(--fg-2)',
              background: i === 2 ? 'rgba(248,125,73,0.1)' : 'transparent',
              borderLeft: i === 2 ? '2px solid var(--brand-accent)' : '2px solid transparent',
            }}>{s}</a>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <div className="glass" style={{padding:24}}>
            <div className="row" style={{justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <p className="eye" style={{margin:0}}>DOMAINS</p>
                <h2 style={{margin:'6px 0 8px',fontSize:20,fontWeight:500}}>Custom domains</h2>
                <p style={{margin:0,color:'var(--fg-2)',fontSize:13,maxWidth:500,lineHeight:1.6}}>
                  Serve sign-in on your own hostname. Authlyn provisions and rotates TLS certificates
                  via Let's Encrypt.
                </p>
              </div>
              <Btn size="sm" icon="plus">Add domain</Btn>
            </div>
            <div style={{marginTop:22,border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
              {[
                { d:'auth.pagoda.dev', p:'Primary · TLS rotating', st:'ok', age:'Verified 14d ago' },
                { d:'login.pagoda.dev', p:'Alias', st:'ok', age:'Verified 89d ago' },
                { d:'accounts.kellwood.co', p:'Partner tenant', st:'warn', age:'CNAME pending' },
              ].map((r,i,a)=>(
                <div key={r.d} className="row" style={{padding:'14px 18px',gap:14,borderBottom: i<a.length-1 ? '1px solid var(--border)' : 'none',background:i===0?'rgba(248,125,73,0.04)':'transparent'}}>
                  <Icon name="globe" size={16} style={{color:'var(--fg-3)'}}/>
                  <div style={{flex:1}}>
                    <div className="mono emph" style={{fontSize:13.5}}>{r.d}</div>
                    <div className="sub">{r.p} · {r.age}</div>
                  </div>
                  <StatusPill tone={r.st}>{r.st === 'ok' ? 'Active' : 'Pending'}</StatusPill>
                  <Icon name="dots" size={16} style={{color:'var(--fg-3)',cursor:'pointer'}}/>
                </div>
              ))}
            </div>
          </div>
          <div className="glass" style={{padding:24}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                <p className="eye" style={{margin:0}}>SSO · SAML</p>
                <h2 style={{margin:'6px 0 8px',fontSize:20,fontWeight:500}}>Identity provider</h2>
                <div className="mono dim" style={{fontSize:12}}>idp.pagoda.dev · EntityID authlyn-pagoda-prod</div>
              </div>
              <Segmented options={['SAML','OIDC']} value="SAML"/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:16}}>
              <Field label="SSO URL" value="https://idp.pagoda.dev/saml/sso" mono/>
              <Field label="Entity ID" value="authlyn-pagoda-prod" mono/>
              <Field label="Certificate fingerprint" value="sha256:AA:3F:1C:…:9E" mono/>
              <Field label="Attribute mapping" value="email = mail, name = displayName" mono/>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdmOverview, AdmUsers, AdmUserDetail, AdmInviteUser, AdmRoles, AdmOrgs, AdmApps, AdmSessions, AdmAudit, AdmSettings });
