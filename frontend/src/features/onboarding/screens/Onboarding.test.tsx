import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Onboarding } from './Onboarding';

function renderIt() {
  return render(<MemoryRouter><Onboarding /></MemoryRouter>);
}

test('renders first step title', () => {
  renderIt();
  expect(screen.getByText('Create your tenant')).toBeInTheDocument();
});

test('renders all 5 step indicators', () => {
  renderIt();
  expect(screen.getByText('Tenant')).toBeInTheDocument();
  expect(screen.getByText('Branding')).toBeInTheDocument();
  expect(screen.getByText('First app')).toBeInTheDocument();
  expect(screen.getByText('Integrate')).toBeInTheDocument();
  expect(screen.getByText('Invite')).toBeInTheDocument();
});

test('renders workspace name field on step 1', () => {
  renderIt();
  expect(screen.getByLabelText('Workspace name')).toBeInTheDocument();
});

test('advances through steps on continue', () => {
  renderIt();
  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
  expect(screen.getByText('Brand your workspace')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
  expect(screen.getByText('Register your first app')).toBeInTheDocument();
});

test('step 3 shows app fields and generated client ID', () => {
  renderIt();
  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
  expect(screen.getByLabelText('Redirect URI')).toBeInTheDocument();
  expect(screen.getByLabelText('Post-signout URL')).toBeInTheDocument();
  expect(screen.getByText('CLIENT ID')).toBeInTheDocument();
});

test('back button is disabled on first step', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /Back/i })).toBeDisabled();
});

test('last step shows finish setup button', () => {
  renderIt();
  for (let i = 0; i < 4; i++) {
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
  }
  expect(screen.getByRole('button', { name: /Finish setup/i })).toBeInTheDocument();
});
