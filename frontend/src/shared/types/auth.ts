/** `POST /api/public/auth/login` and `POST /api/public/auth/oauth/exchange` (api-endpoints.md §2.2, §3.3). */
export type LoginResponse = {
  userId: string;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

/** `POST /api/public/auth/signup` (§2.1). */
export type SignupResponse = {
  userId: string;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
};

/** `POST /api/public/auth/refresh` (§2.3). */
export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
};

/** `GET /api/me` (§2.4). */
export type CurrentUser = {
  userId: string;
  email: string;
  emailVerified: boolean;
  displayName: string | null;
  createdAt: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  displayName?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type PasswordResetConfirmRequest = {
  resetToken: string;
  newPassword: string;
};

/** What the client keeps after any successful sign-in. */
export type StoredSession = {
  userId: string;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
};

export type SocialProvider = "google" | "github";
