import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Roles } from './Roles';

function renderIt() {
  return render(<MemoryRouter><Roles /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText(/Roles/i).length).toBeGreaterThanOrEqual(1);
});

test('renders role list', () => {
  renderIt();
  expect(screen.getAllByText('Owner').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('Admin')).toBeInTheDocument();
  expect(screen.getByText('Member')).toBeInTheDocument();
  expect(screen.getByText('Guest')).toBeInTheDocument();
});

test('renders permissions panel', () => {
  renderIt();
  expect(screen.getByText('PERMISSIONS')).toBeInTheDocument();
  expect(screen.getByText('identity:read')).toBeInTheDocument();
});

test('renders members section', () => {
  renderIt();
  expect(screen.getByText('MEMBERS')).toBeInTheDocument();
});

test('renders edit button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
});
