import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Pricing } from './Pricing';

function renderPricing() {
  return render(
    <MemoryRouter>
      <Pricing />
    </MemoryRouter>
  );
}

describe('Pricing', () => {
  it('renders the main heading', () => {
    renderPricing();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the pricing eyebrow', () => {
    renderPricing();
    expect(screen.getByText('PRICING')).toBeInTheDocument();
  });

  it('renders the navigation landmark', () => {
    renderPricing();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all three tier names', () => {
    renderPricing();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Scale')).toBeInTheDocument();
  });

  it('renders the billing segmented control', () => {
    renderPricing();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly · save 18%')).toBeInTheDocument();
  });
});
