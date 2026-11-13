import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ResetPassword } from './ResetPassword';
import { server } from '@/test/msw/server';
import { ACCESS_TOKEN_KEY } from '@/features/auth/session';

function ShowSearch() {
  return <p data-testid="search">{useLocation().search}</p>;
}

function renderResetPassword(url = '/auth/reset-password?token=reset-abc') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/auth/reset-password" element={<><ResetPassword /><ShowSearch /></>} />
      </Routes>
    </MemoryRouter>
  );
}

async function submit(newPassword: string, confirm = newPassword) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('New password'), newPassword);
  await user.type(screen.getByLabelText('Confirm password'), confirm);
  await user.click(screen.getByRole('button', { name: /update password/i }));
}

describe('ResetPassword', () => {
  it('renders the form and removes the token from the address bar', async () => {
    renderResetPassword();
    expect(screen.getByRole('heading', { level: 1, name: /choose a new password/i })).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
    expect(await screen.findByTestId('search')).toHaveTextContent(/^$/);
  });

  it('updates the password, clears the local session and confirms', async () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'old-access');
    let body: unknown;
    server.use(
      http.post('*/api/public/auth/password-reset/confirm', async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    renderResetPassword();

    await submit('N3w-password!');

    expect(await screen.findByRole('heading', { level: 1, name: /password updated/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/signed out on all your devices/i);
    expect(body).toEqual({ resetToken: 'reset-abc', newPassword: 'N3w-password!' });
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
  });

  it('requires the two passwords to match', async () => {
    renderResetPassword();
    await submit('N3w-password!', 'N3w-password?');
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('shows the invalid-link page when the token is rejected', async () => {
    server.use(http.post('*/api/public/auth/password-reset/confirm', () => new HttpResponse(null, { status: 401 })));
    renderResetPassword();

    await submit('N3w-password!');

    expect(await screen.findByRole('heading', { level: 1, name: /this link isn't valid/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /request a new link/i })).toHaveAttribute('href', '/auth/forgot-password');
  });

  it('shows the invalid-link page when there is no token', () => {
    renderResetPassword('/auth/reset-password');
    expect(screen.getByRole('heading', { level: 1, name: /this link isn't valid/i })).toBeInTheDocument();
  });
});
