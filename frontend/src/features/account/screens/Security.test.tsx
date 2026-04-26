import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Security } from './Security';

beforeEach(() => {
  localStorage.setItem('authlyn.token', 'test-token');
});

afterEach(() => {
  localStorage.clear();
});

function renderSecurity() {
  return render(
    <MemoryRouter>
      <Security />
    </MemoryRouter>
  );
}

describe('Security', () => {
  it('renders the section heading', () => {
    renderSecurity();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the SECURITY eyebrow', () => {
    renderSecurity();
    expect(screen.getByText('SECURITY')).toBeInTheDocument();
  });

  it('renders all four credential cards', () => {
    renderSecurity();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Two-step')).toBeInTheDocument();
    expect(screen.getByText('Passkeys')).toBeInTheDocument();
    expect(screen.getByText('Backup codes')).toBeInTheDocument();
  });

  it('renders the recent security events section', () => {
    renderSecurity();
    expect(screen.getByRole('heading', { level: 2, name: /recent security events/i })).toBeInTheDocument();
  });

  it('renders the events table', () => {
    renderSecurity();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
