import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MobilePasskey } from './MobilePasskey';

test('renders heading', () => {
  render(<MemoryRouter><MobilePasskey /></MemoryRouter>);
  expect(screen.getByText('Save a passkey')).toBeInTheDocument();
});

test('renders feature list', () => {
  render(<MemoryRouter><MobilePasskey /></MemoryRouter>);
  expect(screen.getByText('Faster sign-in')).toBeInTheDocument();
  expect(screen.getByText('Phishing-resistant')).toBeInTheDocument();
  expect(screen.getByText('No password to forget')).toBeInTheDocument();
});

test('renders create passkey button', () => {
  render(<MemoryRouter><MobilePasskey /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /Create passkey/i })).toBeInTheDocument();
});

test('renders skip option', () => {
  render(<MemoryRouter><MobilePasskey /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /Skip for now/i })).toBeInTheDocument();
});
