import { headers } from "next/headers";
import { getOrderItems, listCsvImports, listOrders, listProducts } from "@/db";
import { bootstrapStore } from "@/lib/bootstrap";
import { readOfficialCsv } from "@/lib/csv";
import { PresentationDeck } from "@/app/presentation/PresentationDeck";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  CSV_FIELD_MAPPING,
  DEMO_TRACKING_NUMBER,
  OOS_TEST_SKU,
  PROJECT_TITLE,
  STORE,
  STUDENT_1,
  STUDENT_2,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "COMP101 Project 1 Presentation" };

export default async function PresentationPage() {
  await bootstrapStore();
  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;
  const csv = await readOfficialCsv();
  const catalog = await listProducts("title-asc");
  const imports = await listCsvImports();
  const allOrders = await listOrders();
  const demoOrder = allOrders[0];
  const demoItems = demoOrder ? await getOrderItems(demoOrder.id) : [];
  const oos = catalog.find((product) => product.sku === OOS_TEST_SKU);

  return (
    <PresentationDeck
      siteUrl={siteUrl}
      student1={STUDENT_1}
      student2={STUDENT_2}
      projectTitle={PROJECT_TITLE}
      storeName={STORE.legalName}
      brandColor={STORE.brandColor}
      platform={STORE.platform}
      username={ADMIN_USERNAME}
      password={ADMIN_PASSWORD}
      csvRows={csv.rows}
      mapping={[...CSV_FIELD_MAPPING]}
      products={catalog.map((product) => ({
        sku: product.sku,
        title: product.title,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
      }))}
      importStatus={
        imports[0] ? `${imports[0].status} · ${imports[0].rowCount} products from ${imports[0].filename}` : "Not imported"
      }
      oos={{
        sku: oos?.sku ?? OOS_TEST_SKU,
        title: oos?.title ?? "Compact Trail First Aid Kit",
        stock: oos?.stock ?? 0,
        imageUrl: oos?.imageUrl ?? "",
      }}
      order={{
        orderNumber: demoOrder?.orderNumber ?? "NL-10001",
        status: demoOrder?.status ?? "shipped",
        trackingNumber: demoOrder?.trackingNumber ?? DEMO_TRACKING_NUMBER,
        customerName: demoOrder?.customerName ?? "Test Customer",
        paymentMethod: demoOrder?.paymentMethod ?? "Manual Payment (Test Mode)",
        items: demoItems.map((item) => `${item.title} × ${item.quantity}`),
      }}
    />
  );
}
