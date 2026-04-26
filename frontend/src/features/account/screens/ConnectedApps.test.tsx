import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConnectedApps } from './ConnectedApps';

beforeEach(() => {
  localStorage.setItem('authlyn.token', 'test-token');
});

afterEach(() => {
  localStorage.clear();
});

function renderConnectedApps() {
  return render(
    <MemoryRouter>
      <ConnectedApps />
    </MemoryRouter>
  );
}

describe('ConnectedApps', () => {
  it('renders the section heading', () => {
    renderConnectedApps();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the CONNECTED APPS eyebrow', () => {
    renderConnectedApps();
    expect(screen.getByText('CONNECTED APPS')).toBeInTheDocument();
  });

  it('renders the apps table', () => {
    renderConnectedApps();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders all app names', () => {
    renderConnectedApps();
    expect(screen.getByText('Figma')).toBeInTheDocument();
    expect(screen.getByText('Raycast')).toBeInTheDocument();
    expect(screen.getByText('Linear CLI')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
  });
});
