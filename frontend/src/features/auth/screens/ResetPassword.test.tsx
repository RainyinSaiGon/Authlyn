import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ResetPassword } from './ResetPassword';

function renderResetPassword() {
  return render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>
  );
}

describe('ResetPassword', () => {
  it('renders the Choose a new password heading', () => {
    renderResetPassword();
    expect(screen.getByRole('heading', { level: 1, name: /choose a new password/i })).toBeInTheDocument();
  });

  it('renders the New password input', () => {
    renderResetPassword();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  it('renders the Confirm password input', () => {
    renderResetPassword();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('renders the Update password button', () => {
    renderResetPassword();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });
});
