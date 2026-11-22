"use client"

import { COMPANY } from "@/lib/company"

const ROW_ONE_ITEMS = [
  "LITHIUM SPODUMENE · 4.5–6.2% Li₂O",
  "CASSITERITE TIN ORE · 65–72% Sn",
  "COLUMBITE-TANTALITE · COLTAN",
  "HIGH-GRADE IRON ORE · 60–65% Fe",
  "CALCIUM LIMESTONE · >92% CaCO₃",
  "CRUSHED GRANITE & LATERITE",
]

const ROW_TWO_ITEMS = [
  `CAC VERIFIED · ${COMPANY.rcNumber}`,
  "GALENA & SPHALERITE · 55%+ Pb / 50%+ Zn",
  "ASSAYED GOLD CONCENTRATES · Au",
  "LOKOGOMA ABUJA F.C.T. OPERATIONS",
  "NEPC EXPORT READY · 1MT JUMBO BAGS",
  "MINE-TO-SITE & PORT HAULAGE",
]

function MarqueeTrack({
  items,
  direction,
}: {
  items: string[]
  direction: "left" | "right"
}) {
  const trackClass =
    direction === "left" ? "marquee-track-left" : "marquee-track-right"

  return (
    <div className="flex overflow-hidden select-none">
      <div className={`${trackClass} flex shrink-0 items-center gap-8 pr-8`}>
        {[...items, ...items].map((label, idx) => (
          <span
            key={`${label}-${idx}`}
            translate="no"
            className="notranslate inline-flex items-center gap-8 font-mono text-[11px] font-semibold tracking-[0.16em] whitespace-nowrap text-slate-300 uppercase"
          >
            <span>{label}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-[#F59E0B]" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function MineralMarquee() {
  return (
    <div
      aria-label="Verified Nigerian mineral specifications ticker"
      className="marquee-group relative overflow-hidden border-y border-white/[0.08] bg-[#091322] py-3.5"
    >
      {/* Left & Right Gradient Edge Fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#091322] to-transparent sm:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#091322] to-transparent sm:w-24"
      />

      <div className="space-y-2.5">
        <MarqueeTrack items={ROW_ONE_ITEMS} direction="left" />
        <MarqueeTrack items={ROW_TWO_ITEMS} direction="right" />
      </div>
    </div>
  )
}
