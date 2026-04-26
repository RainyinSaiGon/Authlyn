import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sessions } from './Sessions';

beforeEach(() => {
  localStorage.setItem('authlyn.token', 'test-token');
});

afterEach(() => {
  localStorage.clear();
});

function renderSessions() {
  return render(
    <MemoryRouter>
      <Sessions />
    </MemoryRouter>
  );
}

describe('Sessions', () => {
  it('renders the section heading', () => {
    renderSessions();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the SESSIONS eyebrow', () => {
    renderSessions();
    expect(screen.getByText('SESSIONS')).toBeInTheDocument();
  });

  it('renders the correct session count in the heading', () => {
    renderSessions();
    expect(screen.getByText(/4 active/i)).toBeInTheDocument();
  });

  it('renders the Sign out all others button', () => {
    renderSessions();
    expect(screen.getByRole('button', { name: /sign out all others/i })).toBeInTheDocument();
  });

  it('renders the refresh-token chain section', () => {
    renderSessions();
    expect(screen.getByRole('heading', { level: 2, name: /refresh-token chain/i })).toBeInTheDocument();
  });
});
