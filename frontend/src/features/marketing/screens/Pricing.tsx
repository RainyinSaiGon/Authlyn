import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Segmented } from '@/components/ui/Segmented';
import { MarketingNav } from '../components/MarketingNav';

type TierVariant = 'ghost' | 'primary';

interface Tier {
  name: string;
  price: string;
  unit?: string;
  blurb: string;
  features: string[];
  cta: string;
  variant: TierVariant;
  accent: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Build', price: 'Free', blurb: 'For prototypes and weekend projects.',
    features: ['5,000 MAU', 'Email + password + passkey', '1 organization', 'Community support'],
    cta: 'Start free', variant: 'ghost', accent: false,
  },
  {
    name: 'Team', price: '$0.012', unit: '/ MAU · month', blurb: 'Production auth for serious products.',
    features: ['Unlimited MAU', 'SSO (SAML, OIDC)', 'Organizations & RBAC', 'SOC 2 report', 'Email support, 24h'],
    cta: 'Start 14-day trial', variant: 'primary', accent: true,
  },
  {
    name: 'Scale', price: 'Custom', blurb: 'Dedicated region, SCIM, audit exports.',
    features: ['Everything in Team', 'SCIM v2.0', 'Dedicated region / BYO-KMS', 'SLA 99.99%, 1h resp.', 'Shared Slack channel'],
    cta: 'Talk to us', variant: 'ghost', accent: false,
  },
];

export function Pricing() {
  const [billing, setBilling] = useState('Monthly');

  return (
    <div className="min-h-screen overflow-auto">
      <MarketingNav active="pricing" />

      {/* Hero */}
      <section className="px-[80px] pt-[72px] pb-7 max-w-[1180px] mx-auto text-center">
        <p className="eye">PRICING</p>
        <h1 className="text-[56px] font-medium tracking-[-0.01em] m-0 mt-[18px] mb-[14px] leading-none">
          Priced per{' '}
          <span className="font-display italic text-mint font-normal">active user</span>. Nothing else.
        </h1>
        <p className="lead mx-auto max-w-[560px] m-0">
          No seats, no premium feature paywall on security basics. MFA, passkeys, and audit log
          ship on every tier.
        </p>
        <div className="flex justify-center mt-7">
          <Segmented
            options={['Monthly', 'Yearly · save 18%']}
            value={billing}
            onChange={setBilling}
          />
        </div>
      </section>

      {/* Tier cards */}
      <section className="px-[80px] pt-[40px] pb-[80px] max-w-[1180px] mx-auto grid grid-cols-3 gap-4">
        {TIERS.map((tier) => (
          <article key={tier.name} className={`glass${tier.accent ? ' accent' : ''} p-7 flex flex-col gap-[18px]`}>
            <div>
              <p className="eye">{tier.name}</p>
              <div className="flex items-baseline gap-2 mt-[14px]">
                <span className="text-[44px] font-medium tracking-[-0.02em] leading-none">{tier.price}</span>
                {tier.unit && (
                  <span className="text-fg-3 text-[13px] font-mono">{tier.unit}</span>
                )}
              </div>
              <p className="text-fg-2 text-[13.5px] mt-[10px] m-0">{tier.blurb}</p>
            </div>
            <Button
              variant={tier.variant}
              className="justify-center w-full"
              iconRight={tier.variant === 'primary' ? 'arrowR' : undefined}
            >
              {tier.cta}
            </Button>
            <div className="border-t border-border pt-4 flex flex-col gap-[10px]">
              {tier.features.map((f) => (
                <div key={f} className="flex items-center gap-[10px] text-[13px] text-fg-2">
                  <Icon name="check" size={14} className="text-mint shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
