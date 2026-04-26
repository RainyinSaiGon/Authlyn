const TONES = ['avatar-o', 'avatar-m', 'avatar-c', 'avatar-s', 'avatar-y', 'avatar-p'] as const;
type AvatarTone = (typeof TONES)[number];

interface AvatarProps {
  name?: string;
  size?: 'md' | 'lg' | 'xl';
  tone?: AvatarTone;
}

export function Avatar({ name, size = 'md', tone }: AvatarProps) {
  const initials = (name ?? '??')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase() || '·';

  const idx = (name ?? '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length;
  const resolvedTone = tone ?? TONES[idx];
  const sizeCls = size === 'lg' ? ' lg' : size === 'xl' ? ' xl' : '';

  return (
    <span className={`avatar${sizeCls} ${resolvedTone}`}>{initials}</span>
  );
}
