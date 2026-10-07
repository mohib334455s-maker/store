import Link from "next/link";
import { Storefront } from "@/components/Storefront";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/db";
import { bootstrapStore } from "@/lib/bootstrap";
import { CATEGORIES, STORE } from "@/lib/store";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.pexels.com/photos/5645472/pexels-photo-5645472.jpeg?auto=compress&cs=tinysrgb&w=2000";

const CATEGORY_IMAGES: Record<(typeof CATEGORIES)[number], string> = {
  Hiking: "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200",
  Camping: "https://images.pexels.com/photos/9290539/pexels-photo-9290539.jpeg?auto=compress&cs=tinysrgb&w=1200",
  Travel: "https://images.pexels.com/photos/12505397/pexels-photo-12505397.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export default async function HomePage() {
  await bootstrapStore();
  const catalog = await listProducts("stock-desc");

  return (
    <Storefront>
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Alpine trail at sunrise"
          className="hero-zoom absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-pine-dark/55 via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6">
          <p className="rise font-serif text-3xl tracking-[0.28em] uppercase text-white sm:text-4xl">{STORE.name}</p>
          <h1 className="rise rise-delay-1 mt-5 max-w-2xl font-serif text-4xl leading-[1.08] text-white sm:text-6xl">
            {STORE.tagline}
          </h1>
          <p className="rise rise-delay-2 mt-5 max-w-lg text-base text-cream/90 sm:text-lg">
            Curated hiking, camping, and travel equipment for routes that go farther.
          </p>
          <div className="rise rise-delay-3 mt-9 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-block rounded-full bg-pine px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pine-dark/30 transition hover:bg-pine-light"
            >
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="inline-block rounded-full border border-white/35 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-dark">Collections</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">Shop by pursuit</h2>
          <p className="mt-3 text-muted">Three focused lines. One clear purpose on every trail.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="group relative block min-h-[320px] overflow-hidden rounded-[1.75rem]"
            >
              <img
                src={CATEGORY_IMAGES[category]}
                alt={category}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-dark via-pine-dark/35 to-transparent" />
              <div className="relative flex h-full min-h-[320px] flex-col justify-end p-7 text-cream">
                <p className="text-xs uppercase tracking-[0.24em] text-gold">{category}</p>
                <p className="mt-2 font-serif text-3xl">Explore {category.toLowerCase()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-dark">Featured</p>
            <h2 className="mt-3 font-serif text-4xl">Ready for the trail</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-pine transition hover:text-pine-dark">
            View all
          </Link>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Storefront>
  );
}
