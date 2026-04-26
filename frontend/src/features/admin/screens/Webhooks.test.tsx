import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Webhooks } from './Webhooks';

function renderIt() {
  return render(<MemoryRouter><Webhooks /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Webhooks').length).toBeGreaterThanOrEqual(1);
});

test('renders endpoint list', () => {
  renderIt();
  expect(screen.getAllByText(/hooks\/auth/).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/analytics\.pagoda/).length).toBeGreaterThanOrEqual(1);
});

test('renders endpoint detail panel', () => {
  renderIt();
  expect(screen.getByText('ENDPOINT')).toBeInTheDocument();
  expect(screen.getByText('EVENTS SUBSCRIBED')).toBeInTheDocument();
  expect(screen.getByText('LATEST DELIVERY')).toBeInTheDocument();
});

test('switches detail pane on endpoint click', () => {
  renderIt();
  const analyticsEndpoints = screen.getAllByText(/analytics\.pagoda/);
  fireEvent.click(analyticsEndpoints[0]);
  expect(screen.getAllByText(/session\.started/).length).toBeGreaterThanOrEqual(1);
});

test('renders new endpoint button', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /New endpoint/i })).toBeInTheDocument();
});
