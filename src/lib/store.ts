export const STORE = {
  name: "Peakline",
  legalName: "Peakline Outfitters",
  tagline: "Gear for the trail ahead.",
  brandColor: "#1A5F4A",
  brandColorName: "Peakline Pine",
  accentColor: "#C4A35A",
  accentColorName: "Trail Gold",
  cream: "#F4F0E8",
  email: "hello@peakline.store",
  phone: "+971 4 000 1010",
  address: "Al Sufouh Road, Dubai, United Arab Emirates",
  currency: "USD",
  platform: "Peakline Commerce (Next.js e-commerce platform)",
  platformNote:
    "A purpose-built e-commerce platform selected as a suitable alternative to Wix Stores / Shopify for COMP101, with CSV import, inventory tracking, checkout, fulfillment, and tracking numbers.",
} as const;

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Peakline101";

export const CSV_HEADERS = [
  "SKU",
  "Title",
  "Category",
  "Price",
  "Stock",
  "Description",
  "ImageURL",
] as const;

export const CSV_FIELD_MAPPING = [
  { csv: "SKU", platform: "SKU" },
  { csv: "Title", platform: "Product Title" },
  { csv: "Category", platform: "Category" },
  { csv: "Price", platform: "Price" },
  { csv: "Stock", platform: "Inventory/Stock" },
  { csv: "Description", platform: "Description" },
  { csv: "ImageURL", platform: "Product Image" },
] as const;

export const CATEGORIES = ["Hiking", "Camping", "Travel"] as const;

export const SHIPPING_FLAT = 12;

export const OOS_TEST_SKU = "PL-TRV-002";
export const DEMO_ORDER_NUMBER = "PKL-10001";
export const DEMO_TRACKING_NUMBER = "DXB-TRK-12345";

export const STUDENT_1 = "Alex Morgan";
export const STUDENT_2 = "Sam Rivera";
export const COURSE_NAME = "COMP101";
export const PROJECT_TITLE = "Project 1: E-Commerce Website";
