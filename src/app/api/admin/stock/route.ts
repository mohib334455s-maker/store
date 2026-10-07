import { NextResponse } from "next/server";
import { setProductStock } from "@/db";
import { isAdmin } from "@/lib/auth";
import { bootstrapStore } from "@/lib/bootstrap";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  await bootstrapStore();
  const body = (await request.json()) as { sku?: string; stock?: number };
  const sku = body.sku;
  const stock = typeof body.stock === "number" ? body.stock : Number.NaN;
  if (!sku || !Number.isInteger(stock) || stock < 0) {
    return NextResponse.json({ ok: false, message: "A valid SKU and whole-number stock quantity are required." }, { status: 400 });
  }

  await setProductStock(sku, stock);
  return NextResponse.json({ ok: true });
}
