import { test as base, expect } from '@playwright/test';
import { FakeBackend } from './fakeBackend';

/** `backend` is a fresh FakeBackend per test, already installed on the test's browser context. */
export const test = base.extend<{ backend: FakeBackend }>({
  backend: async ({ context }, use) => {
    const backend = new FakeBackend();
    await backend.install(context);
    await use(backend);
    // Any API call the fake didn't expect is a gap in the test or a bug in the app.
    expect(backend.unhandled, 'requests the fake backend had no handler for').toEqual([]);
  },
});

export { expect };
