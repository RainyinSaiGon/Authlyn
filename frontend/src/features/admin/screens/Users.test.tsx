import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Users } from './Users';

function renderIt() {
  return render(<MemoryRouter><Users /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Users').length).toBeGreaterThanOrEqual(1);
});

test('renders search input', () => {
  renderIt();
  expect(screen.getByPlaceholderText(/Search by name/)).toBeInTheDocument();
});

test('renders user rows', () => {
  renderIt();
  expect(screen.getAllByText('Maya Tran').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Ravi Shah').length).toBeGreaterThanOrEqual(1);
});

test('renders MFA column', () => {
  renderIt();
  expect(screen.getAllByText('Passkey').length).toBeGreaterThan(0);
});

test('renders status pills for anomalies', () => {
  renderIt();
  expect(screen.getByText('Suspended')).toBeInTheDocument();
  expect(screen.getByText('No MFA')).toBeInTheDocument();
});

test('renders invite user button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /Invite user/i })).toBeInTheDocument();
});
