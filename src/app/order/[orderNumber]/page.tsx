import Link from "next/link";
import { notFound } from "next/navigation";
import { Storefront } from "@/components/Storefront";
import { getOrderByNumber, getOrderItems } from "@/db";
import { bootstrapStore } from "@/lib/bootstrap";
import { formatDate, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  await bootstrapStore();
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    notFound();
  }
  const items = await getOrderItems(order.id);
  const shipped = order.status === "shipped" || order.status === "fulfilled";

  return (
    <Storefront>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Order confirmation</p>
        <h1 className="mt-2 font-serif text-4xl">{order.orderNumber}</h1>
        <p className="mt-2 text-sm text-muted">Placed {formatDate(order.createdAt)}</p>
        <div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Status</p>
            <p className="mt-1 text-lg font-semibold capitalize text-pine">{order.status}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Tracking number</p>
            <p className="mt-1 text-lg font-semibold">{order.trackingNumber ?? "Not assigned yet"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Payment</p>
            <p className="mt-1">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Ship to</p>
            <p className="mt-1">
              {order.customerName}
              <br />
              {order.shippingAddress}, {order.city}
              <br />
              {order.country}
            </p>
          </div>
        </div>
        {shipped ? (
          <div className="mt-4 rounded-3xl bg-pine px-6 py-5 text-cream">
            <p className="text-sm uppercase tracking-[0.2em] text-gold">Shipped / Fulfilled</p>
            <p className="mt-2 font-serif text-2xl">Tracking {order.trackingNumber}</p>
          </div>
        ) : null}
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 rounded-3xl bg-white p-4">
              <img src={item.imageUrl} alt={item.title} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted">
                  {item.sku} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm">{money(Number.parseFloat(item.unitPrice) * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between text-sm">
          <span>Total</span>
          <span className="font-semibold">{money(order.total)}</span>
        </div>
        <Link href="/shop" className="mt-8 inline-block text-sm font-semibold text-pine">
          Continue shopping
        </Link>
      </section>
    </Storefront>
  );
}
