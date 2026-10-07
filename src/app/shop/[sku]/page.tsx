import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { Storefront } from "@/components/Storefront";
import { getProductBySku } from "@/db";
import { bootstrapStore } from "@/lib/bootstrap";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  await bootstrapStore();
  const { sku } = await params;
  const product = await getProductBySku(sku);
  if (!product) {
    notFound();
  }

  const outOfStock = product.stock <= 0;

  return (
    <Storefront>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-[2rem] bg-sand shadow-[0_24px_50px_rgba(20,24,22,0.08)]">
          <img src={product.imageUrl} alt={product.title} className="h-full min-h-[360px] w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <Link href="/shop" className="text-sm font-medium text-pine transition hover:text-pine-dark">
            Back to shop
          </Link>
          <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted">{product.category}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{product.title}</h1>
          <p className="mt-5 font-serif text-3xl text-pine">{money(product.price)}</p>
          {outOfStock ? <p className="mt-3 text-sm font-semibold text-red-700">Out of Stock</p> : null}
          <div className="product-copy mt-7 text-base leading-8 text-ink/90" dangerouslySetInnerHTML={{ __html: product.description }} />
          <div className="mt-9">
            <AddToCart
              sku={product.sku}
              title={product.title}
              price={product.price}
              imageUrl={product.imageUrl}
              stock={product.stock}
            />
          </div>
        </div>
      </section>
    </Storefront>
  );
}
