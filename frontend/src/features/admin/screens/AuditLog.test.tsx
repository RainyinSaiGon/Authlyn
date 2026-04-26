import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuditLog } from './AuditLog';

function renderIt() {
  return render(<MemoryRouter><AuditLog /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Audit Log').length).toBeGreaterThanOrEqual(1);
});

test('renders search input', () => {
  renderIt();
  expect(screen.getByPlaceholderText(/Filter events/i)).toBeInTheDocument();
});

test('renders event type column', () => {
  renderIt();
  expect(screen.getByText('user.suspended')).toBeInTheDocument();
  expect(screen.getByText('passkey.registered')).toBeInTheDocument();
});

test('renders event count', () => {
  renderIt();
  expect(screen.getByText(/8,441 events/)).toBeInTheDocument();
});

test('renders export button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
});
