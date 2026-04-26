import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUp } from './SignUp';

function renderSignUp() {
  return render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );
}

describe('SignUp', () => {
  it('renders the Sign up heading', () => {
    renderSignUp();
    expect(screen.getByRole('heading', { level: 1, name: /sign up/i })).toBeInTheDocument();
  });

  it('renders the Display name input', () => {
    renderSignUp();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
  });

  it('renders the Email input', () => {
    renderSignUp();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders the Password input', () => {
    renderSignUp();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the Create account button', () => {
    renderSignUp();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders the Sign up with a passkey button', () => {
    renderSignUp();
    expect(screen.getByRole('button', { name: /sign up with a passkey/i })).toBeInTheDocument();
  });

  it('renders the Terms and Privacy links', () => {
    renderSignUp();
    expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument();
  });

  it('renders the Sign in link', () => {
    renderSignUp();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });
});
