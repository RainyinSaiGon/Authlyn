import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Logs } from './Logs';

function renderIt() {
  return render(<MemoryRouter><Logs /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Logs').length).toBeGreaterThanOrEqual(1);
});

test('renders log level labels', () => {
  renderIt();
  expect(screen.getAllByText('INFO').length).toBeGreaterThan(0);
  expect(screen.getAllByText('WARN').length).toBeGreaterThan(0);
  expect(screen.getAllByText('ERROR').length).toBeGreaterThan(0);
});

test('renders log messages', () => {
  renderIt();
  expect(screen.getByText('Token issued')).toBeInTheDocument();
  expect(screen.getByText('Token validation failed')).toBeInTheDocument();
});

test('renders live indicator', () => {
  renderIt();
  expect(screen.getByText('Live')).toBeInTheDocument();
});

test('renders filter buttons', () => {
  renderIt();
  expect(screen.getByRole('button', { name: 'Errors' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Warnings' })).toBeInTheDocument();
});
