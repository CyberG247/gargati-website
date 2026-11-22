export interface EngineeringCapability {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  deliverables: string[]
  equipmentOrMethodology: string
  inquiryTopic: string
}

export interface OperationalCorridor {
  id: string
  code: string
  vertical: string
  title: string
  corridor: string
  summary: string
  scopeTags: string[]
}

export interface ExecutionStage {
  step: string
  title: string
  detail: string
}

export const ENGINEERING_CAPABILITIES: EngineeringCapability[] = [
  {
    id: "mine-development",
    number: "01",
    title: "Mine Site Development & Excavation",
    subtitle: "Open-Pit Earthworks & Quarry Operations",
    description:
      "End-to-end site opening, haul-road formation, systematic benching, and controlled overburden stripping engineered for safe, high-recovery solid mineral extraction.",
    deliverables: [
      "Open-pit bench design & overburden stripping",
      "Haulage access road grading & stormwater drainage",
      "Primary ore sorting, crushing pads & stockpile management",
      "Progressive pit rehabilitation & site safety fencing",
    ],
    equipmentOrMethodology: "30T–45T Hydraulic Excavators · Bulldozers · Articulated Dump Trucks",
    inquiryTopic: "Mine Site Development & Excavation Brief",
  },
  {
    id: "civil-construction",
    number: "02",
    title: "Civil & Structural Construction",
    subtitle: "Infrastructure, Industrial & Estate Works",
    description:
      "Turnkey civil engineering construction across Nigeria—delivering reinforced concrete structures, drainage networks, industrial warehouses, and commercial estate infrastructure.",
    deliverables: [
      "Reinforced concrete bridges, culverts & retaining walls",
      "Industrial warehouses, weighbridge foundations & processing sheds",
      "Commercial & residential estate road networks and storm drains",
      "Quality-tested aggregate, concrete & asphalt paving execution",
    ],
    equipmentOrMethodology: "BS / NIS Structural Standards · QA/QC Material Testing · Turnkey Supervision",
    inquiryTopic: "Civil & Structural Construction Tender",
  },
  {
    id: "equipment-haulage",
    number: "03",
    title: "Heavy Equipment Leasing & Haulage",
    subtitle: "Earthmoving Fleet & Bulk Mineral Logistics",
    description:
      "Reliable deployment of operated heavy machinery, mobile crushing lines, and bulk mineral haulage trucks connecting remote mining belts to sites and export seaports.",
    deliverables: [
      "Tracked excavators, bulldozers & wheel loaders on contract",
      "Articulated dump trucks & 30T–45T tipper haulage fleets",
      "Mobile jaw/cone crushing & multi-deck screening plant mobilization",
      "Mine-to-Port containerized & bulk export trucking corridors",
    ],
    equipmentOrMethodology: "Preventive Maintenance Support · Trained Operators · GPS Waybill Tracking",
    inquiryTopic: "Heavy Equipment Leasing & Haulage Request",
  },
  {
    id: "geological-survey",
    number: "04",
    title: "Geological Survey & Mineral Exploration",
    subtitle: "Resource Delineation, Sampling & Compliance",
    description:
      "Technical field evaluation, diamond/RC core drilling coordination, representative ore sampling, and environmental baseline studies that de-risk mining investments.",
    deliverables: [
      "Geological mapping, trenching & outcrop channel sampling",
      "Core drilling supervision & logged core-tray archiving",
      "Preliminary resource estimation & grade control planning",
      "Environmental Impact Assessments (EIA) & compliance reporting",
    ],
    equipmentOrMethodology: "Core Logging · Independent Lab Chain-of-Custody · Regulatory Filing Support",
    inquiryTopic: "Geological Survey & Exploration Inquiry",
  },
]

export const OPERATIONAL_CORRIDORS: OperationalCorridor[] = [
  {
    id: "nasarawa-kogi-corridor",
    code: "CORRIDOR · 01",
    vertical: "Critical & Industrial Minerals",
    title: "North-Central Pegmatite & Iron Ore Supply Chain",
    corridor: "Nasarawa · Kogi · Plateau Belts",
    summary:
      "Coordinated sourcing, sizing, and jumbo-bag staging for lithium (spodumene/lepidolite), cassiterite tin, coltan, and 60–65% Fe iron ore lots destined for domestic smelters and Lagos/Port Harcourt export terminals.",
    scopeTags: ["Pre-Shipment Assay", "1MT Jumbo Bagging", "Port Haulage"],
  },
  {
    id: "abuja-civil-supply",
    code: "CORRIDOR · 02",
    vertical: "Construction & Quarry Logistics",
    title: "F.C.T. Abuja Concrete Aggregates & Road-Base Fleet",
    corridor: "Lokogoma · Lugbe · Abuja Environs",
    summary:
      "High-frequency tipper fleet delivering 1/2\" and 3/4\" granite, stone dust, washed sharp sand, and compacted-grade laterite directly to highway contractors, batching plants, and estate developers.",
    scopeTags: ["24–72h Site Dispatch", "30T Tippers", "Weighbridge Slips"],
  },
  {
    id: "benue-sulfides",
    code: "CORRIDOR · 03",
    vertical: "Base Metals Offtake",
    title: "Benue Trough Galena & Sphalerite Consolidation",
    corridor: "Benue Trough → Onne / Apapa Ports",
    summary:
      "Structured bulk consolidation of lead sulfide (PbS) and zinc sulfide (ZnS) concentrates with lot segregation, moisture monitoring, and independent XRF inspection before container stuffing.",
    scopeTags: ["55%+ Pb / 50%+ Zn", "Container Stuffing", "NEPC Export Ready"],
  },
  {
    id: "turnkey-civil",
    code: "CORRIDOR · 04",
    vertical: "Engineering & Earthworks",
    title: "Integrated Site Preparation, Drainage & Industrial Pads",
    corridor: "F.C.T. Abuja & Pan-Nigeria Sites",
    summary:
      "Combined heavy earthmoving, sub-base compaction, reinforced concrete drainage works, and quarry-direct material supply executed under a single accountable corporate mandate.",
    scopeTags: ["Excavation & Grading", "Concrete Works", "Single-Point Accountability"],
  },
]

export const EXECUTION_STAGES: ExecutionStage[] = [
  {
    step: "01",
    title: "Specification & Scope Alignment",
    detail:
      "Buyers submit target tonnage, chemical grade thresholds, delivery destination, and Incoterms via our Procurement Desk or engineering brief.",
  },
  {
    step: "02",
    title: "Independent Lab Assay & Title Check",
    detail:
      "Lot samples are pulled for accredited lab assay, moisture verification, and mineral origin documentation before formal commitment.",
  },
  {
    step: "03",
    title: "Processing, Calibration & Packaging",
    detail:
      "Ores are crushed, washed, or bagged into serialized 1MT FIBC jumbo bags, 50kg PP sacks, security drums, or calibrated tipper loads.",
  },
  {
    step: "04",
    title: "Mine-to-Site & Port Export Dispatch",
    detail:
      "Coordinated haulage delivers directly to project sites across Nigeria or staged export terminals in Lagos (Apapa/Tin Can) and Port Harcourt.",
  },
]
