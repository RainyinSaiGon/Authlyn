import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  // Marketing
  { path: '/',        element: <div>Landing</div> },
  { path: '/pricing', element: <div>Pricing</div> },
  { path: '/docs',    element: <div>Docs</div> },

  // Auth flows
  { path: '/auth/sign-in',        element: <div>SignIn</div> },
  { path: '/auth/sign-up',        element: <div>SignUp</div> },
  { path: '/auth/forgot-password', element: <div>ForgotPassword</div> },
  { path: '/auth/reset-password', element: <div>ResetPassword</div> },
  { path: '/auth/verify-email',   element: <div>VerifyEmail</div> },
  { path: '/auth/mfa',            element: <div>MFAChallenge</div> },
  { path: '/auth/passkey-enroll', element: <div>PasskeyEnroll</div> },
  { path: '/auth/sso',            element: <div>SSORedirect</div> },

  // Account
  { path: '/account/profile',  element: <div>Profile</div> },
  { path: '/account/security', element: <div>Security</div> },
  { path: '/account/sessions', element: <div>Sessions</div> },
  { path: '/account/apps',     element: <div>ConnectedApps</div> },
  { path: '/account/keys',     element: <div>ApiKeys</div> },

  // Admin console
  { path: '/admin',           element: <div>AdminOverview</div> },
  { path: '/admin/users',     element: <div>Users</div> },
  { path: '/admin/users/:id', element: <div>UserDetail</div> },
  { path: '/admin/roles',     element: <div>Roles</div> },
  { path: '/admin/orgs',      element: <div>Organizations</div> },
  { path: '/admin/apps',      element: <div>Applications</div> },
  { path: '/admin/sessions',  element: <div>AdminSessions</div> },
  { path: '/admin/audit',     element: <div>AuditLog</div> },
  { path: '/admin/settings',  element: <div>Settings</div> },

  // Developer tools
  { path: '/admin/keys',     element: <div>ApiKeys (Developer)</div> },
  { path: '/admin/webhooks', element: <div>Webhooks</div> },
  { path: '/admin/jwks',     element: <div>Jwks</div> },
  { path: '/admin/logs',     element: <div>Logs</div> },

  // Other
  { path: '/onboarding',  element: <div>Onboarding</div> },
  { path: '/maintenance', element: <div>Maintenance</div> },

  // 404
  { path: '*', element: <div>NotFound</div> },
]);
