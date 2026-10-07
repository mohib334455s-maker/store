"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Storefront } from "@/components/Storefront";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ sku: item.sku, quantity: item.quantity })),
        customer: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          address: String(form.get("address") ?? ""),
          city: String(form.get("city") ?? ""),
          country: String(form.get("country") ?? ""),
        },
        paymentMethod: "Manual Payment (Test Mode)",
      }),
    });
    const payload = (await response.json()) as { ok: boolean; message?: string; orderNumber?: string };
    setPending(false);
    if (!payload.ok || !payload.orderNumber) {
      setError(payload.message ?? "Checkout could not be completed.");
      return;
    }
    clear();
    router.push(`/order/${payload.orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <Storefront>
        <section className="mx-auto max-w-xl px-4 py-16">
          <h1 className="font-serif text-4xl">Checkout</h1>
          <p className="mt-4 text-muted">Add products to your cart before checking out.</p>
        </section>
      </Storefront>
    );
  }

  return (
    <Storefront>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-white p-6">
          <h1 className="font-serif text-4xl">Checkout</h1>
          <p className="text-sm text-muted">Enter your details below. Payment will be confirmed manually after your order is placed.</p>
          {[
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["address", "Shipping address", "text"],
            ["city", "City", "text"],
          ].map(([name, label, type]) => (
            <label key={name} className="block text-sm">
              <span className="mb-1 block font-medium">{label}</span>
              <input name={name} type={type} required className="w-full rounded-2xl border border-sand px-4 py-3" />
            </label>
          ))}
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Country</span>
            <input name="country" defaultValue="United Arab Emirates" required className="w-full rounded-2xl border border-sand px-4 py-3" />
          </label>
          <div className="rounded-2xl bg-cream px-4 py-3 text-sm">
            <p className="font-semibold">Payment method</p>
            <p className="text-muted">Manual payment</p>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Placing order..." : `Place order · ${money(subtotal)} + shipping`}
          </button>
        </form>
        <aside className="h-fit rounded-3xl bg-white p-6">
          <h2 className="font-serif text-2xl">Items</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.sku} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{money(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </Storefront>
  );
}
