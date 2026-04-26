import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAdmin } from './RequireAdmin';

function makeToken(roles: string[]): string {
  const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'usr_01', roles }));
  return `${header}.${payload}.fakesig`;
}

function renderWithRouter(token: string | null) {
  if (token) {
    localStorage.setItem('authlyn.token', token);
  } else {
    localStorage.removeItem('authlyn.token');
  }

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <div>Admin content</div>
            </RequireAdmin>
          }
        />
        <Route path="/" element={<div>Home page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('RequireAdmin', () => {
  it('renders children when token contains admin role', () => {
    renderWithRouter(makeToken(['admin']));
    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });

  it('redirects to / when token has no admin role', () => {
    renderWithRouter(makeToken(['member']));
    expect(screen.getByText('Home page')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('redirects to / when no token is present', () => {
    renderWithRouter(null);
    expect(screen.getByText('Home page')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('redirects to / when token is malformed', () => {
    localStorage.setItem('authlyn.token', 'not-a-jwt');
    renderWithRouter('not-a-jwt');
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});
