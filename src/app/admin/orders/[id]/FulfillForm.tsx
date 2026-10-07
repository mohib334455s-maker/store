"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function FulfillForm({
  orderId,
  currentTracking,
  status,
}: {
  orderId: number;
  currentTracking: string;
  status: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const shipped = status === "shipped" || status === "fulfilled";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        trackingNumber: String(form.get("trackingNumber") ?? ""),
      }),
    });
    const payload = (await response.json()) as { ok: boolean; message?: string };
    setMessage(payload.message ?? (payload.ok ? "Order marked shipped." : "Update failed."));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6">
      <h2 className="font-serif text-2xl">{shipped ? "Update tracking" : "Mark as shipped"}</h2>
      <p className="mt-2 text-sm text-muted">Enter a logistics tracking number to complete order fulfillment.</p>
      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-medium">Tracking number</span>
        <input
          name="trackingNumber"
          defaultValue={currentTracking}
          required
          className="w-full rounded-2xl border border-sand px-4 py-3"
        />
      </label>
      <button type="submit" className="mt-4 rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white">
        {shipped ? "Save tracking number" : "Fulfill / ship order"}
      </button>
      {message ? <p className="mt-3 text-sm text-pine">{message}</p> : null}
    </form>
  );
}
