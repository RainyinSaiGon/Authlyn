import { postJson } from "@/shared/api/http";
import { apiBaseUrl, oauthBaseUrl } from "@/shared/config/env";
import type { LoginResponse, SocialProvider } from "@/shared/types/auth";

/** Full-page URL that starts the provider's OAuth2 login on the backend. */
export function socialLoginUrl(provider: SocialProvider): string {
  return `${oauthBaseUrl}/oauth2/authorization/${provider}`;
}

/** Trades the one-time `?code=` from the OAuth callback redirect for tokens. */
export function exchangeOAuthCode(code: string): Promise<LoginResponse> {
  return postJson<LoginResponse, { code: string }>(
    `${apiBaseUrl}/api/public/auth/oauth/exchange`,
    { code },
  );
}
