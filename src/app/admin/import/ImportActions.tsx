"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ImportActions({ currentCount }: { currentCount: number }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function importOfficial() {
    setPending(true);
    setMessage("");
    const response = await fetch("/api/admin/import", { method: "POST" });
    const payload = (await response.json()) as { ok: boolean; message?: string; count?: number };
    setPending(false);
    setMessage(payload.message ?? (payload.ok ? `Imported ${payload.count} products.` : "Import failed."));
    router.refresh();
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    setPending(true);
    setMessage("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/import", { method: "POST", body });
    const payload = (await response.json()) as { ok: boolean; message?: string; count?: number };
    setPending(false);
    setMessage(payload.message ?? (payload.ok ? `Imported ${payload.count} products.` : "Import failed."));
    router.refresh();
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={importOfficial}
        disabled={pending}
        className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Importing..." : "Import official products.csv"}
      </button>
      <label className="rounded-full bg-sand px-5 py-3 text-sm font-semibold">
        Upload another CSV
        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => onUpload(event.target.files?.[0])}
        />
      </label>
      <p className="text-sm text-muted">{message || `${currentCount} products currently in the catalog.`}</p>
    </div>
  );
}
