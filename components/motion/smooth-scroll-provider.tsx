"use client"

import { createContext, useCallback, useContext, useEffect, useRef } from "react"
import Lenis from "lenis"
import { MotionConfig } from "framer-motion"

interface SmoothScrollContextValue {
  stopScroll: () => void
  startScroll: () => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  stopScroll: () => {},
  startScroll: () => {},
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const lockCountRef = useRef(0)
  const previousOverflowRef = useRef("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (prefersReduced || !isFinePointer) return

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }
    rafId = window.requestAnimationFrame(raf)

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href || href === "#") return
      const el = document.querySelector(href)
      if (!el) return
      event.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -108 })
    }

    document.addEventListener("click", handleAnchorClick)

    return () => {
      document.removeEventListener("click", handleAnchorClick)
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (lockCountRef.current > 0 && typeof document !== "undefined") {
        document.body.style.overflow = previousOverflowRef.current
        lockCountRef.current = 0
      }
    }
  }, [])

  const stopScroll = useCallback(() => {
    if (typeof document === "undefined") return
    if (lockCountRef.current === 0) {
      previousOverflowRef.current = document.body.style.overflow
      document.body.style.overflow = "hidden"
      lenisRef.current?.stop()
    }
    lockCountRef.current += 1
  }, [])

  const startScroll = useCallback(() => {
    if (typeof document === "undefined") return
    if (lockCountRef.current <= 0) {
      lockCountRef.current = 0
      return
    }
    lockCountRef.current -= 1
    if (lockCountRef.current === 0) {
      document.body.style.overflow = previousOverflowRef.current
      lenisRef.current?.start()
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollContext.Provider value={{ stopScroll, startScroll }}>
        {children}
      </SmoothScrollContext.Provider>
    </MotionConfig>
  )
}
