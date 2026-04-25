import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

interface BrowserTab {
  title: string;
  favicon?: boolean;
}

interface BrowserChromeProps {
  url: string;
  tabs?: BrowserTab[];
  children?: ReactNode;
  style?: CSSProperties;
}

export function BrowserChrome({
  url,
  tabs = [{ title: 'Authlyn', favicon: true }],
  children,
  style,
}: BrowserChromeProps) {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#171a1f',
      ...style,
    }}>
      {/* Tab strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 38,
        padding: '0 10px',
        gap: 8,
        background: '#0f1216',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#28c840', display: 'inline-block' }} />
        </div>
        <div style={{
          display: 'flex',
          gap: 4,
          marginLeft: 12,
          alignItems: 'flex-end',
          height: '100%',
        }}>
          {tabs.map((tab, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '0 12px',
                height: 28,
                minWidth: 140,
                maxWidth: 220,
                borderRadius: '8px 8px 0 0',
                background: i === 0 ? '#1b1f24' : 'transparent',
                color: i === 0 ? '#e8eaed' : '#9aa0a6',
                fontFamily: 'system-ui,sans-serif',
                fontSize: 11.5,
                alignSelf: 'flex-end',
              }}
            >
              {tab.favicon && (
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#6cd0b0" strokeWidth={2}>
                  <path d="M12 3 L20 6 V12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 V6 Z" />
                </svg>
              )}
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tab.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* URL bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 36,
        padding: '0 12px',
        background: '#1b1f24',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', gap: 14, color: '#9aa0a6' }}>
          <Icon name="chevL" size={14} />
          <Icon name="chevR" size={14} style={{ opacity: 0.4 }} />
          <Icon name="refresh" size={14} />
        </div>
        <div style={{
          flex: 1,
          height: 22,
          borderRadius: 999,
          background: '#0f1216',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          fontFamily: 'system-ui,sans-serif',
          fontSize: 11.5,
          color: '#bcc0c7',
        }}>
          <Icon name="lock" size={11} style={{ opacity: 0.7 }} />
          <span>{url}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}
