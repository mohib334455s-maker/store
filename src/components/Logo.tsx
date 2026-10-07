import Link from "next/link";

export function Logo({
  href = "/",
  inverted = false,
}: {
  href?: string;
  inverted?: boolean;
  compact?: boolean;
}) {
  const box = inverted ? "#F3F5F2" : "#1A5F4A";
  const peak = inverted ? "#1A5F4A" : "#F3F5F2";
  const title = inverted ? "#F3F5F2" : "#1A5F4A";
  const subtitle = inverted ? "#D7CFC2" : "#6B645B";

  return (
    <Link href={href} className="flex items-center gap-3 no-underline" aria-label="Peakline Outfitters home">
      <svg width={38} height={38} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill={box} />
        <path d="M18 42 L32 22 L46 42 Z" fill={peak} />
      </svg>
      <span className="leading-tight">
        <span className="block font-serif text-lg tracking-[0.2em] uppercase" style={{ color: title }}>
          Peakline
        </span>
        <span className="block text-[10px] uppercase tracking-[0.24em]" style={{ color: subtitle }}>
          Outfitters
        </span>
      </span>
    </Link>
  );
}
