"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { MaskedTextReveal } from "@/components/motion/masked-text-reveal"
import { COMPANY } from "@/lib/company"
import { useLanguage } from "@/lib/i18n/language-context"

export interface InquiryPrefill {
  inquiryType: string
  subject: string
  key: number
}

interface ComplianceAndContactProps {
  inquiryPrefill: InquiryPrefill | null
  onOpenDrawer: () => void
}

interface InquirySuccessState {
  reference: string
  whatsappUrl: string
  mailtoUrl: string
}

const INQUIRY_TYPE_VALUES = [
  "Bulk Mineral Offtake",
  "Laboratory Assay Report Request",
  "Engineering & Construction Tender",
  "Heavy Equipment Leasing",
  "General Corporate Inquiry",
] as const

export function ComplianceAndContact({
  inquiryPrefill,
  onOpenDrawer,
}: ComplianceAndContactProps) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()

  const [inquiryType, setInquiryType] = useState<string>(INQUIRY_TYPE_VALUES[0])
  const [company, setCompany] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [submitted, setSubmitted] = useState<InquirySuccessState | null>(null)

  useEffect(() => {
    if (!inquiryPrefill) return
    setSubmitted(null)
    setErrors({})
    setInquiryType(
      INQUIRY_TYPE_VALUES.includes(
        inquiryPrefill.inquiryType as (typeof INQUIRY_TYPE_VALUES)[number]
      )
        ? inquiryPrefill.inquiryType
        : INQUIRY_TYPE_VALUES[0]
    )
    setSubject(inquiryPrefill.subject)
    setMessage((prev) =>
      prev.trim()
        ? prev
        : `We would like to request technical documentation, availability schedule, and commercial terms regarding: ${inquiryPrefill.subject}.`
    )
  }, [inquiryPrefill])

  const handleInquirySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setServerError("")
    setSubmitting(true)

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType,
          company,
          contactPerson,
          phone,
          email,
          subject,
          message,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.ok) {
        if (data.errors && typeof data.errors === "object") {
          setErrors(data.errors)
        } else {
          setServerError("Please verify all required fields and try again.")
        }
        return
      }

      setSubmitted({
        reference: data.reference,
        whatsappUrl: data.whatsappUrl,
        mailtoUrl: data.mailtoUrl,
      })
    } catch {
      setServerError("Unable to submit online right now. Please contact our Abuja lines directly.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* SECTION: CORPORATE GOVERNANCE, METRICS COUNTER STRIP & VERIFIED CREDENTIALS */}
      <section
        id="about"
        className="bg-light-grid border-t border-slate-200 bg-[#F8FAFC] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Executive Track Record & Verification Metrics Counter Strip */}
          <div className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            <div className="rounded-xl border border-white/10 bg-[#091322] p-5 text-white shadow-lg">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">
                Mineral Portfolio
              </span>
              <div className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                <AnimatedCounter value={8} />
              </div>
              <p className="mt-1 text-xs text-slate-300">{t.hero.statPortfolioValue}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#091322] p-5 text-white shadow-lg">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">
                Peak Assay Purity
              </span>
              <div className="mt-2 font-display text-3xl font-extrabold text-[#F59E0B] sm:text-4xl">
                <AnimatedCounter value={92} suffix="%+" />
              </div>
              <p className="mt-1 text-xs text-slate-300">Carbonate &amp; High-Grade Specs</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#091322] p-5 text-white shadow-lg">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">
                Logistics Network
              </span>
              <div className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                <AnimatedCounter value={36} suffix="+" />
              </div>
              <p className="mt-1 text-xs text-slate-300">States, F.C.T. &amp; Export Ports</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#091322] p-5 text-white shadow-lg">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">
                CAC Verified
              </span>
              <div
                translate="no"
                className="notranslate mt-2 font-mono text-2xl font-extrabold text-[#FBBF24] sm:text-3xl"
              >
                <AnimatedCounter value={9963225} prefix="RC " />
              </div>
              <p className="mt-1 text-xs text-slate-300">Active Corporate Standing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            {/* Left Corporate Narrative */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-3">
                <span className="h-[2px] w-7 bg-[#D97706]" />
                <span className="font-mono text-xs font-bold tracking-widest text-[#D97706] uppercase">
                  {t.about.eyebrow}
                </span>
              </div>

              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#0F1E36] sm:text-4xl">
                <MaskedTextReveal trigger="inView">
                  {t.about.headingPart1}
                  <span className="text-[#1D4E89]">{t.about.headingAccent}</span>
                </MaskedTextReveal>
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#1E293B]">
                <strong translate="no" className="notranslate font-bold text-[#0F1E36]">
                  {COMPANY.legalName}
                </strong>{" "}
                {t.about.narrativeSuffix}
              </p>

              <div className="mt-8 space-y-4">
                {t.about.pillars.map((pillar, idx) => (
                  <motion.div
                    key={pillar.code}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.55,
                      delay: idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs"
                  >
                    <span
                      translate="no"
                      className="notranslate inline-flex shrink-0 rounded-md bg-[#091322] px-2.5 py-1 font-mono text-[10px] font-bold text-[#FBBF24]"
                    >
                      {pillar.code}
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-[#0F1E36]">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                        {pillar.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Architectural Verification Dossier Card */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-[6px_6px_0_#E2E8F0] sm:p-8 sm:shadow-[12px_12px_0_#E2E8F0]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5 text-[#1D4E89]">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <span className="font-mono text-xs font-bold tracking-widest uppercase">
                      {t.about.dossierBadge}
                    </span>
                  </div>
                  <BadgeCheck className="h-6 w-6 shrink-0 text-[#D97706]" />
                </div>

                <h3
                  translate="no"
                  className="notranslate mt-5 font-display text-base font-extrabold tracking-tight break-words text-[#0F1E36] sm:text-xl"
                >
                  {COMPANY.legalName}
                </h3>
                <p className="mt-1 text-xs text-[#64748B]">{t.about.dossierSubtitle}</p>

                <dl className="mt-6 divide-y divide-slate-100 text-xs sm:text-sm">
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="font-medium text-[#64748B]">{t.about.labelCac}</dt>
                    <dd translate="no" className="notranslate font-mono font-bold text-[#0F1E36]">
                      {COMPANY.rcNumber}
                    </dd>
                  </div>
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="font-medium text-[#64748B]">{t.about.labelAddress}</dt>
                    <dd
                      translate="no"
                      className="notranslate font-semibold break-words text-[#1E293B] sm:max-w-[62%] sm:text-right"
                    >
                      {COMPANY.address}
                    </dd>
                  </div>
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="font-medium text-[#64748B]">{t.about.labelLines}</dt>
                    <dd
                      translate="no"
                      className="notranslate font-mono font-semibold text-[#1D4E89] sm:text-right"
                    >
                      {COMPANY.phones.map((p, idx) => (
                        <span key={p.display}>
                          {idx > 0 && " · "}
                          <a href={p.telHref} className="hover:underline">
                            {p.international}
                          </a>
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="font-medium text-[#64748B]">{t.about.labelEmail}</dt>
                    <dd
                      translate="no"
                      className="notranslate font-mono font-semibold break-all text-[#1D4E89] sm:break-normal"
                    >
                      <a href={`mailto:${COMPANY.email}`} className="hover:underline">
                        {COMPANY.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="font-medium text-[#64748B]">{t.about.labelVerticals}</dt>
                    <dd className="font-medium text-[#1E293B] sm:max-w-[62%] sm:text-right">
                      {t.about.verticalsShort}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-200 pt-5 sm:flex-row">
                  <MagneticButton
                    wrapperClassName="w-full sm:flex-1"
                    onClick={onOpenDrawer}
                    className="inline-flex min-h-11 w-full flex-1 items-center justify-center rounded-md bg-[#091322] px-4 py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-[#1D4E89]"
                  >
                    <span>{t.about.btnOpenRfq}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </MagneticButton>
                  <a
                    href="#contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-center text-xs font-bold text-[#0F1E36] transition-colors hover:bg-slate-50"
                  >
                    <span>{t.about.btnRequestPack}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: ABUJA HEAD OFFICE & DIRECT PROCUREMENT INQUIRY DESK */}
      <section id="contact" className="bg-[#091322] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Direct Inquiry / Assay Request Form */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3">
                <span className="h-[2px] w-7 bg-[#F59E0B]" />
                <span className="font-mono text-xs font-bold tracking-widest text-[#FBBF24] uppercase">
                  {t.contact.eyebrow}
                </span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <MaskedTextReveal trigger="inView">
                  {t.contact.headingPart1}
                  <span className="text-[#F59E0B]">{t.contact.headingAccent}</span>
                </MaskedTextReveal>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {t.contact.intro}
              </p>

              {/* Form Card */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 rounded-xl border border-white/15 bg-white p-5 text-[#1E293B] shadow-2xl sm:p-8"
              >
                {submitted ? (
                  <div className="space-y-5 py-4">
                    <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                      <div>
                        <span
                          translate="no"
                          className="notranslate font-mono text-xs font-bold text-emerald-800"
                        >
                          REFERENCE · {submitted.reference}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-extrabold text-[#0F1E36]">
                          {t.contact.successTitle}
                        </h3>
                        <p className="mt-1 text-sm text-emerald-900">{t.contact.successBody}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <MagneticButton
                        as="a"
                        href={submitted.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        wrapperClassName="w-full"
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#15803D] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#166534]"
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span>{t.contact.btnDispatchWhatsApp}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                      </MagneticButton>
                      <MagneticButton
                        as="a"
                        href={submitted.mailtoUrl}
                        wrapperClassName="w-full"
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#1D4E89] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#1E40AF]"
                      >
                        <Mail className="h-4 w-4 shrink-0" />
                        <span>
                          {t.contact.btnOpenEmail} ({COMPANY.email})
                        </span>
                      </MagneticButton>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(null)
                        setSubject("")
                        setMessage("")
                      }}
                      className="text-xs font-bold text-[#1D4E89] hover:text-[#0F1E36]"
                    >
                      &larr; {t.contact.btnSendAnother}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} noValidate className="space-y-4">
                    {serverError && (
                      <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-900">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="inq-type"
                          className="block text-xs font-bold text-[#0F1E36]"
                        >
                          {t.contact.fieldCategory}
                        </label>
                        <select
                          id="inq-type"
                          value={inquiryType}
                          onChange={(e) => setInquiryType(e.target.value)}
                          className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm"
                        >
                          {INQUIRY_TYPE_VALUES.map((val, idx) => (
                            <option key={val} value={val}>
                              {t.contact.inquiryTypes[idx] || val}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="inq-company"
                          className="block text-xs font-bold text-[#0F1E36]"
                        >
                          {t.contact.fieldCompany}
                        </label>
                        <input
                          id="inq-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder={t.contact.placeholderCompany}
                          className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                            errors.company ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                          }`}
                        />
                        {errors.company && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.company}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="inq-contact"
                          className="block text-xs font-bold text-[#0F1E36]"
                        >
                          {t.contact.fieldContact}
                        </label>
                        <input
                          id="inq-contact"
                          type="text"
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          placeholder={t.contact.placeholderContact}
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
                        <label
                          htmlFor="inq-phone"
                          className="block text-xs font-bold text-[#0F1E36]"
                        >
                          {t.contact.fieldPhone}
                        </label>
                        <input
                          id="inq-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t.contact.placeholderPhone}
                          className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                            errors.phone ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="inq-email"
                          className="block text-xs font-bold text-[#0F1E36]"
                        >
                          {t.contact.fieldEmail}
                        </label>
                        <input
                          id="inq-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.contact.placeholderEmail}
                          className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                            errors.email ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="inq-subject"
                          className="block text-xs font-bold text-[#0F1E36]"
                        >
                          {t.contact.fieldSubject}
                        </label>
                        <input
                          id="inq-subject"
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder={t.contact.placeholderSubject}
                          className={`mt-1 min-h-11 w-full rounded-md border px-3 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:min-h-10 sm:text-sm ${
                            errors.subject ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                          }`}
                        />
                        {errors.subject && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.subject}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="inq-message"
                          className="block text-xs font-bold text-[#0F1E36]"
                        >
                          {t.contact.fieldMessage}
                        </label>
                        <textarea
                          id="inq-message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t.contact.placeholderMessage}
                          className={`mt-1 w-full rounded-md border px-3 py-2 text-base text-[#0F1E36] focus:border-[#1D4E89] focus:outline-none sm:text-sm ${
                            errors.message ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                          }`}
                        />
                        {errors.message && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.message}</p>
                        )}
                      </div>
                    </div>

                    <MagneticButton
                      type="submit"
                      disabled={submitting}
                      wrapperClassName="w-full"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#D97706] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#B45309] disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                          <span>{t.contact.btnSubmitting}</span>
                        </>
                      ) : (
                        <>
                          <span>{t.contact.btnSubmit}</span>
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </>
                      )}
                    </MagneticButton>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Right Column: Abuja Head Office Location Card + Direct Click-to-Call */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between gap-6 lg:col-span-5"
            >
              <div className="overflow-hidden rounded-xl border border-white/15 bg-white text-[#1E293B] shadow-2xl">
                <div className="bg-industrial-grid relative h-56 w-full bg-[#091322] sm:h-64 lg:h-72">
                  <iframe
                    title="Map preview for No. 41B Covenant Garden Estate, Lokogoma District, F.C.T., Abuja"
                    src={COMPANY.googleMapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0 opacity-95"
                  />
                  <div
                    translate="no"
                    className="notranslate pointer-events-none absolute top-3 left-3 rounded bg-[#091322]/90 px-2.5 py-1 font-mono text-[10px] font-bold text-[#FBBF24] backdrop-blur-md"
                  >
                    LOKOGOMA DISTRICT · ABUJA F.C.T.
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4E89]">
                        <Building2 className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] font-bold tracking-widest text-[#D97706] uppercase">
                          {t.contact.headOfficeBadge}
                        </span>
                        <h3
                          translate="no"
                          className="notranslate mt-0.5 font-display text-base font-extrabold break-words text-[#0F1E36]"
                        >
                          {COMPANY.addressLine1}
                        </h3>
                        <p translate="no" className="notranslate text-sm break-words text-[#475569]">
                          {COMPANY.addressLine2}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-[#64748B]">
                    <Clock className="h-4 w-4 shrink-0 text-[#D97706]" />
                    <span>{t.contact.workingHours}</span>
                  </div>

                  <div
                    translate="no"
                    className="notranslate mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    <a
                      href={COMPANY.phones[0].telHref}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-[#091322] px-3 py-2 font-mono text-xs font-bold text-white transition-colors hover:bg-[#1D4E89]"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-[#F59E0B]" />
                      <span>{COMPANY.phones[0].international}</span>
                    </a>
                    <a
                      href={COMPANY.phones[1].telHref}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-[#1D4E89]/30 bg-[#EFF6FF] px-3 py-2 font-mono text-xs font-bold text-[#1D4E89] transition-colors hover:bg-[#1D4E89] hover:text-white"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{COMPANY.phones[1].international}</span>
                    </a>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                    <span translate="no" className="notranslate font-mono text-[#64748B]">
                      {COMPANY.coordinates.display}
                    </span>
                    <a
                      href={COMPANY.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#1D4E89] hover:text-[#D97706]"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{t.contact.btnOpenMaps}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Executive Channels Card */}
              <div className="glass-dark rounded-xl p-5 sm:p-6">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">
                  {t.contact.channelsBadge}
                </span>
                <div className="mt-4 divide-y divide-white/[0.08]">
                  <a
                    href={COMPANY.phones[0].telHref}
                    className="flex items-center justify-between py-3 transition-colors hover:text-[#FBBF24]"
                  >
                    <div>
                      <span className="block text-xs text-slate-400">
                        {t.contact.primaryLineLabel}
                      </span>
                      <span translate="no" className="notranslate font-mono text-sm font-bold text-white">
                        {COMPANY.phones[0].international} ({COMPANY.phones[0].display})
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#F59E0B]" />
                  </a>

                  <a
                    href={COMPANY.phones[1].telHref}
                    className="flex items-center justify-between py-3 transition-colors hover:text-[#FBBF24]"
                  >
                    <div>
                      <span className="block text-xs text-slate-400">
                        {t.contact.secondaryLineLabel}
                      </span>
                      <span translate="no" className="notranslate font-mono text-sm font-bold text-white">
                        {COMPANY.phones[1].international} ({COMPANY.phones[1].display})
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#F59E0B]" />
                  </a>

                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="flex items-center justify-between py-3 transition-colors hover:text-[#FBBF24]"
                  >
                    <div>
                      <span className="block text-xs text-slate-400">{t.contact.emailLabel}</span>
                      <span translate="no" className="notranslate font-mono text-sm font-bold text-white">
                        {COMPANY.email}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#F59E0B]" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
