import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApiKeys } from './ApiKeys';

beforeEach(() => {
  localStorage.setItem('authlyn.token', 'test-token');
});

afterEach(() => {
  localStorage.clear();
});

function renderApiKeys() {
  return render(
    <MemoryRouter>
      <ApiKeys />
    </MemoryRouter>
  );
}

describe('ApiKeys', () => {
  it('renders the section heading', () => {
    renderApiKeys();
    expect(screen.getByRole('heading', { level: 1, name: /3 keys issued/i })).toBeInTheDocument();
  });

  it('renders the PERSONAL API KEYS eyebrow', () => {
    renderApiKeys();
    expect(screen.getByText('PERSONAL API KEYS')).toBeInTheDocument();
  });

  it('renders the keys table', () => {
    renderApiKeys();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders all key labels', () => {
    renderApiKeys();
    expect(screen.getByText('Local dev')).toBeInTheDocument();
    expect(screen.getByText('CI · GitHub Actions')).toBeInTheDocument();
    expect(screen.getByText('Staging importer')).toBeInTheDocument();
  });

  it('renders the one-time reveal card', () => {
    renderApiKeys();
    expect(screen.getByText('Copy before closing')).toBeInTheDocument();
  });
});
