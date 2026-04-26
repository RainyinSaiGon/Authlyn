import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserDetail } from './UserDetail';

function renderIt() {
  return render(<MemoryRouter><UserDetail /></MemoryRouter>);
}

test('renders user name', () => {
  renderIt();
  expect(screen.getAllByText('Maya Tran').length).toBeGreaterThanOrEqual(1);
});

test('renders identity fields', () => {
  renderIt();
  expect(screen.getByText('USER ID')).toBeInTheDocument();
  expect(screen.getByText('TENANT')).toBeInTheDocument();
  expect(screen.getByText('MFA')).toBeInTheDocument();
});

test('renders tab navigation', () => {
  renderIt();
  expect(screen.getAllByText('Overview').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Sessions').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Roles').length).toBeGreaterThanOrEqual(1);
});

test('renders action buttons', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /Email/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Suspend/i })).toBeInTheDocument();
});

test('renders JWT section', () => {
  renderIt();
  expect(screen.getByText('Latest JWT')).toBeInTheDocument();
});
