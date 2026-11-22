"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"

interface BaseMagneticProps {
  children: React.ReactNode
  className?: string
  wrapperClassName?: string
  sheen?: boolean
  strength?: number
  "aria-label"?: string
  translate?: "yes" | "no"
}

type ButtonMagneticProps = BaseMagneticProps & {
  as?: "button"
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

type AnchorMagneticProps = BaseMagneticProps & {
  as: "a"
  href: string
  target?: string
  rel?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export type MagneticButtonProps = ButtonMagneticProps | AnchorMagneticProps

export function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    className = "",
    wrapperClassName,
    sheen = true,
    strength = 7,
    "aria-label": ariaLabel,
    translate,
  } = props

  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const [isFinePointer, setIsFinePointer] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.4 })

  const isDisabled = props.as !== "a" && Boolean(props.disabled)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setIsFinePointer(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isFinePointer || shouldReduceMotion || isDisabled || event.pointerType !== "mouse") return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    rawX.set(Math.max(-1, Math.min(1, relX)) * strength)
    rawY.set(Math.max(-1, Math.min(1, relY)) * strength)
  }

  const handlePointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const sheenOverlay = sheen && isFinePointer && !shouldReduceMotion && !isDisabled && (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/mag:translate-x-full"
    />
  )

  const interactiveElement =
    props.as === "a" ? (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        aria-label={ariaLabel}
        translate={translate}
        className={`group/mag relative touch-manipulation overflow-hidden transition-transform active:scale-[0.98] ${className}`}
      >
        {sheenOverlay}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </a>
    ) : (
      <button
        type={props.type || "button"}
        disabled={props.disabled}
        onClick={props.onClick}
        aria-label={ariaLabel}
        translate={translate}
        className={`group/mag relative touch-manipulation overflow-hidden transition-transform active:scale-[0.98] ${className}`}
      >
        {sheenOverlay}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    )

  if (!isFinePointer || shouldReduceMotion) {
    return interactiveElement
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={wrapperClassName ? `max-w-full ${wrapperClassName}` : "inline-flex max-w-full"}
    >
      {interactiveElement}
    </motion.div>
  )
}
