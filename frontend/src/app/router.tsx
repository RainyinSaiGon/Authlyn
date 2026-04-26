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

import { Overview }        from '@/features/admin/screens/Overview';
import { Users }           from '@/features/admin/screens/Users';
import { UserDetail }      from '@/features/admin/screens/UserDetail';
import { Roles }           from '@/features/admin/screens/Roles';
import { Organizations }   from '@/features/admin/screens/Organizations';
import { Applications }    from '@/features/admin/screens/Applications';
import { AdminSessions }   from '@/features/admin/screens/AdminSessions';
import { AuditLog }        from '@/features/admin/screens/AuditLog';
import { Settings }        from '@/features/admin/screens/Settings';
import { DevApiKeys }      from '@/features/admin/screens/DevApiKeys';
import { Webhooks }        from '@/features/admin/screens/Webhooks';
import { JWKS }            from '@/features/admin/screens/JWKS';
import { Logs }            from '@/features/admin/screens/Logs';

import { NotFound }    from '@/features/errors/screens/NotFound';
import { ServerError } from '@/features/errors/screens/ServerError';
import { Maintenance } from '@/features/errors/screens/Maintenance';

import { Onboarding } from '@/features/onboarding/screens/Onboarding';

import { MobileSignIn } from '@/features/mobile/screens/MobileSignIn';
import { MobileMFA }    from '@/features/mobile/screens/MobileMFA';
import { MobilePasskey } from '@/features/mobile/screens/MobilePasskey';

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

  // Admin console
  { path: '/admin',           element: <Overview /> },
  { path: '/admin/users',     element: <Users /> },
  { path: '/admin/users/:id', element: <UserDetail /> },
  { path: '/admin/roles',     element: <Roles /> },
  { path: '/admin/orgs',      element: <Organizations /> },
  { path: '/admin/apps',      element: <Applications /> },
  { path: '/admin/sessions',  element: <AdminSessions /> },
  { path: '/admin/audit',     element: <AuditLog /> },
  { path: '/admin/settings',  element: <Settings /> },

  // Developer tools
  { path: '/admin/keys',     element: <DevApiKeys /> },
  { path: '/admin/webhooks', element: <Webhooks /> },
  { path: '/admin/jwks',     element: <JWKS /> },
  { path: '/admin/logs',     element: <Logs /> },

  // Onboarding
  { path: '/onboarding', element: <Onboarding /> },

  // Mobile previews
  { path: '/mobile/sign-in', element: <MobileSignIn /> },
  { path: '/mobile/mfa',     element: <MobileMFA /> },
  { path: '/mobile/passkey', element: <MobilePasskey /> },

  // Error pages
  { path: '/500',         element: <ServerError /> },
  { path: '/maintenance', element: <Maintenance /> },

  // 404
  { path: '*', element: <NotFound /> },
]);
