import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { procurementOrders, type ProcurementOrderItem } from "@/lib/db/schema"
import { minerals } from "@/lib/minerals"

export const runtime = "nodejs"

const orderSchema = z.object({
  buyer: z.object({
    company: z.string().trim().min(2).max(160),
    contact: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(32),
    email: z.string().trim().email().max(254),
    destination: z.string().trim().min(2).max(300),
    date: z.iso.date().optional().or(z.literal("")),
    notes: z.string().trim().max(1500),
  }),
  items: z.array(z.object({
    id: z.string().min(1).max(40),
    quantity: z.string().trim().min(1).max(80),
    form: z.string().trim().min(1).max(80),
  })).min(1).max(8),
  website: z.string().max(200).optional(),
})

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (origin && origin !== new URL(request.url).origin) {
    return jsonError("Invalid request origin.", 403)
  }

  const fetchSite = request.headers.get("sec-fetch-site")
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return jsonError("Invalid request source.", 403)
  }

  const contentLength = Number(request.headers.get("content-length") || 0)
  if (contentLength > 16_000) return jsonError("The enquiry is too large.", 413)

  let payload: unknown
  try {
    const body = await request.text()
    if (body.length > 16_000) return jsonError("The enquiry is too large.", 413)
    payload = JSON.parse(body)
  } catch {
    return jsonError("Please submit a valid enquiry.", 400)
  }

  const parsed = orderSchema.safeParse(payload)
  if (!parsed.success) {
    return jsonError("Please check the buyer details and each requested quantity.", 400)
  }
  if (parsed.data.website) return jsonError("Unable to accept this enquiry.", 400)

  const itemIds = parsed.data.items.map((item) => item.id)
  if (new Set(itemIds).size !== itemIds.length) {
    return jsonError("Each resource can only be included once per enquiry.", 400)
  }

  const items: ProcurementOrderItem[] = []
  for (const requested of parsed.data.items) {
    const mineral = minerals.find((item) => item.id === requested.id)
    if (!mineral || !mineral.forms.includes(requested.form)) {
      return jsonError("One of the selected resources or forms is no longer available.", 400)
    }
    items.push({
      id: mineral.id,
      name: mineral.name,
      formula: mineral.formula,
      grade: mineral.grade,
      quantity: requested.quantity,
      form: requested.form,
    })
  }

  const reference = `GME-${new Date().getFullYear()}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`
  const { buyer } = parsed.data

  try {
    await db.insert(procurementOrders).values({
      reference,
      companyName: buyer.company,
      contactName: buyer.contact,
      phone: buyer.phone,
      email: buyer.email,
      destination: buyer.destination,
      deliveryDate: buyer.date || null,
      notes: buyer.notes || null,
      items,
    })
  } catch (error) {
    console.error("[orders] Failed to save procurement enquiry", error)
    return jsonError("We couldn’t save your enquiry. Please try again or contact procurement directly.", 503)
  }

  return NextResponse.json({ reference }, { status: 201 })
}
