import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ServerError } from './ServerError';

test('renders 500 code', () => {
  render(<MemoryRouter><ServerError /></MemoryRouter>);
  expect(screen.getByText('500')).toBeInTheDocument();
});

test('renders heading', () => {
  render(<MemoryRouter><ServerError /></MemoryRouter>);
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});

test('renders action buttons', () => {
  render(<MemoryRouter><ServerError /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /Refresh page/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument();
});
