"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Mail,
  MessageSquare,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { useSmoothScroll } from "@/components/motion/smooth-scroll-provider"
import { COMPANY } from "@/lib/company"
import { useLanguage } from "@/lib/i18n/language-context"
import { minerals, type Mineral } from "@/lib/minerals"
import {
  buildMailtoOrderUrl,
  buildWhatsAppOrderUrl,
  formatOrderBrief,
} from "@/lib/procurement"
import type { OrderRequestPayload } from "@/lib/validation"

export interface CartLineItem {
  mineralId: string
  quantity: string
  unit: string
  form: string
  deliveryTerm: string
}

interface OrderSubmissionResult {
  reference: string
  submittedAt: string
  briefText: string
  whatsappUrl: string
  mailtoUrl: string
  order: OrderRequestPayload
}

interface ProcurementOrderDrawerProps {
  open: boolean
  items: CartLineItem[]
  onClose: () => void
  onAddMineral: (mineral: Mineral) => void
  onUpdateItem: (mineralId: string, patch: Partial<CartLineItem>) => void
  onRemoveItem: (mineralId: string) => void
  onClearCart: () => void
}

const UNIT_VALUES = [
  "Metric Tons (MT)",
  "30T Tipper Trucks",
  "20ft Containers",
  "1MT Jumbo Bags",
] as const

const DESTINATION_VALUES = [
  "Abuja F.C.T.",
  "Lagos Port (Apapa / Tin Can)",
  "Port Harcourt / Onne Port",
  "Kano",
  "Custom Site Address",
] as const

export function ProcurementOrderDrawer({
  open,
  items,
  onClose,
  onAddMineral,
  onUpdateItem,
  onRemoveItem,
  onClearCart,
}: ProcurementOrderDrawerProps) {
  const { language, t } = useLanguage()
  const { stopScroll, startScroll } = useSmoothScroll()
  const shouldReduceMotion = useReducedMotion()

  const [company, setCompany] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [destination, setDestination] = useState<string>(DESTINATION_VALUES[0])
  const [customAddress, setCustomAddress] = useState("")
  const [targetDate, setTargetDate] = useState("")
  const [notes, setNotes] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [result, setResult] = useState<OrderSubmissionResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const mineralMap = useMemo(() => new Map(minerals.map((m) => [m.id, m])), [])
  const unselectedMinerals = useMemo(
    () => minerals.filter((m) => !items.some((line) => line.mineralId === m.id)),
    [items]
  )

  useEffect(() => {
    if (!open) return
    stopScroll()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      startScroll()
      window.removeEventListener("keydown", handleKey)
    }
  }, [open, onClose, stopScroll, startScroll])

  const stepQuantity = (line: CartLineItem, direction: -1 | 1) => {
    const step =
      line.unit === "30T Tipper Trucks" || line.unit === "20ft Containers" ? 1 : 5
    const currentNum = Number.parseFloat(line.quantity) || 0
    const nextNum = Math.max(1, currentNum + direction * step)
    onUpdateItem(line.mineralId, { quantity: String(nextNum) })
  }

  const draftPayload: OrderRequestPayload = {
    items,
    company: company.trim() || "Prospective Buyer",
    contactPerson: contactPerson.trim() || "Procurement Officer",
    phone: phone.trim() || "To be confirmed",
    email: email.trim() || "To be confirmed",
    destination,
    customAddress: customAddress.trim() || undefined,
    targetDate: targetDate || undefined,
    notes: notes.trim() || undefined,
  }

  const instantBriefText = formatOrderBrief(draftPayload)
  const instantWhatsappUrl = buildWhatsAppOrderUrl(instantBriefText)
  const instantMailtoUrl = buildMailtoOrderUrl(
    `Mineral Procurement Inquiry — ${company.trim() || "New Buyer"}`,
    instantBriefText
  )

  const handleSubmitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setServerError("")
    setSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          company,
          contactPerson,
          phone,
          email,
          destination,
          customAddress,
          targetDate,
          notes,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.ok) {
        if (data.errors && typeof data.errors === "object") {
          setErrors(data.errors)
        } else {
          setServerError("Unable to validate procurement order. Please verify fields below.")
        }
        return
      }

      setResult(data as OrderSubmissionResult)
    } catch {
      setServerError(
        "Network interruption submitting to server. You can dispatch directly via WhatsApp or Email below."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyBrief = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.briefText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard API unavailable
    }
  }

  const handleResetAll = () => {
    setResult(null)
    setErrors({})
    setServerError("")
    setCompany("")
    setContactPerson("")
    setPhone("")
    setEmail("")
    setDestination(DESTINATION_VALUES[0])
    setCustomAddress("")
    setTargetDate("")
    setNotes("")
    onClearCart()
  }

  const slideOffset = language.dir === "rtl" ? "-100%" : "100%"

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer-backdrop"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[70] flex justify-end bg-[#091322]/75 backdrop-blur-md"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.aside
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="procurement-drawer-title"
            initial={shouldReduceMotion ? false : { x: slideOffset }}
            animate={{ x: 0 }}
            exit={shouldReduceMotion ? undefined : { x: slideOffset }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="flex h-[100dvh] w-full max-w-2xl flex-col bg-[#F8FAFC] shadow-2xl will-change-transform"
          >
            {/* Sticky Drawer Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-7">
              <div className="min-w-0">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#D97706] uppercase">
                  {t.drawer.eyebrow}
                </span>
                <h2
                  id="procurement-drawer-title"
                  className="mt-0.5 flex flex-wrap items-center gap-2 font-display text-lg font-extrabold text-[#0F1E36] sm:text-xl"
                >
                  <span>{result ? t.drawer.titleProforma : t.drawer.titleBuilder}</span>
                  {!result && (
                    <motion.span
                      key={items.length}
                      initial={shouldReduceMotion ? false : { scale: 1.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                      className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#EFF6FF] px-2 font-mono text-xs font-bold text-[#1D4E89]"
                    >
                      {items.length}
                    </motion.span>
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close procurement drawer"
                className="inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0F1E36]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              data-lenis-prevent
              className="pb-safe flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-7"
            >
              {result ? (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                    <div className="text-xs leading-relaxed sm:text-sm">
                      <strong className="block font-display text-sm font-bold text-emerald-950">
                        {t.drawer.readyBannerTitle}{" "}
                        <span translate="no" className="notranslate">
                          {result.reference}
                        </span>
                      </strong>
                      <span>{t.drawer.readyBannerBody}</span>
                    </div>
                  </div>

                  <div
                    id="official-proforma-document"
                    className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm"
                  >
                    <div className="border-b-4 border-[#D97706] bg-[#091322] px-5 py-5 text-white sm:px-6">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <BrandLogo variant="dark" asLink={false} />
                        <div className="text-left sm:text-right">
                          <span className="block font-mono text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">
                            {t.drawer.proformaTag}
                          </span>
                          <span
                            translate="no"
                            className="notranslate mt-1 block font-mono text-sm font-bold text-white"
                          >
                            {result.reference}
                          </span>
                          <span className="mt-0.5 block font-mono text-[11px] text-slate-300">
                            {new Date(result.submittedAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-4 text-xs sm:grid-cols-2 sm:px-6">
                      <div>
                        <span className="font-mono text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
                          {t.drawer.preparedFor}
                        </span>
                        <p className="mt-1 font-display text-sm font-bold text-[#0F1E36]">
                          {result.order.company}
                        </p>
                        <p className="mt-0.5 text-slate-700">
                          {t.drawer.attnLabel} {result.order.contactPerson} · {result.order.phone}
                        </p>
                        <p className="text-slate-600">{result.order.email}</p>
                      </div>

                      <div className="sm:text-right">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
                          {t.drawer.deliverySchedule}
                        </span>
                        <p className="mt-1 font-semibold text-[#0F1E36]">
                          {result.order.destination === "Custom Site Address" &&
                          result.order.customAddress
                            ? result.order.customAddress
                            : result.order.destination}
                        </p>
                        <p className="mt-0.5 font-mono text-slate-600">
                          {t.drawer.targetDateLabel}{" "}
                          {result.order.targetDate || t.drawer.toBeScheduled}
                        </p>
                        <p className="font-mono text-[11px] text-[#B45309]">
                          {t.drawer.validityNote}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-4 sm:px-6">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[300px] text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 font-mono text-[10px] text-[#64748B] uppercase">
                              <th className="py-2 pr-2">{t.drawer.colCommodity}</th>
                              <th className="px-2 py-2">{t.drawer.colFormTerms}</th>
                              <th className="py-2 pl-2 text-right">{t.drawer.colQuantity}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {result.order.items.map((line) => {
                              const mineral = mineralMap.get(line.mineralId)
                              const loc = t.minerals[line.mineralId as keyof typeof t.minerals]
                              return (
                                <tr key={line.mineralId}>
                                  <td className="py-3 pr-2">
                                    <div className="font-bold text-[#0F1E36]">
                                      {loc?.name || mineral?.name || line.mineralId}
                                    </div>
                                    <div className="font-mono text-[11px] text-[#64748B]">
                                      <span translate="no" className="notranslate">
                                        {mineral?.formula}
                                      </span>{" "}
                                      · {loc?.grade || mineral?.grade}
                                    </div>
                                  </td>
                                  <td className="px-2 py-3 text-slate-700">
                                    <div>{line.form}</div>
                                    <div className="font-mono text-[10px] text-[#1D4E89]">
                                      {line.deliveryTerm}
                                    </div>
                                  </td>
                                  <td className="py-3 pl-2 text-right font-mono font-bold text-[#0F1E36]">
                                    {line.quantity} {line.unit}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>

                      {result.order.notes && (
                        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                          <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase">
                            {t.drawer.buyerNotesLabel}{" "}
                          </span>
                          {result.order.notes}
                        </div>
                      )}
                    </div>

                    <div
                      translate="no"
                      className="notranslate border-t border-slate-200 bg-slate-50 px-4 py-4 text-[11px] leading-relaxed break-words text-slate-600 sm:px-6"
                    >
                      <p className="font-bold text-[#0F1E36]">
                        {COMPANY.legalName} · {COMPANY.rcNumber}
                      </p>
                      <p>{COMPANY.address}</p>
                      <p className="mt-0.5 font-mono">
                        Tel: {COMPANY.phones[0].international} / {COMPANY.phones[1].international} ·{" "}
                        {COMPANY.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <MagneticButton
                      as="a"
                      href={result.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      wrapperClassName="w-full"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#15803D] px-3 py-2.5 text-center text-xs leading-snug font-bold text-white shadow-xs transition-colors hover:bg-[#166534] sm:text-sm"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span>
                        {t.drawer.btnWhatsApp} ({COMPANY.phones[0].display})
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    </MagneticButton>

                    <MagneticButton
                      as="a"
                      href={result.mailtoUrl}
                      wrapperClassName="w-full"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#1D4E89] px-3 py-2.5 text-center text-xs leading-snug font-bold text-white shadow-xs transition-colors hover:bg-[#1E40AF] sm:text-sm"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      <span>
                        {t.drawer.btnEmail} ({COMPANY.email})
                      </span>
                    </MagneticButton>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-center text-xs leading-snug font-bold text-[#0F1E36] transition-colors hover:bg-slate-50 sm:text-sm"
                    >
                      <Download className="h-4 w-4 shrink-0" />
                      <span>{t.drawer.btnPrint}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-center text-xs leading-snug font-bold text-[#0F1E36] transition-colors hover:bg-slate-50 sm:text-sm"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{t.drawer.btnCopied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 shrink-0" />
                          <span>{t.drawer.btnCopy}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs">
                    <button
                      type="button"
                      onClick={() => setResult(null)}
                      className="font-bold text-[#1D4E89] hover:text-[#0F1E36]"
                    >
                      &larr; {t.drawer.btnEditOrder}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAll}
                      className="font-bold text-slate-500 hover:text-red-700"
                    >
                      {t.drawer.btnClearReset}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitOrder} noValidate className="space-y-6">
                  {serverError && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-900">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {errors.items && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-900">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <span>{errors.items}</span>
                    </div>
                  )}

                  {unselectedMinerals.length > 0 && (
                    <div className="rounded-lg border border-slate-200 bg-white p-3.5">
                      <label
                        htmlFor="quick-add-mineral"
                        className="block font-mono text-[10px] font-bold tracking-wider text-[#64748B] uppercase"
                      >
                        {t.drawer.quickAddLabel}
                      </label>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {unselectedMinerals.slice(0, 4).map((m) => {
                          const loc = t.minerals[m.id as keyof typeof t.minerals]
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => onAddMineral(m)}
                              className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-[#0F1E36] transition-colors hover:border-[#D97706] hover:bg-amber-50"
                            >
                              <Plus className="h-3 w-3 text-[#D97706]" />
                              <span>{loc?.name || m.name}</span>
                            </button>
                          )
                        })}
                        {unselectedMinerals.length > 4 && (
                          <select
                            id="quick-add-mineral"
                            defaultValue=""
                            onChange={(e) => {
                              const picked = mineralMap.get(e.target.value)
                              if (picked) {
                                onAddMineral(picked)
                                e.target.value = ""
                              }
                            }}
                            className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-[#1D4E89]"
                          >
                            <option value="" disabled>
                              {t.drawer.moreResources}
                            </option>
                            {unselectedMinerals.slice(4).map((m) => {
                              const loc = t.minerals[m.id as keyof typeof t.minerals]
                              return (
                                <option key={m.id} value={m.id}>
                                  + {loc?.name || m.name} ({m.formula})
                                </option>
                              )
                            })}
                          </select>
                        )}
                      </div>
                    </div>
                  )}

                  {items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                      <PackageCheck className="mx-auto h-9 w-9 text-[#D97706]" />
                      <h3 className="mt-3 font-display text-base font-bold text-[#0F1E36]">
                        {t.drawer.emptyTitle}
                      </h3>
                      <p className="mt-1 text-xs text-[#64748B]">{t.drawer.emptySubtitle}</p>
                      <button
                        type="button"
                        onClick={() => {
                          onClose()
                          window.requestAnimationFrame(() => {
                            document
                              .getElementById("catalog")
                              ?.scrollIntoView({ behavior: "smooth" })
                          })
                        }}
                        className="mt-4 inline-flex h-11 touch-manipulation items-center gap-1.5 rounded-md bg-[#0F1E36] px-4 text-xs font-bold text-white hover:bg-[#1D4E89]"
                      >
                        <span>{t.drawer.browseCatalog}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {items.map((line, index) => {
                          const mineral = mineralMap.get(line.mineralId)
                          if (!mineral) return null
                          const loc = t.minerals[mineral.id as keyof typeof t.minerals]
                          const qtyError = errors[`items.${index}.quantity`]

                          return (
                            <motion.div
                              key={line.mineralId}
                              layout
                              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={shouldReduceMotion ? undefined : { opacity: 0, x: 24 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="h-14 w-16 shrink-0 rounded-md bg-slate-200 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${mineral.image})` }}
                                  />
                                  <div>
                                    <span
                                      translate="no"
                                      className="notranslate font-mono text-[10px] font-bold text-[#1D4E89]"
                                    >
                                      {mineral.code} · {mineral.formula}
                                    </span>
                                    <h3 className="font-display text-sm font-extrabold text-[#0F1E36]">
                                      {loc?.name || mineral.name}
                                    </h3>
                                    <p className="font-mono text-[11px] text-[#64748B]">
                                      {loc?.grade || mineral.grade}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(line.mineralId)}
                                  aria-label={`Remove ${mineral.name} from order`}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <label
                                    htmlFor={`qty-${line.mineralId}`}
                                    className="block text-[11px] font-semibold text-slate-600"
                                  >
                                    {t.drawer.qtyLabel}
                                  </label>
                                  <div className="mt-1 flex flex-col gap-2 min-[400px]:flex-row">
                                    <div className="inline-flex items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                                      <button
                                        type="button"
                                        onClick={() => stepQuantity(line, -1)}
                                        aria-label={`Decrease ${mineral.name} quantity`}
                                        className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center border-r border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 sm:h-9 sm:w-8"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <input
                                        id={`qty-${line.mineralId}`}
                                        type="text"
                                        inputMode="decimal"
                                        value={line.quantity}
                                        onChange={(e) =>
                                          onUpdateItem(line.mineralId, { quantity: e.target.value })
                                        }
                                        placeholder="100"
                                        className={`h-10 w-full min-w-[3.2rem] px-2 text-center font-mono text-base text-[#0F1E36] focus:outline-none min-[400px]:w-16 sm:h-9 sm:text-xs ${
                                          qtyError ? "bg-red-50" : "bg-white"
                                        }`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => stepQuantity(line, 1)}
                                        aria-label={`Increase ${mineral.name} quantity`}
                                        className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center border-l border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 sm:h-9 sm:w-8"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>
                                    <select
                                      aria-label={`${mineral.name} ${t.drawer.unitLabel}`}
                                      value={line.unit}
                                      onChange={(e) =>
                                        onUpdateItem(line.mineralId, { unit: e.target.value })
                                      }
                                      className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-2 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:h-9 sm:text-xs"
                                    >
                                      {UNIT_VALUES.map((unitVal, uIdx) => (
                                        <option key={unitVal} value={unitVal}>
                                          {t.drawer.units[uIdx] || unitVal}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {qtyError && (
                                    <p className="mt-1 text-[11px] text-red-600">{qtyError}</p>
                                  )}
                                </div>

                                <div>
                                  <label
                                    htmlFor={`form-${line.mineralId}`}
                                    className="block text-[11px] font-semibold text-slate-600"
                                  >
                                    {t.drawer.preferredFormLabel}
                                  </label>
                                  <select
                                    id={`form-${line.mineralId}`}
                                    value={line.form}
                                    onChange={(e) =>
                                      onUpdateItem(line.mineralId, { form: e.target.value })
                                    }
                                    className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-2.5 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:h-9 sm:text-xs"
                                  >
                                    {mineral.forms.map((canonicalForm, fIdx) => (
                                      <option key={canonicalForm} value={canonicalForm}>
                                        {loc?.forms[fIdx] || canonicalForm}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="sm:col-span-2">
                                  <label
                                    htmlFor={`term-${line.mineralId}`}
                                    className="block text-[11px] font-semibold text-slate-600"
                                  >
                                    {t.drawer.preferredTermsLabel} ({t.catalog.moqLabel}:{" "}
                                    {loc?.moq || mineral.moq})
                                  </label>
                                  <select
                                    id={`term-${line.mineralId}`}
                                    value={line.deliveryTerm}
                                    onChange={(e) =>
                                      onUpdateItem(line.mineralId, { deliveryTerm: e.target.value })
                                    }
                                    className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-2.5 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:h-9 sm:text-xs"
                                  >
                                    {mineral.terms.map((canonicalTerm, tIdx) => (
                                      <option key={canonicalTerm} value={canonicalTerm}>
                                        {loc?.terms[tIdx] || canonicalTerm}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  {items.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                      <div className="border-b border-slate-100 pb-3">
                        <span className="font-mono text-[10px] font-bold tracking-widest text-[#D97706] uppercase">
                          {t.drawer.buyerSectionEyebrow}
                        </span>
                        <h3 className="mt-0.5 font-display text-base font-bold text-[#0F1E36]">
                          {t.drawer.buyerSectionTitle}
                        </h3>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700">
                            {t.drawer.fieldCompany}
                          </label>
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder={t.drawer.placeholderCompany}
                            className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                              errors.company ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                            }`}
                          />
                          {errors.company && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.company}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700">
                            {t.drawer.fieldContact}
                          </label>
                          <input
                            type="text"
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            placeholder={t.drawer.placeholderContact}
                            className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                              errors.contactPerson
                                ? "border-red-400 bg-red-50"
                                : "border-slate-300 bg-white"
                            }`}
                          />
                          {errors.contactPerson && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.contactPerson}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700">
                            {t.drawer.fieldPhone}
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.drawer.placeholderPhone}
                            className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                              errors.phone ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                            }`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700">
                            {t.drawer.fieldEmail}
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.drawer.placeholderEmail}
                            className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                              errors.email ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700">
                            {t.drawer.fieldDestination}
                          </label>
                          <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm"
                          >
                            {DESTINATION_VALUES.map((val, dIdx) => (
                              <option key={val} value={val}>
                                {t.drawer.destinations[dIdx] || val}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700">
                            {t.drawer.fieldTargetDate}
                          </label>
                          <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm"
                          />
                        </div>

                        {destination === "Custom Site Address" && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700">
                              {t.drawer.fieldCustomAddress}
                            </label>
                            <input
                              type="text"
                              value={customAddress}
                              onChange={(e) => setCustomAddress(e.target.value)}
                              placeholder={t.drawer.placeholderCustomAddress}
                              className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                                errors.customAddress
                                  ? "border-red-400 bg-red-50"
                                  : "border-slate-300 bg-white"
                              }`}
                            />
                            {errors.customAddress && (
                              <p className="mt-1 text-[11px] text-red-600">
                                {errors.customAddress}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700">
                            {t.drawer.fieldNotes}
                          </label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t.drawer.placeholderNotes}
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-5 space-y-2.5">
                        <MagneticButton
                          type="submit"
                          disabled={submitting}
                          wrapperClassName="w-full"
                          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#D97706] px-4 py-3 text-center text-sm leading-snug font-bold text-white shadow-sm transition-colors hover:bg-[#B45309] disabled:opacity-60"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                              <span>{t.drawer.btnSubmitting}</span>
                            </>
                          ) : (
                            <>
                              <span>{t.drawer.btnSubmit}</span>
                              <ArrowRight className="h-4 w-4 shrink-0" />
                            </>
                          )}
                        </MagneticButton>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <a
                            href={instantWhatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-emerald-600/30 bg-emerald-50 px-3 py-2.5 text-center text-xs leading-snug font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
                          >
                            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                            <span>{t.drawer.btnQuickWhatsApp}</span>
                          </a>
                          <a
                            href={instantMailtoUrl}
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-[#1D4E89]/30 bg-[#EFF6FF] px-3 py-2.5 text-center text-xs leading-snug font-bold text-[#1D4E89] transition-colors hover:bg-blue-100"
                          >
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span>{t.drawer.btnDirectEmail}</span>
                          </a>
                        </div>
                      </div>

                      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>
                          {t.drawer.privacyNote}{" "}
                          <span translate="no" className="notranslate">
                            {COMPANY.legalName} ({COMPANY.rcNumber})
                          </span>
                          .
                        </span>
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
