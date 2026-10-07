"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OosReset() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function reset() {
    const response = await fetch("/api/admin/demo", { method: "POST" });
    const payload = (await response.json()) as { ok: boolean; message?: string };
    setMessage(payload.message ?? (payload.ok ? "Ready for another test purchase." : "Reset failed."));
    router.refresh();
  }

  return (
    <div className="text-right">
      <button type="button" onClick={reset} className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white">
        Reset Out-of-Stock test to stock 1
      </button>
      {message ? <p className="mt-2 text-xs text-muted">{message}</p> : null}
    </div>
  );
}
