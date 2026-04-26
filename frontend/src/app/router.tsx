import { createBrowserRouter } from 'react-router-dom';

import { SignIn }          from '@/features/auth/screens/SignIn';
import { SignUp }          from '@/features/auth/screens/SignUp';
import { ForgotPassword }  from '@/features/auth/screens/ForgotPassword';
import { ResetPassword }   from '@/features/auth/screens/ResetPassword';
import { VerifyEmail }     from '@/features/auth/screens/VerifyEmail';
import { MFAChallenge }    from '@/features/auth/screens/MFAChallenge';
import { PasskeyEnroll }   from '@/features/auth/screens/PasskeyEnroll';
import { SSORedirect }     from '@/features/auth/screens/SSORedirect';

import { Landing }  from '@/features/marketing/screens/Landing';
import { Pricing }  from '@/features/marketing/screens/Pricing';
import { Docs }     from '@/features/marketing/screens/Docs';

import { Profile }       from '@/features/account/screens/Profile';
import { Security }      from '@/features/account/screens/Security';
import { Sessions }      from '@/features/account/screens/Sessions';
import { ConnectedApps } from '@/features/account/screens/ConnectedApps';
import { ApiKeys }       from '@/features/account/screens/ApiKeys';

import { RequireAuth } from '@/components/auth/RequireAuth';

export const router = createBrowserRouter([
  // Marketing
  { path: '/',        element: <Landing /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/docs',    element: <Docs /> },

  // Auth flows
  { path: '/auth/sign-in',         element: <SignIn /> },
  { path: '/auth/sign-up',         element: <SignUp /> },
  { path: '/auth/forgot-password', element: <ForgotPassword /> },
  { path: '/auth/reset-password',  element: <ResetPassword /> },
  { path: '/auth/verify-email',    element: <VerifyEmail /> },
  { path: '/auth/mfa',             element: <MFAChallenge /> },
  { path: '/auth/passkey-enroll',  element: <PasskeyEnroll /> },
  { path: '/auth/sso',             element: <SSORedirect /> },

  // Account (gated)
  { path: '/account/profile',  element: <RequireAuth><Profile /></RequireAuth> },
  { path: '/account/security', element: <RequireAuth><Security /></RequireAuth> },
  { path: '/account/sessions', element: <RequireAuth><Sessions /></RequireAuth> },
  { path: '/account/apps',     element: <RequireAuth><ConnectedApps /></RequireAuth> },
  { path: '/account/keys',     element: <RequireAuth><ApiKeys /></RequireAuth> },

  // Admin console (placeholders)
  { path: '/admin',           element: <div>AdminOverview</div> },
  { path: '/admin/users',     element: <div>Users</div> },
  { path: '/admin/users/:id', element: <div>UserDetail</div> },
  { path: '/admin/roles',     element: <div>Roles</div> },
  { path: '/admin/orgs',      element: <div>Organizations</div> },
  { path: '/admin/apps',      element: <div>Applications</div> },
  { path: '/admin/sessions',  element: <div>AdminSessions</div> },
  { path: '/admin/audit',     element: <div>AuditLog</div> },
  { path: '/admin/settings',  element: <div>Settings</div> },

  // Developer tools (placeholders)
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
