import { apiBaseUrl } from "@/shared/config/env";

/** A non-2xx response. UI code branches on `status`; the body shape is not part of the contract. */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
  }
}

/** The request failed before any response arrived (offline, DNS, CORS, aborted). */
export class NetworkError extends Error {
  constructor(cause: unknown) {
    super("Network request failed", { cause });
    this.name = "NetworkError";
  }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Bearer token to send in the Authorization header. */
  accessToken?: string;
  signal?: AbortSignal;
}

/** Resolves an API path against `VITE_API_BASE_URL`, or the page origin when it is empty. */
export function apiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = apiBaseUrl || window.location.origin;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The single fetch wrapper for the app. Returns the parsed JSON body,
 * or `undefined` for empty responses such as `204 No Content`.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, accessToken, signal } = options;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    throw new NetworkError(error);
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function getJson<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function postJson<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse> {
  return request<TResponse>(path, { method: "POST", body });
}
