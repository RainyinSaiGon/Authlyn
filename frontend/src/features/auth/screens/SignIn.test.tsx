import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignIn } from './SignIn';

function renderSignIn() {
  return render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>
  );
}

describe('SignIn', () => {
  it('renders the Sign in heading', () => {
    renderSignIn();
    expect(screen.getByRole('heading', { level: 1, name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the email input', () => {
    renderSignIn();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders the password input', () => {
    renderSignIn();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the Sign in button', () => {
    renderSignIn();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
  });

  it('renders the OR CONTINUE WITH divider', () => {
    renderSignIn();
    expect(screen.getByText(/or continue with/i)).toBeInTheDocument();
  });

  it('renders Passkey, Google, and GitHub SSO buttons', () => {
    renderSignIn();
    expect(screen.getByRole('button', { name: /passkey/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
  });

  it('renders the Forgot password link', () => {
    renderSignIn();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
  });

  it('renders the Create one link', () => {
    renderSignIn();
    expect(screen.getByRole('link', { name: /create one/i })).toBeInTheDocument();
  });
});
