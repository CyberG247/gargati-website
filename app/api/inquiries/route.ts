import { NextResponse } from "next/server"
import { COMPANY } from "@/lib/company"
import {
  buildMailtoOrderUrl,
  buildWhatsAppOrderUrl,
  formatInquiryBrief,
  generateReferenceCode,
} from "@/lib/procurement"
import { validateInquiryPayload } from "@/lib/validation"

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
          from: process.env.RESEND_FROM_EMAIL || "Gargati Desk <onboarding@resend.dev>",
          to: [COMPANY.email],
          subject,
          text: briefText,
        }),
      })
    } catch (error) {
      console.error("[Gargati Inquiries] Optional Resend dispatch failed:", error)
    }
  }

  const webhookUrl = process.env.RFQ_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "corporate_inquiry",
          reference,
          recipient: COMPANY.email,
          payload,
          briefText,
        }),
      })
    } catch (error) {
      console.error("[Gargati Inquiries] Optional webhook dispatch failed:", error)
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

  const validation = validateInquiryPayload(rawBody)
  if (!validation.success) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 400 }
    )
  }

  const reference = generateReferenceCode("GME-INQ")
  const submittedAt = new Date().toISOString()
  const briefText = formatInquiryBrief(validation.data, reference)
  const subject = `${validation.data.inquiryType} (${reference}) — ${validation.data.company}`
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
    inquiry: validation.data,
  })
}
