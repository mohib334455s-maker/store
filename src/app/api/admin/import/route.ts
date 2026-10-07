import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { bootstrapStore } from "@/lib/bootstrap";
import { importCsvText, importOfficialCsv } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    await bootstrapStore();
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ ok: false, message: "Please upload a CSV file." }, { status: 400 });
      }
      const text = await file.text();
      const result = await importCsvText(text, file.name);
      return NextResponse.json({
        ok: true,
        count: result.imported.length,
        message: `Successfully imported ${result.imported.length} products from ${file.name}.`,
      });
    }

    const result = await importOfficialCsv();
    return NextResponse.json({
      ok: true,
      count: result.imported.length,
      message: `Successfully imported ${result.imported.length} products from ${result.filename}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
