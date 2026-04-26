import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Settings } from './Settings';

function renderIt() {
  return render(<MemoryRouter><Settings /></MemoryRouter>);
}

test('renders page title', () => {
  renderIt();
  expect(screen.getAllByText('Settings').length).toBeGreaterThanOrEqual(1);
});

test('renders subnav sections', () => {
  renderIt();
  expect(screen.getByText('General')).toBeInTheDocument();
  expect(screen.getByText('Domains')).toBeInTheDocument();
  expect(screen.getByText('SSO')).toBeInTheDocument();
});

test('shows general section by default', () => {
  renderIt();
  expect(screen.getByText('TENANT NAME')).toBeInTheDocument();
  expect(screen.getByText('TENANT SLUG')).toBeInTheDocument();
});

test('switches to Domains section on click', () => {
  renderIt();
  fireEvent.click(screen.getByText('Domains'));
  expect(screen.getByText('Custom domains')).toBeInTheDocument();
  expect(screen.getByText('pagoda.dev')).toBeInTheDocument();
});

test('switches to SSO section on click', () => {
  renderIt();
  fireEvent.click(screen.getByText('SSO'));
  expect(screen.getByText('SSO providers')).toBeInTheDocument();
  expect(screen.getByText('Google Workspace')).toBeInTheDocument();
});
