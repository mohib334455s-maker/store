import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "src", "data", "catalogCsv.ts");
const source = fs.readFileSync(catalogPath, "utf8");
const match = source.match(/export const OFFICIAL_PRODUCTS_CSV = `([\s\S]*?)`;/);
if (!match) throw new Error("OFFICIAL_PRODUCTS_CSV not found");
const OFFICIAL_PRODUCTS_CSV = match[1].trim() + "\n";

const csvDir = path.join(root, "COMP101_Project1", "CSV");
const publicSamples = path.join(root, "public", "data", "samples");
const packSamples = path.join(csvDir, "samples");
fs.mkdirSync(publicSamples, { recursive: true });
fs.mkdirSync(packSamples, { recursive: true });
fs.mkdirSync(path.join(root, "public", "data"), { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const clean = text.replace(/^\uFEFF/, "").trim();
  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    const next = clean[i + 1];
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
    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toExcelXml(rows, sheetName) {
  const body = rows
    .map(
      (row) => `   <Row>
${row.map((cell) => `    <Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join("\n")}
   </Row>`,
    )
    .join("\n");
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="${sheetName}">
  <Table>
${body}
  </Table>
 </Worksheet>
</Workbook>
`;
}

const rows = parseCsv(OFFICIAL_PRODUCTS_CSV);
const csvBom = `\uFEFF${OFFICIAL_PRODUCTS_CSV}`;

fs.writeFileSync(path.join(root, "public", "data", "products.csv"), csvBom);
fs.writeFileSync(path.join(csvDir, "products.csv"), csvBom);

const outputs = [
  ["sample-valid-10-products.csv", csvBom],
  ["sample-valid-10-products.xls", toExcelXml(rows, "Products")],
  ["sample-template-10-products.xls", toExcelXml(rows, "Products")],
];

for (const [name, content] of outputs) {
  fs.writeFileSync(path.join(publicSamples, name), content);
  fs.writeFileSync(path.join(packSamples, name), content);
}

const readme = `Northlane Outfitters — CSV / Excel samples for COMP101

Required header (exact):
SKU,Title,Category,Price,Stock,Description,ImageURL

Rules:
- Exactly 10 products
- Price like 28.00
- Stock whole number
- ImageURL must start with http:// or https://
- Import the file (do not type products one by one)

Files:
- sample-valid-10-products.csv  ready to upload
- sample-valid-10-products.xls  open in Microsoft Excel
- sample-template-10-products.xls Excel template with the same 10 rows

How to import from Excel:
1. Open the .xls sample in Excel
2. File → Save As → CSV UTF-8 (Comma delimited) (*.csv)
3. Admin → CSV import → Upload another CSV
`;

fs.writeFileSync(path.join(publicSamples, "README.txt"), readme);
fs.writeFileSync(path.join(packSamples, "README.txt"), readme);
console.log("Excel/CSV samples written");
