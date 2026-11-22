"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { EN_BUNDLE, type TranslationBundle } from "@/lib/i18n/en"
import {
  DEFAULT_LANGUAGE_CODE,
  getLanguageByCode,
  type LanguageOption,
} from "@/lib/i18n/languages"
import { safeMergeBundle } from "@/lib/i18n/merge"

interface LanguageContextValue {
  language: LanguageOption
  t: TranslationBundle
  isLoading: boolean
  error: string | null
  setLanguage: (code: string) => Promise<void>
}

const STORAGE_LANG_KEY = "gargati_lang_v1"
const CACHE_PREFIX = "gargati_locale_pack_v1_"

const LanguageContext = createContext<LanguageContextValue>({
  language: getLanguageByCode(DEFAULT_LANGUAGE_CODE),
  t: EN_BUNDLE,
  isLoading: false,
  error: null,
  setLanguage: async () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageOption>(() =>
    getLanguageByCode(DEFAULT_LANGUAGE_CODE)
  )
  const [bundle, setBundle] = useState<TranslationBundle>(EN_BUNDLE)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const memoryCacheRef = useRef<Map<string, TranslationBundle>>(new Map([["en", EN_BUNDLE]]))
  const requestCounterRef = useRef(0)

  const applyDocumentAttributes = useCallback((lang: LanguageOption) => {
    if (typeof document === "undefined") return
    document.documentElement.lang = lang.code
    document.documentElement.dir = lang.dir
  }, [])

  const loadLanguagePack = useCallback(
    async (code: string, persistSelection = true) => {
      const target = getLanguageByCode(code)
      const requestId = ++requestCounterRef.current
      setError(null)

      if (persistSelection) {
        try {
          window.localStorage.setItem(STORAGE_LANG_KEY, target.code)
        } catch {
          // Ignore storage restrictions
        }
      }

      if (target.code === "en") {
        setLanguageState(target)
        setBundle(EN_BUNDLE)
        applyDocumentAttributes(target)
        setIsLoading(false)
        return
      }

      const memHit = memoryCacheRef.current.get(target.code)
      if (memHit) {
        setLanguageState(target)
        setBundle(memHit)
        applyDocumentAttributes(target)
        setIsLoading(false)
        return
      }

      try {
        const cachedRaw = window.localStorage.getItem(`${CACHE_PREFIX}${target.code}`)
        if (cachedRaw) {
          const parsed = safeMergeBundle(JSON.parse(cachedRaw))
          memoryCacheRef.current.set(target.code, parsed)
          setLanguageState(target)
          setBundle(parsed)
          applyDocumentAttributes(target)
          setIsLoading(false)
          return
        }
      } catch {
        // Ignore storage read errors
      }

      setIsLoading(true)
      try {
        let rawPayload: unknown
        if (target.preloaded) {
          const res = await fetch(`/locales/${target.code}.json`, { cache: "force-cache" })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          rawPayload = await res.json()
        } else {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: target.code }),
          })
          const json = await res.json()
          if (!res.ok || !json.ok || !json.bundle) {
            throw new Error(json.error || "Translation failed")
          }
          rawPayload = json.bundle
        }

        if (requestId !== requestCounterRef.current) return

        const merged = safeMergeBundle(rawPayload)
        memoryCacheRef.current.set(target.code, merged)
        try {
          window.localStorage.setItem(`${CACHE_PREFIX}${target.code}`, JSON.stringify(merged))
        } catch {
          // Ignore quota errors
        }

        setLanguageState(target)
        setBundle(merged)
        applyDocumentAttributes(target)
      } catch {
        if (requestId !== requestCounterRef.current) return
        setError(EN_BUNDLE.switcher.errorFallback)
        setLanguageState(getLanguageByCode(DEFAULT_LANGUAGE_CODE))
        setBundle(EN_BUNDLE)
        applyDocumentAttributes(getLanguageByCode(DEFAULT_LANGUAGE_CODE))
      } finally {
        if (requestId === requestCounterRef.current) {
          setIsLoading(false)
        }
      }
    },
    [applyDocumentAttributes]
  )

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_LANG_KEY)
      if (saved && saved !== DEFAULT_LANGUAGE_CODE) {
        void loadLanguagePack(saved, false)
      }
    } catch {
      // Ignore storage access restrictions
    }
  }, [loadLanguagePack])

  const setLanguage = useCallback(
    async (code: string) => {
      await loadLanguagePack(code, true)
    },
    [loadLanguagePack]
  )

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: bundle,
        isLoading,
        error,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
