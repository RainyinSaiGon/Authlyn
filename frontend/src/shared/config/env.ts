const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiBaseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, "") : "";
