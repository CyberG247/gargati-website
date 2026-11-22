"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Globe, Loader2, Search, Sparkles, X } from "lucide-react"
import { useSmoothScroll } from "@/components/motion/smooth-scroll-provider"
import { SUPPORTED_LANGUAGES, type LanguageOption } from "@/lib/i18n/languages"
import { useLanguage } from "@/lib/i18n/language-context"

interface LanguageSelectorProps {
  variant?: "topbar" | "mobile"
  onSelectComplete?: () => void
}

export function LanguageSelector({
  variant = "topbar",
  onSelectComplete,
}: LanguageSelectorProps) {
  const { language, t, isLoading, error, setLanguage } = useLanguage()
  const { stopScroll, startScroll } = useSmoothScroll()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(min-width: 640px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const usePortalSheet = variant === "mobile" || !isDesktop

  useEffect(() => {
    if (!open) return
    setQuery("")

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const timer =
      !usePortalSheet && isFinePointer
        ? window.setTimeout(() => searchInputRef.current?.focus(), 40)
        : undefined

    if (usePortalSheet) {
      stopScroll()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        !usePortalSheet &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    if (!usePortalSheet) {
      document.addEventListener("pointerdown", handlePointerDownOutside)
    }

    return () => {
      if (timer !== undefined) window.clearTimeout(timer)
      if (usePortalSheet) {
        startScroll()
      }
      window.removeEventListener("keydown", handleKeyDown)
      if (!usePortalSheet) {
        document.removeEventListener("pointerdown", handlePointerDownOutside)
      }
    }
  }, [open, usePortalSheet, stopScroll, startScroll])

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (item: LanguageOption) => {
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.nativeName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.regionHint.toLowerCase().includes(q) ||
        item.aliases.some((alias) => alias.toLowerCase().includes(q))
      )
    }

    return {
      nigerian: SUPPORTED_LANGUAGES.filter((l) => l.group === "nigerian" && matches(l)),
      global: SUPPORTED_LANGUAGES.filter((l) => l.group === "global" && matches(l)),
      more: SUPPORTED_LANGUAGES.filter((l) => l.group === "more" && matches(l)),
    }
  }, [query])

  const hasMatches =
    filteredGroups.nigerian.length > 0 ||
    filteredGroups.global.length > 0 ||
    filteredGroups.more.length > 0

  const handleSelect = async (code: string) => {
    setOpen(false)
    onSelectComplete?.()
    await setLanguage(code)
  }

  const renderGroup = (title: string, items: LanguageOption[]) => {
    if (items.length === 0) return null
    return (
      <div>
        <div className="sticky top-0 z-10 border-y border-slate-100 bg-slate-50/95 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-widest text-[#1D4E89] uppercase backdrop-blur-xs">
          {title}
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => {
            const active = item.code === language.code
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => void handleSelect(item.code)}
                className={`flex min-h-[52px] w-full touch-manipulation items-center justify-between gap-2 px-3.5 py-2.5 text-left transition-colors ${
                  active ? "bg-[#EFF6FF]" : "hover:bg-slate-50 active:bg-slate-100"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="truncate text-sm font-bold text-[#0F1E36]">
                      {item.nativeName}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                      {item.code}
                    </span>
                    {item.dir === "rtl" && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-800">
                        {t.switcher.rtlBadge}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-[11px] text-[#64748B]">
                    {item.name} · {item.regionHint}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {!item.preloaded ? (
                    <span className="inline-flex items-center gap-1 rounded border border-[#1D4E89]/25 bg-[#EFF6FF] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#1D4E89]">
                      <Sparkles className="h-2.5 w-2.5" />
                      {t.switcher.aiBadge}
                    </span>
                  ) : (
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-700">
                      {t.switcher.instantBadge}
                    </span>
                  )}
                  {active && <Check className="h-4 w-4 text-[#D97706]" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const dialogCard = (
    <div
      role="dialog"
      aria-modal={usePortalSheet ? "true" : undefined}
      aria-label={t.switcher.modalTitle}
      className={
        usePortalSheet
          ? "flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white text-[#1E293B] shadow-2xl sm:rounded-xl"
          : "absolute top-full z-[85] mt-2 flex max-h-[min(78dvh,32rem)] w-[370px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-[#1E293B] shadow-2xl ltr:right-0 rtl:left-0"
      }
    >
      {/* Header */}
      <div className="shrink-0 border-b border-slate-200 bg-[#0F1E36] px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-sm font-extrabold text-white">
              {t.switcher.modalTitle}
            </h3>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-300">
              {t.switcher.modalSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close language selector"
            className="inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-md border border-white/15 text-slate-200 hover:bg-white/10 hover:text-white active:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-2.5">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.switcher.searchPlaceholder}
            className="h-10 w-full rounded-md border border-white/15 bg-[#0A1527] pr-9 pl-8 text-base text-white placeholder:text-slate-400 focus:border-[#F59E0B] focus:outline-none sm:h-9 sm:text-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 inline-flex h-8 w-8 -translate-y-1/2 touch-manipulation items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="shrink-0 border-b border-amber-200 bg-amber-50 px-3.5 py-2 text-[11px] text-amber-900">
          {error}
        </div>
      )}

      {/* Language List */}
      <div
        data-lenis-prevent
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        {!hasMatches ? (
          <p className="px-4 py-8 text-center text-xs text-[#64748B]">
            {t.switcher.noMatches}
          </p>
        ) : (
          <>
            {renderGroup(t.switcher.groupNigerian, filteredGroups.nigerian)}
            {renderGroup(t.switcher.groupGlobal, filteredGroups.global)}
            {renderGroup(t.switcher.groupMore, filteredGroups.more)}
          </>
        )}
      </div>

      {/* Verbatim Legal Notice Footer */}
      <div className="pb-safe shrink-0 border-t border-slate-200 bg-slate-50 px-3.5 py-2 text-[10px] leading-relaxed text-[#64748B] sm:pb-2">
        {t.switcher.legalNotice}
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${t.switcher.buttonLabel}: ${language.nativeName}`}
        className={
          variant === "topbar"
            ? "relative z-10 inline-flex h-9 shrink-0 touch-manipulation items-center gap-1.5 rounded border border-white/15 bg-white/10 px-2.5 text-[11px] font-semibold text-white transition-colors hover:border-[#F59E0B]/60 hover:bg-white/15 active:bg-white/20 sm:h-7"
            : "inline-flex min-h-[48px] w-full touch-manipulation items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-[#0F1E36] hover:border-[#1D4E89]/40 active:bg-slate-100"
        }
      >
        <span className="inline-flex min-w-0 items-center gap-1.5">
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#F59E0B]" />
          ) : (
            <Globe className="h-3.5 w-3.5 shrink-0 text-[#F59E0B]" />
          )}
          {variant === "mobile" ? (
            <span className="truncate">
              {t.switcher.buttonLabel}: {language.nativeName} ({language.name})
            </span>
          ) : (
            <>
              <span className="font-mono uppercase sm:hidden">{language.shortLabel}</span>
              <span className="hidden truncate sm:inline">{language.nativeName}</span>
            </>
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 opacity-80 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !usePortalSheet && dialogCard}

      {open &&
        mounted &&
        usePortalSheet &&
        createPortal(
          <div
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
            className="fixed inset-0 z-[85] flex items-end justify-center bg-[#091322]/75 p-0 backdrop-blur-xs sm:items-center sm:p-6"
          >
            {dialogCard}
          </div>,
          document.body
        )}
    </div>
  )
}
