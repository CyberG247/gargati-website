"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { MaskedTextReveal } from "@/components/motion/masked-text-reveal"
import { COMPANY } from "@/lib/company"
import { useLanguage } from "@/lib/i18n/language-context"

interface HeroProps {
  cartCount: number
  onOpenDrawer: () => void
}

export function Hero({ cartCount, onOpenDrawer }: HeroProps) {
  const { t } = useLanguage()
  const heroRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 72])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.09])
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -55])
  const orbOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative overflow-hidden bg-[#091322] text-white"
    >
      <div className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[690px]">
        {/* Parallax Background Photo Layer */}
        <motion.div
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { y: imageY, scale: imageScale }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/hero-mining-ops.png"
            alt="Heavy hydraulic excavator loading mineral ore into an articulated haul truck at a Nigerian open-pit operation"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-85"
          />
        </motion.div>

        {/* Architectural Grid & Multi-Stop Obsidian Vignette */}
        <motion.div
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { y: gridY }}
          className="bg-industrial-grid pointer-events-none absolute inset-0 will-change-transform"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#091322]/96 via-[#0F1E36]/88 to-[#091322]/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#091322]/90 via-transparent to-[#091322]/35"
        />

        {/* Ambient Molten Gold & Royal Steel Radial Glows */}
        <motion.div
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { y: orbY, opacity: orbOpacity }}
          className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
        >
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#1D4E89]/25 blur-3xl" />
          <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-[#F59E0B]/15 blur-3xl" />
        </motion.div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-24">
          {/* Left Executive Column with Masked Line-by-Line Reveal */}
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-[#F59E0B]/35 bg-[#091322]/85 px-3.5 py-1.5 backdrop-blur-md"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#F59E0B]" />
              <span className="font-mono text-[10px] font-semibold tracking-wider text-[#FBBF24] uppercase sm:text-[11px]">
                {t.hero.eyebrow}
              </span>
              <span className="hidden text-slate-500 sm:inline">|</span>
              <span
                translate="no"
                className="notranslate font-mono text-[10px] font-semibold text-slate-200 sm:text-[11px]"
              >
                {COMPANY.rcNumber}
              </span>
            </motion.div>

            <h1 className="mt-5 font-display text-[clamp(1.75rem,5.4vw,3.375rem)] leading-[1.09] font-extrabold tracking-tight break-words text-white sm:mt-6">
              <MaskedTextReveal delay={0.05}>{t.hero.headlinePart1}</MaskedTextReveal>
              <MaskedTextReveal delay={0.13} className="text-[#F59E0B]">
                {t.hero.headlineAccent}
              </MaskedTextReveal>
              <MaskedTextReveal delay={0.21}>{t.hero.headlinePart2}</MaskedTextReveal>
            </h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:mt-6 sm:text-base md:text-lg"
            >
              {t.hero.subheadlinePrefix}
              <strong translate="no" className="notranslate font-semibold text-white">
                {COMPANY.legalName}
              </strong>
              {t.hero.subheadlineSuffix}
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5"
            >
              <MagneticButton
                as="a"
                href="#catalog"
                wrapperClassName="w-full sm:w-auto"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#D97706] px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-black/30 transition-colors hover:bg-[#F59E0B] hover:text-[#091322] sm:w-auto"
              >
                <span>{t.hero.ctaExplore}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </MagneticButton>

              <MagneticButton
                as="a"
                href="#contact"
                wrapperClassName="w-full sm:w-auto"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-white/30 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white/20 sm:w-auto"
              >
                <span>{t.hero.ctaContact}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </MagneticButton>

              {cartCount > 0 && (
                <MagneticButton
                  onClick={onOpenDrawer}
                  wrapperClassName="w-full sm:w-auto"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-[#F59E0B]/50 bg-[#091322]/90 px-5 py-3 text-sm font-semibold text-[#FBBF24] transition-colors hover:bg-[#13294B] sm:w-auto"
                >
                  <PackageCheck className="h-4 w-4 shrink-0" />
                  <span>
                    {t.hero.ctaOpenRfq} ({cartCount})
                  </span>
                </MagneticButton>
              )}
            </motion.div>
          </div>

          {/* Right Executive Obsidian Glass Operations Card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0 lg:col-span-5 xl:col-span-4"
          >
            <div className="glass-dark relative overflow-hidden rounded-xl p-5 shadow-[0_24px_70px_rgba(0,0,0,0.5)] sm:p-6">
              {/* Top Luminous Hairline Accent */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/70 to-transparent"
              />

              <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-semibold tracking-widest text-[#FBBF24] uppercase">
                    {t.hero.deskEyebrow}
                  </span>
                  <h2 className="mt-1 font-display text-base font-bold text-white sm:text-lg">
                    {t.hero.deskTitle}
                  </h2>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1D4E89]/40 text-[#F59E0B]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] py-3 text-xs sm:text-sm">
                  <dt className="text-slate-300">{t.hero.statStatus}</dt>
                  <dd translate="no" className="notranslate font-mono text-xs font-semibold text-white">
                    {COMPANY.rcNumber}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] py-3 text-xs sm:text-sm">
                  <dt className="text-slate-300">{t.hero.statPortfolio}</dt>
                  <dd className="text-right font-mono text-xs font-semibold text-[#FBBF24]">
                    {t.hero.statPortfolioValue}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] py-3 text-xs sm:text-sm lg:border-b">
                  <dt className="text-slate-300">{t.hero.statHeadOffice}</dt>
                  <dd className="text-right font-medium text-white">
                    {t.hero.statHeadOfficeValue}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 py-3 text-xs sm:text-sm">
                  <dt className="text-slate-300">{t.hero.statChannels}</dt>
                  <dd className="text-right font-medium text-slate-200">
                    {t.hero.statChannelsValue}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-white/[0.08] pt-5 min-[380px]:grid-cols-2">
                <MagneticButton
                  onClick={onOpenDrawer}
                  wrapperClassName="w-full"
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-[#1D4E89] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#2563EB]"
                >
                  <span>{t.hero.ctaBuildRfq}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </MagneticButton>
                <a
                  translate="no"
                  href={COMPANY.phones[0].telHref}
                  className="notranslate inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <span>{COMPANY.phones[0].display}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4-Pillar Trust Bar */}
      <div className="border-t border-white/[0.08] bg-[#091322]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-px bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5 bg-[#091322] px-4 py-4 sm:px-5 lg:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1D4E89]/35 text-[#F59E0B]">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{t.hero.trustCacTitle}</p>
                <p translate="no" className="notranslate font-mono text-xs text-slate-300">
                  {COMPANY.rcNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#091322] px-4 py-4 sm:px-5 lg:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1D4E89]/35 text-[#F59E0B]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{t.hero.trustAbujaTitle}</p>
                <p className="text-xs text-slate-300">{t.hero.trustAbujaSub}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#091322] px-4 py-4 sm:px-5 lg:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1D4E89]/35 text-[#F59E0B]">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{t.hero.trustAssayTitle}</p>
                <p className="text-xs text-slate-300">{t.hero.trustAssaySub}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-[#091322] px-4 py-4 sm:px-5 lg:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1D4E89]/35 text-[#F59E0B]">
                <Truck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{t.hero.trustLogisticsTitle}</p>
                <p className="text-xs text-slate-300">{t.hero.trustLogisticsSub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Verticals Strip */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-xs text-slate-700 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-[#1D4E89] uppercase">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-[#D97706]" />
            {t.hero.coreVerticalsLabel}
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-semibold text-[#0F1E36] sm:gap-x-6">
            {t.hero.verticals.map((vertical, idx) => (
              <span key={vertical} className="inline-flex items-center gap-2">
                {idx > 0 && (
                  <span className="hidden h-1 w-1 rounded-full bg-[#D97706] sm:inline-block" />
                )}
                {vertical}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
