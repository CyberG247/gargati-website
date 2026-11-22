"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, CheckCircle2, X } from "lucide-react"
import { ComplianceAndContact, type InquiryPrefill } from "@/components/compliance-and-contact"
import { EngineeringServices } from "@/components/engineering-services"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { MineralCatalog } from "@/components/mineral-catalog"
import { MineralSpecModal } from "@/components/mineral-spec-modal"
import { MineralMarquee } from "@/components/motion/mineral-marquee"
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider"
import { Navbar } from "@/components/navbar"
import {
  ProcurementOrderDrawer,
  type CartLineItem,
} from "@/components/procurement-order-drawer"
import { ProjectsSection } from "@/components/projects-section"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { minerals, type Mineral } from "@/lib/minerals"

const STORAGE_KEY = "gargati_rfq_cart_v1"

function createDefaultLineItem(mineral: Mineral, preferredForm?: string): CartLineItem {
  return {
    mineralId: mineral.id,
    quantity: mineral.id === "aggregates" ? "2" : mineral.id === "gold" ? "1" : "30",
    unit: mineral.defaultUnit,
    form: preferredForm || mineral.forms[0],
    deliveryTerm: mineral.terms[0],
  }
}

function PortalContent() {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const [cartItems, setCartItems] = useState<CartLineItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSpecMineral, setActiveSpecMineral] = useState<Mineral | null>(null)
  const [inquiryPrefill, setInquiryPrefill] = useState<InquiryPrefill | null>(null)
  const [toast, setToast] = useState<{ title: string; subtitle: string } | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const validIds = new Set(minerals.map((m) => m.id))
          const filtered = parsed.filter(
            (entry): entry is CartLineItem =>
              Boolean(entry && typeof entry.mineralId === "string" && validIds.has(entry.mineralId))
          )
          setCartItems(filtered)
        }
      }
    } catch {
      // Ignore storage access restrictions
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      // Ignore storage write restrictions
    }
  }, [cartItems, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const cartIds = useMemo(() => new Set(cartItems.map((item) => item.mineralId)), [cartItems])

  const activeSpecLine = useMemo(
    () =>
      activeSpecMineral
        ? cartItems.find((line) => line.mineralId === activeSpecMineral.id)
        : undefined,
    [activeSpecMineral, cartItems]
  )

  const addMineralToCart = (
    mineral: Mineral,
    preferredForm?: string,
    openDrawerAfter = false
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((line) => line.mineralId === mineral.id)
      if (existingIndex >= 0) {
        if (!preferredForm) return prev
        const next = [...prev]
        next[existingIndex] = { ...next[existingIndex], form: preferredForm }
        return next
      }
      return [...prev, createDefaultLineItem(mineral, preferredForm)]
    })

    if (openDrawerAfter) {
      setActiveSpecMineral(null)
      setDrawerOpen(true)
    } else {
      const loc = t.minerals[mineral.id as keyof typeof t.minerals]
      const mineralName = loc?.name || mineral.name
      const mineralGrade = loc?.grade || mineral.grade
      setToast({
        title: `${mineralName} ${t.toast.addedSuffix}`,
        subtitle: `${mineralGrade} · ${t.toast.readySubtitle}`,
      })
    }
  }

  const updateCartItem = (mineralId: string, patch: Partial<CartLineItem>) => {
    setCartItems((prev) =>
      prev.map((line) => (line.mineralId === mineralId ? { ...line, ...patch } : line))
    )
  }

  const removeCartItem = (mineralId: string) => {
    setCartItems((prev) => prev.filter((line) => line.mineralId !== mineralId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const scrollToContactWithPrefill = (inquiryType: string, subject: string) => {
    setActiveSpecMineral(null)
    setDrawerOpen(false)
    setInquiryPrefill({ inquiryType, subject, key: Date.now() })
    window.requestAnimationFrame(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <Navbar cartCount={cartItems.length} onOpenDrawer={() => setDrawerOpen(true)} />

      <main>
        <Hero cartCount={cartItems.length} onOpenDrawer={() => setDrawerOpen(true)} />

        <MineralMarquee />

        <MineralCatalog
          cartIds={cartIds}
          cartCount={cartItems.length}
          onAddToCart={(mineral) => addMineralToCart(mineral)}
          onOpenSpec={(mineral) => setActiveSpecMineral(mineral)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <EngineeringServices
          onRequestProposal={(topic) =>
            scrollToContactWithPrefill("Engineering & Construction Tender", topic)
          }
        />

        <ProjectsSection
          onOpenDrawer={() => setDrawerOpen(true)}
          onRequestCorridorBrief={(topic) =>
            scrollToContactWithPrefill("Bulk Mineral Offtake", topic)
          }
        />

        <ComplianceAndContact
          inquiryPrefill={inquiryPrefill}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
      </main>

      <Footer
        onOpenDrawer={() => setDrawerOpen(true)}
        onRequestAssayInquiry={() =>
          scrollToContactWithPrefill(
            "Laboratory Assay Report Request",
            "Assay Report & Mineral Sample Verification Request"
          )
        }
        onRequestEngineeringInquiry={() =>
          scrollToContactWithPrefill(
            "Engineering & Construction Tender",
            "Civil Construction & Heavy Equipment Proposal Brief"
          )
        }
      />

      <MineralSpecModal
        mineral={activeSpecMineral}
        isInCart={activeSpecMineral ? cartIds.has(activeSpecMineral.id) : false}
        initialForm={activeSpecLine?.form}
        onClose={() => setActiveSpecMineral(null)}
        onAddAndOpenOrder={(mineral, form) => addMineralToCart(mineral, form, true)}
        onRequestAssay={(mineral) =>
          scrollToContactWithPrefill(
            "Laboratory Assay Report Request",
            `Assay Report Request: ${mineral.name} (${mineral.formula})`
          )
        }
      />

      <ProcurementOrderDrawer
        open={drawerOpen}
        items={cartItems}
        onClose={() => setDrawerOpen(false)}
        onAddMineral={(mineral) => addMineralToCart(mineral)}
        onUpdateItem={updateCartItem}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
      />

      <AnimatePresence>
        {toast && !drawerOpen && (
          <motion.div
            key="rfq-toast"
            role="status"
            aria-live="polite"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="glass-dark fixed inset-x-3 bottom-3 z-50 flex items-start gap-3 rounded-xl p-4 text-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:max-w-sm ltr:sm:right-6 rtl:sm:left-6"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />
            <div className="flex-1 text-xs">
              <p className="font-display text-sm font-bold text-white">{toast.title}</p>
              <p className="mt-0.5 text-slate-300">{toast.subtitle}</p>
              <button
                type="button"
                onClick={() => {
                  setToast(null)
                  setDrawerOpen(true)
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded bg-[#D97706] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#F59E0B] hover:text-[#091322]"
              >
                <span>
                  {t.toast.openRfqLabel} ({cartItems.length})
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PortalShell() {
  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <PortalContent />
      </SmoothScrollProvider>
    </LanguageProvider>
  )
}
