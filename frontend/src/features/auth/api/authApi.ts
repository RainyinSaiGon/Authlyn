import { request } from "@/shared/api/http";
import type {
  LoginRequest,
  LoginResponse,
  PasswordResetConfirmRequest,
  RefreshResponse,
  SignupRequest,
  SignupResponse,
} from "@/shared/types/auth";

/**
 * Typed client for the public Phase 1 identity endpoints (docs/architecture/api-endpoints.md §2).
 * Bearer-authenticated calls live in `accountApi.ts` and go through `authorizedRequest`.
 */
export const authApi = {
  signup: (body: SignupRequest) =>
    request<SignupResponse>("/api/public/auth/signup", { method: "POST", body }),

  login: (body: LoginRequest) =>
    request<LoginResponse>("/api/public/auth/login", { method: "POST", body }),

  refresh: (refreshToken: string) =>
    request<RefreshResponse>("/api/public/auth/refresh", { method: "POST", body: { refreshToken } }),

  requestPasswordReset: (email: string) =>
    request<void>("/api/public/auth/password-reset/request", { method: "POST", body: { email } }),

  confirmPasswordReset: (body: PasswordResetConfirmRequest) =>
    request<void>("/api/public/auth/password-reset/confirm", { method: "POST", body }),
};
