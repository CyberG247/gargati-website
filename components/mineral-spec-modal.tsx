"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Check,
  FileCheck2,
  FlaskConical,
  Maximize2,
  Minimize2,
  Package,
  ShieldCheck,
  X,
  ZoomIn,
} from "lucide-react"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { useSmoothScroll } from "@/components/motion/smooth-scroll-provider"
import { useLanguage } from "@/lib/i18n/language-context"
import type { Mineral, MineralCategory } from "@/lib/minerals"

interface MineralSpecModalProps {
  mineral: Mineral | null
  isInCart: boolean
  initialForm?: string
  onClose: () => void
  onAddAndOpenOrder: (mineral: Mineral, selectedForm: string) => void
  onRequestAssay: (mineral: Mineral) => void
}

type DatasheetTab = "commercial" | "technical" | "packaging"

const ASSAY_BENCHMARKS: Record<
  string,
  { pct: number; benchmarkLabel: string }
> = {
  lithium: { pct: 88, benchmarkLabel: "4.5% – 6.2% Li₂O Concentrate Range" },
  gold: { pct: 95, benchmarkLabel: "Lab-Verified Fire Assay Custody" },
  tin: { pct: 72, benchmarkLabel: "65% – 72% Sn Smelter Grade" },
  coltan: { pct: 68, benchmarkLabel: "45% – 68%+ Ta₂O₅ / Nb₂O₅ Split" },
  "lead-zinc": { pct: 70, benchmarkLabel: "55%+ Pb / 50%+ Zn Concentrate" },
  iron: { pct: 65, benchmarkLabel: "60% – 65% Total Fe Content" },
  limestone: { pct: 94, benchmarkLabel: "92% – 96.5% CaCO₃ Purity" },
  aggregates: { pct: 98, benchmarkLabel: "BS 812 / NIS Quarry Spec Compliance" },
}

export function MineralSpecModal({
  mineral,
  isInCart,
  initialForm,
  onClose,
  onAddAndOpenOrder,
  onRequestAssay,
}: MineralSpecModalProps) {
  const { t } = useLanguage()
  const { stopScroll, startScroll } = useSmoothScroll()
  const shouldReduceMotion = useReducedMotion()

  const [activeTab, setActiveTab] = useState<DatasheetTab>("commercial")
  const [selectedForm, setSelectedForm] = useState("")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomedIn, setZoomedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mineral) return
    setActiveTab("commercial")
    setSelectedForm(initialForm || mineral.forms[0] || "")
    setLightboxOpen(false)
    setZoomedIn(false)
  }, [mineral, initialForm])

  useEffect(() => {
    if (!mineral) return
    stopScroll()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false)
          setZoomedIn(false)
        } else {
          onClose()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      startScroll()
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mineral, lightboxOpen, onClose, stopScroll, startScroll])

  const categoryLabelMap: Record<MineralCategory, string> = {
    "Battery & Critical": t.catalog.categories.battery,
    "Precious Metals": t.catalog.categories.precious,
    "Industrial Ores": t.catalog.categories.industrial,
    "Construction & Quarry": t.catalog.categories.construction,
  }

  const loc = mineral ? t.minerals[mineral.id as keyof typeof t.minerals] : undefined
  const displayName = loc?.name || mineral?.name || ""
  const displaySubtitle = loc?.subtitle || mineral?.subtitle || ""
  const displayDescription = loc?.description || mineral?.description || ""
  const displayGrade = loc?.grade || mineral?.grade || ""
  const displayOrigin = loc?.origin || mineral?.origin || ""
  const displayCompliance = loc?.complianceNote || mineral?.complianceNote || ""
  const displayMoq = loc?.moq || mineral?.moq || ""
  const displayTerms = loc?.terms || mineral?.terms || []
  const displayLeadTime = loc?.leadTime || mineral?.leadTime || ""
  const displayApplications = loc?.applications || mineral?.applications || []
  const displayPackaging = loc?.packagingOptions || mineral?.packagingOptions || []
  const displayForms = loc?.forms || mineral?.forms || []
  const benchmark = mineral
    ? ASSAY_BENCHMARKS[mineral.id] || { pct: 85, benchmarkLabel: displayGrade }
    : { pct: 85, benchmarkLabel: "" }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {mineral && (
        <motion.div
          key="spec-modal-backdrop"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[#091322]/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.section
            key={mineral.id}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mineral-spec-title"
            data-lenis-prevent
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative grid max-h-[94dvh] w-full max-w-5xl grid-cols-1 overflow-y-auto overscroll-contain rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[92dvh] sm:rounded-xl lg:grid-cols-12"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close mineral technical datasheet"
              className="absolute top-3.5 right-3.5 z-20 inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 hover:text-[#0F1E36]"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left Column: Visual + Animated Assay Purity Bar */}
            <div className="flex flex-col justify-between bg-[#0F1E36] text-white lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#162742] lg:aspect-auto lg:min-h-[340px] lg:flex-1">
                <Image
                  src={mineral.image}
                  alt={`${displayName} specimen`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#091322] via-transparent to-[#091322]/35"
                />

                <div
                  translate="no"
                  className="notranslate absolute top-4 left-4 flex items-center gap-2"
                >
                  <span className="rounded bg-[#091322]/85 px-2.5 py-1 font-mono text-[11px] font-bold text-[#FBBF24] backdrop-blur-md">
                    {mineral.code}
                  </span>
                  <span className="rounded bg-white/15 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur-md">
                    HS {mineral.hsCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-md border border-white/25 bg-[#091322]/85 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-[#F59E0B] hover:bg-[#1D4E89]"
                >
                  <ZoomIn className="h-4 w-4 text-[#F59E0B]" />
                  <span>{t.specModal.inspectTexture}</span>
                </button>
              </div>

              <div className="space-y-3.5 border-t border-white/10 bg-[#091322] p-5">
                {/* Animated Assay Benchmark Purity Meter */}
                <div className="rounded-lg border border-white/10 bg-[#0F1E36]/75 p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400 uppercase">
                      {t.specModal.purityLabel}
                    </span>
                    <span className="font-mono font-bold text-[#FBBF24]">{displayGrade}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={shouldReduceMotion ? false : { scaleX: 0 }}
                      animate={{ scaleX: benchmark.pct / 100 }}
                      transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full origin-left rounded-full bg-gradient-to-r from-[#D97706] to-[#FBBF24]"
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-slate-300">
                    {benchmark.benchmarkLabel}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-slate-400">{t.specModal.originLabel}</span>
                  <span className="text-right font-medium text-slate-100">{displayOrigin}</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{displayCompliance}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Tabbed Specifications */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
              <div>
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-bold tracking-wide text-[#1D4E89] uppercase">
                    {categoryLabelMap[mineral.category]}
                  </span>
                  <span
                    translate="no"
                    className="notranslate rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-bold text-[#0F1E36]"
                  >
                    {mineral.formula}
                  </span>
                </div>

                <h2
                  id="mineral-spec-title"
                  className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#0F1E36] sm:text-3xl"
                >
                  {displayName}
                </h2>
                <p className="text-sm font-medium text-[#64748B]">{displaySubtitle}</p>

                <p className="mt-4 text-sm leading-relaxed text-[#1E293B]">
                  {displayDescription}
                </p>

                {/* Datasheet Tabs with Shared-Element layoutId */}
                <div className="mt-6 border-b border-slate-200">
                  <div
                    className="no-scrollbar -mx-1 -mb-px flex flex-nowrap gap-4 overflow-x-auto px-1 sm:gap-6"
                    role="tablist"
                  >
                    {(
                      [
                        { id: "commercial", label: t.specModal.tabCommercial, icon: Package },
                        { id: "technical", label: t.specModal.tabTechnical, icon: FlaskConical },
                        { id: "packaging", label: t.specModal.tabPackaging, icon: FileCheck2 },
                      ] as const
                    ).map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeTab === tab.id
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative inline-flex min-h-[44px] shrink-0 touch-manipulation items-center gap-1.5 pb-2 text-xs font-bold whitespace-nowrap transition-colors sm:text-[13px] ${
                            isActive
                              ? "text-[#0F1E36]"
                              : "text-slate-500 hover:text-[#1D4E89]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span>{tab.label}</span>
                          {isActive && (
                            <motion.span
                              layoutId="spec-tab-indicator"
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                              className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#D97706]"
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tab Panels */}
                <div className="mt-5 min-h-[215px]">
                  {activeTab === "commercial" && (
                    <div className="space-y-4">
                      <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-xs sm:text-sm">
                        {[
                          { label: t.specModal.moqLabel, val: displayMoq, mono: true },
                          {
                            label: t.specModal.termsLabel,
                            val: displayTerms.join(" · "),
                            blue: true,
                          },
                          { label: t.specModal.leadTimeLabel, val: displayLeadTime },
                        ].map((row, rIdx) => (
                          <motion.div
                            key={row.label}
                            initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.35,
                              delay: rIdx * 0.04,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex justify-between gap-4 py-2.5"
                          >
                            <dt className="text-[#64748B]">{row.label}</dt>
                            <dd
                              className={`text-right font-semibold ${
                                row.mono
                                  ? "font-mono text-[#0F1E36]"
                                  : row.blue
                                    ? "text-[#1D4E89]"
                                    : "text-[#1E293B]"
                              }`}
                            >
                              {row.val}
                            </dd>
                          </motion.div>
                        ))}
                      </dl>

                      <div>
                        <h3 className="font-mono text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                          {t.specModal.applicationsHeading}
                        </h3>
                        <ul className="mt-2 space-y-1.5 text-xs text-[#1E293B] sm:text-sm">
                          {displayApplications.map((app) => (
                            <li key={app} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D97706]" />
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === "technical" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 p-4">
                        <h3 className="font-mono text-[11px] font-bold tracking-wider text-[#1D4E89] uppercase">
                          {t.specModal.physicalHeading}
                        </h3>
                        <dl className="mt-3 space-y-2.5 text-xs">
                          {mineral.physicalSpecs.map((spec, sIdx) => (
                            <motion.div
                              key={spec.label}
                              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: sIdx * 0.04, duration: 0.3 }}
                              className="border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                            >
                              <dt className="text-[#64748B]">{spec.label}</dt>
                              <dd className="mt-0.5 font-semibold text-[#0F1E36]">{spec.value}</dd>
                            </motion.div>
                          ))}
                        </dl>
                      </div>

                      <div className="rounded-lg border border-slate-200 p-4">
                        <h3 className="font-mono text-[11px] font-bold tracking-wider text-[#D97706] uppercase">
                          {t.specModal.chemicalHeading}
                        </h3>
                        <dl className="mt-3 space-y-2.5 text-xs">
                          {mineral.chemicalSpecs.map((spec, sIdx) => (
                            <motion.div
                              key={spec.label}
                              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: sIdx * 0.04, duration: 0.3 }}
                              className="border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                            >
                              <dt className="text-[#64748B]">{spec.label}</dt>
                              <dd className="mt-0.5 font-mono font-semibold text-[#0F1E36]">
                                {spec.value}
                              </dd>
                            </motion.div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  )}

                  {activeTab === "packaging" && (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-slate-200 p-4">
                        <h3 className="font-mono text-[11px] font-bold tracking-wider text-[#1D4E89] uppercase">
                          {t.specModal.packagingHeading}
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs text-[#1E293B] sm:text-sm">
                          {displayPackaging.map((pkg) => (
                            <li key={pkg} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              <span>{pkg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-[#475569]">
                        {t.specModal.packagingDisclaimer}
                      </p>
                    </div>
                  )}
                </div>

                {/* Preferred Form Selector */}
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <span className="block font-mono text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
                    {t.specModal.preferredFormHeading}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mineral.forms.map((canonicalForm, idx) => {
                      const chosen = selectedForm === canonicalForm
                      const displayForm = displayForms[idx] || canonicalForm
                      return (
                        <button
                          key={canonicalForm}
                          type="button"
                          onClick={() => setSelectedForm(canonicalForm)}
                          className={`min-h-[40px] touch-manipulation rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                            chosen
                              ? "border border-[#0F1E36] bg-[#0F1E36] text-white"
                              : "border border-slate-200 bg-white text-slate-700 hover:border-[#1D4E89]"
                          }`}
                        >
                          {displayForm}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pb-safe mt-6 flex flex-col gap-2.5 border-t border-slate-200 pt-5 sm:flex-row sm:pb-0">
                <MagneticButton
                  wrapperClassName="w-full sm:flex-1"
                  onClick={() => onAddAndOpenOrder(mineral, selectedForm || mineral.forms[0])}
                  className="inline-flex min-h-11 w-full flex-1 items-center justify-center rounded-md bg-[#D97706] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#B45309]"
                >
                  <span>{isInCart ? t.specModal.updateAndOpen : t.specModal.addAndOpen}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </MagneticButton>

                <button
                  type="button"
                  onClick={() => onRequestAssay(mineral)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#1D4E89] bg-white px-4 py-2.5 text-center text-xs font-bold text-[#1D4E89] transition-colors hover:bg-[#EFF6FF]"
                >
                  <FlaskConical className="h-4 w-4 shrink-0" />
                  <span>{t.specModal.requestAssay}</span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Lightbox High-Resolution Ore Inspector */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#060D1A]/95 p-4"
                role="dialog"
                aria-modal="true"
                aria-label={`${displayName} — ${t.specModal.lightboxTitleSuffix}`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setLightboxOpen(false)
                    setZoomedIn(false)
                  }
                }}
              >
                <div className="mb-3 flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 text-white">
                  <div className="min-w-0">
                    <span translate="no" className="notranslate font-mono text-xs text-[#FBBF24]">
                      {mineral.code} · {mineral.formula}
                    </span>
                    <h3 className="font-display text-base font-bold break-words sm:text-lg">
                      {displayName} — {t.specModal.lightboxTitleSuffix}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoomedIn((z) => !z)}
                      className="inline-flex h-10 touch-manipulation items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/20"
                    >
                      {zoomedIn ? (
                        <>
                          <Minimize2 className="h-4 w-4 shrink-0" />
                          <span>{t.specModal.resetZoom}</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-4 w-4 shrink-0" />
                          <span>{t.specModal.macroZoom}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLightboxOpen(false)
                        setZoomedIn(false)
                      }}
                      aria-label="Close texture lightbox"
                      className="inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-md border border-white/25 bg-white/10 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  data-lenis-prevent
                  className="relative h-[72dvh] w-full max-w-5xl overflow-auto rounded-xl border border-white/15 bg-black"
                >
                  <div
                    className={`relative h-full w-full transition-transform duration-300 ${
                      zoomedIn ? "scale-[1.75] cursor-zoom-out" : "scale-100 cursor-zoom-in"
                    }`}
                    onClick={() => setZoomedIn((z) => !z)}
                  >
                    <Image
                      src={mineral.image}
                      alt={`${displayName} texture`}
                      fill
                      sizes="100vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
