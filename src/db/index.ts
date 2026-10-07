import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { CsvImport, NewProduct, Order, OrderItem, Product } from "@/db/schema";

type StoreData = {
  nextProductId: number;
  nextImportId: number;
  nextOrderId: number;
  nextOrderItemId: number;
  products: Product[];
  csvImports: CsvImport[];
  orders: Order[];
  orderItems: OrderItem[];
};

const emptyStore = (): StoreData => ({
  nextProductId: 1,
  nextImportId: 1,
  nextOrderId: 1,
  nextOrderItemId: 1,
  products: [],
  csvImports: [],
  orders: [],
  orderItems: [],
});

const globalForStore = globalThis as typeof globalThis & {
  __peaklineStore?: StoreData;
};

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "store.json");

function loadStore(): StoreData {
  if (globalForStore.__peaklineStore) {
    return globalForStore.__peaklineStore;
  }

  if (isServerless) {
    globalForStore.__peaklineStore = emptyStore();
    return globalForStore.__peaklineStore;
  }

  try {
    mkdirSync(dataDir, { recursive: true });
    if (existsSync(dataFile)) {
      globalForStore.__peaklineStore = JSON.parse(readFileSync(dataFile, "utf8")) as StoreData;
    } else {
      const fresh = emptyStore();
      writeFileSync(dataFile, JSON.stringify(fresh, null, 2), "utf8");
      globalForStore.__peaklineStore = fresh;
    }
  } catch {
    globalForStore.__peaklineStore = emptyStore();
  }

  return globalForStore.__peaklineStore;
}

function saveStore(store: StoreData) {
  globalForStore.__peaklineStore = store;
  if (isServerless) {
    return;
  }
  try {
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(dataFile, JSON.stringify(store, null, 2), "utf8");
  } catch {
  }
}

function nowIso() {
  return new Date().toISOString();
}

export async function ensureDatabase() {
  loadStore();
}

export async function listProducts(sort: "stock-desc" | "title-asc" = "title-asc") {
  const items = [...loadStore().products];
  if (sort === "stock-desc") {
    items.sort((a, b) => b.stock - a.stock || a.title.localeCompare(b.title));
  } else {
    items.sort((a, b) => a.title.localeCompare(b.title));
  }
  return items;
}

export async function getProductBySku(sku: string) {
  return loadStore().products.find((product) => product.sku === sku) ?? null;
}

export async function upsertProduct(input: NewProduct) {
  const store = loadStore();
  const existing = store.products.find((product) => product.sku === input.sku);
  const stamp = nowIso();

  if (existing) {
    existing.title = input.title;
    existing.category = input.category;
    existing.price = input.price;
    existing.stock = input.stock;
    existing.description = input.description;
    existing.imageUrl = input.imageUrl;
    existing.updatedAt = stamp;
    saveStore(store);
    return existing;
  }

  const product: Product = {
    id: store.nextProductId++,
    ...input,
    createdAt: stamp,
    updatedAt: stamp,
  };
  store.products.push(product);
  saveStore(store);
  return product;
}

export async function setProductStock(sku: string, stock: number) {
  const store = loadStore();
  const product = store.products.find((item) => item.sku === sku);
  if (!product) {
    throw new Error(`Product ${sku} was not found.`);
  }
  product.stock = stock;
  product.updatedAt = nowIso();
  saveStore(store);
  return product;
}

export async function listCsvImports() {
  return [...loadStore().csvImports].sort((a, b) => b.importedAt.localeCompare(a.importedAt));
}

export async function addCsvImport(input: {
  filename: string;
  rowCount: number;
  status: string;
  mapping: string;
  notes: string | null;
}) {
  const store = loadStore();
  const record: CsvImport = {
    id: store.nextImportId++,
    filename: input.filename,
    rowCount: input.rowCount,
    status: input.status,
    mapping: input.mapping,
    notes: input.notes,
    importedAt: nowIso(),
  };
  store.csvImports.unshift(record);
  saveStore(store);
  return record;
}

export async function listOrders() {
  return [...loadStore().orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderById(id: number) {
  return loadStore().orders.find((order) => order.id === id) ?? null;
}

export async function getOrderByNumber(orderNumber: string) {
  return loadStore().orders.find((order) => order.orderNumber === orderNumber) ?? null;
}

export async function getOrderItems(orderId: number) {
  return loadStore().orderItems.filter((item) => item.orderId === orderId);
}

export async function createOrderRecord(input: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country: string;
  paymentMethod: string;
  status: string;
  notes: string | null;
  subtotal: string;
  shipping: string;
  total: string;
  items: {
    productId: number;
    sku: string;
    title: string;
    unitPrice: string;
    quantity: number;
    imageUrl: string;
  }[];
  stockUpdates: { sku: string; stock: number }[];
}) {
  const store = loadStore();

  for (const update of input.stockUpdates) {
    const product = store.products.find((item) => item.sku === update.sku);
    if (!product) {
      throw new Error(`Product ${update.sku} was not found.`);
    }
    product.stock = update.stock;
    product.updatedAt = nowIso();
  }

  const order: Order = {
    id: store.nextOrderId++,
    orderNumber: input.orderNumber,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    shippingAddress: input.shippingAddress,
    city: input.city,
    country: input.country,
    paymentMethod: input.paymentMethod,
    status: input.status,
    trackingNumber: null,
    notes: input.notes,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    createdAt: nowIso(),
    fulfilledAt: null,
  };

  store.orders.unshift(order);

  for (const item of input.items) {
    store.orderItems.push({
      id: store.nextOrderItemId++,
      orderId: order.id,
      productId: item.productId,
      sku: item.sku,
      title: item.title,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    });
  }

  saveStore(store);
  return order;
}

export async function fulfillOrderRecord(orderId: number, trackingNumber: string) {
  const store = loadStore();
  const order = store.orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order not found.");
  }
  order.status = "shipped";
  order.trackingNumber = trackingNumber.trim();
  order.fulfilledAt = nowIso();
  saveStore(store);
  return order;
}

export async function countProducts() {
  return loadStore().products.length;
}

export async function countOrders() {
  return loadStore().orders.length;
}
