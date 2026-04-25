// primitives.jsx — shared UI pieces used across all Authlyn screens.
// Export to window so each screen JSX file can pick what it needs.

const { useState, useEffect, useRef } = React;

// ---------- Logo ----------
function Logo({ size = 28, showWord = true, word = 'Authlyn' }) {
  return (
    <div className="logo-shield">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M24 4 L40 9 V22 C40 32 33 40 24 44 C15 40 8 32 8 22 V9 Z"
          stroke="#6cd0b0" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
        <circle cx="22" cy="20" r="5" stroke="#6cd0b0" strokeWidth="1.8" fill="none"/>
        <path d="M26 22 L32 28 M30 26 L32 28 M28 28 L30 30"
          stroke="#6cd0b0" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
      {showWord && <span className="word">{word}</span>}
    </div>
  );
}

// ---------- Lucide-ish inline icons (stroke 1.75, currentColor) ----------
// Hand-rolled so we don't need a CDN at runtime.
function Icon({ name, size = 16, style }) {
  const s = { width: size, height: size, stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none', ...style };
  const P = {
    home:      <><path d="M3 11 L12 3 L21 11"/><path d="M5 10 V20 H19 V10"/></>,
    users:     <><circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5"/><path d="M15 8a3 3 0 1 0 0-5"/><path d="M21 19c0-2.2-1.8-4-4-4"/></>,
    user:      <><circle cx="12" cy="8" r="3.6"/><path d="M4 20c0-3.4 3.6-6 8-6s8 2.6 8 6"/></>,
    shield:    <><path d="M12 3 L20 6 V12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 V6 Z"/></>,
    key:       <><circle cx="8" cy="15" r="3.5"/><path d="M10.5 12.5 L20 3"/><path d="M16 7 L18 9"/></>,
    building:  <><rect x="4" y="3" width="12" height="18" rx="1.2"/><path d="M8 7h4M8 11h4M8 15h4"/><path d="M16 11h4v10h-4"/></>,
    app:       <><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></>,
    activity:  <><path d="M3 12h4l2-6 3 12 3-9 2 3h4"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9A7 7 0 0 0 14.6 5L14 2.6h-4L9.4 5A7 7 0 0 0 7.4 6.8l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-.9A7 7 0 0 0 9.4 19l.6 2.4h4l.6-2.4a7 7 0 0 0 2-1.8l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/></>,
    code:      <><path d="M8 18 L2 12 L8 6"/><path d="M16 6 L22 12 L16 18"/></>,
    webhook:   <><circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/><circle cx="12" cy="6" r="3"/><path d="M9 16 L15 16"/><path d="M13.5 8.5 L16.5 13.5"/><path d="M10.5 8.5 L7.5 13.5"/></>,
    logs:      <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></>,
    plus:      <><path d="M12 5v14M5 12h14"/></>,
    chev:      <><path d="M6 9l6 6 6-6"/></>,
    chevR:     <><path d="M9 6l6 6-6 6"/></>,
    chevL:     <><path d="M15 6l-6 6 6 6"/></>,
    x:         <><path d="M6 6l12 12M18 6L6 18"/></>,
    check:     <><path d="M4 12l5 5L20 6"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></>,
    filter:    <><path d="M3 5h18l-7 9v6l-4-2v-4z"/></>,
    dots:      <><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></>,
    bell:      <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    arrowR:    <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowL:    <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
    mail:      <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></>,
    device:    <><rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M10 18h4"/></>,
    desktop:   <><rect x="3" y="4" width="18" height="12" rx="1.6"/><path d="M8 20h8M12 16v4"/></>,
    lock:      <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    eye:       <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    copy:      <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></>,
    download:  <><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></>,
    refresh:   <><path d="M20 11A8 8 0 0 0 6 6l-2 2"/><path d="M4 13a8 8 0 0 0 14 5l2-2"/><path d="M20 4v5h-5M4 20v-5h5"/></>,
    trash:     <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
    edit:      <><path d="M4 20h4L20 8l-4-4L4 16Z"/></>,
    link:      <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
    globe:     <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    clock:     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    zap:       <><path d="M13 2 L4 14 H11 L10 22 L20 10 H13 Z"/></>,
    finger:    <><path d="M8 11a4 4 0 0 1 8 0v4M5 14c0-4 3-7 7-7s7 3 7 7"/><path d="M9 16v3M12 15v5M15 16v3"/></>,
    passkey:   <><circle cx="10" cy="9" r="3.5"/><path d="M5 20c0-3 2.5-5 5-5s3 1 3 2v3"/><path d="M15 13l5 5M18 15l2 2M17 17l1 1"/></>,
    info:      <><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M11 12h1v5"/></>,
    alert:     <><path d="M12 3 L22 20 H2 Z"/><path d="M12 10v4M12 17v.5"/></>,
    wifi:      <><path d="M2 9a15 15 0 0 1 20 0"/><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/></>,
    github:    <><path d="M9 19c-4 1-4-2-6-2.5M15 22v-3.5a3 3 0 0 0-.8-2.3c2.9-.3 5.8-1.4 5.8-6.4a5 5 0 0 0-1.3-3.5 4.6 4.6 0 0 0-.1-3.5s-1-.3-3.5 1.4a12 12 0 0 0-6 0C6.3 2 5.5 2.3 5.5 2.3a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 4 9.3c0 5 3 6.1 5.8 6.4a3 3 0 0 0-.8 2.3V22"/></>,
    google:    <><path d="M21 12c0 5-4 9-9 9a9 9 0 1 1 6.3-15.5L15 8.4A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 17 14H12v-3h9c0 .3 0 .6 0 1Z"/></>,
    sso:       <><rect x="3" y="5" width="9" height="14" rx="1.6"/><path d="M12 12h9M18 9l3 3-3 3"/></>,
    moon:      <><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/></>,
    slack:     <><rect x="3" y="8" width="5" height="5" rx="2"/><rect x="11" y="3" width="5" height="5" rx="2"/><rect x="11" y="16" width="5" height="5" rx="2"/><rect x="16" y="11" width="5" height="5" rx="2"/></>,
    figma:     <><path d="M8 3h4v6H8a3 3 0 1 1 0-6Z"/><path d="M12 3h4a3 3 0 1 1 0 6h-4Z"/><path d="M8 9h4v6H8a3 3 0 1 1 0-6Z"/><path d="M16 12a3 3 0 1 1-4 0"/><path d="M8 15h4v3a3 3 0 1 1-4-3Z"/></>,
    folder:    <><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></>,
    branch:    <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><circle cx="6" cy="19" r="2"/><path d="M6 7v10"/><path d="M18 17V9a4 4 0 0 0-4-4H8"/></>,
  };
  return <svg viewBox="0 0 24 24" className="ic" style={s}>{P[name] || P.info}</svg>;
}

// ---------- Avatar ----------
const AVTONES = ['avatar-o', 'avatar-m', 'avatar-c', 'avatar-s', 'avatar-y', 'avatar-p'];
function Avatar({ name, size = 'md', tone }) {
  const initials = (name || '??')
    .split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase() || '·';
  const idx = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVTONES.length;
  const cls = `avatar ${size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : ''} ${tone || AVTONES[idx]}`;
  return <span className={cls}>{initials}</span>;
}

// ---------- StatusPill ----------
function StatusPill({ label, tone = 'ok', children }) {
  return (
    <span className={`pill ${tone}`}>
      <span className="dot" /> {label && <span style={{ color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10.5, fontWeight: 500 }}>{label}</span>}
      {children}
    </span>
  );
}

// ---------- Button ----------
function Btn({ variant = 'primary', size, icon, iconRight, children, onClick, style, type = 'button' }) {
  const cls = `btn btn-${variant}${size ? ' btn-' + size : ''}`;
  return (
    <button type={type} className={cls} style={style} onClick={onClick}>
      {icon && <Icon name={icon} size={size === 'xs' ? 12 : 14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'xs' ? 12 : 14} />}
    </button>
  );
}

// ---------- Field ----------
function Field({ label, value, onChange, type = 'text', hint, err, placeholder, mono, suffix }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value ?? ''}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          style={mono ? { fontFamily: 'var(--font-mono)' } : undefined}
        />
        {suffix && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', fontSize: 12 }}>{suffix}</span>}
      </div>
      {(hint || err) && <div className={'hint' + (err ? ' err' : '')}>{err || hint}</div>}
    </div>
  );
}

// ---------- Toggle ----------
function Toggle({ on, onChange }) {
  return <span className={`toggle${on ? ' on' : ''}`} onClick={() => onChange && onChange(!on)} role="switch" aria-checked={on} />;
}

// ---------- Segmented ----------
function Segmented({ options, value, onChange }) {
  return (
    <div className="segmented">
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        return <button key={v} className={v === value ? 'active' : ''} onClick={() => onChange && onChange(v)}>{l}</button>;
      })}
    </div>
  );
}

// ---------- Tabs (inline) ----------
function Tabs({ options, value, onChange }) {
  return (
    <div className="tabs">
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        return <button key={v} className={v === value ? 'active' : ''} onClick={() => onChange && onChange(v)}>{l}</button>;
      })}
    </div>
  );
}

// ---------- Sidebar (admin + developer) ----------
function Sidebar({ nav, active, footer }) {
  return (
    <aside className="sidebar">
      <div className="brandrow"><Logo size={22} /></div>
      {nav.map((g, gi) => (
        <div key={gi}>
          {g.title && <div className="section">{g.title}</div>}
          {g.items.map(it => (
            <a key={it.id} className={it.id === active ? 'active' : ''}>
              <Icon name={it.icon} size={15} />
              <span>{it.label}</span>
              {it.count != null && (
                <span style={{ marginLeft: 'auto', color: 'var(--fg-3)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{it.count}</span>
              )}
            </a>
          ))}
        </div>
      ))}
      <div className="foot">
        {footer || (
          <div className="row" style={{ gap: 10 }}>
            <Avatar name="Maya Tran" size="md" />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Maya Tran</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>authlyn-eng</div>
            </div>
            <Icon name="chev" size={14} style={{ marginLeft: 'auto', color: 'var(--fg-3)' }} />
          </div>
        )}
      </div>
    </aside>
  );
}

// ---------- AppBar ----------
function AppBar({ crumbs, title, actions }) {
  return (
    <header className="appbar">
      <div>
        {crumbs && (
          <div className="crumb">
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && <span style={{ opacity: 0.5, margin: '0 6px' }}>/</span>}
                {i === crumbs.length - 1 ? <b>{c}</b> : c}
              </span>
            ))}
          </div>
        )}
        {title && <h1 style={{ marginTop: crumbs ? 2 : 0 }}>{title}</h1>}
      </div>
      <div className="row" style={{ gap: 10 }}>{actions}</div>
    </header>
  );
}

// ---------- Modal (visual, no overlay) — just a centered glass card ----------
function Modal({ title, subtitle, children, actions, width = 460 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(5,12,20,0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 20,
    }}>
      <div className="glass" style={{ width, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {title && <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h2>
          {subtitle && <p style={{ margin: '6px 0 0', color: 'var(--fg-2)', fontSize: 13.5 }}>{subtitle}</p>}
        </div>}
        {children}
        {actions && <div className="row" style={{ gap: 10, justifyContent: 'flex-end' }}>{actions}</div>}
      </div>
    </div>
  );
}

// ---------- BrowserChrome (minimal, dark) ----------
function BrowserChrome({ url, children, tabs = [{ title: 'Authlyn', favicon: 'shield' }], activeTab = 0, style }) {
  return (
    <div style={{
      height: '100%', width: '100%',
      display: 'flex', flexDirection: 'column',
      background: '#171a1f',
      ...style,
    }}>
      {/* tab strip */}
      <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 10px', gap: 8, background: '#0f1216', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#ff5f57' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#febc2e' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#28c840' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 12, alignItems: 'flex-end', height: '100%' }}>
          {tabs.map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0 12px', height: 28, minWidth: 140, maxWidth: 220,
              borderRadius: '8px 8px 0 0',
              background: i === activeTab ? '#1b1f24' : 'transparent',
              color: i === activeTab ? '#e8eaed' : '#9aa0a6',
              fontFamily: 'system-ui,sans-serif', fontSize: 11.5,
              alignSelf: 'flex-end',
            }}>
              {t.favicon && (
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#6cd0b0" strokeWidth={2}>
                  <path d="M12 3 L20 6 V12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 V6 Z"/>
                </svg>
              )}
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
            </div>
          ))}
        </div>
      </div>
      {/* URL bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 12px', background: '#1b1f24', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 14, color: '#9aa0a6' }}>
          <Icon name="chevL" size={14} />
          <Icon name="chevR" size={14} style={{ opacity: 0.4 }} />
          <Icon name="refresh" size={14} />
        </div>
        <div style={{
          flex: 1, height: 22, borderRadius: 999, background: '#0f1216',
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
          fontFamily: 'system-ui,sans-serif', fontSize: 11.5, color: '#bcc0c7',
        }}>
          <Icon name="lock" size={11} style={{ opacity: 0.7 }} />
          <span>{url}</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
    </div>
  );
}

// ---------- Phone frame (minimal) ----------
function PhoneFrame({ children, width = 320, height = 650 }) {
  return (
    <div style={{
      width, height, borderRadius: 42,
      padding: 10, background: '#0a0f14',
      boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.08)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden', position: 'relative',
      }}>
        {/* status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 38, zIndex: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 22px', color: '#f8f2e8',
          fontFamily: 'system-ui,sans-serif', fontSize: 12, fontWeight: 600,
        }}>
          <span>9:41</span>
          <span style={{
            position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
            width: 90, height: 22, background: '#0a0f14', borderRadius: 999,
          }} />
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Icon name="wifi" size={13} />
            <div style={{ width: 22, height: 10, borderRadius: 3, border: '1px solid #f8f2e8', position: 'relative', opacity: 0.9 }}>
              <div style={{ position: 'absolute', inset: 1.5, background: '#f8f2e8', borderRadius: 1, width: '72%' }} />
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: '100%' }}>{children}</div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 4, borderRadius: 999, background: 'rgba(248,242,232,0.55)', zIndex: 4,
        }} />
      </div>
    </div>
  );
}

Object.assign(window, { Logo, Icon, Avatar, StatusPill, Btn, Field, Toggle, Segmented, Tabs, Sidebar, AppBar, Modal, BrowserChrome, PhoneFrame });
