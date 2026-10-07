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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Shop</p>
        <h1 className="mt-2 font-serif text-4xl">{category ? category : "All gear"}</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Reliable outdoor equipment for hiking, camping, and travel. Check stock levels and order what you need for the trail.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full px-4 py-2 text-sm ${!category ? "bg-pine text-white" : "bg-white text-pine ring-1 ring-sand"}`}
          >
            All
          </Link>
          {CATEGORIES.map((item) => (
            <Link
              key={item}
              href={`/shop?category=${encodeURIComponent(item)}`}
              className={`rounded-full px-4 py-2 text-sm ${
                category === item ? "bg-pine text-white" : "bg-white text-pine ring-1 ring-sand"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Storefront>
  );
}
