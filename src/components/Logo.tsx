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
  const ink = inverted ? "#F1F5F4" : "#111111";

  return (
    <Link href={href} className="flex items-center gap-3 no-underline" aria-label={`${STORE.legalName} home`}>
      <svg width={42} height={42} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="none" stroke={ink} strokeWidth="1.6" />
        <text
          x="32"
          y="37"
          textAnchor="middle"
          fill={ink}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="16"
          fontWeight="500"
          letterSpacing="1.5"
        >
          NL
        </text>
      </svg>
      <span className="leading-[1.05]" style={{ color: ink, fontFamily: "Arial, Helvetica, sans-serif" }}>
        <span className="block text-[11px] font-light uppercase tracking-[0.14em] sm:text-[12px]">Northlane</span>
        <span className="block text-[11px] font-light uppercase tracking-[0.14em] sm:text-[12px]">Outfitters</span>
      </span>
    </Link>
  );
}
