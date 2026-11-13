import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

interface ButtonBaseProps {
  variant?: 'primary' | 'ghost' | 'link' | 'danger';
  size?: 'default' | 'sm' | 'xs';
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'menu' | 'dialog' | 'listbox' | true;
  'aria-controls'?: string;
}

/**
 * A button needs an accessible name. With visible text it has one; an icon-only button must
 * pass `aria-label`. The union makes `<Button icon="dots" />` without a label a type error.
 */
type ButtonProps = ButtonBaseProps &
  (
    | { children: ReactNode; 'aria-label'?: string }
    | { children?: never; icon: IconName; 'aria-label': string }
  );

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
  ...aria
}: ButtonProps) {
  const iconSize = size === 'xs' ? 12 : 14;
  const cls = `btn btn-${variant}${size && size !== 'default' ? ` btn-${size}` : ''}${className ? ` ${className}` : ''}`;
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...aria}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
