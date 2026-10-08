"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function ImportActions({ currentCount }: { currentCount: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);

  async function importOfficial() {
    setPending(true);
    setMessage("");
    setOk(null);
    const response = await fetch("/api/admin/import", { method: "POST" });
    const payload = (await response.json()) as { ok: boolean; message?: string; count?: number };
    setPending(false);
    setOk(payload.ok);
    setMessage(payload.message ?? (payload.ok ? `Imported ${payload.count} products.` : "Import failed."));
    router.refresh();
  }

  async function onUpload(file: File | undefined) {
    if (!file) return;
    setPending(true);
    setMessage("");
    setOk(null);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/import", { method: "POST", body });
    const payload = (await response.json()) as { ok: boolean; message?: string; count?: number };
    setPending(false);
    setOk(payload.ok);
    setMessage(payload.message ?? (payload.ok ? `Imported ${payload.count} products.` : "Import failed."));
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={importOfficial}
          disabled={pending}
          className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Importing..." : "Import official products.csv"}
        </button>
        <label className="cursor-pointer rounded-full bg-sand px-5 py-3 text-sm font-semibold">
          Upload another CSV
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv,.txt"
            className="hidden"
            onChange={(event) => onUpload(event.target.files?.[0])}
          />
        </label>
        <a href="/admin/products" className="text-sm font-semibold text-pine">
          Open inventory →
        </a>
      </div>
      <p
        className={`text-sm ${
          ok === true ? "font-medium text-pine" : ok === false ? "font-medium text-red-700" : "text-muted"
        }`}
      >
        {message || `${currentCount} products currently in the catalog.`}
      </p>
      <p className="text-xs text-muted">
        Upload a UTF-8 CSV with the exact header SKU,Title,Category,Price,Stock,Description,ImageURL and exactly 10
        rows. Excel files must be saved as CSV before upload.
      </p>
    </div>
  );
}
