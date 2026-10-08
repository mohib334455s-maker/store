import Link from "next/link";
import { Storefront } from "@/components/Storefront";

export default function NotFound() {
  return (
    <Storefront>
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Page not found</h1>
        <p className="mt-3 text-muted">The page you requested is not part of the Northlane store.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white">
          Return home
        </Link>
      </section>
    </Storefront>
  );
}
