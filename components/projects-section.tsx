"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { MaskedTextReveal } from "@/components/motion/masked-text-reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import { EXECUTION_STAGES, OPERATIONAL_CORRIDORS } from "@/lib/projects-and-services"

interface ProjectsSectionProps {
  onOpenDrawer: () => void
  onRequestCorridorBrief: (topic: string) => void
}

export function ProjectsSection({
  onOpenDrawer,
  onRequestCorridorBrief,
}: ProjectsSectionProps) {
  const { t } = useLanguage()
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="projects" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="h-[2px] w-7 bg-[#D97706]" />
              <span className="font-mono text-xs font-bold tracking-widest text-[#D97706] uppercase">
                {t.projects.eyebrow}
              </span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#0F1E36] sm:text-4xl lg:text-5xl">
              <MaskedTextReveal trigger="inView">
                {t.projects.headingPart1}
                <span className="text-[#1D4E89]">{t.projects.headingAccent}</span>
              </MaskedTextReveal>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[#64748B] sm:text-base">
            {t.projects.intro}
          </p>
        </div>

        {/* 4 Supply & Execution Corridor Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {OPERATIONAL_CORRIDORS.map((item, idx) => {
            const loc = t.projects.corridors[idx]
            return (
              <motion.article
                key={item.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(idx * 0.08, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 transition-all hover:border-[#1D4E89]/40 hover:bg-white hover:shadow-lg sm:p-7"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      translate="no"
                      className="notranslate font-mono text-[11px] font-bold tracking-wider text-[#D97706]"
                    >
                      {item.code}
                    </span>
                    <span className="rounded-full border border-[#1D4E89]/20 bg-[#EFF6FF] px-3 py-0.5 text-[11px] font-bold text-[#1D4E89]">
                      {loc?.vertical || item.vertical}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-extrabold tracking-tight break-words text-[#0F1E36] sm:text-xl">
                    {loc?.title || item.title}
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#475569]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D97706]" />
                    <span className="break-words">{loc?.corridor || item.corridor}</span>
                  </div>

                  <p className="mt-3.5 text-sm leading-relaxed text-[#475569]">
                    {loc?.summary || item.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(loc?.scopeTags || item.scopeTags).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-[#0F1E36]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRequestCorridorBrief(`Corridor Schedule: ${item.title}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1D4E89] hover:text-[#D97706]"
                  >
                    <span>{t.projects.inquireSchedule}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Assay & Export Staging Protocol Showcase */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-[#091322] text-white shadow-xl lg:grid-cols-12"
        >
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/9] lg:col-span-5 lg:aspect-auto lg:min-h-[380px]">
            <Image
              src="/images/assay-logistics.png"
              alt="Geological drill core trays and palletized export jumbo mineral bags staged for dispatch"
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#091322]/90 via-[#091322]/20 to-transparent"
            />
            <div className="absolute right-4 bottom-4 left-4 sm:right-5 sm:bottom-5 sm:left-5">
              <span className="inline-flex items-center gap-1.5 rounded bg-[#091322]/85 px-3 py-1 font-mono text-[10px] font-semibold text-[#FBBF24] backdrop-blur-md sm:text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                {t.projects.stagingBadge}
              </span>
              <p className="mt-2 text-xs font-semibold text-white sm:text-sm">
                {t.projects.stagingCaption}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:col-span-7 lg:p-10">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
              <div>
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#FBBF24] uppercase">
                  {t.projects.protocolEyebrow}
                </span>
                <h3 className="mt-1 font-display text-2xl font-extrabold text-white">
                  {t.projects.protocolTitle}
                </h3>
              </div>
              <MagneticButton
                onClick={onOpenDrawer}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#D97706] px-4 text-xs font-bold text-white transition-colors hover:bg-[#F59E0B] hover:text-[#091322]"
              >
                <span>{t.projects.btnStartOrder}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </MagneticButton>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {EXECUTION_STAGES.map((stage, idx) => {
                const loc = t.projects.stages[idx]
                return (
                  <motion.div
                    key={stage.step}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        translate="no"
                        className="notranslate inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#1D4E89] font-mono text-xs font-bold text-[#FBBF24]"
                      >
                        {stage.step}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white">
                        {loc?.title || stage.title}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {loc?.detail || stage.detail}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 bg-[#0F1E36]/75 px-4 py-3 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{t.projects.surveyorNotice}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
