"use client"

import Image from "next/image"
import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Building2, Check, Compass, HardHat, Mountain, Truck } from "lucide-react"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { MaskedTextReveal } from "@/components/motion/masked-text-reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import { ENGINEERING_CAPABILITIES } from "@/lib/projects-and-services"

interface EngineeringServicesProps {
  onRequestProposal: (topic: string) => void
}

const CAPABILITY_ICONS = [Mountain, Building2, Truck, Compass]

export function EngineeringServices({ onRequestProposal }: EngineeringServicesProps) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  const activeCap = ENGINEERING_CAPABILITIES[activeIndex] || ENGINEERING_CAPABILITIES[0]
  const activeLoc = t.engineering.capabilities[activeIndex]
  const progressFraction = (activeIndex + 1) / ENGINEERING_CAPABILITIES.length

  return (
    <section
      id="engineering"
      className="bg-industrial-grid relative bg-[#091322] py-20 text-white lg:py-28"
    >
      {/* Ambient Deep Industrial Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#1D4E89]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#D97706]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Sticky Split-Screen Architecture */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Sticky Showcase Column */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <div className="inline-flex items-center gap-3">
              <span className="h-[2px] w-7 bg-[#F59E0B]" />
              <span className="font-mono text-xs font-bold tracking-widest text-[#FBBF24] uppercase">
                {t.engineering.eyebrow}
              </span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.1]">
              <MaskedTextReveal trigger="inView">
                {t.engineering.headingPart1}
                <span className="text-[#F59E0B]">{t.engineering.headingAccent}</span>
              </MaskedTextReveal>
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              {t.engineering.intro}
            </p>

            {/* Active Capability Index & Progress Track */}
            <div className="mt-7 rounded-xl border border-white/[0.08] bg-[#0F1E36]/75 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeCap.number}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="text-lg font-extrabold text-[#F59E0B]"
                    >
                      {activeCap.number}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">04</span>
                </div>

                <span className="truncate font-mono text-[11px] font-semibold tracking-wider text-slate-200 uppercase">
                  {activeLoc?.subtitle || activeCap.subtitle}
                </span>
              </div>

              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ scaleX: progressFraction }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full origin-left rounded-full bg-gradient-to-r from-[#D97706] to-[#FBBF24]"
                />
              </div>

              {/* Interactive Division Pills for Quick Jump */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {ENGINEERING_CAPABILITIES.map((cap, idx) => (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`min-h-[40px] min-w-[44px] touch-manipulation rounded px-2.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                      idx === activeIndex
                        ? "bg-[#D97706] text-white"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15"
                    }`}
                  >
                    {cap.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Framed Operations Visual Card with Active Cross-Fade Caption */}
            <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.12] bg-[#0A1527] shadow-2xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/images/engineering-civil.png"
                  alt="Civil engineers inspecting blueprints beside heavy bridge and highway earthworks in Nigeria"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#091322] via-[#091322]/25 to-transparent"
                />
                <div className="glass-dark absolute right-3 bottom-3 left-3 rounded-lg p-3.5">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#FBBF24]">
                    <HardHat className="h-3.5 w-3.5 shrink-0" />
                    <span>{t.engineering.bannerBadge}</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeCap.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
                      transition={{ duration: 0.28 }}
                      className="mt-1 font-display text-sm font-bold text-white"
                    >
                      {activeLoc?.title || activeCap.title}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <MagneticButton
                  wrapperClassName="w-full sm:w-auto"
                  onClick={() => onRequestProposal("Engineering & Construction Tender")}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#D97706] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#F59E0B] hover:text-[#091322] sm:w-auto"
                >
                  <span>{t.engineering.btnSubmitBrief}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </MagneticButton>
                <a
                  href="#projects"
                  className="inline-flex min-h-10 items-center justify-center text-xs font-semibold text-slate-300 transition-colors hover:text-[#FBBF24]"
                >
                  {t.engineering.btnViewCorridors} &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Right Scrolling Capability Pillars Column */}
          <div className="space-y-6 lg:col-span-7">
            {ENGINEERING_CAPABILITIES.map((cap, index) => {
              const Icon = CAPABILITY_ICONS[index] || Building2
              const loc = t.engineering.capabilities[index]
              const isActive = index === activeIndex

              return (
                <motion.article
                  key={cap.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  onViewportEnter={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  transition={{
                    duration: 0.65,
                    delay: Math.min(index * 0.06, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`flex min-w-0 flex-col justify-between rounded-xl border p-5 backdrop-blur-md transition-all duration-300 sm:p-7 lg:p-8 ${
                    isActive
                      ? "border-[#F59E0B]/55 bg-[#11223E]/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                      : "border-white/[0.08] bg-[#0F1E36]/65 hover:border-white/25"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3.5">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors sm:h-12 sm:w-12 ${
                            isActive
                              ? "border-[#F59E0B]/50 bg-[#D97706]/15 text-[#FBBF24]"
                              : "border-white/15 bg-[#091322] text-[#F59E0B]"
                          }`}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                        <div className="min-w-0">
                          <span className="block font-mono text-[10px] font-bold tracking-widest break-words text-[#FBBF24] uppercase sm:text-[11px]">
                            {t.engineering.divisionLabel} {cap.number} ·{" "}
                            {loc?.subtitle || cap.subtitle}
                          </span>
                          <h3 className="mt-1 font-display text-lg font-extrabold break-words text-white sm:text-xl">
                            {loc?.title || cap.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      {loc?.description || cap.description}
                    </p>

                    <ul className="mt-5 grid grid-cols-1 gap-2 text-xs text-slate-200 sm:text-sm">
                      {(loc?.deliverables || cap.deliverables).map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-col justify-between gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center">
                    <span className="font-mono text-[11px] break-words text-slate-400">
                      {loc?.equipmentOrMethodology || cap.equipmentOrMethodology}
                    </span>
                    <MagneticButton
                      onClick={() => onRequestProposal(cap.inquiryTopic)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-3.5 py-2 text-xs font-bold text-[#FBBF24] transition-colors hover:bg-[#D97706] hover:text-white"
                    >
                      <span>{t.engineering.requestProposal}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </MagneticButton>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
