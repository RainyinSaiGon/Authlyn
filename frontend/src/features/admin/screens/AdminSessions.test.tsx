import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdminSessions } from './AdminSessions';

function renderIt() {
  return render(<MemoryRouter><AdminSessions /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Sessions').length).toBeGreaterThanOrEqual(1);
});

test('renders stat cards', () => {
  renderIt();
  expect(screen.getByText('ACTIVE NOW')).toBeInTheDocument();
  expect(screen.getByText('ANOMALIES FLAGGED')).toBeInTheDocument();
  expect(screen.getByText('AVG DURATION')).toBeInTheDocument();
});

test('renders session rows', () => {
  renderIt();
  expect(screen.getAllByText('Maya Tran').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Jon Park').length).toBeGreaterThanOrEqual(1);
});

test('renders anomaly status pill', () => {
  renderIt();
  expect(screen.getByText('Anomaly')).toBeInTheDocument();
});

test('renders active status pills', () => {
  renderIt();
  expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
});
