import { http, HttpResponse } from 'msw';
import type { CurrentUser, LoginResponse, RefreshResponse, SignupResponse } from '@/shared/types/auth';

/** Fake backend for tests: happy paths for every Phase 1 identity endpoint. Override per test with `server.use`. */

export const testUser: CurrentUser = {
  userId: 'user-1',
  email: 'maya.tran@pagoda.dev',
  emailVerified: true,
  displayName: 'Maya Tran',
  createdAt: '2024-03-12T00:00:00Z',
};

export const loginResponse: LoginResponse = {
  userId: testUser.userId,
  sessionId: 'session-1',
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  expiresAt: '2026-11-14T00:15:00Z',
};

export const signupResponse: SignupResponse = {
  userId: testUser.userId,
  sessionId: 'session-1',
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  createdAt: '2026-11-14T00:00:00Z',
};

export const refreshResponse: RefreshResponse = {
  accessToken: 'access-2',
  refreshToken: 'refresh-2',
  accessTokenExpiresAt: '2026-11-14T00:30:00Z',
};

export const handlers = [
  http.post('*/api/public/auth/login', () => HttpResponse.json(loginResponse)),
  http.post('*/api/public/auth/signup', () => HttpResponse.json(signupResponse, { status: 201 })),
  http.post('*/api/public/auth/refresh', () => HttpResponse.json(refreshResponse)),
  http.post('*/api/public/auth/password-reset/request', () => new HttpResponse(null, { status: 204 })),
  http.post('*/api/public/auth/password-reset/confirm', () => new HttpResponse(null, { status: 204 })),
  http.post('*/api/public/auth/oauth/exchange', () => HttpResponse.json(loginResponse)),
  http.get('*/api/me', () => HttpResponse.json(testUser)),
  http.post('*/api/auth/logout', () => new HttpResponse(null, { status: 204 })),
  http.post('*/api/auth/logout-all', () => new HttpResponse(null, { status: 204 })),
];
