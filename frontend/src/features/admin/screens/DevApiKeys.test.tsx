import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DevApiKeys } from './DevApiKeys';

function renderIt() {
  return render(<MemoryRouter><DevApiKeys /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('API Keys').length).toBeGreaterThanOrEqual(1);
});

test('renders stat cards', () => {
  renderIt();
  expect(screen.getByText('TOTAL KEYS')).toBeInTheDocument();
  expect(screen.getByText('REQUESTS · 24H')).toBeInTheDocument();
  expect(screen.getByText('ERROR RATE')).toBeInTheDocument();
});

test('renders key rows', () => {
  renderIt();
  expect(screen.getByText('Production backend')).toBeInTheDocument();
  expect(screen.getByText('CI pipeline')).toBeInTheDocument();
});

test('renders environment pills', () => {
  renderIt();
  expect(screen.getAllByText('live').length).toBeGreaterThan(0);
  expect(screen.getAllByText('test').length).toBeGreaterThan(0);
});

test('renders new API key button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /New API key/i })).toBeInTheDocument();
});
