"use client"

import { motion, useReducedMotion } from "framer-motion"

interface MaskedTextRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  trigger?: "mount" | "inView"
}

export function MaskedTextReveal({
  children,
  delay = 0,
  className = "",
  trigger = "mount",
}: MaskedTextRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <span className={`block ${className}`}>{children}</span>
  }

  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "105%", opacity: 0.001 }}
        animate={trigger === "mount" ? { y: "0%", opacity: 1 } : undefined}
        whileInView={trigger === "inView" ? { y: "0%", opacity: 1 } : undefined}
        viewport={trigger === "inView" ? { once: true, amount: 0.25 } : undefined}
        transition={{
          duration: 0.85,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}
