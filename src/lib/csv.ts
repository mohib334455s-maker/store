import { readFile } from "fs/promises";
import path from "path";
import { CSV_HEADERS } from "@/lib/store";

export type ProductCsvRow = {
  SKU: string;
  Title: string;
  Category: string;
  Price: string;
  Stock: string;
  Description: string;
  ImageURL: string;
};

export function parseCsv(text: string): ProductCsvRow[] {
  const rows = splitCsv(text.replace(/^\uFEFF/, "").trim());
  if (rows.length === 0) {
    throw new Error("The CSV file is empty.");
  }

  const header = rows[0].map((cell) => cell.trim());
  const expected = [...CSV_HEADERS];
  if (header.length !== expected.length || expected.some((key, i) => header[i] !== key)) {
    throw new Error(
      `CSV header must be exactly ${expected.join(",")}. Received: ${header.join(",")}`,
    );
  }

  const products = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  const seen = new Set<string>();
  const parsed: ProductCsvRow[] = [];

  for (const [index, row] of products.entries()) {
    const record = Object.fromEntries(expected.map((key, i) => [key, (row[i] ?? "").trim()])) as ProductCsvRow;
    const line = index + 2;
    for (const key of expected) {
      if (!record[key]) {
        throw new Error(`Row ${line} is missing ${key}.`);
      }
    }
    if (seen.has(record.SKU)) {
      throw new Error(`Duplicate SKU ${record.SKU} on row ${line}.`);
    }
    if (!/^\d+(\.\d{1,2})?$/.test(record.Price)) {
      throw new Error(`Row ${line} has an invalid price: ${record.Price}`);
    }
    if (!/^\d+$/.test(record.Stock)) {
      throw new Error(`Row ${line} has an invalid stock quantity: ${record.Stock}`);
    }
    if (!/^https?:\/\//i.test(record.ImageURL)) {
      throw new Error(`Row ${line} ImageURL must be an online http(s) link.`);
    }
    seen.add(record.SKU);
    parsed.push(record);
  }

  if (parsed.length !== 10) {
    throw new Error(`CSV must contain exactly 10 products. Found ${parsed.length}.`);
  }

  return parsed;
}

export async function readOfficialCsv(): Promise<{ filename: string; text: string; rows: ProductCsvRow[] }> {
  const filename = "products.csv";
  const csvPath = path.join(process.cwd(), "public", "data", "products.csv");
  const text = await readFile(csvPath, "utf8");
  return { filename, text, rows: parseCsv(text) };
}

function splitCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}
