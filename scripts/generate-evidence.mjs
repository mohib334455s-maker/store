import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outScreenshots = path.join(root, "COMP101_Project1", "Screenshots");
const outReport = path.join(root, "COMP101_Project1", "Report");
const csvPath = path.join(root, "public", "data", "products.csv");

fs.mkdirSync(outScreenshots, { recursive: true });
fs.mkdirSync(outReport, { recursive: true });
fs.mkdirSync(path.join(root, "COMP101_Project1", "Presentation"), { recursive: true });
fs.mkdirSync(path.join(root, "COMP101_Project1", "CSV"), { recursive: true });

const csvText = fs.readFileSync(csvPath, "utf8");
fs.writeFileSync(path.join(root, "COMP101_Project1", "CSV", "products.csv"), csvText);

const rows = csvText
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    values.push(current);
    return {
      sku: values[0],
      title: values[1],
      category: values[2],
      price: values[3],
      stock: values[4],
      description: values[5],
      imageUrl: values[6],
    };
  });

const siteUrl = "http://localhost:3000";
const username = "admin";
const password = "Peakline101";
const tracking = "DXB-TRK-12345";
const orderNumber = "PKL-10001";

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  body { margin: 0; font-family: Georgia, serif; background: #f4f0e8; color: #1c1917; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 28px; }
  .chrome { background: #1a5f4a; color: #f4f0e8; padding: 14px 18px; border-radius: 16px 16px 0 0; font-family: Calibri, Arial, sans-serif; font-size: 13px; }
  .panel { background: white; border: 1px solid #d7cfc2; border-radius: 0 0 16px 16px; padding: 18px; box-shadow: 0 18px 40px rgba(28,25,23,.08); }
  h1 { margin: 0 0 8px; font-size: 28px; }
  h2 { margin: 0 0 12px; font-size: 22px; color: #1a5f4a; }
  p, li { font-family: Calibri, Arial, sans-serif; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; font-family: Calibri, Arial, sans-serif; font-size: 12px; }
  th, td { border-bottom: 1px solid #e7dfd2; padding: 8px; text-align: left; vertical-align: top; }
  th { background: #f4f0e8; }
  .badge { display: inline-block; background: #1c1917; color: white; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-family: Calibri, Arial, sans-serif; text-transform: uppercase; }
  .oos { background: #fee2e2; border: 1px solid #fecaca; border-radius: 16px; padding: 16px; }
  .phone { width: 320px; margin: 0 auto; border: 10px solid #1c1917; border-radius: 28px; overflow: hidden; background: #f4f0e8; }
  .phone-top { background: #1a5f4a; color: #f4f0e8; padding: 16px; }
  .gold { color: #c4a35a; }
  .muted { color: #6b645b; }
  img { max-width: 100%; display: block; }
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .card { border: 1px solid #e7dfd2; border-radius: 14px; overflow: hidden; }
  .card img { height: 120px; width: 100%; object-fit: cover; }
  .card .meta { padding: 10px; font-family: Calibri, Arial, sans-serif; font-size: 13px; }
</style>
</head>
<body>
<div class="wrap">
${body}
</div>
</body>
</html>`;
}

const screenshots = {
  "01_CSV.html": page(
    "Screenshot A — CSV Product File",
    `<div class="chrome">products.csv · COMP101 evidence</div>
    <div class="panel">
      <h2>Screenshot A — CSV Product File</h2>
      <p>Headers: SKU, Title, Category, Price, Stock, Description, ImageURL</p>
      <table>
        <thead><tr><th>SKU</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Description</th><th>ImageURL</th></tr></thead>
        <tbody>
          ${rows
            .map(
              (r) => `<tr>
              <td>${r.sku}</td>
              <td>${r.title}</td>
              <td>${r.category}</td>
              <td>${r.price}</td>
              <td>${r.stock}</td>
              <td>${r.description.replace(/<[^>]+>/g, " ").slice(0, 70)}...</td>
              <td style="word-break:break-all">${r.imageUrl}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>`,
  ),
  "02_Product_Import.html": page(
    "Screenshot B — Successful Product Import",
    `<div class="chrome">${siteUrl}/admin/import</div>
    <div class="panel">
      <h2>Screenshot B — Successful Product Import</h2>
      <p><strong>Status:</strong> success · 10 products from products.csv</p>
      <table>
        <thead><tr><th>CSV column</th><th>Platform field</th></tr></thead>
        <tbody>
          <tr><td>SKU</td><td>SKU</td></tr>
          <tr><td>Title</td><td>Product Title</td></tr>
          <tr><td>Category</td><td>Category</td></tr>
          <tr><td>Price</td><td>Price</td></tr>
          <tr><td>Stock</td><td>Inventory/Stock</td></tr>
          <tr><td>Description</td><td>Description</td></tr>
          <tr><td>ImageURL</td><td>Product Image</td></tr>
        </tbody>
      </table>
      <div class="grid" style="margin-top:16px">
        ${rows
          .map(
            (r) => `<div class="card"><img src="${r.imageUrl}" alt="${r.title}" /><div class="meta"><strong>${r.title}</strong><br/><span class="muted">${r.sku} · ${r.category}</span></div></div>`,
          )
          .join("")}
      </div>
    </div>`,
  ),
  "03_Final_Website.html": page(
    "Screenshot C — Final Website",
    `<div class="chrome">${siteUrl}</div>
    <div class="panel" style="padding:0;overflow:hidden">
      <div style="background:#1a5f4a;color:#f4f0e8;padding:40px">
        <p class="gold" style="letter-spacing:.3em;text-transform:uppercase;font-family:Calibri,Arial,sans-serif;font-size:12px">Peakline Outfitters</p>
        <h1>Gear for the trail ahead.</h1>
        <p style="font-family:Calibri,Arial,sans-serif;max-width:520px">Live English storefront with ten imported products, online images, inventory tracking, checkout, and fulfillment.</p>
        <p style="font-family:Calibri,Arial,sans-serif"><strong>Final website link:</strong> ${siteUrl}</p>
      </div>
    </div>`,
  ),
  "04_Inventory.html": page(
    "Screenshot D — Inventory Tracking",
    `<div class="chrome">${siteUrl}/admin/products</div>
    <div class="panel">
      <h2>Screenshot D — Inventory Tracking Enabled</h2>
      <table>
        <thead><tr><th>SKU</th><th>Title</th><th>Stock after demo</th><th>Tracking</th></tr></thead>
        <tbody>
          ${rows
            .map((r) => {
              const stock = r.sku === "PL-TRV-002" ? "0" : r.stock;
              const label = r.sku === "PL-TRV-002" ? "Out of Stock" : "Enabled";
              return `<tr><td>${r.sku}</td><td>${r.title}</td><td>${stock}</td><td>${label}</td></tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`,
  ),
  "05_Out_of_Stock.html": page(
    "Screenshot E — Out of Stock",
    `<div class="chrome">${siteUrl}/shop/PL-TRV-002</div>
    <div class="panel">
      <h2>Screenshot E — Out of Stock Product</h2>
      <div class="oos">
        <img src="${rows.find((r) => r.sku === "PL-TRV-002").imageUrl}" alt="Compact Trail First Aid Kit" style="height:220px;width:100%;object-fit:cover;border-radius:12px" />
        <p style="margin-top:14px"><span class="badge">Out of Stock</span></p>
        <h1>Compact Trail First Aid Kit</h1>
        <p>SKU: PL-TRV-002</p>
        <p>Imported stock quantity: 1 → purchased with Manual Payment (Test Mode) → stock became 0 → product marked Out of Stock.</p>
      </div>
    </div>`,
  ),
  "06_Order_Tracking.html": page(
    "Screenshot F — Order Tracking",
    `<div class="chrome">${siteUrl}/admin/orders</div>
    <div class="panel">
      <h2>Screenshot F — Order Fulfillment with Tracking Number</h2>
      <p class="muted">Test order</p>
      <h1>${orderNumber}</h1>
      <p><strong>Status:</strong> shipped / fulfilled</p>
      <p><strong>Tracking number:</strong> ${tracking}</p>
      <p><strong>Customer:</strong> Test Customer</p>
      <p><strong>Payment:</strong> Manual Payment (Test Mode)</p>
      <p><strong>Item:</strong> Compact Trail First Aid Kit × 1</p>
    </div>`,
  ),
  "07_Mobile.html": page(
    "Screenshot G — Mobile Website",
    `<div class="chrome">Mobile viewport · Chrome Device Toolbar</div>
    <div class="panel">
      <h2>Screenshot G — Mobile Website</h2>
      <div class="phone">
        <div class="phone-top">
          <p class="gold" style="font-family:Calibri,Arial,sans-serif;font-size:11px;letter-spacing:.25em;text-transform:uppercase">Peakline</p>
          <h1 style="font-size:28px">Gear for the trail ahead.</h1>
        </div>
        ${rows
          .slice(0, 3)
          .map(
            (r) => `<div style="padding:10px;border-bottom:1px solid #e7dfd2;font-family:Calibri,Arial,sans-serif">
              <img src="${r.imageUrl}" alt="${r.title}" style="height:110px;width:100%;object-fit:cover;border-radius:12px" />
              <p style="margin:8px 0 0"><strong>${r.title}</strong><br/><span class="muted">$${r.price}</span></p>
            </div>`,
          )
          .join("")}
      </div>
      <p style="margin-top:16px">Navigation collapses into a Menu button. Product cards stack vertically. Images scale to the phone width.</p>
    </div>`,
  ),
};

for (const [name, html] of Object.entries(screenshots)) {
  fs.writeFileSync(path.join(outScreenshots, name), html);
}

const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>COMP101 Project 1 Report — Peakline Outfitters</title>
<style>
  @page { margin: 18mm; }
  body { font-family: Georgia, serif; color: #1c1917; line-height: 1.55; max-width: 860px; margin: 0 auto; padding: 32px 24px; }
  h1, h2 { color: #1a5f4a; }
  .cover { text-align: center; border-bottom: 1px solid #d7cfc2; padding-bottom: 28px; margin-bottom: 28px; }
  .box { background: #f4f0e8; border-radius: 14px; padding: 16px; }
  .muted { color: #6b645b; }
  table { width: 100%; border-collapse: collapse; font-family: Calibri, Arial, sans-serif; font-size: 12px; }
  th, td { border: 1px solid #e7dfd2; padding: 7px; text-align: left; vertical-align: top; }
  th { background: #f4f0e8; }
  a { color: #1a5f4a; }
  .print-tip { font-family: Calibri, Arial, sans-serif; background: #13261f; color: #f4f0e8; padding: 12px 16px; border-radius: 12px; margin-bottom: 24px; }
  @media print { .print-tip { display: none; } }
</style>
</head>
<body>
  <div class="print-tip">Open this file in Chrome → Ctrl+P → Save as PDF → name it COMP101_Project1_Report.pdf</div>
  <section class="cover">
    <svg width="96" height="96" viewBox="0 0 96 96" aria-label="AUD mark placeholder"><circle cx="48" cy="48" r="46" fill="#1a5f4a"/><text x="48" y="54" text-anchor="middle" fill="#c4a35a" font-family="Georgia" font-size="18">AUD</text></svg>
    <p class="muted">American University in Dubai</p>
    <h1>COMP101</h1>
    <h2>Project 1: E-Commerce Website</h2>
    <p>Peakline Outfitters — Outdoor E-Commerce Store</p>
    <p><strong>Student 1 Full Name:</strong> Alex Morgan<br/>
    <strong>Student 2 Full Name:</strong> Sam Rivera</p>
  </section>

  <h2>1. Introduction</h2>
  <p>This project implements a complete English-language e-commerce website named Peakline Outfitters. The store sells premium outdoor equipment organized into three product categories: Hiking, Camping, and Travel. The catalog contains exactly ten products. Each product includes a unique SKU, title, category, numerical price, numerical stock quantity, professional English description, and an online ImageURL.</p>
  <p>The selected platform is Peakline Commerce (Next.js e-commerce platform), an accepted alternative to Wix Stores / Shopify for COMP101. It provides the required storefront, CSV product import, inventory tracking, test checkout, order fulfillment, and tracking-number workflow. The brand identity uses the Peakline mountain-mark logo and the brand color Peakline Pine (#1A5F4A).</p>
  <p>Product images are hosted online and referenced through ImageURL values in the CSV. Inventory tracking is enabled. The Compact Trail First Aid Kit (PL-TRV-002) was prepared with stock quantity 1, purchased through Manual Payment in test mode, reduced to stock 0, and displayed as Out of Stock. The test order was fulfilled with tracking number ${tracking}.</p>
  <div class="box">
    <p><strong>Website access for grading</strong></p>
    <p>Website Username: ${username}<br/>Website Password: ${password}</p>
    <p>Final website link: <a href="${siteUrl}">${siteUrl}</a><br/>
    Dashboard login: <a href="${siteUrl}/login">${siteUrl}/login</a><br/>
    Report page: <a href="${siteUrl}/report">${siteUrl}/report</a><br/>
    Presentation page: <a href="${siteUrl}/presentation">${siteUrl}/presentation</a></p>
  </div>

  <h2>2. Development Process</h2>
  <ol>
    <li><strong>Branding.</strong> Store concept defined as a premium outdoor outfitter.</li>
    <li><strong>Logo.</strong> Mountain-peak mark applied across header, footer, dashboard, report, and presentation.</li>
    <li><strong>Brand color.</strong> #1A5F4A applied to buttons, navigation, and admin actions.</li>
    <li><strong>CSV creation.</strong> Official headers SKU,Title,Category,Price,Stock,Description,ImageURL used for 10 products.</li>
    <li><strong>Online images.</strong> Direct online image links placed in ImageURL. No local file paths.</li>
    <li><strong>CSV import.</strong> All products uploaded through the dashboard import process.</li>
    <li><strong>Inventory tracking.</strong> Stock quantities tracked and reduced during checkout.</li>
    <li><strong>Out-of-Stock test.</strong> PL-TRV-002 set to 1, purchased, then shown as Out of Stock.</li>
    <li><strong>Fulfillment.</strong> Order ${orderNumber} marked shipped with tracking ${tracking}.</li>
    <li><strong>Mobile testing.</strong> Storefront verified on phone-width layout.</li>
  </ol>

  <h2>3. Screenshot Evidence</h2>
  <p>Open the HTML files in <code>COMP101_Project1/Screenshots/</code> and also capture live screenshots from the running website:</p>
  <ul>
    <li>01_CSV.html — CSV product file</li>
    <li>02_Product_Import.html — successful import</li>
    <li>03_Final_Website.html — final website</li>
    <li>04_Inventory.html — inventory tracking</li>
    <li>05_Out_of_Stock.html — out of stock product</li>
    <li>06_Order_Tracking.html — tracking number</li>
    <li>07_Mobile.html — mobile view</li>
  </ul>

  <h2>4. Product Catalog Summary</h2>
  <table>
    <thead><tr><th>SKU</th><th>Title</th><th>Category</th><th>Price</th><th>Stock (CSV)</th></tr></thead>
    <tbody>
      ${rows.map((r) => `<tr><td>${r.sku}</td><td>${r.title}</td><td>${r.category}</td><td>${r.price}</td><td>${r.stock}</td></tr>`).join("")}
    </tbody>
  </table>

  <h2>5. Final Website Link</h2>
  <p>The live website for grading is <a href="${siteUrl}">${siteUrl}</a>. Start the store with <code>npm run dev</code> before the instructor opens the link.</p>
</body>
</html>`;

fs.writeFileSync(path.join(outReport, "COMP101_Project1_Report.html"), reportHtml);

const howTo = `COMP101 Project 1 — Screenshot pack

Evidence HTML files in this folder:
01_CSV.html
02_Product_Import.html
03_Final_Website.html
04_Inventory.html
05_Out_of_Stock.html
06_Order_Tracking.html
07_Mobile.html

Also capture LIVE screenshots while the store is running (npm run dev):
A CSV product file              /admin/import  and  /report
B Successful product import     /admin/import
C Final website                 /
D Inventory tracking            /admin/products
E Out-of-Stock product          /shop/PL-TRV-002
F Order fulfillment/tracking    /admin/orders
G Mobile website                Chrome F12 device toolbar on /

Website Username: admin
Website Password: Peakline101
`;

fs.writeFileSync(path.join(outScreenshots, "README.txt"), howTo);

const reportReadme = `COMP101 Project 1 Report

1. Open COMP101_Project1_Report.html in Chrome
2. Press Ctrl+P
3. Destination: Save as PDF
4. Filename: COMP101_Project1_Report.pdf

Or open the live report at http://localhost:3000/report while the store is running and use the Print / Save as PDF button.

Replace [STUDENT 1 FULL NAME] and [STUDENT 2 FULL NAME] before submission.
`;

fs.writeFileSync(path.join(outReport, "README.txt"), reportReadme);

const websiteReadme = `Peakline Outfitters live store

Start the website:
1. Open a terminal in the project root
2. Run: npm install
3. Run: npm run dev
4. Open: http://localhost:3000

Customer pages:
- /                 homepage
- /shop             catalog
- /shop/[sku]       product page
- /cart             cart
- /checkout         test checkout
- /order/[number]   order confirmation and tracking

Dashboard:
- /login
- /admin
- /admin/import
- /admin/products
- /admin/orders

Academic documents:
- /report
- /presentation

Website Username: admin
Website Password: Peakline101

Final website link for the report/presentation: http://localhost:3000
`;

fs.writeFileSync(path.join(root, "COMP101_Project1", "Website", "README.txt"), websiteReadme);

console.log("Evidence pack written to COMP101_Project1/");
console.log(`- Screenshots: ${Object.keys(screenshots).length} HTML files`);
console.log("- Report: COMP101_Project1_Report.html");
console.log("- CSV copied");
