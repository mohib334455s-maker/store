"use client";

import Link from "next/link";
import type { Product } from "@/db/schema";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const outOfStock = product.stock <= 0;
  const price = Number.parseFloat(product.price);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] bg-white/80 shadow-[0_18px_40px_rgba(20,24,22,0.06)] ring-1 ring-sand/80 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(20,24,22,0.1)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Link href={`/shop/${product.sku}`} className="block h-full w-full">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        {outOfStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Out of Stock
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-medium text-pine shadow-sm">
            {product.category}
          </span>
        )}
        {!outOfStock ? (
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-pine text-white shadow-lg shadow-pine-dark/25 transition hover:scale-105 hover:bg-pine-dark"
            onClick={() =>
              add({
                sku: product.sku,
                title: product.title,
                price,
                imageUrl: product.imageUrl,
                stock: product.stock,
              })
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" />
            </svg>
          </button>
        ) : null}
      </div>
      <Link href={`/shop/${product.sku}`} className="block space-y-2 p-5">
        <h3 className="font-serif text-xl leading-tight text-ink transition group-hover:text-pine">{product.title}</h3>
        <p className="text-sm font-semibold text-pine">{money(product.price)}</p>
      </Link>
    </article>
  );
}
