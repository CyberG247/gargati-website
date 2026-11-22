"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  PackageCheck,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import { MaskedTextReveal } from "@/components/motion/masked-text-reveal"
import { MineralTiltCard } from "@/components/motion/mineral-tilt-card"
import { useLanguage } from "@/lib/i18n/language-context"
import { MINERAL_CATEGORIES, minerals, type Mineral, type MineralCategory } from "@/lib/minerals"

interface MineralCatalogProps {
  cartIds: Set<string>
  cartCount: number
  onAddToCart: (mineral: Mineral) => void
  onOpenSpec: (mineral: Mineral) => void
  onOpenDrawer: () => void
}

export function MineralCatalog({
  cartIds,
  cartCount,
  onAddToCart,
  onOpenSpec,
  onOpenDrawer,
}: MineralCatalogProps) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const [selectedCategory, setSelectedCategory] = useState<"All Resources" | MineralCategory>(
    "All Resources"
  )
  const [searchQuery, setSearchQuery] = useState("")

  const categoryLabelMap: Record<"All Resources" | MineralCategory, string> = {
    "All Resources": t.catalog.categories.all,
    "Battery & Critical": t.catalog.categories.battery,
    "Precious Metals": t.catalog.categories.precious,
    "Industrial Ores": t.catalog.categories.industrial,
    "Construction & Quarry": t.catalog.categories.construction,
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Resources": minerals.length }
    for (const item of minerals) {
      counts[item.category] = (counts[item.category] || 0) + 1
    }
    return counts
  }, [])

  const filteredMinerals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return minerals.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Resources" || item.category === selectedCategory
      if (!matchesCategory) return false
      if (!query) return true

      const loc = t.minerals[item.id as keyof typeof t.minerals]
      return (
        item.name.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.formula.toLowerCase().includes(query) ||
        item.origin.toLowerCase().includes(query) ||
        item.forms.some((f) => f.toLowerCase().includes(query)) ||
        item.applications.some((a) => a.toLowerCase().includes(query)) ||
        Boolean(loc?.name.toLowerCase().includes(query)) ||
        Boolean(loc?.subtitle.toLowerCase().includes(query)) ||
        Boolean(loc?.origin.toLowerCase().includes(query)) ||
        Boolean(loc?.forms.some((f) => f.toLowerCase().includes(query))) ||
        Boolean(loc?.applications.some((a) => a.toLowerCase().includes(query)))
      )
    })
  }, [selectedCategory, searchQuery, t.minerals])

  return (
    <section id="catalog" className="bg-light-grid bg-[#F8FAFC] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="h-[2px] w-7 bg-[#D97706]" />
              <span className="font-mono text-xs font-bold tracking-widest text-[#D97706] uppercase">
                {t.catalog.eyebrow}
              </span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#0F1E36] sm:text-4xl lg:text-5xl">
              <MaskedTextReveal trigger="inView">
                {t.catalog.headingPart1}
                <span className="text-[#1D4E89]">{t.catalog.headingAccent}</span>
              </MaskedTextReveal>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-[#64748B] sm:text-base">
              {t.catalog.intro}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1D4E89] hover:text-[#0F1E36]"
              >
                <span>{t.catalog.requestSchedule}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Filter, Search & RFQ Bar */}
        <div className="glass-light mt-10 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Spring Sliding Pill Category Tabs */}
            <div
              className="no-scrollbar -mx-1 flex flex-nowrap items-center gap-1.5 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
              role="group"
              aria-label="Filter mineral resources by category"
            >
              {MINERAL_CATEGORIES.map((category) => {
                const active = selectedCategory === category
                const count = categoryCounts[category] || 0
                return (
                    <button
                    key={category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative inline-flex min-h-[40px] shrink-0 touch-manipulation items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:text-[13px] ${
                      active
                        ? "text-white"
                        : "border border-slate-200/80 bg-white/80 text-slate-600 hover:border-[#1D4E89]/40 hover:text-[#0F1E36]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="mineral-filter-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-[#091322] shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{categoryLabelMap[category]}</span>
                    <span
                      className={`relative z-10 rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                        active ? "bg-white/15 text-[#FBBF24]" : "bg-slate-200/70 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search & RFQ Drawer Action */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-auto sm:min-w-[230px] lg:flex-none">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.catalog.searchPlaceholder}
                  aria-label={t.catalog.searchPlaceholder}
                  className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pr-8 pl-9 text-base text-[#1E293B] placeholder:text-slate-400 focus:border-[#1D4E89] focus:bg-white focus:outline-none sm:h-10 sm:text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear mineral search"
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onOpenDrawer}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-[#1D4E89]/25 bg-[#EFF6FF] px-4 text-xs font-bold text-[#1D4E89] transition-colors hover:bg-[#1D4E89] hover:text-white sm:h-10"
              >
                <PackageCheck className="h-4 w-4" />
                <span>
                  {t.catalog.rfqListLabel} ({cartCount})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mineral Cards Grid with 3D Tilt, Cursor Spotlight & Layout Transitions */}
        {filteredMinerals.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-[#D97706]" />
            <h3 className="mt-3 font-display text-lg font-bold text-[#0F1E36]">
              {t.catalog.emptyTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{t.catalog.emptySubtitle}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All Resources")
                setSearchQuery("")
              }}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[#0F1E36] px-4 text-xs font-bold text-white hover:bg-[#1D4E89]"
            >
              {t.catalog.resetFilters}
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredMinerals.map((item, idx) => {
                const inCart = cartIds.has(item.id)
                const loc = t.minerals[item.id as keyof typeof t.minerals]
                const displayName = loc?.name || item.name
                const displaySubtitle = loc?.subtitle || item.subtitle
                const displayGrade = loc?.grade || item.grade
                const displayForms = loc?.forms || item.forms
                const displayMoq = loc?.moq || item.moq
                const displayOrigin = loc?.origin || item.origin
                const displayTerms = loc?.terms || item.terms

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(idx * 0.04, 0.25),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full"
                  >
                    <MineralTiltCard>
                      <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs transition-shadow duration-300 hover:border-[#1D4E89]/40 hover:shadow-[0_20px_50px_rgba(9,19,34,0.12)]">
                        {/* Mineral Specimen Image with Micro-Zoom & Frosted Quick-Spec Bar */}
                        <button
                          type="button"
                          onClick={() => onOpenSpec(item)}
                          aria-label={`${displayName} — ${t.catalog.viewFullSpecs}`}
                          className="relative aspect-[4/3] w-full overflow-hidden bg-[#1E293B] text-left"
                        >
                          <Image
                            src={item.image}
                            alt={`${displayName} (${displaySubtitle})`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-[#091322]/85 via-transparent to-[#091322]/25"
                          />

                          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                            <span
                              translate="no"
                              className="notranslate rounded bg-[#091322]/85 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-md"
                            >
                              {String(idx + 1).padStart(2, "0")} · {item.code}
                            </span>
                            <span className="max-w-[55%] truncate rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#0F1E36] uppercase backdrop-blur-md">
                              {categoryLabelMap[item.category]}
                            </span>
                          </div>

                          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                            <span
                              translate="no"
                              className="notranslate inline-flex items-center rounded border border-[#F59E0B]/40 bg-[#091322]/85 px-2 py-0.5 font-mono text-xs font-bold text-[#FBBF24] backdrop-blur-md"
                            >
                              {item.formula}
                            </span>

                            {/* Frosted Glass Quick-Spec Overlay revealed on hover */}
                            <span className="hidden translate-y-2 items-center gap-1.5 rounded-md border border-white/20 bg-[#091322]/80 px-2 py-1 font-mono text-[10px] font-semibold text-slate-100 opacity-0 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 sm:inline-flex">
                              <span className="truncate max-w-[130px]">{displayGrade}</span>
                            </span>

                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/95 text-[#0F1E36] shadow-sm transition-transform duration-300 group-hover:scale-105">
                              <Eye className="h-4 w-4" />
                            </span>
                          </div>
                        </button>

                        {/* Card Body */}
                        <div className="relative z-20 flex flex-1 flex-col p-4 sm:p-5">
                          <div>
                            <h3 className="font-display text-lg font-extrabold tracking-tight break-words text-[#0F1E36]">
                              {displayName}
                            </h3>
                            <p className="mt-0.5 text-xs font-medium text-[#64748B]">
                              {displaySubtitle}
                            </p>
                          </div>

                          <div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/75 px-3 py-2.5">
                            <span className="block font-mono text-[10px] font-bold tracking-wider text-[#B45309] uppercase">
                              {t.catalog.gradeLabel}
                            </span>
                            <span className="mt-0.5 block font-mono text-xs font-bold break-words text-[#0F1E36]">
                              {displayGrade}
                            </span>
                          </div>

                          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <dt className="shrink-0 text-[#64748B]">{t.catalog.formsLabel}</dt>
                              <dd className="min-w-0 text-right font-medium break-words text-[#1E293B]">
                                {displayForms.slice(0, 3).join(" · ")}
                              </dd>
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <dt className="shrink-0 text-[#64748B]">{t.catalog.moqLabel}</dt>
                              <dd className="min-w-0 text-right font-mono text-[11px] font-semibold break-words text-[#0F1E36]">
                                {displayMoq}
                              </dd>
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <dt className="shrink-0 text-[#64748B]">{t.catalog.originLabel}</dt>
                              <dd className="min-w-0 text-right font-medium break-words text-[#1E293B]">
                                {displayOrigin}
                              </dd>
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <dt className="shrink-0 text-[#64748B]">{t.catalog.termsLabel}</dt>
                              <dd className="min-w-0 text-right font-medium break-words text-[#1D4E89]">
                                {displayTerms.join(" / ")}
                              </dd>
                            </div>
                          </dl>

                          <div className="mt-5 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 min-[360px]:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => onOpenSpec(item)}
                              className="inline-flex min-h-10 items-center justify-center gap-1 rounded-md border border-[#1D4E89]/30 bg-white px-2.5 py-2 text-center text-xs leading-tight font-bold text-[#1D4E89] transition-colors hover:border-[#1D4E89] hover:bg-[#EFF6FF]"
                            >
                              <span>{t.catalog.viewFullSpecs}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                            </button>

                            {inCart ? (
                              <button
                                type="button"
                                onClick={onOpenDrawer}
                                className="inline-flex min-h-10 items-center justify-center gap-1 rounded-md bg-emerald-700 px-2.5 py-2 text-center text-xs leading-tight font-bold text-white transition-colors hover:bg-emerald-800"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                <span>{t.catalog.inRfqOrder}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onAddToCart(item)}
                                className="inline-flex min-h-10 items-center justify-center gap-1 rounded-md bg-[#D97706] px-2.5 py-2 text-center text-xs leading-tight font-bold text-white transition-colors hover:bg-[#B45309]"
                              >
                                <Plus className="h-3.5 w-3.5 shrink-0" />
                                <span>{t.catalog.orderQuote}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    </MineralTiltCard>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Catalog Footer Note */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-[#64748B] sm:flex-row sm:items-center">
          <p>{t.catalog.footerNote}</p>
          <button
            type="button"
            onClick={onOpenDrawer}
            className="inline-flex shrink-0 items-center gap-1.5 font-bold text-[#1D4E89] hover:text-[#0F1E36]"
          >
            <span>{t.catalog.assembleMultiOrder}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
