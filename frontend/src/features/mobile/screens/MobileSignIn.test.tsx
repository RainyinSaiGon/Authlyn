import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MobileSignIn } from './MobileSignIn';

test('renders welcome heading', () => {
  render(<MemoryRouter><MobileSignIn /></MemoryRouter>);
  expect(screen.getByText('Welcome back')).toBeInTheDocument();
});

test('renders email and password fields', () => {
  render(<MemoryRouter><MobileSignIn /></MemoryRouter>);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});

test('renders sign in button', () => {
  render(<MemoryRouter><MobileSignIn /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
});

test('renders passkey option', () => {
  render(<MemoryRouter><MobileSignIn /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /Continue with Passkey/i })).toBeInTheDocument();
});
