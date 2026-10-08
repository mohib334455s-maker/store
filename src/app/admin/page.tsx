import Link from "next/link";
import { listCsvImports, listOrders, listProducts } from "@/db";
import { DEMO_TRACKING_NUMBER, OOS_TEST_SKU } from "@/lib/store";

export default async function AdminHomePage() {
  const catalog = await listProducts("title-asc");
  const recentOrders = await listOrders();
  const imports = (await listCsvImports()).slice(0, 5);
  const oos = catalog.find((product) => product.sku === OOS_TEST_SKU);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Dashboard</p>
        <h1 className="mt-2 font-serif text-4xl">Store operations</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Products imported", String(catalog.length)],
          ["Orders", String(recentOrders.length)],
          ["CSV imports", String(imports.length)],
          ["OOS test SKU", oos ? `${oos.sku} · ${oos.stock}` : "Missing"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
            <p className="mt-2 font-serif text-2xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-serif text-2xl">Required demonstrations</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6">
            <li>CSV import mapped SKU, Title, Category, Price, Stock, Description, and ImageURL.</li>
            <li>Inventory tracking is enabled for every product.</li>
            <li>
              {OOS_TEST_SKU} started with stock 1, was purchased with Manual Payment, and now shows{" "}
              {oos && oos.stock <= 0 ? "Out of Stock" : `stock ${oos?.stock ?? 0}`}.
            </li>
            <li>Test order was marked Shipped with tracking number {DEMO_TRACKING_NUMBER}.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/import" className="rounded-full bg-pine px-4 py-2 text-sm text-white">
              Open CSV import
            </Link>
            <Link href="/admin/orders" className="rounded-full bg-sand px-4 py-2 text-sm">
              Open orders
            </Link>
          </div>
        </section>
        <section className="rounded-3xl bg-white p-6">
          <h2 className="font-serif text-2xl">Latest import</h2>
          {imports[0] ? (
            <div className="mt-4 text-sm">
              <p>
                <span className="text-muted">File:</span> {imports[0].filename}
              </p>
              <p>
                <span className="text-muted">Rows:</span> {imports[0].rowCount}
              </p>
              <p>
                <span className="text-muted">Status:</span> {imports[0].status}
              </p>
              <p className="mt-3 text-muted">{imports[0].notes}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No import recorded yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
