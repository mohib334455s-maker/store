import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { bootstrapStore } from "@/lib/bootstrap";
import { fulfillOrder } from "@/lib/orders";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    await bootstrapStore();
    const body = (await request.json()) as { orderId?: number; trackingNumber?: string };
    if (!body.orderId || !body.trackingNumber) {
      return NextResponse.json({ ok: false, message: "Order and tracking number are required." }, { status: 400 });
    }
    const order = await fulfillOrder(body.orderId, body.trackingNumber);
    return NextResponse.json({ ok: true, message: `Order ${order.orderNumber} marked shipped with ${order.trackingNumber}.` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fulfillment failed.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
