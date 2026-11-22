export interface CorporatePhone {
  display: string
  international: string
  telHref: string
  label: string
}

export const COMPANY = {
  legalName: "GARGATI MINNING ENGINEERING CONSTRUCTION COMPANY LIMITED",
  shortName: "GARGATI MINNING",
  descriptor: "ENGINEERING & CONSTRUCTION",
  tagline:
    "Solid Mineral Mining & Processing · Civil & Heavy Engineering · Infrastructure Construction · Bulk Mineral Supply",
  rcNumber: "RC No.: 9963225",
  rcCode: "9963225",
  address: "No. 41B Covenant Garden Estate, Lokogoma District, F.C.T., Abuja, Nigeria",
  addressLine1: "No. 41B Covenant Garden Estate",
  addressLine2: "Lokogoma District, F.C.T., Abuja, Nigeria",
  postalDistrict: "F.C.T. Abuja · 900104",
  coordinates: {
    lat: 8.9835,
    lng: 7.4562,
    display: "8.9835° N · 7.4562° E",
  },
  email: "gargaiiumor@gmail.com",
  whatsappNumber: "2348096470254",
  phones: [
    {
      display: "08096470254",
      international: "+234 809 647 0254",
      telHref: "tel:+2348096470254",
      label: "Primary Procurement Desk",
    },
    {
      display: "08082785351",
      international: "+234 808 278 5351",
      telHref: "tel:+2348082785351",
      label: "Engineering & Logistics Line",
    },
  ] as CorporatePhone[],
  workingHours: "Monday – Friday · 08:00 – 17:00 WAT (Saturday Site Dispatch by Appointment)",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=No.+41B+Covenant+Garden+Estate,+Lokogoma+District,+Abuja,+Nigeria",
  googleMapsEmbedUrl:
    "https://maps.google.com/maps?q=Covenant%20Garden%20Estate%2C%20Lokogoma%20District%2C%20Abuja%2C%20Nigeria&t=&z=14&ie=UTF8&iwloc=&output=embed",
  verticals: [
    "Solid Mineral Mining & Processing",
    "Civil & Heavy Engineering",
    "Infrastructure Construction",
    "Bulk Mineral Supply",
  ],
  compliancePillars: [
    {
      code: "CAC-REG",
      title: "Corporate Affairs Commission Incorporated",
      detail: "Registered under the Companies and Allied Matters Act as RC No.: 9963225.",
    },
    {
      code: "MMSD-STD",
      title: "Federal Ministry of Solid Minerals Alignment",
      detail: "Sourcing aligned with licensed quarry, lease, and mineral title documentation protocols.",
    },
    {
      code: "NEPC-EXP",
      title: "Export Readiness & Independent Assay Custody",
      detail: "Lot-specific laboratory assay, radiation screening where applicable, and export packing.",
    },
  ],
} as const
