import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Overview } from './Overview';

function renderIt() {
  return render(<MemoryRouter><Overview /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Overview').length).toBeGreaterThanOrEqual(1);
});

test('renders stat cards', () => {
  renderIt();
  expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
  expect(screen.getByText('SIGN-INS · 24H')).toBeInTheDocument();
  expect(screen.getByText('MFA COVERAGE')).toBeInTheDocument();
});

test('renders chart section', () => {
  renderIt();
  expect(screen.getByText(/Sign-ins · last/i)).toBeInTheDocument();
});

test('renders recent events feed', () => {
  renderIt();
  expect(screen.getByText('Recent events')).toBeInTheDocument();
  expect(screen.getByText(/Passkey registered/)).toBeInTheDocument();
});

test('renders period segmented control', () => {
  renderIt();
  expect(screen.getByText('14d')).toBeInTheDocument();
  expect(screen.getByText('30d')).toBeInTheDocument();
});
