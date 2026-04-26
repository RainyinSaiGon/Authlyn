import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SSORedirect } from './SSORedirect';

function renderSSORedirect() {
  return render(
    <MemoryRouter>
      <SSORedirect />
    </MemoryRouter>
  );
}

describe('SSORedirect', () => {
  it('renders the Signing you in heading', () => {
    renderSSORedirect();
    expect(screen.getByRole('heading', { level: 1, name: /signing you in/i })).toBeInTheDocument();
  });

  it('renders the organisation name', () => {
    renderSSORedirect();
    expect(screen.getByText('Pagoda Inc.')).toBeInTheDocument();
  });

  it('renders the tenant and protocol label', () => {
    renderSSORedirect();
    expect(screen.getByText(/pagoda-prod/i)).toBeInTheDocument();
    expect(screen.getByText(/saml 2\.0/i)).toBeInTheDocument();
  });

  it('renders the redirect URL', () => {
    renderSSORedirect();
    expect(screen.getByText(/idp\.pagoda\.dev/i)).toBeInTheDocument();
  });

  it('renders the Use a different account link', () => {
    renderSSORedirect();
    expect(screen.getByRole('link', { name: /use a different account/i })).toBeInTheDocument();
  });
});
