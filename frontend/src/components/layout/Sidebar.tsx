import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { Avatar } from '@/components/ui/Avatar';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  count?: number;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  nav: NavGroup[];
  active: string;
  footer?: ReactNode;
}

function LogoShield() {
  return (
    <div className="logo-shield">
      <svg width={22} height={22} viewBox="0 0 48 48" fill="none">
        <path
          d="M24 4 L40 9 V22 C40 32 33 40 24 44 C15 40 8 32 8 22 V9 Z"
          stroke="#6cd0b0"
          strokeWidth="2.2"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="22" cy="20" r="5" stroke="#6cd0b0" strokeWidth="1.8" fill="none" />
        <path
          d="M26 22 L32 28 M30 26 L32 28 M28 28 L30 30"
          stroke="#6cd0b0"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="word">Authlyn</span>
    </div>
  );
}

export function Sidebar({ nav, active, footer }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brandrow">
        <LogoShield />
      </div>
      {nav.map((group, gi) => (
        <div key={gi}>
          {group.title && <div className="section">{group.title}</div>}
          {group.items.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={item.id === active ? 'active' : ''}
            >
              <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={15} />
              <span>{item.label}</span>
              {item.count != null && (
                <span style={{
                  marginLeft: 'auto',
                  color: 'var(--fg-3)',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}
      <div className="foot">
        {footer ?? (
          <div className="row" style={{ gap: 10 }}>
            <Avatar name="Maya Tran" size="md" />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Maya Tran</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                authlyn-eng
              </div>
            </div>
            <Icon name="chev" size={14} style={{ marginLeft: 'auto', color: 'var(--fg-3)' }} />
          </div>
        )}
      </div>
    </aside>
  );
}
