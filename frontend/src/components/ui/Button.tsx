import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'link' | 'danger';
  size?: 'default' | 'sm' | 'xs';
  icon?: IconName;
  iconRight?: IconName;
  style?: CSSProperties;
  onClick?: () => void;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size,
  icon,
  iconRight,
  style,
  onClick,
  children,
  type = 'button',
  disabled,
}: ButtonProps) {
  const iconSize = size === 'xs' ? 12 : 14;
  const cls = `btn btn-${variant}${size && size !== 'default' ? ` btn-${size}` : ''}`;
  return (
    <button type={type} className={cls} style={style} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
