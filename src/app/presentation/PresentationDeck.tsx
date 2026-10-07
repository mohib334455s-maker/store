"use client";

import { useEffect, useState } from "react";

type CsvRow = {
  SKU: string;
  Title: string;
  Category: string;
  Price: string;
  Stock: string;
  Description: string;
  ImageURL: string;
};

type Props = {
  siteUrl: string;
  student1: string;
  student2: string;
  projectTitle: string;
  storeName: string;
  brandColor: string;
  platform: string;
  username: string;
  password: string;
  csvRows: CsvRow[];
  mapping: { csv: string; platform: string }[];
  products: { sku: string; title: string; category: string; price: string; stock: number; imageUrl: string }[];
  importStatus: string;
  oos: { sku: string; title: string; stock: number; imageUrl: string };
  order: {
    orderNumber: string;
    status: string;
    trackingNumber: string;
    customerName: string;
    paymentMethod: string;
    items: string[];
  };
};

export function PresentationDeck(props: Props) {
  const [index, setIndex] = useState(0);
  const slides = buildSlides(props);
  const slide = slides[index];

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        setIndex((value) => Math.min(slides.length - 1, value + 1));
      }
      if (event.key === "ArrowLeft") {
        setIndex((value) => Math.max(0, value - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-gold">
          <span>COMP101 · {props.projectTitle}</span>
          <span>
            Slide {index + 1} / {slides.length}
          </span>
        </div>
        <div className="mt-6 flex-1 rounded-[2rem] bg-[#13261f] p-6 shadow-2xl sm:p-10">{slide}</div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            className="rounded-full bg-white/10 px-4 py-2 text-sm"
          >
            Previous
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            {slides.map((item, slideIndex) => (
              <button
                key={slideIndex}
                type="button"
                aria-label={`Go to slide ${slideIndex + 1}`}
                onClick={() => setIndex(slideIndex)}
                className={`h-2.5 w-2.5 rounded-full ${slideIndex === index ? "bg-gold" : "bg-white/25"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(slides.length - 1, value + 1))}
            className="rounded-full bg-pine px-4 py-2 text-sm font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function buildSlides(props: Props) {
  return [
    <CoverSlide key="cover" {...props} />,
    <WebsiteSlide key="web" {...props} />,
    <CsvSlide key="csv" rows={props.csvRows} />,
    <ImportSlide key="import" mapping={props.mapping} importStatus={props.importStatus} products={props.products} />,
    <InventorySlide key="inv" products={props.products} />,
    <OosSlide key="oos" oos={props.oos} />,
    <OrderSlide key="order" order={props.order} />,
    <MobileSlide key="mobile" products={props.products} siteUrl={props.siteUrl} />,
  ];
}

function CoverSlide({ student1, student2, projectTitle, storeName }: Props) {
  return (
    <div className="flex h-full min-h-[28rem] flex-col justify-center">
      <img src="/images/aud-logo.svg" alt="American University in Dubai" className="h-20 w-20" />
      <p className="mt-8 text-sm uppercase tracking-[0.35em] text-gold">COMP101</p>
      <h1 className="mt-4 font-serif text-4xl sm:text-6xl">{projectTitle}</h1>
      <p className="mt-4 text-xl text-sand">{storeName}</p>
      <div className="mt-10 space-y-2 text-lg">
        <p>{student1}</p>
        <p>{student2}</p>
      </div>
    </div>
  );
}

function WebsiteSlide({ siteUrl, storeName, platform }: Props) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-gold">Live website</p>
      <h2 className="mt-3 font-serif text-4xl">{storeName}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-sand">
        Peakline is an English-language outdoor store selling hiking, camping, and travel equipment. The catalog contains ten
        products imported from CSV, with online images and live stock tracking.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Hiking", "Camping", "Travel"].map((category) => (
          <div key={category} className="rounded-3xl bg-pine px-5 py-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Category</p>
            <p className="mt-2 font-serif text-2xl">{category}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        Platform: {platform}
        <br />
        Live link: {siteUrl}
      </p>
    </div>
  );
}

function CsvSlide({ rows }: { rows: CsvRow[] }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-gold">CSV database</p>
      <h2 className="mt-3 font-serif text-4xl">products.csv</h2>
      <div className="mt-5 overflow-x-auto rounded-2xl bg-black/20 p-3">
        <table className="min-w-[700px] text-left text-[11px]">
          <thead>
            <tr className="text-gold">
              <th className="py-2 pr-2">SKU</th>
              <th className="py-2 pr-2">Title</th>
              <th className="py-2 pr-2">Category</th>
              <th className="py-2 pr-2">Price</th>
              <th className="py-2 pr-2">Stock</th>
              <th className="py-2 pr-2">Description</th>
              <th className="py-2">ImageURL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.SKU} className="border-t border-white/10 align-top">
                <td className="py-2 pr-2">{row.SKU}</td>
                <td className="py-2 pr-2">{row.Title}</td>
                <td className="py-2 pr-2">{row.Category}</td>
                <td className="py-2 pr-2">{row.Price}</td>
                <td className="py-2 pr-2">{row.Stock}</td>
                <td className="max-w-[140px] py-2 pr-2">{row.Description.replace(/<[^>]+>/g, " ").slice(0, 48)}...</td>
                <td className="max-w-[140px] break-all py-2">{row.ImageURL}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ImportSlide({
  mapping,
  importStatus,
  products,
}: {
  mapping: { csv: string; platform: string }[];
  importStatus: string;
  products: Props["products"];
}) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-gold">Product import</p>
      <h2 className="mt-3 font-serif text-4xl">CSV import succeeded</h2>
      <p className="mt-3 text-sand">{importStatus}</p>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <table className="text-left text-sm">
          <tbody>
            {mapping.map((row) => (
              <tr key={row.csv} className="border-b border-white/10">
                <td className="py-2 pr-3">{row.csv}</td>
                <td className="py-2 text-gold">→ {row.platform}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid grid-cols-5 gap-2">
          {products.map((product) => (
            <img key={product.sku} src={product.imageUrl} alt={product.title} className="h-16 w-full rounded-xl object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
}

function InventorySlide({ products }: { products: Props["products"] }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-gold">Inventory</p>
      <h2 className="mt-3 font-serif text-4xl">Stock tracking enabled</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gold">
              <th className="py-2 pr-3">SKU</th>
              <th className="py-2 pr-3">Title</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.sku} className="border-t border-white/10">
                <td className="py-2 pr-3">{product.sku}</td>
                <td className="py-2 pr-3">{product.title}</td>
                <td className="py-2 pr-3">{product.category}</td>
                <td className="py-2 pr-3">${product.price}</td>
                <td className="py-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OosSlide({ oos }: { oos: Props["oos"] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Out-of-Stock test</p>
        <h2 className="mt-3 font-serif text-4xl">{oos.title}</h2>
        <p className="mt-4 text-lg leading-8 text-sand">
          Stock was set to 1. A Manual Payment test purchase reduced the quantity to 0. The storefront now displays Out of
          Stock.
        </p>
        <p className="mt-6 font-serif text-5xl text-red-300">{oos.stock <= 0 ? "Out of Stock" : `Stock ${oos.stock}`}</p>
        <p className="mt-3 text-sm">SKU {oos.sku} · live quantity {oos.stock}</p>
      </div>
      {oos.imageUrl ? <img src={oos.imageUrl} alt={oos.title} className="h-72 w-full rounded-3xl object-cover" /> : null}
    </div>
  );
}

function OrderSlide({ order }: { order: Props["order"] }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-gold">Order processing</p>
      <h2 className="mt-3 font-serif text-4xl">{order.orderNumber}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Status</p>
          <p className="mt-2 font-serif text-3xl capitalize">{order.status}</p>
        </div>
        <div className="rounded-3xl bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Tracking number</p>
          <p className="mt-2 font-serif text-3xl">{order.trackingNumber}</p>
        </div>
      </div>
      <p className="mt-6 text-sand">
        Customer: {order.customerName}
        <br />
        Payment: {order.paymentMethod}
      </p>
      <ul className="mt-4 text-sm">
        {order.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MobileSlide({ products, siteUrl }: { products: Props["products"]; siteUrl: string }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Mobile responsiveness</p>
        <h2 className="mt-3 font-serif text-4xl">Works on phone screens</h2>
        <p className="mt-4 text-lg leading-8 text-sand">
          Homepage, navigation, product cards, images, buttons, cart, and checkout remain readable and usable on mobile. The
          menu collapses, content does not overflow horizontally, and touch targets stay large enough to tap.
        </p>
        <p className="mt-6 text-sm">Tested with a mobile viewport and the live site at {siteUrl}</p>
      </div>
      <div className="mx-auto w-[230px] overflow-hidden rounded-[2rem] border-4 border-white/20 bg-cream text-ink">
        <div className="bg-pine p-4 text-cream">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Peakline</p>
          <p className="font-serif text-xl">Trail gear</p>
        </div>
        {products.slice(0, 2).map((product) => (
          <div key={product.sku} className="border-t border-sand">
            <img src={product.imageUrl} alt={product.title} className="h-20 w-full object-cover" />
            <p className="px-3 py-2 text-xs">{product.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
