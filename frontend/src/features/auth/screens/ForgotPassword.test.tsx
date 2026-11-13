import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { ForgotPassword } from './ForgotPassword';
import { server } from '@/test/msw/server';

function renderForgotPassword() {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );
}

describe('ForgotPassword', () => {
  it('renders the form', () => {
    renderForgotPassword();
    expect(screen.getByRole('heading', { level: 1, name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/expires in 60 minutes/i)).toBeInTheDocument();
  });

  it('sends the request and shows the same confirmation whether or not the account exists', async () => {
    let body: unknown;
    server.use(
      http.post('*/api/public/auth/password-reset/request', async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    const user = userEvent.setup();
    renderForgotPassword();

    await user.type(screen.getByLabelText(/email/i), '  maya@pagoda.dev ');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(await screen.findByRole('heading', { level: 1, name: /check your email/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/if an account exists for maya@pagoda\.dev/i);
    expect(body).toEqual({ email: 'maya@pagoda.dev' });
  });

  it('shows an error when the request fails', async () => {
    server.use(http.post('*/api/public/auth/password-reset/request', () => new HttpResponse(null, { status: 500 })));
    const user = userEvent.setup();
    renderForgotPassword();

    await user.type(screen.getByLabelText(/email/i), 'maya@pagoda.dev');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
  });
});
