import Link from "next/link";
import { Logo } from "@/components/Logo";
import { STORE } from "@/lib/store";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-sand bg-pine text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-md text-sm leading-6 text-sand">
            {STORE.tagline} Premium outdoor equipment for hiking, camping, and travel.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Shop</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/shop" className="hover:text-gold">
              All products
            </Link>
            <Link href="/shop?category=Hiking" className="hover:text-gold">
              Hiking
            </Link>
            <Link href="/shop?category=Camping" className="hover:text-gold">
              Camping
            </Link>
            <Link href="/shop?category=Travel" className="hover:text-gold">
              Travel
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Contact</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <p>{STORE.address}</p>
            <p>{STORE.phone}</p>
            <p>{STORE.email}</p>
            <Link href="/about" className="hover:text-gold">
              About Peakline
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-sand">
        © {new Date().getFullYear()} {STORE.legalName}. All rights reserved. Designed for outdoor living.
      </div>
    </footer>
  );
}
