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
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Fulfillment</p>
        <h1 className="mt-2 font-serif text-4xl">{order.orderNumber}</h1>
        <p className="mt-2 text-sm text-muted">Placed {formatDate(order.createdAt)}</p>
      </div>
      <section className="grid gap-4 rounded-3xl bg-white p-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Customer</p>
          <p className="mt-2">
            {order.customerName}
            <br />
            {order.customerEmail}
            <br />
            {order.customerPhone}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Shipping</p>
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
        </div>
      </section>
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Items</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span>
                {item.title} · {item.sku} × {item.quantity}
              </span>
              <span>{money(Number.parseFloat(item.unitPrice) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right font-semibold">Total {money(order.total)}</p>
      </section>
      <FulfillForm orderId={order.id} currentTracking={order.trackingNumber ?? "DXB-TRK-12345"} status={order.status} />
    </div>
  );
}
