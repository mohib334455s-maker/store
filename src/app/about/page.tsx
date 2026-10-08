import { Storefront } from "@/components/Storefront";
import { STORE } from "@/lib/store";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Storefront>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pine/12 via-transparent to-gold/10" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-dark">Our story</p>
          <h1 className="mt-3 font-serif text-5xl text-ink">Built for the next mile</h1>
          <p className="mt-7 text-lg leading-8 text-ink/90">
            {STORE.legalName} is a curated outdoor store for hikers, campers, and travelers who want reliable equipment
            without excess. Every piece is chosen for steep climbs, quiet camps, and long travel days.
          </p>
          <p className="mt-5 leading-7 text-muted">
            From Dubai, we ship thoughtfully chosen hiking, camping, and travel essentials with clear availability before
            checkout.
          </p>

          <div className="mt-12 rounded-[1.75rem] bg-pine px-7 py-8 text-cream shadow-lg shadow-pine/20">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Founder</p>
            <h2 className="mt-3 font-serif text-3xl">{STORE.founder}</h2>
            <div className="mt-5 grid gap-3 text-sm text-sand sm:grid-cols-2">
              <p>
                <span className="block text-xs uppercase tracking-[0.16em] text-gold/90">Phone</span>
                <a href={`tel:${STORE.phone.replace(/\s/g, "")}`} className="mt-1 inline-block text-cream hover:text-gold">
                  {STORE.phone}
                </a>
              </p>
              <p>
                <span className="block text-xs uppercase tracking-[0.16em] text-gold/90">Email</span>
                <a href={`mailto:${STORE.email}`} className="mt-1 inline-block break-all text-cream hover:text-gold">
                  {STORE.email}
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/80 p-6 ring-1 ring-sand">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Categories</p>
              <p className="mt-2">Hiking · Camping · Travel</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/80 p-6 ring-1 ring-sand">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Location</p>
              <p className="mt-2">{STORE.address}</p>
            </div>
          </div>
        </div>
      </section>
    </Storefront>
  );
}
