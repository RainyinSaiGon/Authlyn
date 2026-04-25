import type { CSSProperties, ReactNode } from 'react';

export type IconName =
  | 'home' | 'users' | 'user' | 'shield' | 'key' | 'building' | 'app'
  | 'activity' | 'settings' | 'code' | 'webhook' | 'logs' | 'plus' | 'chev'
  | 'chevR' | 'chevL' | 'x' | 'check' | 'search' | 'filter' | 'dots'
  | 'bell' | 'arrowR' | 'arrowL' | 'mail' | 'device' | 'desktop' | 'lock'
  | 'eye' | 'copy' | 'download' | 'refresh' | 'trash' | 'edit' | 'link'
  | 'globe' | 'clock' | 'zap' | 'finger' | 'passkey' | 'info' | 'alert'
  | 'wifi' | 'github' | 'google' | 'sso' | 'moon' | 'slack' | 'figma'
  | 'folder' | 'branch';

const PATHS: Record<IconName, ReactNode> = {
  home:     <><path d="M3 11 L12 3 L21 11"/><path d="M5 10 V20 H19 V10"/></>,
  users:    <><circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5"/><path d="M15 8a3 3 0 1 0 0-5"/><path d="M21 19c0-2.2-1.8-4-4-4"/></>,
  user:     <><circle cx="12" cy="8" r="3.6"/><path d="M4 20c0-3.4 3.6-6 8-6s8 2.6 8 6"/></>,
  shield:   <><path d="M12 3 L20 6 V12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 V6 Z"/></>,
  key:      <><circle cx="8" cy="15" r="3.5"/><path d="M10.5 12.5 L20 3"/><path d="M16 7 L18 9"/></>,
  building: <><rect x="4" y="3" width="12" height="18" rx="1.2"/><path d="M8 7h4M8 11h4M8 15h4"/><path d="M16 11h4v10h-4"/></>,
  app:      <><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></>,
  activity: <><path d="M3 12h4l2-6 3 12 3-9 2 3h4"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9A7 7 0 0 0 14.6 5L14 2.6h-4L9.4 5A7 7 0 0 0 7.4 6.8l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-.9A7 7 0 0 0 9.4 19l.6 2.4h4l.6-2.4a7 7 0 0 0 2-1.8l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/></>,
  code:     <><path d="M8 18 L2 12 L8 6"/><path d="M16 6 L22 12 L16 18"/></>,
  webhook:  <><circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/><circle cx="12" cy="6" r="3"/><path d="M9 16 L15 16"/><path d="M13.5 8.5 L16.5 13.5"/><path d="M10.5 8.5 L7.5 13.5"/></>,
  logs:     <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></>,
  plus:     <><path d="M12 5v14M5 12h14"/></>,
  chev:     <><path d="M6 9l6 6 6-6"/></>,
  chevR:    <><path d="M9 6l6 6-6 6"/></>,
  chevL:    <><path d="M15 6l-6 6 6 6"/></>,
  x:        <><path d="M6 6l12 12M18 6L6 18"/></>,
  check:    <><path d="M4 12l5 5L20 6"/></>,
  search:   <><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></>,
  filter:   <><path d="M3 5h18l-7 9v6l-4-2v-4z"/></>,
  dots:     <><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></>,
  bell:     <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
  arrowR:   <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  arrowL:   <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
  mail:     <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></>,
  device:   <><rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M10 18h4"/></>,
  desktop:  <><rect x="3" y="4" width="18" height="12" rx="1.6"/><path d="M8 20h8M12 16v4"/></>,
  lock:     <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  eye:      <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  copy:     <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></>,
  download: <><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></>,
  refresh:  <><path d="M20 11A8 8 0 0 0 6 6l-2 2"/><path d="M4 13a8 8 0 0 0 14 5l2-2"/><path d="M20 4v5h-5M4 20v-5h5"/></>,
  trash:    <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
  edit:     <><path d="M4 20h4L20 8l-4-4L4 16Z"/></>,
  link:     <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
  globe:    <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  clock:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  zap:      <><path d="M13 2 L4 14 H11 L10 22 L20 10 H13 Z"/></>,
  finger:   <><path d="M8 11a4 4 0 0 1 8 0v4M5 14c0-4 3-7 7-7s7 3 7 7"/><path d="M9 16v3M12 15v5M15 16v3"/></>,
  passkey:  <><circle cx="10" cy="9" r="3.5"/><path d="M5 20c0-3 2.5-5 5-5s3 1 3 2v3"/><path d="M15 13l5 5M18 15l2 2M17 17l1 1"/></>,
  info:     <><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M11 12h1v5"/></>,
  alert:    <><path d="M12 3 L22 20 H2 Z"/><path d="M12 10v4M12 17v.5"/></>,
  wifi:     <><path d="M2 9a15 15 0 0 1 20 0"/><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/></>,
  github:   <><path d="M9 19c-4 1-4-2-6-2.5M15 22v-3.5a3 3 0 0 0-.8-2.3c2.9-.3 5.8-1.4 5.8-6.4a5 5 0 0 0-1.3-3.5 4.6 4.6 0 0 0-.1-3.5s-1-.3-3.5 1.4a12 12 0 0 0-6 0C6.3 2 5.5 2.3 5.5 2.3a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 4 9.3c0 5 3 6.1 5.8 6.4a3 3 0 0 0-.8 2.3V22"/></>,
  google:   <><path d="M21 12c0 5-4 9-9 9a9 9 0 1 1 6.3-15.5L15 8.4A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 17 14H12v-3h9c0 .3 0 .6 0 1Z"/></>,
  sso:      <><rect x="3" y="5" width="9" height="14" rx="1.6"/><path d="M12 12h9M18 9l3 3-3 3"/></>,
  moon:     <><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/></>,
  slack:    <><rect x="3" y="8" width="5" height="5" rx="2"/><rect x="11" y="3" width="5" height="5" rx="2"/><rect x="11" y="16" width="5" height="5" rx="2"/><rect x="16" y="11" width="5" height="5" rx="2"/></>,
  figma:    <><path d="M8 3h4v6H8a3 3 0 1 1 0-6Z"/><path d="M12 3h4a3 3 0 1 1 0 6h-4Z"/><path d="M8 9h4v6H8a3 3 0 1 1 0-6Z"/><path d="M16 12a3 3 0 1 1-4 0"/><path d="M8 15h4v3a3 3 0 1 1-4-3Z"/></>,
  folder:   <><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></>,
  branch:   <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><circle cx="6" cy="19" r="2"/><path d="M6 7v10"/><path d="M18 17V9a4 4 0 0 0-4-4H8"/></>,
};

interface IconProps {
  name: IconName;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 16, style, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`ic${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={style}
    >
      {PATHS[name] ?? PATHS.info}
    </svg>
  );
}
