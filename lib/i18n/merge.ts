import { EN_BUNDLE, type TranslationBundle } from "@/lib/i18n/en"

function mergeNode<T>(fallback: T, candidate: unknown): T {
  if (typeof fallback === "string") {
    return (typeof candidate === "string" && candidate.trim().length > 0 ? candidate : fallback) as T
  }

  if (Array.isArray(fallback)) {
    if (!Array.isArray(candidate) || candidate.length !== fallback.length) {
      return fallback
    }
    return fallback.map((item, idx) => mergeNode(item, candidate[idx])) as T
  }

  if (fallback && typeof fallback === "object") {
    const src = candidate && typeof candidate === "object" ? (candidate as Record<string, unknown>) : {}
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(fallback as Record<string, unknown>)) {
      out[key] = mergeNode((fallback as Record<string, unknown>)[key], src[key])
    }
    return out as T
  }

  return fallback
}

export function safeMergeBundle(partial: unknown): TranslationBundle {
  return mergeNode<TranslationBundle>(EN_BUNDLE, partial)
}
