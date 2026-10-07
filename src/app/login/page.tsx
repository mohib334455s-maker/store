"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(form.get("username") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });
    const payload = (await response.json()) as { ok: boolean; message?: string };
    setPending(false);
    if (!payload.ok) {
      setError(payload.message ?? "Login failed.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(28,25,23,0.08)]">
        <Logo />
        <h1 className="font-serif text-3xl">Store dashboard</h1>
        <p className="text-sm text-muted">Sign in to import CSV data, manage inventory, and fulfill orders.</p>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Website username</span>
          <input name="username" required className="w-full rounded-2xl border border-sand px-4 py-3" />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Website password</span>
          <input name="password" type="password" required className="w-full rounded-2xl border border-sand px-4 py-3" />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={pending} className="w-full rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white">
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
