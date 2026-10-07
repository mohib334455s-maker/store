import { NextResponse } from "next/server";
import { bootstrapStore } from "@/lib/bootstrap";
import { createOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await bootstrapStore();
    const body = (await request.json()) as {
      items?: { sku: string; quantity: number }[];
      customer?: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
      };
      paymentMethod?: string;
    };

    if (!body.items || !body.customer) {
      return NextResponse.json({ ok: false, message: "Checkout details are incomplete." }, { status: 400 });
    }

    const required = ["name", "email", "phone", "address", "city", "country"] as const;
    for (const key of required) {
      if (!body.customer[key]?.trim()) {
        return NextResponse.json({ ok: false, message: "Please complete every customer field." }, { status: 400 });
      }
    }

    const result = await createOrder({
      items: body.items,
      customer: body.customer,
      paymentMethod: body.paymentMethod ?? "Manual Payment (Test Mode)",
    });

    return NextResponse.json({ ok: true, orderNumber: result.order.orderNumber });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
