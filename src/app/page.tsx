import Link from "next/link";
import { Storefront } from "@/components/Storefront";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/db";
import { bootstrapStore } from "@/lib/bootstrap";
import { CATEGORIES, STORE } from "@/lib/store";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.pexels.com/photos/5645472/pexels-photo-5645472.jpeg?auto=compress&cs=tinysrgb&w=2000";

export default async function HomePage() {
  await bootstrapStore();
  const catalog = await listProducts("stock-desc");

  return (
    <Storefront>
      <section className="relative overflow-hidden">
        <img src={HERO_IMAGE} alt="Alpine trail at sunrise" className="h-[78vh] min-h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-16 sm:px-6">
          <p className="font-serif text-2xl tracking-[0.2em] uppercase text-white sm:text-3xl">Peakline</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl">Gear for the trail ahead.</h1>
          <p className="mt-4 max-w-md text-base text-cream/90">
            Hiking, camping, and travel gear with live inventory and online product images.
          </p>
          <div className="mt-8">
            <Link href="/shop" className="inline-block rounded-full bg-pine px-7 py-3 text-sm font-semibold text-white hover:bg-pine-dark">
              Shop the catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Categories</p>
            <h2 className="mt-2 font-serif text-3xl">Shop by pursuit</h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            Choose gear for the mountains, the campsite, or the road ahead.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="rounded-3xl bg-pine px-6 py-10 text-cream transition hover:bg-pine-dark"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-gold">{category}</p>
              <p className="mt-3 font-serif text-3xl">Explore {category.toLowerCase()} gear</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Featured</p>
            <h2 className="mt-2 font-serif text-3xl">Shop the collection</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-pine">
            View shop
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Storefront>
  );
}
