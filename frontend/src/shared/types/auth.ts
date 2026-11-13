export type LoginResponse = {
  userId: string;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export type SocialProvider = "google" | "github";
