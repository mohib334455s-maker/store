"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/components/CartProvider";
import { CATEGORIES } from "@/lib/store";

export function Header() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/85 md:flex">
          <Link href="/shop" className="transition hover:text-pine">
            Shop
          </Link>
          {CATEGORIES.map((category) => (
            <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="transition hover:text-pine">
              {category}
            </Link>
          ))}
          <Link href="/about" className="transition hover:text-pine">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-pine text-white shadow-md shadow-pine/20 transition hover:bg-pine-dark"
            aria-label="Open cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {ready && count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-semibold text-ink">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="rounded-full border border-pine/15 bg-white px-3 py-2 text-sm md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-sand bg-cream/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-base">
            <Link href="/shop" onClick={() => setOpen(false)}>
              Shop all gear
            </Link>
            {CATEGORIES.map((category) => (
              <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} onClick={() => setOpen(false)}>
                {category}
              </Link>
            ))}
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)}>
              Cart
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
