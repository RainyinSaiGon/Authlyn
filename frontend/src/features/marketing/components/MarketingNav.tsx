import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

interface MarketingNavProps {
  active: 'product' | 'docs' | 'pricing';
  variant?: 'marketing' | 'docs';
}

function NavLogo() {
  return (
    <div className="brand">
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
      <span className="brand-name">Authlyn</span>
    </div>
  );
}

export function MarketingNav({ active, variant = 'marketing' }: MarketingNavProps) {
  if (variant === 'docs') {
    return (
      <nav className="topnav">
        <NavLogo />
        <div className="links">
          <Link to="/" className={active === 'product' ? 'active' : ''}>Product</Link>
          <Link to="/docs" className={active === 'docs' ? 'active' : ''}>Docs</Link>
          <Link to="/pricing" className={active === 'pricing' ? 'active' : ''}>Pricing</Link>
          <Button variant="ghost" size="sm" icon="search">Search docs</Button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="topnav">
      <NavLogo />
      <div className="links">
        <Link to="/" className={active === 'product' ? 'active' : ''}>Product</Link>
        <Link to="/docs" className={active === 'docs' ? 'active' : ''}>Docs</Link>
        <Link to="/pricing" className={active === 'pricing' ? 'active' : ''}>Pricing</Link>
        <a>Customers</a>
        <a>Changelog</a>
        <Link to="/auth/sign-in" className="!text-fg-1">Sign in</Link>
        <Button size="sm" iconRight="arrowR">Get started</Button>
      </div>
    </nav>
  );
}
