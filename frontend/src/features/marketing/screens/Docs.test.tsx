import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Docs } from './Docs';

function renderDocs() {
  return render(
    <MemoryRouter>
      <Docs />
    </MemoryRouter>
  );
}

describe('Docs', () => {
  it('renders the Quickstart heading', () => {
    renderDocs();
    expect(screen.getByRole('heading', { level: 1, name: /quickstart/i })).toBeInTheDocument();
  });

  it('renders the navigation landmark', () => {
    renderDocs();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all three step headings', () => {
    renderDocs();
    expect(screen.getByText(/1\. Install the SDK/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Configure your tenant/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Protect a route/i)).toBeInTheDocument();
  });

  it('renders all four doc nav groups', () => {
    renderDocs();
    expect(screen.getAllByText('Get started').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Auth')).toBeInTheDocument();
    expect(screen.getByText('Orgs & RBAC')).toBeInTheDocument();
    expect(screen.getByText('API reference')).toBeInTheDocument();
  });

  it('renders the tip card', () => {
    renderDocs();
    expect(screen.getByText('TIP')).toBeInTheDocument();
  });
});
