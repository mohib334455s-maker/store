export function money(value: string | number) {
  const amount = typeof value === "number" ? value : Number.parseFloat(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function stockLabel(stock: number) {
  if (stock <= 0) return "Out of Stock";
  if (stock === 1) return "Only 1 left in stock";
  return `${stock} in stock`;
}
