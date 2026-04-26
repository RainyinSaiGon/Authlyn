import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MFAChallenge } from './MFAChallenge';

function renderMFAChallenge() {
  return render(
    <MemoryRouter>
      <MFAChallenge />
    </MemoryRouter>
  );
}

describe('MFAChallenge', () => {
  it('renders the Enter your code heading', () => {
    renderMFAChallenge();
    expect(screen.getByRole('heading', { level: 1, name: /enter your code/i })).toBeInTheDocument();
  });

  it('renders all six OTP digits', () => {
    renderMFAChallenge();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders the Verify button', () => {
    renderMFAChallenge();
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument();
  });

  it('renders the backup code link', () => {
    renderMFAChallenge();
    expect(screen.getByRole('link', { name: /use a backup code/i })).toBeInTheDocument();
  });

  it('renders the rotation countdown', () => {
    renderMFAChallenge();
    expect(screen.getByText(/rotates in/i)).toBeInTheDocument();
  });
});
