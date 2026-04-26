import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Applications } from './Applications';

function renderIt() {
  return render(<MemoryRouter><Applications /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Applications').length).toBeGreaterThanOrEqual(1);
});

test('renders app rows', () => {
  renderIt();
  expect(screen.getByText('Pagoda Web')).toBeInTheDocument();
  expect(screen.getByText('Pagoda API')).toBeInTheDocument();
  expect(screen.getByText('Pagoda iOS')).toBeInTheDocument();
});

test('renders grant types', () => {
  renderIt();
  expect(screen.getAllByText(/auth_code/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/client_credentials/i).length).toBeGreaterThan(0);
});

test('renders status pills', () => {
  renderIt();
  expect(screen.getAllByText('Live').length).toBeGreaterThan(0);
});

test('renders new application button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /New application/i })).toBeInTheDocument();
});
