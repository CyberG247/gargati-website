import { jsonb, pgTable, text, timestamp, uuid, date } from "drizzle-orm/pg-core"

export type ProcurementOrderItem = {
  id: string
  name: string
  formula: string
  grade: string
  quantity: string
  form: string
}

export const procurementOrders = pgTable("procurement_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  reference: text("reference").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  destination: text("destination").notNull(),
  deliveryDate: date("delivery_date"),
  notes: text("notes"),
  items: jsonb("items").$type<ProcurementOrderItem[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
