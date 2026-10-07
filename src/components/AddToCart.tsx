"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/format";

type Props = {
  sku: string;
  title: string;
  price: string | number;
  imageUrl: string;
  stock: number;
};

export function AddToCart({ sku, title, price, imageUrl, stock }: Props) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const numericPrice = typeof price === "number" ? price : Number.parseFloat(price);
  const outOfStock = stock <= 0;

  if (outOfStock) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-lg font-semibold text-red-800">Out of Stock</p>
        <p className="mt-1 text-sm text-red-700">This product is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-muted" htmlFor={`qty-${sku}`}>
          Quantity
        </label>
        <input
          id={`qty-${sku}`}
          type="number"
          min={1}
          max={stock}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Math.min(stock, Number(event.target.value) || 1)))}
          className="w-20 rounded-xl border border-sand bg-white px-3 py-2"
        />
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-pine-dark"
        onClick={() => {
          const result = add(
            {
              sku,
              title,
              price: numericPrice,
              imageUrl,
              stock,
            },
            quantity,
          );
          setMessage(result.message);
        }}
      >
        Add to cart · {money(numericPrice)}
      </button>
      {message ? <p className="text-sm text-pine">{message}</p> : null}
    </div>
  );
}
