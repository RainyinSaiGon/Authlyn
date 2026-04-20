import { startTransition, useEffect, useState } from "react";
import { getPublicMeta } from "@/features/overview/api/getPublicMeta";
import { StatusPill } from "@/features/overview/components/StatusPill";
import type { PublicMeta } from "@/shared/types/system";

type LoadState =
  | { status: "loading" }
  | { status: "success"; data: PublicMeta }
  | { status: "error"; message: string };

const principles = [
  "Domain-first backend modules",
  "Feature-sliced React frontend",
  "Typed contracts between UI and API",
  "JWT and JWKS kept in shared security infrastructure",
];

export function App() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    void getPublicMeta()
      .then((data) => {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setState({ status: "success", data });
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to reach the Authlyn API.";
        startTransition(() => {
          setState({ status: "error", message });
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Identity infrastructure, refactored with intention</p>
        <h1>
          Authlyn is now structured as a <span>Spring + React monorepo</span>.
        </h1>
        <p className="lead">
          The backend owns identity and token infrastructure. The frontend is a dedicated React workspace built
          for product surfaces, onboarding flows, and future account management.
        </p>
        <div className="hero-actions">
          <StatusPill label="Backend" tone={state.status === "success" ? "success" : state.status === "error" ? "danger" : "neutral"}>
            {state.status === "success" ? "Connected" : state.status === "error" ? "Unavailable" : "Checking"}
          </StatusPill>
          <StatusPill label="Frontend" tone="success">
            React Ready
          </StatusPill>
        </div>
      </section>

      <section className="grid">
        <article className="panel accent-panel">
          <p className="panel-kicker">Architecture</p>
          <h2>One repo, clear boundaries.</h2>
          <p>
            Backend modules now separate product domains from shared infrastructure, while the frontend keeps app
            shell, features, and shared utilities in their own lanes.
          </p>
          <ul className="principles">
            {principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="panel-kicker">Public API Bootstrap</p>
          <h2>Frontend contract</h2>
          {state.status === "success" ? (
            <dl className="meta-list">
              <div>
                <dt>Application</dt>
                <dd>{state.data.applicationName}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{state.data.status}</dd>
              </div>
              <div>
                <dt>JWKS Path</dt>
                <dd>{state.data.jwksPath}</dd>
              </div>
              <div>
                <dt>Architecture Doc</dt>
                <dd>{state.data.architectureDocument}</dd>
              </div>
            </dl>
          ) : state.status === "error" ? (
            <p className="message error-message">{state.message}</p>
          ) : (
            <p className="message">Requesting `/api/public/meta` from the Spring backend.</p>
          )}
        </article>

        <article className="panel">
          <p className="panel-kicker">Next Build Slice</p>
          <h2>What this setup unlocks</h2>
          <p>
            We can now add sign up, sign in, and account flows without mixing transport, view logic, and security
            infrastructure in the same folders.
          </p>
          <div className="chips">
            <span>Sign up</span>
            <span>Sign in</span>
            <span>Sessions</span>
            <span>Organizations</span>
            <span>RBAC</span>
            <span>Passkeys</span>
          </div>
        </article>
      </section>
    </main>
  );
}
