import { COMPANY } from "@/lib/company"
import { minerals } from "@/lib/minerals"
import type { InquiryRequestPayload, OrderRequestPayload } from "@/lib/validation"

export function generateReferenceCode(prefix: "GME" | "GME-INQ" = "GME"): string {
  const year = new Date().getFullYear()
  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${year}-${randomDigits}`
}

export function formatOrderBrief(order: OrderRequestPayload, reference?: string): string {
  const mineralLookup = new Map(minerals.map((item) => [item.id, item]))
  const resolvedDestination =
    order.destination === "Custom Site Address" && order.customAddress
      ? `Custom Site: ${order.customAddress}`
      : order.destination

  const lineBlocks = order.items.map((line, idx) => {
    const mineral = mineralLookup.get(line.mineralId)
    const name = mineral ? `${mineral.name} (${mineral.formula})` : line.mineralId
    const grade = mineral ? mineral.grade : "Per specification"
    return [
      `${idx + 1}. ${name}`,
      `   Qty: ${line.quantity} ${line.unit}`,
      `   Preferred Form: ${line.form} | Grade: ${grade}`,
      `   Delivery Terms: ${line.deliveryTerm}`,
    ].join("\n")
  })

  return [
    COMPANY.legalName,
    COMPANY.rcNumber,
    `B2B PROCUREMENT & RFQ BRIEF${reference ? ` · REF: ${reference}` : ""}`,
    "--------------------------------------------------",
    "SELECTED MINERAL RESOURCES:",
    ...lineBlocks,
    "",
    "BUYER & DELIVERY SCHEDULE:",
    `Company: ${order.company}`,
    `Contact: ${order.contactPerson}`,
    `Phone / WhatsApp: ${order.phone}`,
    `Email: ${order.email}`,
    `Destination: ${resolvedDestination}`,
    `Target Delivery Date: ${order.targetDate || "To be confirmed"}`,
    `Assay / Logistics Notes: ${order.notes || "None specified"}`,
    "--------------------------------------------------",
    `Head Office: ${COMPANY.address}`,
    `Procurement Lines: ${COMPANY.phones.map((p) => p.international).join(" | ")}`,
    `Email: ${COMPANY.email}`,
  ].join("\n")
}

export function formatInquiryBrief(inquiry: InquiryRequestPayload, reference?: string): string {
  return [
    COMPANY.legalName,
    COMPANY.rcNumber,
    `CORPORATE / TECHNICAL INQUIRY${reference ? ` · REF: ${reference}` : ""}`,
    "--------------------------------------------------",
    `Category: ${inquiry.inquiryType}`,
    `Subject: ${inquiry.subject}`,
    `Company / Organization: ${inquiry.company}`,
    `Contact Person: ${inquiry.contactPerson}`,
    `Phone / WhatsApp: ${inquiry.phone}`,
    `Email: ${inquiry.email}`,
    "",
    "REQUIREMENTS / MESSAGE:",
    inquiry.message,
    "--------------------------------------------------",
    `Head Office: ${COMPANY.address}`,
    `Email: ${COMPANY.email}`,
  ].join("\n")
}

export function buildWhatsAppOrderUrl(text: string): string {
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export function buildMailtoOrderUrl(subject: string, text: string): string {
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
}
