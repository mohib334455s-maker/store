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
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Order details</p>
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
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Fulfilled</p>
            <p className="mt-1">{order.fulfilledAt ? formatDate(order.fulfilledAt) : "Pending"}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 rounded-3xl bg-white p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Customer</p>
            <p className="mt-2 font-medium">{order.customerName}</p>
            <p className="mt-1 text-sm">{order.customerEmail}</p>
            <p className="mt-1 text-sm">{order.customerPhone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Shipping address</p>
            <p className="mt-2">
              {order.shippingAddress}
              <br />
              {order.city}
              <br />
              {order.country}
            </p>
          </div>
        </div>

        {shipped ? (
          <div className="mt-4 rounded-3xl bg-pine px-6 py-5 text-cream">
            <p className="text-sm uppercase tracking-[0.2em] text-gold">Shipped / Fulfilled</p>
            <p className="mt-2 font-serif text-2xl">Tracking {order.trackingNumber}</p>
            {order.fulfilledAt ? <p className="mt-2 text-sm text-sand">Fulfilled {formatDate(order.fulfilledAt)}</p> : null}
          </div>
        ) : null}

        <div className="mt-6 rounded-3xl bg-white p-6">
          <h2 className="font-serif text-2xl">Items</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 border-b border-sand pb-3 last:border-0">
                <img src={item.imageUrl} alt={item.title} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted">
                    {item.sku} · Qty {item.quantity} · {money(item.unitPrice)} each
                  </p>
                </div>
                <p className="text-sm font-medium">{money(Number.parseFloat(item.unitPrice) * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{money(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{money(order.total)}</span>
            </div>
          </div>
        </div>

        {order.notes ? (
          <div className="mt-4 rounded-3xl bg-cream p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Order notes</p>
            <p className="mt-2">{order.notes}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/shop" className="inline-block text-sm font-semibold text-pine">
            Continue shopping
          </Link>
          <Link href={`/order/${order.orderNumber}`} className="inline-block text-sm text-muted">
            Order details page: /order/{order.orderNumber}
          </Link>
        </div>
      </section>
    </Storefront>
  );
}
