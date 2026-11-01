import type { Metadata } from "next";
import { AccountView } from "@/components/account-view";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="page space-y-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Your account</h1>
      <AccountView />
    </div>
  );
}
