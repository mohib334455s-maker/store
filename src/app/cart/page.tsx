"use client";

import Link from "next/link";
import { Storefront } from "@/components/Storefront";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/format";
import { SHIPPING_FLAT } from "@/lib/store";

export default function CartPage() {
  const { items, update, remove, subtotal } = useCart();
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  return (
    <Storefront>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-4xl">Cart</h1>
        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-8">
            <p className="text-muted">Your cart is empty.</p>
            <Link href="/shop" className="mt-4 inline-block rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.sku} className="flex gap-4 rounded-3xl bg-white p-4">
                  <img src={item.imageUrl} alt={item.title} className="h-24 w-24 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-xl">{item.title}</h2>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">{item.sku}</p>
                    <p className="mt-1 text-sm text-pine">{money(item.price)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-sm" htmlFor={`cart-${item.sku}`}>
                        Quantity
                      </label>
                      <input
                        id={`cart-${item.sku}`}
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(event) => update(item.sku, Number(event.target.value))}
                        className="w-20 rounded-xl border border-sand px-3 py-2"
                      />
                      <button type="button" className="text-sm text-red-700" onClick={() => remove(item.sku)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="h-fit rounded-3xl bg-white p-6">
              <p className="font-serif text-2xl">Order summary</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : money(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-sand pt-3 font-semibold">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="mt-6 block rounded-full bg-pine px-5 py-3 text-center text-sm font-semibold text-white">
                Checkout
              </Link>
              <p className="mt-3 text-xs text-muted">Free shipping on orders of $150 or more. Test checkout uses Manual Payment.</p>
            </aside>
          </div>
        )}
      </section>
    </Storefront>
  );
}
