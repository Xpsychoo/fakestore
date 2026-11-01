"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { login } from "@/lib/actions";
import { setSession } from "@/lib/store";

/** A real account from the Fake Store API's sample users. */
export const DEMO_USER = { username: "johnd", password: "m38rmF$" };

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await login(username, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSession(result.session);
      router.push(next);
    });
  };

  return (
    <form onSubmit={submit} className="card space-y-5 p-6">
      <div>
        <label htmlFor="login-username" className="label">
          Username
        </label>
        <input
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="input"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="input"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        <LogIn className="size-4" aria-hidden="true" />
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <div className="rounded-xl bg-sunken p-4 text-sm">
        <p className="font-semibold">Just looking around?</p>
        <p className="mt-1 text-muted">
          Use the demo account: <code className="font-mono text-ink">{DEMO_USER.username}</code> /{" "}
          <code className="font-mono text-ink">{DEMO_USER.password}</code>
        </p>
        <button
          type="button"
          onClick={() => {
            setUsername(DEMO_USER.username);
            setPassword(DEMO_USER.password);
          }}
          className="mt-2 font-semibold text-brand hover:underline"
        >
          Fill in demo account
        </button>
      </div>
    </form>
  );
}
