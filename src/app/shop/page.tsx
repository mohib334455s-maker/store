import Link from "next/link";
import { Storefront } from "@/components/Storefront";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/db";
import { bootstrapStore } from "@/lib/bootstrap";
import { CATEGORIES } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await bootstrapStore();
  const params = await searchParams;
  const category = params.category;
  const catalog = await listProducts("title-asc");
  const visible = category ? catalog.filter((product) => product.category === category) : catalog;

  return (
    <Storefront>
      <section className="relative overflow-hidden border-b border-sand/70">
        <div className="absolute inset-0 bg-gradient-to-br from-pine/10 via-transparent to-gold/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-dark">Shop</p>
          <h1 className="mt-3 font-serif text-5xl text-ink">{category ? category : "All gear"}</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Reliable outdoor equipment for hiking, camping, and travel — selected for long days outside.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/shop"
              className={`rounded-full px-4 py-2 text-sm transition ${!category ? "bg-pine text-white" : "bg-white/80 text-pine ring-1 ring-sand hover:bg-white"}`}
            >
              All
            </Link>
            {CATEGORIES.map((item) => (
              <Link
                key={item}
                href={`/shop?category=${encodeURIComponent(item)}`}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  category === item ? "bg-pine text-white" : "bg-white/80 text-pine ring-1 ring-sand hover:bg-white"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Storefront>
  );
}
