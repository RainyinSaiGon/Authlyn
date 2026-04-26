import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';

function renderWithRouter(token: string | null) {
  if (token) {
    localStorage.setItem('authlyn.token', token);
  } else {
    localStorage.removeItem('authlyn.token');
  }

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <RequireAuth>
              <div>Protected content</div>
            </RequireAuth>
          }
        />
        <Route path="/auth/sign-in" element={<div>Sign in page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('RequireAuth', () => {
  it('renders children when a token is present', () => {
    renderWithRouter('valid-token');
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to /auth/sign-in when no token is present', () => {
    renderWithRouter(null);
    expect(screen.getByText('Sign in page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('does not render children when no token is present', () => {
    renderWithRouter(null);
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
