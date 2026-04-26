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

test('renders step indicators', () => {
  renderIt();
  expect(screen.getByText('Create tenant')).toBeInTheDocument();
  expect(screen.getByText('Invite team')).toBeInTheDocument();
  expect(screen.getByText('Set up app')).toBeInTheDocument();
});

test('renders workspace name field', () => {
  renderIt();
  expect(screen.getByLabelText('Workspace name')).toBeInTheDocument();
});

test('advances to next step on continue', () => {
  renderIt();
  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
  expect(screen.getByText('Invite your team')).toBeInTheDocument();
});

test('back button is disabled on first step', () => {
  renderIt();
  expect(screen.getByRole('button', { name: /Back/i })).toBeDisabled();
});
