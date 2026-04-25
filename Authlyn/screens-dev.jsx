// screens-dev.jsx — Developer surfaces + onboarding + edge states + mobile

function DevKeys() {
  return (
    <AdminShell active="keys" crumbs={['Pagoda','API keys']} title="API keys"
      actions={<Btn size="sm" icon="plus">New API key</Btn>}>
      <div className="row" style={{gap:14,marginBottom:18}}>
        {[['LIVE KEYS','6'],['TEST KEYS','12'],['REQUESTS · 24H','284,771'],['4XX · 24H','0.12%']].map(([k,v]) => (
          <div key={k} className="glass" style={{flex:1,padding:16}}>
            <div className="cap">{k}</div>
            <div style={{fontSize:24,fontWeight:500,marginTop:4,fontFamily:'var(--font-mono)'}}>{v}</div>
          </div>
        ))}
      </div>
      <div className="glass" style={{padding:0,overflow:'hidden'}}>
        <table className="tbl">
          <thead><tr><th>Label</th><th>Prefix</th><th>Env</th><th>Scopes</th><th>Last used</th><th>Requests · 24h</th><th></th></tr></thead>
          <tbody>
            {[
              ['Web — live','ak_live_h7Tz','live','identity:read · session:read','4 min ago','82,412'],
              ['iOS — live','ak_live_m2Qr','live','identity:read','12 min ago','41,008'],
              ['CI · GitHub','ak_live_b9Xp','live','identity:read · org:read','1 h','14,220'],
              ['Staging importer','ak_test_n4Lk','test','identity:write','Yesterday','902'],
              ['Analytics cron','ak_live_s8Zq','live','audit:read','3 h','312'],
            ].map((r,i)=>(
              <tr key={i}>
                <td style={{fontWeight:500}}>{r[0]}</td>
                <td><span className="mono" style={{fontSize:12,color:'var(--brand-accent-soft)'}}>{r[1]}·····</span></td>
                <td><span className={`pill ${r[2]==='live'?'ok':'accent'}`}>{r[2]}</span></td>
                <td><span className="mono" style={{fontSize:12}}>{r[3]}</span></td>
                <td className="mono dim" style={{fontSize:12}}>{r[4]}</td>
                <td className="mono emph" style={{fontSize:12}}>{r[5]}</td>
                <td><Icon name="dots" size={15} style={{color:'var(--fg-3)'}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function DevWebhooks() {
  return (
    <AdminShell active="webhooks" crumbs={['Pagoda','Webhooks']} title="Webhooks"
      actions={<Btn size="sm" icon="plus">New endpoint</Btn>}>
      <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:14}}>
        <div className="glass" style={{padding:0,overflow:'hidden'}}>
          {[
            { url:'https://api.pagoda.dev/hooks/authlyn', s:'ok', ev:'14 events · 2xx', r:'99.98%' },
            { url:'https://ops.pagoda.dev/audit', s:'ok', ev:'3 events · 2xx', r:'100%' },
            { url:'https://staging.pagoda.dev/hook', s:'warn', ev:'1 retry pending', r:'96.4%' },
          ].map((w,i,a)=>(
            <div key={w.url} style={{padding:'16px 20px',borderBottom:i<a.length-1?'1px solid var(--border)':'none'}}>
              <div className="row" style={{justifyContent:'space-between'}}>
                <div className="mono emph" style={{fontSize:13,wordBreak:'break-all'}}>{w.url}</div>
                <StatusPill tone={w.s}>{w.s==='ok'?'Healthy':'Retrying'}</StatusPill>
              </div>
              <div className="row" style={{gap:18,marginTop:8,fontSize:12}}>
                <span className="mono dim">{w.ev}</span>
                <span className="mono" style={{color:w.s==='ok'?'var(--brand-mint)':'var(--warning)'}}>{w.r}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="glass" style={{padding:22}}>
          <div className="cap">RECENT DELIVERY</div>
          <div className="mono emph" style={{fontSize:14,marginTop:6}}>user.created</div>
          <div className="mono dim" style={{fontSize:11.5,marginTop:2}}>evt_01HZXQR8… · 204 ms · HTTP 200</div>
          <pre className="codeblock" style={{marginTop:14,fontSize:11.5,lineHeight:1.6}}>
{`{
  "event": "user.created",
  "created": "2026-04-23T04:17:02Z",
  "data": {
    "id": "usr_01HZXQK4M7RB9TP",
    "email": "maya@pagoda.dev",
    "tenant": "pagoda-prod"
  },
  "signature": "v1,t=1745..,sha256=AA:3F:..."
}`}
          </pre>
          <div className="row" style={{gap:8,marginTop:14}}>
            <Btn variant="ghost" size="sm" icon="refresh">Resend</Btn>
            <Btn variant="ghost" size="sm" icon="copy">Copy payload</Btn>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function DevJWKS() {
  return (
    <AdminShell active="jwks" crumbs={['Pagoda','JWKS']} title="JSON Web Key Set"
      actions={<><Btn variant="ghost" size="sm" icon="refresh">Rotate</Btn><Btn variant="ghost" size="sm" icon="download">Download</Btn></>}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <div className="glass" style={{padding:22}}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <div>
              <div className="cap">ACTIVE KEY</div>
              <div className="mono emph" style={{fontSize:16,marginTop:6}}>authlyn-01</div>
              <div className="mono dim" style={{fontSize:11.5,marginTop:2}}>RS256 · 2048-bit · in rotation since 14 Feb 2026</div>
            </div>
            <StatusPill tone="ok">Signing</StatusPill>
          </div>
          <div style={{marginTop:20}}>
            <div className="cap">NEXT ROTATE</div>
            <div className="progress" style={{marginTop:10}}><i style={{width:'68%'}}/></div>
            <div className="row" style={{justifyContent:'space-between',marginTop:6,fontSize:11.5,color:'var(--fg-3)'}}>
              <span className="mono">day 62 of 90</span>
              <span className="mono">rotate auto-scheduled · 21 Jun 2026</span>
            </div>
          </div>
        </div>
        <div className="glass" style={{padding:22}}>
          <div className="cap">PREVIOUS · STILL TRUSTED</div>
          <div className="mono emph" style={{fontSize:16,marginTop:6}}>authlyn-00</div>
          <div className="mono dim" style={{fontSize:11.5,marginTop:2}}>RS256 · trust window 30d · 14 days remaining</div>
          <div style={{marginTop:18}}>
            <div className="cap">PUBLIC URL</div>
            <div className="mono emph" style={{fontSize:13,marginTop:6,wordBreak:'break-all'}}>https://authlyn.dev/.well-known/jwks.json</div>
            <Btn variant="link" size="sm" icon="copy" style={{padding:0,marginTop:8}}>Copy URL</Btn>
          </div>
        </div>
      </div>
      <div className="glass" style={{padding:0,marginTop:14,overflow:'hidden'}}>
        <div className="row" style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',background:'rgba(0,0,0,0.25)'}}>
          <div className="cap">RESPONSE PREVIEW</div>
          <div className="mono dim" style={{fontSize:11.5,marginLeft:'auto'}}>application/json · 412 B · cache 5 min</div>
        </div>
        <pre className="codeblock" style={{margin:0,border:0,borderRadius:0,fontSize:12,padding:22,lineHeight:1.6}}>
{`{
  "keys": [
    { "kty":"RSA", "kid":"authlyn-01", "use":"sig", "alg":"RS256",
      "n":"xz7k4Lp9Rm2yJ8c3NqFv…", "e":"AQAB" },
    { "kty":"RSA", "kid":"authlyn-00", "use":"sig", "alg":"RS256",
      "n":"q2Zf4Tn8Kl6sVe1xBdHj…", "e":"AQAB" }
  ]
}`}
        </pre>
      </div>
    </AdminShell>
  );
}

function DevLogs() {
  const logs = [
    ['00:12:04.812','INFO','auth.signin.success','usr_01HZXQK4 · method=passkey · 203.162.44.18'],
    ['00:12:04.610','DEBUG','jwks.cache.hit','kid=authlyn-01 · age=47s'],
    ['00:12:03.331','INFO','session.rotate','chn_01HZXQR2K · rotation #147'],
    ['00:11:58.204','WARN','rate.limit.near','ip=139.162.11.90 · 82/100'],
    ['00:11:52.001','INFO','org.member.added','org=pagoda-prod · usr_01HZXQR3…'],
    ['00:11:48.887','ERROR','mfa.challenge.failed','usr_01HZXQK4 · reason=code_reuse'],
    ['00:11:44.612','INFO','webhook.delivered','evt_01HZXQR8 · 204ms · 200'],
    ['00:11:40.101','DEBUG','rbac.cache.miss','permission=identity:write · sub=usr_01HZXQR1'],
    ['00:11:38.904','INFO','auth.signin.success','usr_01HZXQK9 · method=password'],
    ['00:11:36.220','INFO','apikey.used','ak_live_m2Qr · identity:read · 1.2kB'],
  ];
  const tone = l => l==='ERROR'?'var(--brand-danger)':l==='WARN'?'var(--warning)':l==='INFO'?'var(--brand-mint)':'var(--fg-3)';
  return (
    <AdminShell active="audit" crumbs={['Pagoda','Observability','Logs']} title="Live logs"
      actions={<><Btn variant="ghost" size="sm" icon="filter">Level: all</Btn><Btn variant="ghost" size="sm" icon="download">Stream</Btn></>}>
      <div className="glass" style={{padding:0,overflow:'hidden',fontFamily:'var(--font-mono)',fontSize:12.5}}>
        <div className="row" style={{padding:'10px 18px',borderBottom:'1px solid var(--border)',background:'rgba(0,0,0,0.25)',gap:14}}>
          <span style={{width:8,height:8,borderRadius:999,background:'var(--brand-mint)',boxShadow:'0 0 10px var(--brand-mint)'}}/>
          <span style={{color:'var(--brand-mint)'}}>STREAMING</span>
          <span style={{color:'var(--fg-3)'}}>region=ap-southeast-1</span>
          <span style={{marginLeft:'auto',color:'var(--fg-3)'}}>tail -f · 1,284 msg/min</span>
        </div>
        <div style={{maxHeight:520,overflow:'auto'}}>
          {logs.map((r,i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'108px 60px 220px 1fr',gap:14,padding:'9px 18px',borderBottom:'1px solid rgba(255,255,255,0.03)',color:'var(--fg-2)'}}>
              <span style={{color:'var(--fg-3)'}}>{r[0]}</span>
              <span style={{color:tone(r[1]),fontWeight:600}}>{r[1]}</span>
              <span style={{color:'var(--brand-accent-soft)'}}>{r[2]}</span>
              <span>{r[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

// ---------- Onboarding wizard ----------
function Onboarding() {
  const steps = ['Tenant','Branding','First app','Integrate','Invite'];
  return (
    <div className="scr" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:40,overflow:'auto'}}>
      <div className="glass" style={{width:720,padding:0,overflow:'hidden'}}>
        <div style={{padding:'22px 30px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Logo size={22}/>
          <div className="row" style={{gap:14}}>
            {steps.map((s,i)=>(
              <div key={s} className="row" style={{gap:8,opacity:i>2?0.45:1}}>
                <span style={{
                  width:22,height:22,borderRadius:999,
                  background:i<2?'var(--brand-accent)':i===2?'rgba(248,125,73,0.2)':'transparent',
                  border:`1px solid ${i<=2?'var(--brand-accent)':'var(--border)'}`,
                  display:'inline-flex',alignItems:'center',justifyContent:'center',
                  fontSize:11,fontWeight:600,color:i<2?'#1a0f08':i===2?'var(--brand-accent)':'var(--fg-3)',
                }}>{i<2 ? <Icon name="check" size={11} style={{color:'#1a0f08'}}/> : i+1}</span>
                <span style={{fontSize:12,color:i===2?'var(--fg-bright)':'var(--fg-3)'}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:'32px 40px 34px'}}>
          <p className="eye">STEP 3 OF 5 · FIRST APPLICATION</p>
          <h1 style={{fontSize:30,fontWeight:500,letterSpacing:'-0.01em',margin:'10px 0 8px'}}>
            Register your <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)'}}>first app</span>
          </h1>
          <p style={{color:'var(--fg-2)',fontSize:14,margin:0,maxWidth:520,lineHeight:1.6}}>
            Authlyn needs to know which clients will request tokens. You can add more later — this
            one becomes your default.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:24}}>
            <Field label="Application name" value="Pagoda Web"/>
            <Field label="Type" value="SPA · PKCE"/>
            <Field label="Redirect URI" value="https://pagoda.dev/auth/callback" mono/>
            <Field label="Post-signout URL" value="https://pagoda.dev" mono/>
          </div>
          <div className="glass xs" style={{padding:14,marginTop:20,background:'rgba(108,208,176,0.05)',borderColor:'rgba(108,208,176,0.2)'}}>
            <div className="cap" style={{color:'var(--brand-mint)'}}>CLIENT ID · GENERATED</div>
            <div className="mono emph" style={{fontSize:14,marginTop:6}}>app_01HZXS4K2M9QR7NPAGODAWEB</div>
          </div>
        </div>
        <div style={{padding:'16px 30px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',background:'rgba(0,0,0,0.2)'}}>
          <Btn variant="ghost" size="sm" icon="chevL">Back</Btn>
          <div className="row" style={{gap:10}}>
            <Btn variant="link" size="sm">Skip for now</Btn>
            <Btn size="sm" iconRight="chevR">Continue</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Edge states ----------
function ErrPage({ code, title, sub, cta }) {
  return (
    <div className="scr" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,gap:18,textAlign:'center'}}>
      <Logo size={24}/>
      <div style={{fontSize:140,fontFamily:'var(--font-display)',fontStyle:'italic',fontWeight:400,color:'var(--brand-mint)',lineHeight:1,letterSpacing:'-0.04em',marginTop:10}}>
        {code}
      </div>
      <h1 style={{margin:0,fontSize:34,fontWeight:500,letterSpacing:'-0.01em'}}>{title}</h1>
      <p style={{margin:0,color:'var(--fg-2)',fontSize:14.5,maxWidth:480,lineHeight:1.65}}>{sub}</p>
      <div className="row" style={{gap:10,marginTop:10}}>{cta}</div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-3)',marginTop:24}}>
        trace_id: 01HZXQ9K7M2PAGODA4BVX8 · region ap-southeast-1
      </div>
    </div>
  );
}
function Err404(){return <ErrPage code="404" title="We can't find that page" sub="The resource or route you requested doesn't exist in this tenant. It may have been renamed, revoked, or never issued." cta={<><Btn icon="home" size="sm">Back home</Btn><Btn variant="ghost" size="sm" icon="logs">Report</Btn></>}/>;}
function Err500(){return <ErrPage code="500" title="Something broke on our side" sub="Our SRE team gets paged automatically. You can try again in a few seconds — or check status.authlyn.dev for the latest." cta={<><Btn icon="refresh" size="sm">Retry</Btn><Btn variant="ghost" size="sm" icon="link">Status page</Btn></>}/>;}
function Maintenance(){return (
  <div className="scr" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,gap:18,textAlign:'center'}}>
    <Logo size={24}/>
    <div style={{width:70,height:70,borderRadius:'50%',background:'rgba(248,125,73,0.12)',border:'1px solid rgba(248,125,73,0.35)',display:'flex',alignItems:'center',justifyContent:'center',marginTop:10}}>
      <Icon name="settings" size={32} style={{color:'var(--brand-accent)'}}/>
    </div>
    <p className="eye">MAINTENANCE WINDOW</p>
    <h1 style={{margin:0,fontSize:32,fontWeight:500,letterSpacing:'-0.01em'}}>
      Rotating signing keys
    </h1>
    <p style={{margin:0,color:'var(--fg-2)',fontSize:14,maxWidth:500,lineHeight:1.65}}>
      We're rolling a scheduled 90-day JWKS rotation. Sign-ins will resume in about five minutes.
      Existing sessions are unaffected.
    </p>
    <div className="glass xs" style={{padding:14,marginTop:10,display:'flex',gap:18,alignItems:'center'}}>
      <div><div className="cap">STARTED</div><div className="mono emph" style={{marginTop:4,fontSize:13}}>00:03 UTC</div></div>
      <div style={{width:1,height:28,background:'var(--border)'}}/>
      <div><div className="cap">ETA</div><div className="mono emph" style={{marginTop:4,fontSize:13,color:'var(--brand-mint)'}}>~4 min</div></div>
      <div style={{width:1,height:28,background:'var(--border)'}}/>
      <div><div className="cap">REGION</div><div className="mono emph" style={{marginTop:4,fontSize:13}}>ap-southeast-1</div></div>
    </div>
  </div>
);}
function EmptyState(){return (
  <AdminShell active="webhooks" crumbs={['Pagoda','Webhooks']} title="Webhooks"
    actions={<Btn size="sm" icon="plus">New endpoint</Btn>}>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'60px 20px',gap:16}}>
      <div style={{width:72,height:72,borderRadius:18,background:'rgba(108,208,176,0.08)',border:'1px solid rgba(108,208,176,0.25)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Icon name="webhook" size={34} style={{color:'var(--brand-mint)'}}/>
      </div>
      <h2 style={{margin:0,fontSize:22,fontWeight:500,letterSpacing:'-0.01em'}}>No webhook endpoints yet</h2>
      <p style={{margin:0,color:'var(--fg-2)',fontSize:14,maxWidth:400,lineHeight:1.6}}>
        Subscribe to <span className="mono" style={{color:'var(--brand-accent-soft)'}}>user.created</span>,{' '}
        <span className="mono" style={{color:'var(--brand-accent-soft)'}}>session.revoked</span>, or{' '}
        <span className="mono" style={{color:'var(--brand-accent-soft)'}}>role.assigned</span> to react to
        identity changes in your own systems.
      </p>
      <div className="row" style={{gap:10,marginTop:4}}>
        <Btn size="sm" icon="plus">Add your first endpoint</Btn>
        <Btn variant="ghost" size="sm" icon="code">View events</Btn>
      </div>
    </div>
  </AdminShell>
);}

// ---------- Mobile frames ----------
function MobileSignIn() {
  return (
    <div className="scr" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:30}}>
      <PhoneFrame>
        <div style={{background:'var(--bg-0)',width:'100%',height:'100%',padding:'60px 22px 22px',display:'flex',flexDirection:'column',gap:14}}>
          <Logo size={24}/>
          <p className="eye" style={{marginTop:20}}>SIGN IN</p>
          <h1 style={{margin:'6px 0 10px',fontSize:26,fontWeight:500,letterSpacing:'-0.01em',lineHeight:1.1}}>
            Sign in to<br/>
            <span style={{fontFamily:'var(--font-display)',fontStyle:'italic',color:'var(--brand-mint)',fontWeight:400}}>Pagoda</span>
          </h1>
          <Field label="Email" value="maya@pagoda.dev" mono/>
          <Field label="Password" type="password" value="············"/>
          <Btn style={{justifyContent:'center',width:'100%'}}>Sign in</Btn>
          <div className="divider">OR</div>
          <Btn variant="ghost" icon="passkey" style={{justifyContent:'center',width:'100%'}}>Use Face ID</Btn>
          <div style={{marginTop:'auto',textAlign:'center',fontSize:12,color:'var(--fg-3)'}}>
            Protected by <b style={{color:'var(--fg-1)'}}>Authlyn</b>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

function MobileMFA() {
  return (
    <div className="scr" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:30}}>
      <PhoneFrame>
        <div style={{background:'var(--bg-0)',width:'100%',height:'100%',padding:'60px 22px 22px',display:'flex',flexDirection:'column',gap:16}}>
          <Logo size={22}/>
          <p className="eye" style={{marginTop:16}}>TWO-STEP</p>
          <h1 style={{margin:'6px 0 0',fontSize:24,fontWeight:500,letterSpacing:'-0.01em'}}>Enter your code</h1>
          <p style={{margin:0,color:'var(--fg-2)',fontSize:13,lineHeight:1.55}}>From your authenticator for <span className="mono" style={{color:'var(--brand-accent-soft)'}}>pagoda-prod</span></p>
          <div className="row" style={{gap:8,justifyContent:'center',marginTop:6}}>
            {['4','7','2','9','1','8'].map((d,i)=>(
              <div key={i} style={{width:38,height:48,borderRadius:12,border:`1px solid ${i===5?'var(--brand-accent)':'var(--border)'}`,background:'rgba(0,0,0,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontSize:22,color:'var(--fg-bright)',fontWeight:500}}>{d}</div>
            ))}
          </div>
          <div className="row" style={{justifyContent:'space-between',fontSize:12,marginTop:4}}>
            <a style={{color:'var(--brand-accent)'}}>Backup code</a>
            <span style={{color:'var(--fg-3)',fontFamily:'var(--font-mono)'}}>0:22</span>
          </div>
          <Btn style={{justifyContent:'center',width:'100%',marginTop:'auto'}}>Verify</Btn>
          <div style={{textAlign:'center',fontSize:11,color:'var(--fg-3)',fontFamily:'var(--font-mono)'}}>authlyn.dev · RS256</div>
        </div>
      </PhoneFrame>
    </div>
  );
}

function MobilePasskey() {
  return (
    <div className="scr" style={{display:'flex',alignItems:'center',justifyContent:'center',padding:30}}>
      <PhoneFrame>
        <div style={{background:'var(--bg-0)',width:'100%',height:'100%',position:'relative'}}>
          <div style={{padding:'60px 22px 22px',opacity:0.35,filter:'blur(1.5px)'}}>
            <Logo size={22}/>
            <h1 style={{fontSize:22,marginTop:28}}>Sign in to Pagoda</h1>
            <div style={{height:40,background:'var(--bg-2)',borderRadius:12,marginTop:20}}/>
            <div style={{height:40,background:'var(--bg-2)',borderRadius:12,marginTop:12}}/>
          </div>
          <div style={{position:'absolute',left:12,right:12,bottom:14,background:'rgba(14,26,36,0.98)',backdropFilter:'blur(20px)',border:'1px solid var(--border)',borderRadius:22,padding:22,display:'flex',flexDirection:'column',gap:14,boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:46,height:46,borderRadius:12,background:'rgba(108,208,176,0.12)',border:'1px solid rgba(108,208,176,0.35)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="passkey" size={22} style={{color:'var(--brand-mint)'}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500}}>Sign in to Pagoda?</div>
                <div className="mono dim" style={{fontSize:11.5}}>authlyn.dev · Face ID</div>
              </div>
            </div>
            <div style={{fontSize:12.5,color:'var(--fg-2)',lineHeight:1.55}}>
              Your passkey for <span className="mono" style={{color:'var(--brand-accent-soft)'}}>maya@pagoda.dev</span> is on this iPhone.
            </div>
            <div className="row" style={{gap:10,marginTop:4}}>
              <Btn variant="ghost" size="sm" style={{flex:1,justifyContent:'center'}}>Cancel</Btn>
              <Btn size="sm" style={{flex:1,justifyContent:'center'}}>Continue</Btn>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

Object.assign(window, { DevKeys, DevWebhooks, DevJWKS, DevLogs, Onboarding, Err404, Err500, Maintenance, EmptyState, MobileSignIn, MobileMFA, MobilePasskey });
