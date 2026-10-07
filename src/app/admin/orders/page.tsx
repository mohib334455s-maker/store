import Link from "next/link";
import { listOrders } from "@/db";
import { formatDate, money } from "@/lib/format";

export default async function OrdersPage() {
  const rows = await listOrders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Order processing</p>
        <h1 className="mt-2 font-serif text-4xl">Orders</h1>
      </div>
      <div className="overflow-x-auto rounded-3xl bg-white p-4">
        <table className="min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-sand text-muted">
              <th className="py-3 pr-3">Order</th>
              <th className="py-3 pr-3">Customer</th>
              <th className="py-3 pr-3">Total</th>
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 pr-3">Tracking</th>
              <th className="py-3">Placed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-b border-sand/70">
                <td className="py-3 pr-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-pine">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-3 pr-3">{order.customerName}</td>
                <td className="py-3 pr-3">{money(order.total)}</td>
                <td className="py-3 pr-3 capitalize">{order.status}</td>
                <td className="py-3 pr-3">{order.trackingNumber ?? "—"}</td>
                <td className="py-3">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
