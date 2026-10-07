import { NextResponse } from "next/server";
import { setProductStock } from "@/db";
import { isAdmin } from "@/lib/auth";
import { bootstrapStore } from "@/lib/bootstrap";
import { OOS_TEST_SKU } from "@/lib/store";

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  await bootstrapStore();
  await setProductStock(OOS_TEST_SKU, 1);
  return NextResponse.json({
    ok: true,
    message: `${OOS_TEST_SKU} stock is now 1. Purchase it on the live store to repeat the Out-of-Stock test.`,
  });
}
