import { countOrders, countProducts, ensureDatabase } from "@/db";
import { createDemonstrationOrder, importOfficialCsv } from "@/lib/orders";

let bootPromise: Promise<void> | null = null;

async function runBootstrap() {
  await ensureDatabase();

  if ((await countProducts()) === 0) {
    await importOfficialCsv();
  }

  if ((await countOrders()) === 0) {
    await createDemonstrationOrder();
  }
}

export function bootstrapStore() {
  if (!bootPromise) {
    bootPromise = runBootstrap().catch((error) => {
      bootPromise = null;
      console.error("Store bootstrap failed", error);
      throw error;
    });
  }
  return bootPromise;
}
