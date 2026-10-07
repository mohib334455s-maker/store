"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StockEditor({ sku, stock }: { sku: string; stock: number }) {
  const router = useRouter();
  const [value, setValue] = useState(String(stock));
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    await fetch("/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, stock: Number.parseInt(value, 10) }),
    });
    setPending(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-20 rounded-xl border border-sand px-2 py-1"
      />
      <button type="button" onClick={save} disabled={pending} className="text-xs font-semibold text-pine">
        Save
      </button>
    </div>
  );
}
