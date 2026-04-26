import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AppBar } from './AppBar';
import type { NavGroup } from './Sidebar';

const ADMIN_NAV: NavGroup[] = [
  {
    items: [
      { id: 'overview', label: 'Overview', icon: 'home', path: '/admin' },
    ],
  },
  {
    title: 'People',
    items: [
      { id: 'users',  label: 'Users',         icon: 'users',    path: '/admin/users',  count: '1,247' },
      { id: 'roles',  label: 'Roles',          icon: 'shield',   path: '/admin/roles' },
      { id: 'orgs',   label: 'Organizations',  icon: 'building', path: '/admin/orgs',   count: '84' },
    ],
  },
  {
    title: 'Apps',
    items: [
      { id: 'apps', label: 'Applications', icon: 'app', path: '/admin/apps' },
    ],
  },
  {
    title: 'Security',
    items: [
      { id: 'sessions', label: 'Sessions',  icon: 'activity', path: '/admin/sessions' },
      { id: 'audit',    label: 'Audit Log', icon: 'logs',     path: '/admin/audit' },
    ],
  },
  {
    title: 'Developer',
    items: [
      { id: 'keys',     label: 'API Keys',  icon: 'key',     path: '/admin/keys' },
      { id: 'webhooks', label: 'Webhooks',  icon: 'webhook', path: '/admin/webhooks' },
      { id: 'jwks',     label: 'JWKS',      icon: 'code',    path: '/admin/jwks' },
      { id: 'logs',     label: 'Logs',      icon: 'logs',    path: '/admin/logs' },
    ],
  },
  {
    title: 'Config',
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings', path: '/admin/settings' },
    ],
  },
];

interface AdminShellProps {
  active: string;
  crumbs?: string[];
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminShell({ active, crumbs, title, actions, children }: AdminShellProps) {
  return (
    <div className="app">
      <Sidebar nav={ADMIN_NAV} active={active} />
      <main className="appmain">
        <AppBar crumbs={crumbs} title={title} actions={actions} />
        <div className="appbody">{children}</div>
      </main>
    </div>
  );
}
