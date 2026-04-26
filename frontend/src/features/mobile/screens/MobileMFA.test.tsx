import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MobileMFA } from './MobileMFA';

test('renders heading', () => {
  render(<MemoryRouter><MobileMFA /></MemoryRouter>);
  expect(screen.getByText('Two-factor auth')).toBeInTheDocument();
});

test('renders verify button', () => {
  render(<MemoryRouter><MobileMFA /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
});

test('renders backup code link', () => {
  render(<MemoryRouter><MobileMFA /></MemoryRouter>);
  expect(screen.getByText(/Use a backup code/i)).toBeInTheDocument();
});

test('renders code input cells', () => {
  render(<MemoryRouter><MobileMFA /></MemoryRouter>);
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();
});
