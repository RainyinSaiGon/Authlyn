import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';

test('renders 404 code', () => {
  render(<MemoryRouter><NotFound /></MemoryRouter>);
  expect(screen.getByText('404')).toBeInTheDocument();
});

test('renders heading', () => {
  render(<MemoryRouter><NotFound /></MemoryRouter>);
  expect(screen.getByText('Page not found')).toBeInTheDocument();
});

test('renders go home link', () => {
  render(<MemoryRouter><NotFound /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Go home/i })).toBeInTheDocument();
});
