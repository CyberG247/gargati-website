import { COMPANY } from "@/lib/company"

interface BrandLogoProps {
  variant?: "light" | "dark" | "compact" | "letterhead"
  asLink?: boolean
  className?: string
}

export function BrandLogo({
  variant = "light",
  asLink = true,
  className = "",
}: BrandLogoProps) {
  const isDarkSurface = variant === "dark"
  const isLetterhead = variant === "letterhead"
  const isLightNavbar = variant === "light"

  const content = (
    <span
      translate="no"
      className={`notranslate inline-flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-md border ${
          isLetterhead ? "h-10 w-10 sm:h-11 sm:w-11" : "h-9 w-9 sm:h-11 sm:w-11"
        } ${
          isDarkSurface
            ? "border-[#1D4E89]/60 bg-[#13294B] text-white"
            : "border-[#0F1E36]/15 bg-[#0F1E36] text-white shadow-sm"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6 sm:h-8 sm:w-8">
          <path
            d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
            stroke="#1D4E89"
            strokeWidth="2.5"
            fill="#112442"
          />
          <path
            d="M32 2V7M32 57V62M58 17L53.5 19.5M10.5 44.5L6 47M58 47L53.5 44.5M10.5 19.5L6 17"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <path
            d="M32 10L50 20.5V43.5L32 54L14 43.5V20.5L32 10Z"
            stroke="#94A3B8"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <rect x="16" y="40" width="26" height="5.5" rx="2.75" fill="#FFFFFF" />
          <circle cx="19.5" cy="42.75" r="1.4" fill="#0F1E36" />
          <circle cx="38.5" cy="42.75" r="1.4" fill="#0F1E36" />
          <path
            d="M19 38.5V30.5H29L31.5 34.5L38 22L48.5 26.5L46 31L39 27.5L33 38.5H19Z"
            fill="#F59E0B"
          />
          <path
            d="M48 26.5L52 33.5L46 36.5L44 31"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span
            className={`font-display text-[13px] font-extrabold tracking-tight whitespace-nowrap sm:text-sm md:text-base ${
              isDarkSurface ? "text-white" : "text-[#0F1E36]"
            }`}
          >
            GARGATI MINNING
          </span>
          <span
            className={`${
              isLightNavbar ? "hidden min-[420px]:inline-flex" : "inline-flex"
            } items-center rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wide whitespace-nowrap sm:text-[10px] ${
              isDarkSurface
                ? "border border-[#F59E0B]/40 bg-[#F59E0B]/15 text-[#FBBF24]"
                : "border border-[#1D4E89]/25 bg-[#EFF6FF] text-[#1D4E89]"
            }`}
          >
            {COMPANY.rcNumber}
          </span>
        </span>
        <span
          className={`mt-1 font-sans text-[8px] leading-tight font-bold tracking-[0.04em] uppercase sm:text-[9.5px] sm:tracking-[0.08em] md:text-[10px] ${
            isLightNavbar ? "truncate sm:whitespace-normal" : "break-words"
          } ${isDarkSurface ? "text-slate-300" : "text-[#475569]"}`}
        >
          ENGINEERING CONSTRUCTION COMPANY LIMITED
        </span>
      </span>
    </span>
  )

  if (!asLink) {
    return content
  }

  return (
    <a
      href="#home"
      aria-label={`${COMPANY.legalName} — Return to top`}
      className="group inline-flex min-w-0 items-center rounded-sm focus-visible:outline-2"
    >
      {content}
    </a>
  )
}
