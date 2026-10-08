import Link from "next/link";
import { STORE } from "@/lib/store";

export function Logo({
  href = "/",
  inverted = false,
}: {
  href?: string;
  inverted?: boolean;
  compact?: boolean;
}) {
  const box = inverted ? "#F1F5F4" : STORE.brandColor;
  const mark = inverted ? STORE.brandColor : "#F1F5F4";
  const accent = STORE.accentColor;
  const title = inverted ? "#F1F5F4" : STORE.brandColor;
  const subtitle = inverted ? "#D7CFC2" : "#5F6A63";

  return (
    <Link href={href} className="flex items-center gap-3 no-underline" aria-label={`${STORE.legalName} home`}>
      <svg width={38} height={38} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill={box} />
        <circle cx="32" cy="32" r="16" fill="none" stroke={mark} strokeWidth="2.5" />
        <path d="M32 18 V46" fill="none" stroke={mark} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18 32 H46" fill="none" stroke={mark} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="32" cy="32" r="3.5" fill={accent} />
        <path d="M32 22 L35 32 L32 29 L29 32 Z" fill={accent} />
      </svg>
      <span className="leading-tight">
        <span className="block font-serif text-lg tracking-[0.18em] uppercase" style={{ color: title }}>
          {STORE.name}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.24em]" style={{ color: subtitle }}>
          Outfitters
        </span>
      </span>
    </Link>
  );
}
