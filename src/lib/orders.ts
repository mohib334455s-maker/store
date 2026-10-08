import {
  addCsvImport,
  createOrderRecord,
  fulfillOrderRecord,
  getOrderById,
  getProductBySku,
  upsertProduct,
} from "@/db";
import { parseCsv, readOfficialCsv, type ProductCsvRow } from "@/lib/csv";
import {
  CSV_FIELD_MAPPING,
  DEMO_ORDER_NUMBER,
  DEMO_TRACKING_NUMBER,
  OOS_TEST_SKU,
  SHIPPING_FLAT,
} from "@/lib/store";

type CheckoutItem = { sku: string; quantity: number };

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

export async function importProductRows(rows: ProductCsvRow[], filename: string) {
  const imported = [];

  for (const row of rows) {
    const product = await upsertProduct({
      sku: row.SKU,
      title: row.Title,
      category: row.Category,
      price: row.Price,
      stock: Number.parseInt(row.Stock, 10),
      description: row.Description,
      imageUrl: row.ImageURL,
    });
    imported.push(product);
  }

  await addCsvImport({
    filename,
    rowCount: rows.length,
    status: "success",
    mapping: JSON.stringify(CSV_FIELD_MAPPING),
    notes: "CSV fields mapped to catalog, inventory, description, and online product image.",
  });

  return imported;
}

export async function importOfficialCsv() {
  const file = await readOfficialCsv();
  const imported = await importProductRows(file.rows, file.filename);
  return { ...file, imported };
}

export async function importCsvText(text: string, filename: string) {
  const rows = parseCsv(text);
  const imported = await importProductRows(rows, filename);
  return { rows, imported };
}

export async function createOrder(input: {
  items: CheckoutItem[];
  customer: Customer;
  paymentMethod: string;
  orderNumber?: string;
  notes?: string;
}) {
  if (input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const lines: {
    productId: number;
    sku: string;
    title: string;
    unitPrice: string;
    quantity: number;
    imageUrl: string;
    lineTotal: number;
  }[] = [];
  const stockUpdates: { sku: string; stock: number }[] = [];

  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Each item quantity must be at least 1.");
    }

    const product = await getProductBySku(item.sku);
    if (!product) {
      throw new Error(`Product ${item.sku} was not found.`);
    }
    if (product.stock < item.quantity) {
      if (product.stock <= 0) {
        throw new Error(`${product.title} is out of stock.`);
      }
      throw new Error(`Only ${product.stock} of ${product.title} remaining.`);
    }

    stockUpdates.push({ sku: product.sku, stock: product.stock - item.quantity });

    const unitPrice = Number.parseFloat(product.price);
    lines.push({
      productId: product.id,
      sku: product.sku,
      title: product.title,
      unitPrice: product.price,
      quantity: item.quantity,
      imageUrl: product.imageUrl,
      lineTotal: unitPrice * item.quantity,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping = subtotal >= 150 ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const orderNumber = input.orderNumber ?? `NL-${Date.now().toString().slice(-8)}`;

  const order = await createOrderRecord({
    orderNumber,
    customerName: input.customer.name,
    customerEmail: input.customer.email,
    customerPhone: input.customer.phone,
    shippingAddress: input.customer.address,
    city: input.customer.city,
    country: input.customer.country,
    paymentMethod: input.paymentMethod,
    status: "paid",
    notes: input.notes ?? null,
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2),
    items: lines.map((line) => ({
      productId: line.productId,
      sku: line.sku,
      title: line.title,
      unitPrice: line.unitPrice,
      quantity: line.quantity,
      imageUrl: line.imageUrl,
    })),
    stockUpdates,
  });

  return { order, items: lines, subtotal, shipping, total };
}

export async function fulfillOrder(orderId: number, trackingNumber: string) {
  const existing = await getOrderById(orderId);
  if (!existing) {
    throw new Error("Order not found.");
  }
  if (!trackingNumber.trim()) {
    throw new Error("A tracking number is required to ship this order.");
  }
  return fulfillOrderRecord(orderId, trackingNumber);
}

export async function createDemonstrationOrder() {
  const result = await createOrder({
    orderNumber: DEMO_ORDER_NUMBER,
    paymentMethod: "Manual Payment (Test Mode)",
    notes: "COMP101 Out-of-Stock and fulfillment demonstration order.",
    items: [{ sku: OOS_TEST_SKU, quantity: 1 }],
    customer: {
      name: "Test Customer",
      email: "test.customer@northlane.demo",
      phone: "+971 50 000 1010",
      address: "123 Trailhead Avenue",
      city: "Dubai",
      country: "United Arab Emirates",
    },
  });

  await fulfillOrder(result.order.id, DEMO_TRACKING_NUMBER);
  return result.order;
}
