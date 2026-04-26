import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Maintenance } from './Maintenance';

test('renders heading', () => {
  render(<MemoryRouter><Maintenance /></MemoryRouter>);
  expect(screen.getByText('Under maintenance')).toBeInTheDocument();
});

test('renders estimated time', () => {
  render(<MemoryRouter><Maintenance /></MemoryRouter>);
  expect(screen.getByText(/~30 min/)).toBeInTheDocument();
});

test('renders status link', () => {
  render(<MemoryRouter><Maintenance /></MemoryRouter>);
  expect(screen.getByText(/status\.authlyn\.io/)).toBeInTheDocument();
});
