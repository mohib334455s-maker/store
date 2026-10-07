import Link from "next/link";
import { Logo } from "@/components/Logo";
import { STORE } from "@/lib/store";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-pine-dark/20 bg-pine-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-5 max-w-md text-sm leading-7 text-sand">
            {STORE.tagline} Premium outdoor equipment for hiking, camping, and travel.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Shop</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <Link href="/shop" className="transition hover:text-gold">
              All products
            </Link>
            <Link href="/shop?category=Hiking" className="transition hover:text-gold">
              Hiking
            </Link>
            <Link href="/shop?category=Camping" className="transition hover:text-gold">
              Camping
            </Link>
            <Link href="/shop?category=Travel" className="transition hover:text-gold">
              Travel
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Contact</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-sand">
            <p>{STORE.address}</p>
            <p>{STORE.phone}</p>
            <p>{STORE.email}</p>
            <Link href="/about" className="text-cream transition hover:text-gold">
              About Peakline
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-sand/90">
        © {new Date().getFullYear()} {STORE.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
