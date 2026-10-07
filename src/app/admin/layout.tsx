import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { bootstrapStore } from "@/lib/bootstrap";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  await bootstrapStore();

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-sand bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo href="/admin" />
          <nav className="flex flex-wrap gap-3 text-sm font-medium text-pine">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/import">CSV import</Link>
            <Link href="/admin/products">Inventory</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/">View store</Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="text-muted">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
