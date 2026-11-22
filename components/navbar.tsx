"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import {
  ArrowUpRight,
  Mail,
  Menu,
  MessageSquare,
  PackageCheck,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { LanguageSelector } from "@/components/language-selector"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { useSmoothScroll } from "@/components/motion/smooth-scroll-provider"
import { COMPANY } from "@/lib/company"
import { useLanguage } from "@/lib/i18n/language-context"

interface NavbarProps {
  cartCount: number
  onOpenDrawer: () => void
}

const SECTION_IDS = ["home", "about", "catalog", "engineering", "projects", "contact"] as const

export function Navbar({ cartCount, onOpenDrawer }: NavbarProps) {
  const { language, t, isLoading } = useLanguage()
  const { stopScroll, startScroll } = useSmoothScroll()
  const shouldReduceMotion = useReducedMotion()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  })

  const navItems = [
    { href: "#home", label: t.nav.home, id: "home" },
    { href: "#about", label: t.nav.about, id: "about" },
    { href: "#catalog", label: t.nav.catalog, id: "catalog" },
    { href: "#engineering", label: t.nav.engineering, id: "engineering" },
    { href: "#projects", label: t.nav.projects, id: "projects" },
    { href: "#contact", label: t.nav.contact, id: "contact" },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)

      const scrollOffset = window.scrollY + 150
      let current = "home"
      for (const id of SECTION_IDS) {
        const sectionEl = document.getElementById(id)
        if (sectionEl && sectionEl.offsetTop <= scrollOffset) {
          current = id
        }
      }
      setActiveSection(current)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    stopScroll()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }

    const mq = window.matchMedia("(min-width: 1024px)")
    const handleBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    mq.addEventListener("change", handleBreakpoint)

    return () => {
      startScroll()
      window.removeEventListener("keydown", handleKeyDown)
      mq.removeEventListener("change", handleBreakpoint)
    }
  }, [mobileMenuOpen, stopScroll, startScroll])

  const handleMobileNavClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    event.preventDefault()
    setMobileMenuOpen(false)
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      window.history.replaceState(null, "", href)
    })
  }

  const sidebarSlideOffset = language.dir === "rtl" ? "-100%" : "100%"

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* 2px Molten Gold Architectural Scroll Progress Bar */}
      <div className="h-[2px] w-full bg-[#091322]">
        <motion.div
          style={{ scaleX }}
          className="h-full origin-left bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#FBBF24]"
        />
      </div>

      {/* Executive Compliance, Language Preference & Dispatch Utility Bar */}
      <div
        className={`border-b border-white/[0.08] bg-[#091322] text-slate-300 transition-all duration-300 ${
          isScrolled ? "py-1" : "py-1.5"
        }`}
      >
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-between gap-2 px-3 text-xs sm:gap-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-[#F59E0B] ring-4 ring-[#F59E0B]/20" />
            <span className="truncate font-medium text-slate-200">{t.nav.topLocation}</span>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <span
              translate="no"
              className="notranslate hidden items-center gap-1.5 font-mono text-[11px] font-semibold text-[#FBBF24] sm:inline-flex"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {COMPANY.rcNumber}
            </span>
            <a
              translate="no"
              href={COMPANY.phones[0].telHref}
              className="notranslate hidden items-center gap-1.5 font-mono text-[11px] font-medium text-white transition-colors hover:text-[#FBBF24] md:inline-flex"
            >
              <Phone className="h-3 w-3 text-[#F59E0B]" />
              <span>{COMPANY.phones[0].international}</span>
            </a>
            <a
              translate="no"
              href={`mailto:${COMPANY.email}`}
              className="notranslate hidden items-center gap-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:text-white xl:inline-flex"
            >
              <Mail className="h-3 w-3 text-[#F59E0B]" />
              <span>{COMPANY.email}</span>
            </a>

            <LanguageSelector variant="topbar" />
          </div>
        </div>
      </div>

      {/* Smooth Indeterminate Gold Beam During Live AI Translation */}
      {isLoading && (
        <div className="relative h-0.5 w-full overflow-hidden bg-amber-100">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "250%" }}
            transition={{ repeat: Infinity, duration: 1.15, ease: "linear" }}
            className="h-full w-2/5 bg-gradient-to-r from-transparent via-[#D97706] to-transparent"
          />
        </div>
      )}

      {/* Smart Shrinking Frosted Glass Header */}
      <header
        className={`border-b transition-all duration-300 ${
          isScrolled
            ? "border-slate-200/75 bg-white/85 shadow-[0_12px_40px_rgba(9,19,34,0.10)] backdrop-blur-xl"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-2.5 px-3 transition-all duration-300 sm:gap-4 sm:px-6 lg:px-8 ${
            isScrolled
              ? "min-h-[60px] py-1.5 sm:min-h-[64px]"
              : "min-h-[68px] py-2 sm:min-h-[76px]"
          }`}
        >
          <div className="min-w-0 flex-1 overflow-hidden lg:flex-none">
            <BrandLogo variant="light" />
          </div>

          {/* Desktop & Landscape Tablet Navigation with Shared-Element layoutId Indicator */}
          <nav
            className="hidden items-center lg:flex lg:gap-0.5 xl:gap-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative rounded-md py-2 font-semibold whitespace-nowrap transition-colors lg:px-2 lg:text-xs xl:px-3 xl:text-[13px] ${
                    isActive
                      ? "text-[#0F1E36]"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-[#1D4E89]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-x-2 -bottom-[14px] h-[2.5px] rounded-full bg-[#D97706] xl:inset-x-3"
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right Procurement Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onOpenDrawer}
              aria-label={`${t.nav.openRfqList} (${cartCount})`}
              className="relative z-10 inline-flex h-11 shrink-0 touch-manipulation items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/90 px-2.5 text-xs font-semibold text-[#0F1E36] transition-colors hover:border-[#1D4E89]/40 hover:bg-[#EFF6FF] active:bg-slate-100 sm:h-10 sm:gap-2 sm:px-3.5 sm:text-[13px]"
            >
              <PackageCheck className="h-4 w-4 text-[#1D4E89]" />
              <span className="hidden sm:inline">{t.nav.orderRfq}</span>
              <motion.span
                key={cartCount}
                initial={{ scale: 1.45 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 460, damping: 18 }}
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-bold ${
                  cartCount > 0
                    ? "bg-[#D97706] text-white"
                    : "bg-[#1D4E89]/10 text-[#1D4E89]"
                }`}
              >
                {cartCount}
              </motion.span>
            </button>

            <MagneticButton
              onClick={onOpenDrawer}
              wrapperClassName="hidden md:inline-flex"
              className="hidden h-10 items-center gap-1.5 rounded-md bg-[#D97706] px-3.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#B45309] md:inline-flex xl:px-4 xl:text-[13px]"
            >
              <span className="whitespace-nowrap">{t.nav.requestBulkQuote}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </MagneticButton>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="relative z-10 inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-md border border-slate-200 text-[#0F1E36] transition-colors hover:bg-slate-50 active:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Portal Slide-Over Mobile & Tablet Navigation Sidebar */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                key="mobile-sidebar-backdrop"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="presentation"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setMobileMenuOpen(false)
                }}
                className="fixed inset-0 z-[65] flex justify-end bg-[#091322]/75 backdrop-blur-xs lg:hidden"
              >
                <motion.aside
                  key="mobile-sidebar-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile navigation"
                  initial={shouldReduceMotion ? false : { x: sidebarSlideOffset }}
                  animate={{ x: 0 }}
                  exit={shouldReduceMotion ? undefined : { x: sidebarSlideOffset }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  className="flex h-[100dvh] w-full max-w-[340px] flex-col bg-white shadow-2xl will-change-transform"
                >
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3.5">
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <BrandLogo variant="light" asLink={false} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Close mobile menu"
                      className="inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Scrollable Sidebar Body */}
                  <div
                    data-lenis-prevent
                    className="pb-safe flex-1 overflow-y-auto overscroll-contain px-4 py-4"
                  >
                    <nav
                      className="flex flex-col divide-y divide-slate-100"
                      aria-label="Mobile navigation"
                    >
                      {navItems.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          onClick={(e) => handleMobileNavClick(e, item.id, item.href)}
                          className={`flex min-h-[48px] touch-manipulation items-center justify-between py-2.5 text-sm font-semibold ${
                            activeSection === item.id
                              ? "text-[#D97706]"
                              : "text-[#0F1E36] hover:text-[#1D4E89]"
                          }`}
                        >
                          <span>{item.label}</span>
                          {activeSection === item.id && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                          )}
                        </a>
                      ))}
                    </nav>

                    <div className="mt-4">
                      <LanguageSelector
                        variant="mobile"
                        onSelectComplete={() => setMobileMenuOpen(false)}
                      />
                    </div>

                    <div className="mt-4 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          onOpenDrawer()
                        }}
                        className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-md bg-[#D97706] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#B45309] active:bg-[#92400E]"
                      >
                        <PackageCheck className="h-4 w-4 shrink-0" />
                        <span>
                          {t.nav.openRfqList} ({cartCount})
                        </span>
                      </button>

                      <a
                        translate="no"
                        href={COMPANY.phones[0].telHref}
                        className="notranslate inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-md border border-[#1D4E89] bg-[#EFF6FF] px-4 py-2.5 text-sm font-bold text-[#1D4E89] transition-colors hover:bg-blue-100 active:bg-blue-200"
                      >
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>
                          {t.nav.callPrefix} {COMPANY.phones[0].international}
                        </span>
                      </a>

                      <a
                        translate="no"
                        href={`https://wa.me/${COMPANY.whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="notranslate inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-100 active:bg-emerald-200"
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span>
                          {t.footer.linkWhatsApp} ({COMPANY.phones[0].display})
                        </span>
                      </a>
                    </div>

                    <div
                      translate="no"
                      className="notranslate mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-[11px] leading-relaxed text-slate-600"
                    >
                      <p className="font-bold text-[#0F1E36]">{COMPANY.legalName}</p>
                      <p className="font-mono font-semibold text-[#1D4E89]">{COMPANY.rcNumber}</p>
                      <p className="mt-1">{COMPANY.address}</p>
                    </div>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
