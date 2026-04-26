import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Landing } from './Landing';

function renderLanding() {
  return render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );
}

describe('Landing', () => {
  it('renders the hero heading', () => {
    renderLanding();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the eyebrow copy', () => {
    renderLanding();
    expect(screen.getByText(/IDENTITY INFRASTRUCTURE/i)).toBeInTheDocument();
  });

  it('renders the main nav landmark', () => {
    renderLanding();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all three feature card headings', () => {
    renderLanding();
    expect(screen.getByText('Drop-in auth UI')).toBeInTheDocument();
    expect(screen.getByText('Roles that nest')).toBeInTheDocument();
    expect(screen.getByText('Refresh-token chains')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    renderLanding();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
