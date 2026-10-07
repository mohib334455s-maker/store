# COMP101 Project 1 — Peakline Outfitters

Complete academic package for **COMP101 Project 1: E-Commerce Website**.

## Store concept

Peakline Outfitters is an English-language outdoor e-commerce store.

- 10 products imported from CSV
- Categories: Hiking, Camping, Travel
- Online product images (ImageURL)
- Inventory tracking + Out-of-Stock test
- Test order fulfillment with tracking number `DXB-TRK-12345`
- Mobile-responsive storefront
- Logo + brand color `#1A5F4A`

## How to start the website

From the project root (`t`):

```bash
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Grading access

| Item | Value |
|------|--------|
| Website Username | `admin` |
| Website Password | `Peakline101` |
| Final website link | `http://localhost:3000` |
| Dashboard login | `http://localhost:3000/login` |
| Academic report | `http://localhost:3000/report` |
| Presentation | `http://localhost:3000/presentation` |

## Submission folder

```text
COMP101_Project1/
├── Website/          how to open the live store
├── CSV/
│   └── products.csv
├── Product_Images/   online ImageURL catalog
├── Screenshots/      evidence HTML + capture guide
├── Report/           printable HTML report → save as PDF
└── Presentation/
    └── COMP101_Project1_Presentation.pptx
```

## Build the deliverables

```bash
npm run submit
```

This regenerates the PowerPoint and the evidence/report files.

## Before Blackboard upload

1. Replace `[STUDENT 1 FULL NAME]` and `[STUDENT 2 FULL NAME]` in:
   - `src/lib/store.ts`
   - the report cover
   - the presentation cover
2. Open `COMP101_Project1/Report/COMP101_Project1_Report.html` → Print → Save as PDF
3. Or open `/report` on the live site and use **Print / Save as PDF**
4. Capture the live screenshots listed in `Screenshots/README.txt` if your instructor wants browser screenshots
5. Submit the report PDF, the PPTX, and keep the website runnable for demo

## Rubric coverage

| Requirement | Where it is |
|-------------|-------------|
| Logo + brand color | Header/logo, CSS theme `#1A5F4A` |
| CSV import of 10 products | `CSV/products.csv`, `/admin/import` |
| Online image links | ImageURL column, product cards |
| Inventory + Out of Stock | `/admin/products`, `/shop/PL-TRV-002` |
| Order shipped + tracking | `/admin/orders`, tracking `DXB-TRK-12345` |
| Mobile | Responsive layout + Screenshot G |
| Report with screenshots | `/report` and `Report/` |
| Presentation | `/presentation` and `Presentation/*.pptx` |
