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
    <header className="sticky top-0 z-40 border-b border-sand/80 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink md:flex">
          <Link href="/shop" className="hover:text-pine">
            Shop
          </Link>
          {CATEGORIES.map((category) => (
            <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="hover:text-pine">
              {category}
            </Link>
          ))}
          <Link href="/about" className="hover:text-pine">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-full border border-pine/15 bg-white px-3 py-2 text-sm font-medium text-pine"
          >
            Cart
            {ready && count > 0 ? (
              <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-pine px-1.5 text-[11px] text-white">
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
        <div className="border-t border-sand bg-cream px-4 py-4 md:hidden">
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
              About Peakline
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
