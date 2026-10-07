import { listProducts } from "@/db";
import { money } from "@/lib/format";
import { StockEditor } from "@/app/admin/products/StockEditor";
import { OosReset } from "@/app/admin/products/OosReset";
import { OOS_TEST_SKU } from "@/lib/store";

export default async function InventoryPage() {
  const catalog = [...(await listProducts("title-asc"))].sort((a, b) => a.sku.localeCompare(b.sku));
  const trackingEnabled = catalog.every((product) => Number.isInteger(product.stock));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Inventory tracking</p>
          <h1 className="mt-2 font-serif text-4xl">Product inventory</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Inventory tracking is {trackingEnabled ? "enabled" : "not complete"} for all SKUs. Stock changes immediately when
            a customer completes checkout.
          </p>
        </div>
        <OosReset />
      </div>
      <div className="overflow-x-auto rounded-3xl bg-white p-4">
        <table className="min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-sand text-muted">
              <th className="py-3 pr-3">Image</th>
              <th className="py-3 pr-3">SKU</th>
              <th className="py-3 pr-3">Title</th>
              <th className="py-3 pr-3">Category</th>
              <th className="py-3 pr-3">Price</th>
              <th className="py-3 pr-3">Stock</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((product) => {
              const out = product.stock <= 0;
              return (
                <tr key={product.id} className="border-b border-sand/70 align-middle">
                  <td className="py-3 pr-3">
                    <img src={product.imageUrl} alt={product.title} className="h-12 w-12 rounded-xl object-cover" />
                  </td>
                  <td className="py-3 pr-3 font-medium">{product.sku}</td>
                  <td className="py-3 pr-3">{product.title}</td>
                  <td className="py-3 pr-3">{product.category}</td>
                  <td className="py-3 pr-3">{money(product.price)}</td>
                  <td className="py-3 pr-3">
                    <StockEditor sku={product.sku} stock={product.stock} />
                  </td>
                  <td className="py-3">
                    <span className={out ? "font-semibold text-red-700" : "text-pine"}>
                      {out
                        ? "Out of Stock"
                        : product.sku === OOS_TEST_SKU && product.stock === 1
                          ? "OOS test quantity = 1"
                          : "In stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
