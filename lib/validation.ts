import { minerals } from "@/lib/minerals"

export interface OrderLineInput {
  mineralId: string
  quantity: string
  unit: string
  form: string
  deliveryTerm: string
}

export interface OrderRequestPayload {
  items: OrderLineInput[]
  company: string
  contactPerson: string
  phone: string
  email: string
  destination: string
  customAddress?: string
  targetDate?: string
  notes?: string
}

export interface InquiryRequestPayload {
  inquiryType: string
  company: string
  contactPerson: string
  phone: string
  email: string
  subject: string
  message: string
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function digitCount(phone: string): number {
  return phone.replace(/\D/g, "").length
}

const VALID_MINERAL_IDS = new Set(minerals.map((item) => item.id))

export function validateOrderPayload(raw: unknown): ValidationResult<OrderRequestPayload> {
  const errors: Record<string, string> = {}

  if (!raw || typeof raw !== "object") {
    return { success: false, errors: { form: "Invalid procurement payload submitted." } }
  }

  const body = raw as Record<string, unknown>
  const rawItems = Array.isArray(body.items) ? body.items : []
  const items: OrderLineInput[] = []

  if (rawItems.length === 0) {
    errors.items = "Please add at least one mineral resource to your order list."
  } else {
    rawItems.forEach((entry, index) => {
      if (!entry || typeof entry !== "object") {
        errors[`items.${index}`] = "Invalid line item."
        return
      }
      const line = entry as Record<string, unknown>
      const mineralId = cleanText(line.mineralId)
      const quantity = cleanText(line.quantity)
      const unit = cleanText(line.unit) || "Metric Tons (MT)"
      const form = cleanText(line.form)
      const deliveryTerm = cleanText(line.deliveryTerm) || "Delivered Site"

      if (!VALID_MINERAL_IDS.has(mineralId)) {
        errors[`items.${index}.mineralId`] = "Unrecognized mineral resource selected."
      }
      if (!quantity) {
        errors[`items.${index}.quantity`] = "Enter required quantity or tonnage."
      }
      if (!form) {
        errors[`items.${index}.form`] = "Select preferred grade or form."
      }

      items.push({ mineralId, quantity, unit, form, deliveryTerm })
    })
  }

  const company = cleanText(body.company)
  const contactPerson = cleanText(body.contactPerson)
  const phone = cleanText(body.phone)
  const email = cleanText(body.email)
  const destination = cleanText(body.destination)
  const customAddress = cleanText(body.customAddress)
  const targetDate = cleanText(body.targetDate)
  const notes = cleanText(body.notes)

  if (company.length < 2) {
    errors.company = "Enter your registered company or organization name."
  }
  if (contactPerson.length < 2) {
    errors.contactPerson = "Enter the contact person's full name."
  }
  if (digitCount(phone) < 7) {
    errors.phone = "Enter a valid phone or WhatsApp number."
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid official email address."
  }
  if (!destination) {
    errors.destination = "Select a delivery destination."
  }
  if (destination === "Custom Site Address" && customAddress.length < 5) {
    errors.customAddress = "Provide the specific site address or port destination."
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      items,
      company,
      contactPerson,
      phone,
      email,
      destination,
      customAddress: customAddress || undefined,
      targetDate: targetDate || undefined,
      notes: notes || undefined,
    },
  }
}

export function validateInquiryPayload(raw: unknown): ValidationResult<InquiryRequestPayload> {
  const errors: Record<string, string> = {}

  if (!raw || typeof raw !== "object") {
    return { success: false, errors: { form: "Invalid inquiry payload submitted." } }
  }

  const body = raw as Record<string, unknown>
  const inquiryType = cleanText(body.inquiryType) || "General Procurement Inquiry"
  const company = cleanText(body.company)
  const contactPerson = cleanText(body.contactPerson)
  const phone = cleanText(body.phone)
  const email = cleanText(body.email)
  const subject = cleanText(body.subject)
  const message = cleanText(body.message)

  if (company.length < 2) {
    errors.company = "Enter your company or ministry name."
  }
  if (contactPerson.length < 2) {
    errors.contactPerson = "Enter your full name."
  }
  if (digitCount(phone) < 7) {
    errors.phone = "Enter a valid telephone or WhatsApp number."
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid official email address."
  }
  if (subject.length < 3) {
    errors.subject = "Provide a brief inquiry subject."
  }
  if (message.length < 10) {
    errors.message = "Include project requirements, mineral lot details, or questions."
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      inquiryType,
      company,
      contactPerson,
      phone,
      email,
      subject,
      message,
    },
  }
}
