import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, getOrderItems } from "@/db";
import { formatDate, money } from "@/lib/format";
import { FulfillForm } from "@/app/admin/orders/[id]/FulfillForm";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number.parseInt(id, 10);
  const order = await getOrderById(orderId);
  if (!order) {
    notFound();
  }
  const items = await getOrderItems(order.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Order details / Fulfillment</p>
        <h1 className="mt-2 font-serif text-4xl">{order.orderNumber}</h1>
        <p className="mt-2 text-sm text-muted">Placed {formatDate(order.createdAt)}</p>
        <p className="mt-2 text-sm">
          Customer order page:{" "}
          <Link href={`/order/${order.orderNumber}`} className="font-semibold text-pine">
            /order/{order.orderNumber}
          </Link>
        </p>
      </div>
      <section className="grid gap-4 rounded-3xl bg-white p-6 md:grid-cols-2">
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
            {order.city}, {order.country}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Payment</p>
          <p className="mt-2">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Status</p>
          <p className="mt-2 text-lg font-semibold capitalize text-pine">{order.status}</p>
          <p className="text-sm">Tracking: {order.trackingNumber ?? "Not entered"}</p>
          <p className="text-sm">Fulfilled: {order.fulfilledAt ? formatDate(order.fulfilledAt) : "Pending"}</p>
        </div>
      </section>
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Items</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span>
                {item.title} · {item.sku} × {item.quantity} · {money(item.unitPrice)} each
              </span>
              <span>{money(Number.parseFloat(item.unitPrice) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-sand pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{money(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{money(order.shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>
        </div>
      </section>
      {order.notes ? (
        <section className="rounded-3xl bg-cream p-5 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Order notes</p>
          <p className="mt-2">{order.notes}</p>
        </section>
      ) : null}
      <FulfillForm orderId={order.id} currentTracking={order.trackingNumber ?? "DXB-TRK-12345"} status={order.status} />
    </div>
  );
}
