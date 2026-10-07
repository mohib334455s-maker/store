import { Storefront } from "@/components/Storefront";
import { STORE } from "@/lib/store";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Storefront>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Our story</p>
        <h1 className="mt-3 font-serif text-4xl">Built for long days outside</h1>
        <p className="mt-6 text-lg leading-8 text-ink">
          {STORE.legalName} is a curated outdoor store for hikers, campers, and travelers who want reliable equipment without
          excess. We keep the catalog focused so every piece of gear is ready for steep climbs, quiet camps, and long travel
          days.
        </p>
        <p className="mt-4 leading-7 text-muted">
          From Dubai, we ship thoughtfully chosen hiking, camping, and travel essentials. If an item is low in stock, you will
          see it clearly before you check out.
        </p>
        <div className="mt-10 grid gap-4 rounded-3xl bg-white p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Brand color</p>
            <p className="mt-2 font-semibold text-pine">
              {STORE.brandColorName} {STORE.brandColor}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Accent</p>
            <p className="mt-2 font-semibold" style={{ color: STORE.accentColor }}>
              {STORE.accentColorName} {STORE.accentColor}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Categories</p>
            <p className="mt-2">Hiking, Camping, Travel</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Contact</p>
            <p className="mt-2">
              {STORE.email}
              <br />
              {STORE.phone}
            </p>
          </div>
        </div>
      </section>
    </Storefront>
  );
}
