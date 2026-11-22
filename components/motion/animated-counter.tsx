"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  formatCommas?: boolean
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  formatCommas = false,
  duration = 1.4,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })
  const shouldReduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      setDisplayValue(value)
      return
    }

    setDisplayValue(0)
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [isInView, value, duration, shouldReduceMotion])

  const formatted = formatCommas
    ? displayValue.toLocaleString("en-US")
    : String(displayValue)

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
