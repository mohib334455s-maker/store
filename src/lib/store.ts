export const STORE = {
  name: "Northlane",
  legalName: "Northlane Outfitters",
  tagline: "Built for the next mile.",
  brandColor: "#0B3D4A",
  brandColorName: "Northlane Tide",
  accentColor: "#D4A574",
  accentColorName: "Dune Gold",
  cream: "#F1F5F4",
  founder: "Mohammad Arman",
  email: "armanamir583@gmail.com",
  phone: "+971 52 172 83 78",
  address: "Al Sufouh Road, Dubai, United Arab Emirates",
  currency: "USD",
  platform: "Northlane Commerce (Next.js e-commerce platform)",
  platformNote:
    "A purpose-built e-commerce platform selected as a suitable alternative to Wix Stores / Shopify for COMP101, with CSV import, inventory tracking, checkout, fulfillment, and tracking numbers.",
} as const;

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Northlane101";

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

export const OOS_TEST_SKU = "NL-TRV-002";
export const DEMO_ORDER_NUMBER = "NL-10001";
export const DEMO_TRACKING_NUMBER = "DXB-TRK-12345";

export const STUDENT_1 = "Mohammad Arman";
export const STUDENT_2 = "Mohammad Arman";
export const COURSE_NAME = "COMP101";
export const PROJECT_TITLE = "Project 1: E-Commerce Website";
