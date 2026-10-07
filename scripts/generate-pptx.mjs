import fs from "node:fs";
import path from "node:path";
import PptxGenJS from "pptxgenjs";

const outDir = path.join(process.cwd(), "COMP101_Project1", "Presentation");
fs.mkdirSync(outDir, { recursive: true });

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "COMP101 Project 1";
pptx.title = "Project 1: E-Commerce Website";

const pine = "1A5F4A";
const gold = "C4A35A";
const cream = "F4F0E8";
const ink = "1C1917";

const products = [
  ["PL-HIK-001", "Alpine Ridge Backpack 45L", "Hiking", "189.00", "24"],
  ["PL-HIK-002", "Merino Trail Socks 3-Pack", "Hiking", "36.00", "48"],
  ["PL-HIK-003", "Carbonlite Trekking Poles", "Hiking", "129.00", "18"],
  ["PL-HIK-004", "Summit Trail Running Shoes", "Hiking", "158.00", "12"],
  ["PL-CMP-001", "Ultralight 2-Person Tent", "Camping", "249.00", "8"],
  ["PL-CMP-002", "Alpine Down Sleeping Bag", "Camping", "219.00", "10"],
  ["PL-CMP-003", "Titanium Camp Stove", "Camping", "89.00", "22"],
  ["PL-CMP-004", "Insulated Steel Bottle 1L", "Camping", "42.00", "35"],
  ["PL-TRV-001", "Packable Storm Jacket", "Travel", "164.00", "15"],
  ["PL-TRV-002", "Compact Trail First Aid Kit", "Travel", "28.00", "1"],
];

function addChrome(slide, title) {
  slide.addShape("rect", { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: pine } });
  slide.addText(title, {
    x: 0.6,
    y: 0.28,
    w: 12,
    h: 0.4,
    fontSize: 12,
    color: gold,
    fontFace: "Calibri",
    margin: 0,
  });
}

const cover = pptx.addSlide();
addChrome(cover, "COMP101");
cover.addText("Project 1: E-Commerce Website", {
  x: 0.7,
  y: 2.1,
  w: 12,
  h: 1.2,
  fontSize: 36,
  fontFace: "Georgia",
  color: cream,
  bold: true,
});
cover.addText("Peakline Outfitters", {
  x: 0.7,
  y: 3.3,
  w: 12,
  h: 0.5,
  fontSize: 22,
  color: gold,
  fontFace: "Calibri",
});
cover.addText("Alex Morgan\nSam Rivera", {
  x: 0.7,
  y: 4.4,
  w: 12,
  h: 1,
  fontSize: 18,
  color: cream,
  fontFace: "Calibri",
});

const web = pptx.addSlide();
addChrome(web, "LIVE WEBSITE");
web.addText("Peakline Outfitters", {
  x: 0.7,
  y: 1.1,
  w: 12,
  h: 0.7,
  fontSize: 32,
  color: cream,
  fontFace: "Georgia",
});
web.addText(
  "English-language outdoor store selling hiking, camping, and travel gear. Ten products were imported from CSV with online image URLs, live inventory, test checkout, fulfillment, and tracking numbers.\n\nPlatform: Peakline Commerce (Next.js e-commerce platform)\nCategories: Hiking · Camping · Travel\nLive website: http://localhost:3000\nLogin: admin / Peakline101\nAcademic deck: /presentation",
  { x: 0.7, y: 2, w: 12, h: 4.2, fontSize: 18, color: cream, fontFace: "Calibri" },
);

const csv = pptx.addSlide();
addChrome(csv, "CSV DATABASE");
csv.addText("products.csv — SKU, Title, Category, Price, Stock, Description, ImageURL", {
  x: 0.5,
  y: 0.8,
  w: 12.3,
  h: 0.4,
  fontSize: 16,
  color: cream,
  fontFace: "Calibri",
});
csv.addTable(
  [
    [
      { text: "SKU", options: { fill: { color: gold }, color: ink, bold: true } },
      { text: "Title", options: { fill: { color: gold }, color: ink, bold: true } },
      { text: "Category", options: { fill: { color: gold }, color: ink, bold: true } },
      { text: "Price", options: { fill: { color: gold }, color: ink, bold: true } },
      { text: "Stock", options: { fill: { color: gold }, color: ink, bold: true } },
      { text: "Image", options: { fill: { color: gold }, color: ink, bold: true } },
    ],
    ...products.map((row) => row.concat(["Online ImageURL"])),
  ],
  {
    x: 0.45,
    y: 1.3,
    w: 12.4,
    colW: [1.6, 3.6, 1.5, 1.3, 1.2, 3.2],
    fontFace: "Calibri",
    fontSize: 11,
    color: ink,
    fill: { color: cream },
    border: [{ pt: 0 }, { pt: 0 }, { pt: 0 }, { pt: 0 }],
    valign: "middle",
  },
);

const mapped = pptx.addSlide();
addChrome(mapped, "PRODUCT IMPORT");
mapped.addText("CSV fields were mapped and all 10 products imported successfully.", {
  x: 0.7,
  y: 1.1,
  w: 12,
  h: 0.5,
  fontSize: 20,
  color: cream,
  fontFace: "Calibri",
});
mapped.addTable(
  [
    ["CSV column", "Platform field"],
    ["SKU", "SKU"],
    ["Title", "Product Title"],
    ["Category", "Category"],
    ["Price", "Price"],
    ["Stock", "Inventory/Stock"],
    ["Description", "Description"],
    ["ImageURL", "Product Image"],
  ].map((row, index) =>
    row.map((text) => ({
      text,
      options: {
        fill: { color: index === 0 ? gold : cream },
        color: ink,
        bold: index === 0,
      },
    })),
  ),
  { x: 0.7, y: 1.8, w: 8, fontSize: 14, fontFace: "Calibri", colW: [3.5, 4.5] },
);

const inv = pptx.addSlide();
addChrome(inv, "INVENTORY TRACKING");
inv.addText("Inventory tracking is enabled for every SKU. Checkout reduces stock inside a database transaction.", {
  x: 0.7,
  y: 1,
  w: 12,
  h: 0.7,
  fontSize: 16,
  color: cream,
  fontFace: "Calibri",
});
inv.addTable(
  [
    [
      { text: "SKU", options: { fill: { color: gold }, color: ink, bold: true } },
      { text: "Title", options: { fill: { color: gold }, color: ink, bold: true } },
      { text: "Stock after demonstration", options: { fill: { color: gold }, color: ink, bold: true } },
    ],
    ...products.map((row) => [row[0], row[1], row[0] === "PL-TRV-002" ? "0 — Out of Stock" : row[4]]),
  ],
  { x: 0.7, y: 1.8, w: 12, fontSize: 12, fontFace: "Calibri", fill: { color: cream }, color: ink },
);

const oos = pptx.addSlide();
addChrome(oos, "OUT OF STOCK TEST");
oos.addText("Compact Trail First Aid Kit", {
  x: 0.7,
  y: 1.3,
  w: 12,
  h: 0.7,
  fontSize: 32,
  color: cream,
  fontFace: "Georgia",
});
oos.addText(
  "1. Stock quantity set to 1\n2. Live store opened\n3. Test purchase completed with Manual Payment\n4. Stock became 0\n5. Product page displays Out of Stock\n\nSKU: PL-TRV-002",
  { x: 0.7, y: 2.2, w: 12, h: 3.5, fontSize: 20, color: cream, fontFace: "Calibri" },
);

const order = pptx.addSlide();
addChrome(order, "ORDER FULFILLMENT");
order.addText("Test order PKL-10001", {
  x: 0.7,
  y: 1.3,
  w: 12,
  h: 0.6,
  fontSize: 32,
  color: cream,
  fontFace: "Georgia",
});
order.addText("Status: Shipped / Fulfilled", {
  x: 0.7,
  y: 2.2,
  w: 12,
  h: 0.5,
  fontSize: 22,
  color: gold,
  fontFace: "Calibri",
});
order.addText("Tracking Number: DXB-TRK-12345", {
  x: 0.7,
  y: 2.9,
  w: 12,
  h: 0.5,
  fontSize: 22,
  color: cream,
  fontFace: "Calibri",
});
order.addText(
  "Customer: Test Customer\nPayment: Manual Payment (Test Mode)\nItem: Compact Trail First Aid Kit × 1",
  { x: 0.7, y: 3.7, w: 12, h: 1.6, fontSize: 18, color: cream, fontFace: "Calibri" },
);

const mobile = pptx.addSlide();
addChrome(mobile, "MOBILE WEBSITE");
mobile.addText("The store works on mobile devices", {
  x: 0.7,
  y: 1.3,
  w: 12,
  h: 0.7,
  fontSize: 32,
  color: cream,
  fontFace: "Georgia",
});
mobile.addText(
  "Homepage, navigation, product listing, product pages, images, buttons, cart, and checkout remain usable on a phone-width screen. The header uses a Menu button, images scale to the viewport, and content does not overflow horizontally.\n\nOpen /presentation and /report on the live website for the live mobile evidence view.",
  { x: 0.7, y: 2.2, w: 12, h: 3.6, fontSize: 18, color: cream, fontFace: "Calibri" },
);

const outFile = path.join(outDir, "COMP101_Project1_Presentation.pptx");
await pptx.writeFile({ fileName: outFile });
console.log(`Wrote ${outFile}`);
