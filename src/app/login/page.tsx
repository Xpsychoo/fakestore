import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

/** Only same-site paths are allowed, so the redirect can't send people to another site. */
const safeNext = (value: unknown) => (typeof value === "string" && /^\/(?![/\\])/.test(value) ? value : "/account");

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const next = safeNext((await searchParams).next);
  return (
    <div className="page max-w-md space-y-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-muted">Check out faster with your saved address.</p>
      </div>
      <LoginForm next={next} />
    </div>
  );
}
