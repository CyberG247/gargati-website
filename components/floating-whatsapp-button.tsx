"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { COMPANY } from "@/lib/company"
import { useLanguage } from "@/lib/i18n/language-context"
import { buildGeneralWhatsAppUrl } from "@/lib/procurement"
import type { OrderLineInput } from "@/lib/validation"

interface FloatingWhatsAppButtonProps {
  items: OrderLineInput[]
  hidden?: boolean
}

export function FloatingWhatsAppButton({
  items,
  hidden = false,
}: FloatingWhatsAppButtonProps) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const href = buildGeneralWhatsAppUrl(items)

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="floating-whatsapp-cta"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 print:hidden ltr:right-4 rtl:left-4 sm:bottom-6 ltr:sm:right-6 rtl:sm:left-6"
        >
          <MagneticButton
            as="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            strength={5}
            aria-label={`${t.footer.linkWhatsApp} (${COMPANY.phones[0].international})`}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[#15803D] text-white shadow-[0_14px_34px_rgba(9,19,34,0.38)] ring-2 ring-white/80 transition-colors hover:bg-[#166534] sm:h-12 sm:w-auto sm:gap-2.5 sm:px-4"
          >
            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden="true"
                className="h-6 w-6 text-white"
              >
                <path d="M16.01 3.2C8.94 3.2 3.2 8.93 3.2 16c0 2.26.59 4.46 1.71 6.4L3 29l6.77-1.78a12.76 12.76 0 0 0 6.24 1.62h.01c7.06 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.64-3.75-9.06A12.73 12.73 0 0 0 16.01 3.2Zm0 23.48h-.01a10.6 10.6 0 0 1-5.41-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.6 10.6 0 0 1-1.63-5.68c0-5.87 4.78-10.65 10.66-10.65 2.84 0 5.52 1.11 7.53 3.12a10.58 10.58 0 0 1 3.12 7.53c0 5.87-4.78 10.66-10.66 10.66Zm5.84-7.98c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.51-.16-.72.16-.21.32-.83 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
              </svg>
              {items.length > 0 && (
                <span
                  translate="no"
                  className="notranslate absolute -top-1.5 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F59E0B] px-1 font-mono text-[10px] font-extrabold text-[#091322] shadow-xs sm:hidden"
                >
                  {items.length}
                </span>
              )}
            </span>

            <span className="hidden font-display text-xs font-extrabold tracking-tight whitespace-nowrap text-white sm:inline">
              {t.footer.linkWhatsApp}
            </span>

            {items.length > 0 && (
              <span
                translate="no"
                className="notranslate hidden h-5 min-w-5 items-center justify-center rounded-full bg-[#F59E0B] px-1.5 font-mono text-[10px] font-extrabold text-[#091322] sm:inline-flex"
              >
                {items.length}
              </span>
            )}
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
