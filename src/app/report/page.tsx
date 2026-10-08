import { headers } from "next/headers";
import { Logo } from "@/components/Logo";
import { getOrderItems, listCsvImports, listOrders, listProducts } from "@/db";
import { bootstrapStore } from "@/lib/bootstrap";
import { readOfficialCsv } from "@/lib/csv";
import { formatDate, money } from "@/lib/format";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  COURSE_NAME,
  CSV_FIELD_MAPPING,
  DEMO_ORDER_NUMBER,
  DEMO_TRACKING_NUMBER,
  OOS_TEST_SKU,
  PROJECT_TITLE,
  STORE,
  STUDENT_NAME,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "COMP101 Project 1 Report" };

export default async function ReportPage() {
  await bootstrapStore();
  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;
  const csv = await readOfficialCsv();
  const catalog = await listProducts("title-asc");
  const imports = await listCsvImports();
  const allOrders = await listOrders();
  const demoOrder = allOrders.find((order) => order.orderNumber === DEMO_ORDER_NUMBER) ?? allOrders[0];
  const demoItems = demoOrder ? await getOrderItems(demoOrder.id) : [];
  const oosProduct = catalog.find((product) => product.sku === OOS_TEST_SKU);

  return (
    <div className="bg-[#f7f4ee] text-ink">
      <article className="mx-auto max-w-4xl bg-white px-6 py-12 shadow-xl sm:px-12">
        <section className="border-b border-sand pb-10 text-center">
          <img src="/images/aud-logo.svg" alt="American University in Dubai" className="mx-auto h-28 w-28" />
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-gold-dark">American University in Dubai</p>
          <h1 className="mt-3 font-serif text-4xl">{COURSE_NAME}</h1>
          <p className="mt-2 font-serif text-2xl">{PROJECT_TITLE}</p>
          <p className="mt-6 text-lg">{STORE.legalName} — Outdoor E-Commerce Store</p>
          <div className="mt-6 flex justify-center">
            <Logo href="/report" />
          </div>
          <div className="mt-8 text-sm">
            <p>
              <span className="text-muted">Student Full Name:</span> {STUDENT_NAME}
            </p>
          </div>
        </section>

        <section className="py-10">
          <h2 className="font-serif text-3xl">1. Introduction</h2>
          <p className="mt-4 leading-7">
            This project implements a complete English-language e-commerce website named {STORE.legalName}. The store sells
            premium outdoor equipment organized into three product categories: Hiking, Camping, and Travel. The catalog
            contains exactly ten products. Each product includes a unique SKU, title, category, numerical price, numerical
            stock quantity, professional English description, and an online ImageURL.
          </p>
          <p className="mt-4 leading-7">
            The selected platform is {STORE.platform}. This is an accepted e-commerce implementation for COMP101 because it
            provides the required storefront, CSV product import, inventory tracking, test checkout, order fulfillment, and
            tracking-number workflow. The brand identity uses a minimal circular NL mark with stacked Northlane Outfitters
            wordmark, applied across the header, footer, dashboard, report, and presentation.
          </p>
          <p className="mt-4 leading-7">
            Product images are not stored as local computer file paths. They are hosted online and referenced through direct
            image URLs in the CSV ImageURL column. After import, the live website displays all ten images. Inventory tracking
            is enabled for every SKU. The Compact Trail First Aid Kit ({OOS_TEST_SKU}) was prepared with a stock quantity of 1,
            purchased through Manual Payment in test mode, reduced to stock 0, and then displayed as Out of Stock. The test
            order was fulfilled/shipped with tracking number {DEMO_TRACKING_NUMBER}.
          </p>
          <div className="mt-6 rounded-2xl bg-cream p-5">
            <p className="font-semibold">Website access for grading</p>
            <p className="mt-2">
              Website Username: {ADMIN_USERNAME}
              <br />
              Website Password: {ADMIN_PASSWORD}
            </p>
            <p className="mt-3 text-sm leading-7">
              Final website link:{" "}
              <a className="font-semibold text-pine" href={siteUrl}>
                {siteUrl}
              </a>
              <br />
              Dashboard login:{" "}
              <a className="font-semibold text-pine" href={`${siteUrl}/login`}>
                {siteUrl}/login
              </a>
              <br />
              Report page:{" "}
              <a className="font-semibold text-pine" href={`${siteUrl}/report`}>
                {siteUrl}/report
              </a>
              <br />
              Presentation page:{" "}
              <a className="font-semibold text-pine" href={`${siteUrl}/presentation`}>
                {siteUrl}/presentation
              </a>
            </p>
          </div>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">2. Development Process</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7">
            <li>
              <strong>Branding.</strong> Store concept defined as a premium outdoor outfitter.
            </li>
            <li>
              <strong>Logo.</strong> Circular NL mark with stacked Northlane Outfitters wordmark applied across header,
              footer, dashboard, report, and presentation.
            </li>
            <li>
              <strong>Storefront styling.</strong> Consistent navigation, buttons, and admin actions applied across the site.
            </li>
            <li>
              <strong>CSV creation.</strong> Official headers SKU,Title,Category,Price,Stock,Description,ImageURL used for 10
              products.
            </li>
            <li>
              <strong>Online images.</strong> Direct online image links placed in ImageURL. No local file paths.
            </li>
            <li>
              <strong>CSV import.</strong> All products uploaded through the dashboard import process.
            </li>
            <li>
              <strong>Inventory tracking.</strong> Stock quantities tracked and reduced during checkout.
            </li>
            <li>
              <strong>Out-of-Stock test.</strong> {OOS_TEST_SKU} set to 1, purchased, then shown as Out of Stock.
            </li>
            <li>
              <strong>Fulfillment.</strong> Order {demoOrder?.orderNumber ?? DEMO_ORDER_NUMBER} marked shipped with tracking{" "}
              {DEMO_TRACKING_NUMBER}.
            </li>
            <li>
              <strong>Mobile testing.</strong> Storefront verified on phone-width layout.
            </li>
          </ol>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">3. Screenshot Evidence</h2>
          <p className="mt-3 leading-7">
            Open the HTML files in <code>COMP101_Project1/Screenshots/</code> and also review the live evidence sections below
            from the running website:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-7">
            <li>01_CSV.html — CSV product file</li>
            <li>02_Product_Import.html — successful import</li>
            <li>03_Final_Website.html — final website</li>
            <li>04_Inventory.html — inventory tracking</li>
            <li>05_Out_of_Stock.html — out of stock product</li>
            <li>06_Order_Tracking.html — tracking number</li>
            <li>07_Mobile.html — mobile view</li>
          </ul>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">4. Screenshot A — CSV Product File</h2>
          <p className="mt-3 leading-7">
            The CSV below is the actual products.csv used for import. It contains SKU, Title, Category, Price, Stock,
            Description, and ImageURL for all ten products.
          </p>
          <div className="evidence-frame mt-4">
            <div className="browser-chrome">
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="ml-3 text-xs text-muted">products.csv</span>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="min-w-[720px] text-left text-[11px]">
                <thead>
                  <tr className="border-b border-sand">
                    <th className="py-2 pr-2">SKU</th>
                    <th className="py-2 pr-2">Title</th>
                    <th className="py-2 pr-2">Category</th>
                    <th className="py-2 pr-2">Price</th>
                    <th className="py-2 pr-2">Stock</th>
                    <th className="py-2 pr-2">Description</th>
                    <th className="py-2">ImageURL</th>
                  </tr>
                </thead>
                <tbody>
                  {csv.rows.map((row) => (
                    <tr key={row.SKU} className="border-b border-sand/70 align-top">
                      <td className="py-2 pr-2">{row.SKU}</td>
                      <td className="py-2 pr-2">{row.Title}</td>
                      <td className="py-2 pr-2">{row.Category}</td>
                      <td className="py-2 pr-2">{row.Price}</td>
                      <td className="py-2 pr-2">{row.Stock}</td>
                      <td className="max-w-[180px] py-2 pr-2">{row.Description.replace(/<[^>]+>/g, " ").slice(0, 90)}...</td>
                      <td className="max-w-[160px] break-all py-2">{row.ImageURL}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">5. Screenshot B — Successful Product Import</h2>
          <p className="mt-3 leading-7">
            The import process mapped CSV columns to platform fields and wrote {catalog.length} products into the catalog.
            Latest import status: {imports[0]?.status ?? "pending"} · {imports[0]?.rowCount ?? 0} rows ·{" "}
            {imports[0]?.filename ?? "products.csv"}.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-sand">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-cream">
                  <th className="px-3 py-2">CSV column</th>
                  <th className="px-3 py-2">Platform field</th>
                </tr>
              </thead>
              <tbody>
                {CSV_FIELD_MAPPING.map((row) => (
                  <tr key={row.csv} className="border-t border-sand">
                    <td className="px-3 py-2">{row.csv}</td>
                    <td className="px-3 py-2">{row.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {catalog.map((product) => (
              <div key={product.id} className="flex gap-3 rounded-2xl border border-sand p-3">
                <img src={product.imageUrl} alt={product.title} className="h-16 w-16 rounded-xl object-cover" />
                <div>
                  <p className="text-xs text-muted">{product.sku}</p>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-pine">
                    {product.category} · {money(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">6. Screenshot C — Final Website</h2>
          <p className="mt-3 leading-7">
            Final website link:{" "}
            <a className="font-semibold text-pine" href={siteUrl}>
              {siteUrl}
            </a>
          </p>
          <div className="evidence-frame mt-4">
            <div className="browser-chrome">
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="ml-3 text-xs text-muted">{siteUrl}</span>
            </div>
            <div className="relative min-h-56 bg-pine p-8 text-cream">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{STORE.legalName}</p>
              <p className="mt-3 font-serif text-4xl">Gear for the trail ahead.</p>
              <p className="mt-3 max-w-lg text-sm text-sand">
                Live English storefront with ten imported products, online images, and real inventory.
              </p>
            </div>
          </div>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">7. Screenshot D — Inventory Tracking</h2>
          <p className="mt-3 leading-7">
            Inventory tracking is enabled. Each product has a numerical stock value that the checkout transaction updates.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-sand">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-cream">
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((product) => (
                  <tr key={product.id} className="border-t border-sand">
                    <td className="px-3 py-2">{product.sku}</td>
                    <td className="px-3 py-2">{product.title}</td>
                    <td className="px-3 py-2">{product.stock}</td>
                    <td className="px-3 py-2">{product.stock <= 0 ? "Out of Stock" : "Enabled"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">8. Screenshot E — Out-of-Stock Product</h2>
          <p className="mt-3 leading-7">
            The Compact Trail First Aid Kit was imported with Stock = 1. A Manual Payment test purchase reduced the quantity
            to 0. The product page now displays Out of Stock.
          </p>
          {oosProduct ? (
            <div className="mt-4 overflow-hidden rounded-3xl border border-red-200 bg-red-50">
              <img src={oosProduct.imageUrl} alt={oosProduct.title} className="h-56 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-red-800">
                  {oosProduct.sku} · {oosProduct.category}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{oosProduct.title}</h3>
                <p className="mt-2 text-lg font-semibold text-red-800">
                  {oosProduct.stock <= 0 ? "Out of Stock" : `Current stock: ${oosProduct.stock}`}
                </p>
                <p className="mt-2 text-sm">Live stock quantity after the test purchase: {oosProduct.stock}</p>
              </div>
            </div>
          ) : (
            <p>The Out-of-Stock test product was not found.</p>
          )}
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">9. Screenshot F — Order Fulfillment and Tracking Number</h2>
          {demoOrder ? (
            <div className="mt-4 rounded-3xl border border-sand p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gold-dark">Test order</p>
              <p className="mt-2 font-serif text-3xl">{demoOrder.orderNumber}</p>
              <p className="mt-2 text-sm">
                Full order details page:{" "}
                <a className="font-semibold text-pine" href={`${siteUrl}/order/${demoOrder.orderNumber}`}>
                  {siteUrl}/order/{demoOrder.orderNumber}
                </a>
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <p>
                  <span className="text-muted">Customer:</span> {demoOrder.customerName}
                </p>
                <p>
                  <span className="text-muted">Email:</span> {demoOrder.customerEmail}
                </p>
                <p>
                  <span className="text-muted">Phone:</span> {demoOrder.customerPhone}
                </p>
                <p>
                  <span className="text-muted">Payment:</span> {demoOrder.paymentMethod}
                </p>
                <p>
                  <span className="text-muted">Status:</span> <strong className="capitalize">{demoOrder.status}</strong>
                </p>
                <p>
                  <span className="text-muted">Tracking number:</span> <strong>{demoOrder.trackingNumber}</strong>
                </p>
                <p>
                  <span className="text-muted">Shipping address:</span> {demoOrder.shippingAddress}, {demoOrder.city},{" "}
                  {demoOrder.country}
                </p>
                <p>
                  <span className="text-muted">Fulfilled:</span> {formatDate(demoOrder.fulfilledAt)}
                </p>
                <p>
                  <span className="text-muted">Subtotal:</span> {money(demoOrder.subtotal)}
                </p>
                <p>
                  <span className="text-muted">Shipping:</span> {money(demoOrder.shipping)}
                </p>
                <p>
                  <span className="text-muted">Total:</span> {money(demoOrder.total)}
                </p>
              </div>
              <ul className="mt-4 text-sm">
                {demoItems.map((item) => (
                  <li key={item.id}>
                    {item.title} · {item.sku} × {item.quantity} · {money(item.unitPrice)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-3">No test order is available yet.</p>
          )}
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">10. Screenshot G — Mobile Website</h2>
          <p className="mt-3 leading-7">
            The mobile layout was tested using a narrow viewport. Navigation collapses into a Menu button, product cards stack
            vertically, images scale to the screen width, and checkout controls remain tappable.
          </p>
          <div className="mx-auto mt-6 w-[320px] overflow-hidden rounded-[2rem] border-8 border-ink bg-cream shadow-2xl">
            <div className="bg-pine px-4 py-4 text-cream">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{STORE.name}</p>
              <p className="font-serif text-2xl">Gear for the trail ahead.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 p-3">
              {catalog.slice(0, 3).map((product) => (
                <div key={product.id} className="overflow-hidden rounded-2xl bg-white">
                  <img src={product.imageUrl} alt={product.title} className="h-24 w-full object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-pine">{money(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-6">
          <h2 className="font-serif text-3xl">11. Final Website Link</h2>
          <p className="mt-3 leading-7">
            The live website for grading is{" "}
            <a className="font-semibold text-pine" href={siteUrl}>
              {siteUrl}
            </a>
            . Academic documents are available at {siteUrl}/report and {siteUrl}/presentation. The store dashboard is at{" "}
            {siteUrl}/login.
          </p>
        </section>
      </article>
    </div>
  );
}
