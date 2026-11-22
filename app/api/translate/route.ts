import { NextResponse } from "next/server"
import { EN_BUNDLE, type TranslationBundle } from "@/lib/i18n/en"
import { getLanguageByCode, SUPPORTED_LANGUAGES } from "@/lib/i18n/languages"
import { safeMergeBundle } from "@/lib/i18n/merge"

const serverCache = new Map<string, TranslationBundle>([["en", EN_BUNDLE]])

const SUPPORTED_CODE_SET = new Set(SUPPORTED_LANGUAGES.map((l) => l.code))

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed JSON payload." }, { status: 400 })
  }

  const code =
    body && typeof body === "object" && typeof (body as { code?: unknown }).code === "string"
      ? (body as { code: string }).code.trim().toLowerCase()
      : ""

  if (!code || !SUPPORTED_CODE_SET.has(code)) {
    return NextResponse.json({ ok: false, error: "Unsupported language code." }, { status: 400 })
  }

  const cached = serverCache.get(code)
  if (cached) {
    return NextResponse.json({ ok: true, code, bundle: cached })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Live translation service is not configured." },
      { status: 503 }
    )
  }

  const targetLang = getLanguageByCode(code)

  const prompt = [
    `Translate every string value in the JSON object below from English into ${targetLang.name} (${targetLang.nativeName}).`,
    "Rules:",
    "1. Return valid JSON with the EXACT same keys, nesting, and array lengths.",
    "2. Keep an authoritative corporate B2B mining, civil engineering, and mineral export tone.",
    "3. NEVER translate or modify: 'GARGATI MINNING ENGINEERING CONSTRUCTION COMPANY LIMITED', 'RC No.: 9963225', 'No. 41B Covenant Garden Estate, Lokogoma District, F.C.T., Abuja, Nigeria', 'gargaiiumor@gmail.com', phone numbers, 'SGS', 'Intertek', 'Alfred H Knight', 'NEPC', 'CAC', 'F.C.T.', or chemical formulas (Li₂O, Au, SnO₂, Ta₂O₅, Nb₂O₅, PbS, ZnS, Fe₂O₃, Fe₃O₄, CaCO₃, SiO₂).",
    "4. Keep short technical abbreviations like 'MOQ', 'FOB', 'FIBC', 'XRF', 'BS / NIS' clear and accurate for industrial buyers.",
    "",
    JSON.stringify(EN_BUNDLE),
  ].join("\n")

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.15,
          },
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `Translation provider returned HTTP ${response.status}.` },
        { status: 502 }
      )
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) {
      return NextResponse.json(
        { ok: false, error: "Translation response was empty." },
        { status: 502 }
      )
    }

    const parsed = JSON.parse(rawText)
    const bundle = safeMergeBundle(parsed)
    serverCache.set(code, bundle)

    return NextResponse.json({ ok: true, code, bundle })
  } catch (error) {
    console.error("[Gargati Translate] Error translating locale:", code, error)
    return NextResponse.json(
      { ok: false, error: "Failed to generate translated language pack." },
      { status: 500 }
    )
  }
}
