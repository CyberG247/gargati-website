import { NextResponse } from "next/server"
import { COMPANY } from "@/lib/company"
import {
  buildMailtoOrderUrl,
  buildWhatsAppOrderUrl,
  formatOrderBrief,
  generateReferenceCode,
} from "@/lib/procurement"
import { validateOrderPayload } from "@/lib/validation"

async function dispatchOptionalNotifications(
  reference: string,
  subject: string,
  briefText: string,
  payload: unknown
) {
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Gargati Procurement <onboarding@resend.dev>",
          to: [COMPANY.email],
          subject,
          text: briefText,
        }),
      })
    } catch (error) {
      console.error("[Gargati Orders] Optional Resend dispatch failed:", error)
    }
  }

  const webhookUrl = process.env.RFQ_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mineral_order_rfq",
          reference,
          recipient: COMPANY.email,
          payload,
          briefText,
        }),
      })
    } catch (error) {
      console.error("[Gargati Orders] Optional webhook dispatch failed:", error)
    }
  }
}

export async function POST(request: Request) {
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Malformed JSON request payload." } },
      { status: 400 }
    )
  }

  const validation = validateOrderPayload(rawBody)
  if (!validation.success) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 400 }
    )
  }

  const reference = generateReferenceCode("GME")
  const submittedAt = new Date().toISOString()
  const briefText = formatOrderBrief(validation.data, reference)
  const subject = `Bulk Mineral RFQ ${reference} — ${validation.data.company}`
  const whatsappUrl = buildWhatsAppOrderUrl(briefText)
  const mailtoUrl = buildMailtoOrderUrl(subject, briefText)

  await dispatchOptionalNotifications(reference, subject, briefText, validation.data)

  return NextResponse.json({
    ok: true,
    reference,
    submittedAt,
    briefText,
    whatsappUrl,
    mailtoUrl,
    order: validation.data,
  })
}
