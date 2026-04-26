import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'link' | 'danger';
  size?: 'default' | 'sm' | 'xs';
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
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
  className,
  onClick,
  children,
  type = 'button',
  disabled,
}: ButtonProps) {
  const iconSize = size === 'xs' ? 12 : 14;
  const cls = `btn btn-${variant}${size && size !== 'default' ? ` btn-${size}` : ''}${className ? ` ${className}` : ''}`;
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
