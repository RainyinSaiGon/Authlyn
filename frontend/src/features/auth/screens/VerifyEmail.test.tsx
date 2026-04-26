import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VerifyEmail } from './VerifyEmail';

function renderVerifyEmail() {
  return render(
    <MemoryRouter>
      <VerifyEmail />
    </MemoryRouter>
  );
}

describe('VerifyEmail', () => {
  it('renders the Check your inbox heading', () => {
    renderVerifyEmail();
    expect(screen.getByRole('heading', { level: 1, name: /check your inbox/i })).toBeInTheDocument();
  });

  it('renders the email address', () => {
    renderVerifyEmail();
    expect(screen.getByText('maya@pagoda.dev')).toBeInTheDocument();
  });

  it('renders the link expiry notice', () => {
    renderVerifyEmail();
    expect(screen.getByText(/link expires in 30 minutes/i)).toBeInTheDocument();
  });

  it('renders the Resend button', () => {
    renderVerifyEmail();
    expect(screen.getByRole('button', { name: /resend/i })).toBeInTheDocument();
  });

  it('renders the Change email button', () => {
    renderVerifyEmail();
    expect(screen.getByRole('button', { name: /change email/i })).toBeInTheDocument();
  });
});
