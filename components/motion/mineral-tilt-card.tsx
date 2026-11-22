"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"

interface MineralTiltCardProps {
  children: React.ReactNode
  className?: string
}

export function MineralTiltCard({ children, className = "" }: MineralTiltCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState(false)
  const [isFinePointer, setIsFinePointer] = useState(false)

  const pointerX = useMotionValue(160)
  const pointerY = useMotionValue(160)
  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)

  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 24 })
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 24 })

  const spotlightBg = useMotionTemplate`radial-gradient(280px circle at ${pointerX}px ${pointerY}px, rgba(245, 158, 11, 0.14), rgba(29, 78, 137, 0.08) 45%, transparent 75%)`

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setIsFinePointer(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isFinePointer || shouldReduceMotion || event.pointerType !== "mouse") return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return

    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    pointerX.set(localX)
    pointerY.set(localY)

    const normX = (localX / rect.width - 0.5) * 2
    const normY = (localY / rect.height - 0.5) * 2
    rawRotateY.set(Math.max(-5, Math.min(5, normX * 5)))
    rawRotateX.set(Math.max(-5, Math.min(5, -normY * 5)))
  }

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isFinePointer || shouldReduceMotion || event.pointerType !== "mouse") return
    setHovered(true)
  }

  const handlePointerLeave = () => {
    setHovered(false)
    rawRotateX.set(0)
    rawRotateY.set(0)
  }

  if (!isFinePointer || shouldReduceMotion) {
    return <div className={`relative h-full ${className}`}>{children}</div>
  }

  return (
    <div style={{ perspective: "1100px" }} className="h-full">
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative h-full will-change-transform ${className}`}
      >
        {/* Dynamic Cursor Spotlight Glow Overlay */}
        <motion.div
          aria-hidden="true"
          style={{ background: spotlightBg }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 z-10 rounded-xl"
        />
        {children}
      </motion.div>
    </div>
  )
}
