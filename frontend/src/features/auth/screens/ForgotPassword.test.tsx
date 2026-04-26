import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ForgotPassword } from './ForgotPassword';

function renderForgotPassword() {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );
}

describe('ForgotPassword', () => {
  it('renders the Reset your password heading', () => {
    renderForgotPassword();
    expect(screen.getByRole('heading', { level: 1, name: /reset your password/i })).toBeInTheDocument();
  });

  it('renders the Email input', () => {
    renderForgotPassword();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders the Send reset link button', () => {
    renderForgotPassword();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('renders the Back to sign in link', () => {
    renderForgotPassword();
    expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument();
  });

  it('renders the expiry description', () => {
    renderForgotPassword();
    expect(screen.getByText(/expires in 30 minutes/i)).toBeInTheDocument();
  });
});
