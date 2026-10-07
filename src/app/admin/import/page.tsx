import { listCsvImports, listProducts } from "@/db";
import { readOfficialCsv } from "@/lib/csv";
import { CSV_FIELD_MAPPING } from "@/lib/store";
import { ImportActions } from "@/app/admin/import/ImportActions";
import { formatDate } from "@/lib/format";

export default async function ImportPage() {
  const file = await readOfficialCsv();
  const catalog = await listProducts("title-asc");
  const history = await listCsvImports();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-dark">Data management</p>
        <h1 className="mt-2 font-serif text-4xl">CSV product import</h1>
        <p className="mt-3 max-w-3xl text-muted">
          Products are not created one by one in the catalog. They are imported from a structured CSV file with online image
          URLs. Field mapping is verified before import.
        </p>
      </div>
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Field mapping</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sand text-muted">
                <th className="py-2 pr-4">CSV column</th>
                <th className="py-2">Platform field</th>
              </tr>
            </thead>
            <tbody>
              {CSV_FIELD_MAPPING.map((row) => (
                <tr key={row.csv} className="border-b border-sand/70">
                  <td className="py-2 pr-4 font-medium">{row.csv}</td>
                  <td className="py-2">{row.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="rounded-3xl bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">Official CSV · {file.filename}</h2>
          <a href="/data/products.csv" className="text-sm font-semibold text-pine">
            Download products.csv
          </a>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-muted">
                <th className="py-2 pr-3">SKU</th>
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3">Stock</th>
                <th className="py-2 pr-3">Description</th>
                <th className="py-2">ImageURL</th>
              </tr>
            </thead>
            <tbody>
              {file.rows.map((row) => (
                <tr key={row.SKU} className="border-b border-sand/70 align-top">
                  <td className="py-2 pr-3 font-medium">{row.SKU}</td>
                  <td className="py-2 pr-3">{row.Title}</td>
                  <td className="py-2 pr-3">{row.Category}</td>
                  <td className="py-2 pr-3">{row.Price}</td>
                  <td className="py-2 pr-3">{row.Stock}</td>
                  <td className="max-w-xs py-2 pr-3">{row.Description.replace(/<[^>]+>/g, " ")}</td>
                  <td className="max-w-xs break-all py-2">{row.ImageURL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ImportActions currentCount={catalog.length} />
      </section>
      <section className="rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Import history</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {history.map((item) => (
            <li key={item.id} className="rounded-2xl bg-cream px-4 py-3">
              {formatDate(item.importedAt)} · {item.filename} · {item.rowCount} rows · {item.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
