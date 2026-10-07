export type Product = {
  id: number;
  sku: string;
  title: string;
  category: string;
  price: string;
  stock: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CsvImport = {
  id: number;
  filename: string;
  rowCount: number;
  status: string;
  mapping: string;
  notes: string | null;
  importedAt: string;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country: string;
  paymentMethod: string;
  status: string;
  trackingNumber: string | null;
  notes: string | null;
  subtotal: string;
  shipping: string;
  total: string;
  createdAt: string;
  fulfilledAt: string | null;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  sku: string;
  title: string;
  unitPrice: string;
  quantity: number;
  imageUrl: string;
};

export type NewProduct = {
  sku: string;
  title: string;
  category: string;
  price: string;
  stock: number;
  description: string;
  imageUrl: string;
};
