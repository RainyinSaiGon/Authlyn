import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PasskeyEnroll } from './PasskeyEnroll';

function renderPasskeyEnroll() {
  return render(
    <MemoryRouter>
      <PasskeyEnroll />
    </MemoryRouter>
  );
}

describe('PasskeyEnroll', () => {
  it('renders the Register a passkey heading', () => {
    renderPasskeyEnroll();
    expect(screen.getByRole('heading', { level: 1, name: /register a passkey/i })).toBeInTheDocument();
  });

  it('renders the Touch ID feature prompt', () => {
    renderPasskeyEnroll();
    expect(screen.getByText(/touch id/i)).toBeInTheDocument();
  });

  it('renders all three feature bullet points', () => {
    renderPasskeyEnroll();
    expect(screen.getByText(/private to this device/i)).toBeInTheDocument();
    expect(screen.getByText(/phishing-resistant/i)).toBeInTheDocument();
    expect(screen.getByText(/works offline/i)).toBeInTheDocument();
  });

  it('renders the Continue button', () => {
    renderPasskeyEnroll();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('renders the Skip for now link', () => {
    renderPasskeyEnroll();
    expect(screen.getByText(/skip for now/i)).toBeInTheDocument();
  });
});
