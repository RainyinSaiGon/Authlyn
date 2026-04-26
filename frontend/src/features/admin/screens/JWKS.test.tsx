import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { JWKS } from './JWKS';

function renderIt() {
  return render(<MemoryRouter><JWKS /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('JWKS').length).toBeGreaterThanOrEqual(1);
});

test('renders key cards', () => {
  renderIt();
  expect(screen.getAllByText('authlyn-01').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('authlyn-00')).toBeInTheDocument();
});

test('renders key status pills', () => {
  renderIt();
  expect(screen.getByText('Active')).toBeInTheDocument();
  expect(screen.getByText('Retired')).toBeInTheDocument();
});

test('renders JWKS endpoint path', () => {
  renderIt();
  expect(screen.getByText('/.well-known/jwks.json')).toBeInTheDocument();
});

test('renders rotate key button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /Rotate key/i })).toBeInTheDocument();
});
