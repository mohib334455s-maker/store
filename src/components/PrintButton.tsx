"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white"
    >
      Print / Save as PDF
    </button>
  );
}
