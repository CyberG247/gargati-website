"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { COMPANY } from "@/lib/company"
import { useLanguage } from "@/lib/i18n/language-context"

interface FooterProps {
  onOpenDrawer: () => void
  onRequestAssayInquiry: () => void
  onRequestEngineeringInquiry: () => void
}

export function Footer({
  onOpenDrawer,
  onRequestAssayInquiry,
  onRequestEngineeringInquiry,
}: FooterProps) {
  const { t } = useLanguage()
  const footerRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [28, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.85, 1])

  const year = new Date().getFullYear()

  return (
    <footer
      ref={footerRef}
      className="pb-safe relative overflow-hidden bg-[#060D1A] text-slate-300"
    >
      {/* Luminous 1px Molten Gold Top Hairline Divider */}
      <div
        aria-hidden="true"
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F59E0B]/75 to-transparent"
      />

      <motion.div
        style={shouldReduceMotion ? undefined : { y, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-4 py-12 will-change-transform sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Verbatim Legal Identity */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-4">
            <BrandLogo variant="dark" />
            <div className="mt-5 rounded-lg border border-white/[0.09] bg-[#091322]/90 p-4 backdrop-blur-md">
              <p className="font-mono text-[11px] font-semibold tracking-wider text-[#FBBF24] uppercase">
                {t.footer.verifiedRegistration}
              </p>
              <p
                translate="no"
                className="notranslate mt-1.5 text-xs leading-relaxed font-bold break-words text-white"
              >
                {COMPANY.legalName}
              </p>
              <p translate="no" className="notranslate mt-1 font-mono text-xs text-slate-300">
                {COMPANY.rcNumber}
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{t.footer.mission}</p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs font-bold tracking-widest text-[#F59E0B] uppercase">
              {t.footer.colPortal}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#catalog" className="transition-colors hover:text-white">
                  {t.nav.catalog}
                </a>
              </li>
              <li>
                <a href="#engineering" className="transition-colors hover:text-white">
                  {t.nav.engineering}
                </a>
              </li>
              <li>
                <a href="#projects" className="transition-colors hover:text-white">
                  {t.nav.projects}
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-white">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-white">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Procurement Actions */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs font-bold tracking-widest text-[#F59E0B] uppercase">
              {t.footer.colProcurement}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <MagneticButton
                  onClick={onOpenDrawer}
                  strength={4}
                  className="inline-flex min-h-[40px] touch-manipulation items-center gap-1.5 rounded-md border border-[#F59E0B]/35 bg-[#D97706]/15 px-3 py-2 text-left text-xs font-bold text-[#FBBF24] transition-colors hover:bg-[#D97706] hover:text-white"
                >
                  <span>{t.footer.linkOpenRfq}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </MagneticButton>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onRequestAssayInquiry}
                  className="inline-flex min-h-[40px] touch-manipulation items-center gap-1.5 py-1.5 text-left transition-colors hover:text-white"
                >
                  <span>{t.footer.linkRequestAssay}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onRequestEngineeringInquiry}
                  className="inline-flex min-h-[40px] touch-manipulation items-center gap-1.5 py-1.5 text-left transition-colors hover:text-white"
                >
                  <span>{t.footer.linkSubmitTender}</span>
                </button>
              </li>
              <li>
                <MagneticButton
                  as="a"
                  href={`https://wa.me/${COMPANY.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  strength={4}
                  className="inline-flex min-h-[40px] touch-manipulation items-center gap-1.5 py-1.5 text-xs font-bold text-[#34D399] transition-colors hover:text-[#6EE7B7]"
                >
                  <span>
                    {t.footer.linkWhatsApp} ({COMPANY.phones[0].display})
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </MagneticButton>
              </li>
            </ul>
          </div>

          {/* Column 4: Verified Abuja Head Office & Contacts */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-3">
            <h3 className="font-mono text-xs font-bold tracking-widest text-[#F59E0B] uppercase">
              {t.footer.colHeadOffice}
            </h3>
            <div translate="no" className="notranslate mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                <p className="leading-relaxed break-words text-slate-300">{COMPANY.address}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                <div className="flex flex-col font-mono text-xs">
                  {COMPANY.phones.map((phone) => (
                    <a
                      key={phone.display}
                      href={phone.telHref}
                      className="py-0.5 text-white transition-colors hover:text-[#FBBF24]"
                    >
                      {phone.international} ({phone.display})
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="font-mono text-xs break-all text-white transition-colors hover:text-[#FBBF24] sm:break-normal"
                >
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Copyright Bottom Strip */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.08] pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <div translate="no" className="notranslate flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F59E0B]" />
              &copy; {year} {COMPANY.legalName}
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[#FBBF24]">{COMPANY.rcNumber}</span>
          </div>

          <a
            href="#home"
            className="inline-flex items-center gap-1 font-semibold text-[#FBBF24] transition-colors hover:text-white"
          >
            {t.footer.backToTop} &uarr;
          </a>
        </div>
      </motion.div>

      {/* Oversized Architectural Watermark */}
      <div
        aria-hidden="true"
        translate="no"
        className="notranslate pointer-events-none mx-auto max-w-7xl overflow-hidden px-4 pb-4 text-center select-none sm:px-6 lg:px-8"
      >
        <p className="font-display text-[clamp(2rem,8vw,6.5rem)] leading-none font-extrabold tracking-tighter whitespace-nowrap text-white/[0.03]">
          GARGATI MINNING · RC 9963225
        </p>
      </div>
    </footer>
  )
}
