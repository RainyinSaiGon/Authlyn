import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Organizations } from './Organizations';

function renderIt() {
  return render(<MemoryRouter><Organizations /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Organizations').length).toBeGreaterThanOrEqual(1);
});

test('renders org cards', () => {
  renderIt();
  expect(screen.getAllByText('Pagoda').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('Lumen Labs')).toBeInTheDocument();
  expect(screen.getByText('Orbitloom')).toBeInTheDocument();
});

test('renders org slugs', () => {
  renderIt();
  expect(screen.getByText('pagoda-prod')).toBeInTheDocument();
  expect(screen.getByText('lumen-labs')).toBeInTheDocument();
});

test('renders manage buttons', () => {
  renderIt();
  expect(screen.getAllByRole('button', { name: /Manage/i }).length).toBeGreaterThan(0);
});

test('renders new org button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /New org/i })).toBeInTheDocument();
});
