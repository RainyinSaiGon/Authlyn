import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Profile } from './Profile';

beforeEach(() => {
  localStorage.setItem('authlyn.token', 'test-token');
});

afterEach(() => {
  localStorage.clear();
});

function renderProfile() {
  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
}

describe('Profile', () => {
  it('renders the section heading', () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 1, name: /maya tran/i })).toBeInTheDocument();
  });

  it('renders the PROFILE eyebrow', () => {
    renderProfile();
    expect(screen.getByText('PROFILE')).toBeInTheDocument();
  });

  it('renders the linked identities section', () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 2, name: /linked identities/i })).toBeInTheDocument();
  });

  it('renders all three identity providers', () => {
    renderProfile();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Slack')).toBeInTheDocument();
  });
});
