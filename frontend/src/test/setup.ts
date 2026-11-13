import "@testing-library/jest-dom";
import { server } from "./msw/server";

// Any request without a handler fails the test, so no test silently hits a real network.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());
