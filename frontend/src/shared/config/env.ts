function normalizeBaseUrl(raw: string | undefined): string {
  const trimmed = raw?.trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : "";
}

export const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

/**
 * Origin of the backend that runs the OAuth2 social-login redirect dance.
 * Unlike API calls, this cannot go through the Vite proxy: the browser must
 * visit the backend directly so the provider's callback lands on it.
 */
export const oauthBaseUrl =
  normalizeBaseUrl(import.meta.env.VITE_OAUTH_BASE_URL) ||
  apiBaseUrl ||
  (import.meta.env.DEV ? "http://localhost:8080" : "");
