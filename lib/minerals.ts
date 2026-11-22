export type MineralCategory =
  | "Battery & Critical"
  | "Precious Metals"
  | "Industrial Ores"
  | "Construction & Quarry"

export interface MineralSpecItem {
  label: string
  value: string
}

export interface Mineral {
  id: string
  code: string
  name: string
  subtitle: string
  formula: string
  category: MineralCategory
  grade: string
  purityHighlight: string
  forms: string[]
  defaultUnit: string
  moq: string
  origin: string
  terms: string[]
  image: string
  description: string
  hsCode: string
  leadTime: string
  packagingOptions: string[]
  applications: string[]
  physicalSpecs: MineralSpecItem[]
  chemicalSpecs: MineralSpecItem[]
  complianceNote: string
}

export const MINERAL_CATEGORIES: Array<"All Resources" | MineralCategory> = [
  "All Resources",
  "Battery & Critical",
  "Precious Metals",
  "Industrial Ores",
  "Construction & Quarry",
]

export const minerals: Mineral[] = [
  {
    id: "lithium",
    code: "GM-LI-01",
    name: "Lithium Ore",
    subtitle: "Spodumene & Lepidolite",
    formula: "Li₂O",
    category: "Battery & Critical",
    grade: "4.5% – 6.2% Li₂O",
    purityHighlight: "Battery-grade Li₂O (4.5% – 6.2%) · Export-ready",
    forms: ["Raw Lump", "Crushed (0–50mm)", "Concentrate"],
    defaultUnit: "Metric Tons (MT)",
    moq: "30 Metric Tons / 1 Tipper Truck",
    origin: "Nasarawa, Kogi & Kwara Pegmatite Belt, Nigeria",
    terms: ["Ex-Works", "Delivered Site", "FOB Lagos"],
    image: "/images/minerals/lithium.png",
    description:
      "Hard-rock spodumene and lepidolite lithium feedstock sourced across central Nigerian pegmatite formations, sorted and prepared to buyer particle-size and chemical thresholds for lithium carbonate and hydroxide refining.",
    hsCode: "2530.90",
    leadTime: "7 – 14 business days from lot confirmation",
    packagingOptions: [
      "1,000 kg Heavy-Duty Woven Jumbo Bags (FIBC)",
      "50 kg Double-Lined PP Export Sacks",
      "Bulk Loose Tipper Dispatch (Domestic Delivery)",
    ],
    applications: [
      "EV battery cathode precursor & lithium chemical refining",
      "Technical ceramics and heat-resistant borosilicate glass",
      "Industrial lubricants and specialty metallurgical fluxes",
    ],
    physicalSpecs: [
      { label: "Mineralogy", value: "Spodumene (LiAlSi₂O₆) / Lepidolite" },
      { label: "Size Calibration", value: "Raw lump (30–200mm) or crushed (0–50mm)" },
      { label: "Moisture Content", value: "< 2.0% max at dispatch" },
      { label: "Bulk Density", value: "1.6 – 1.85 t/m³ (crushed)" },
    ],
    chemicalSpecs: [
      { label: "Lithium Oxide (Li₂O)", value: "4.5% – 6.2% (lot assayed)" },
      { label: "Iron Oxide (Fe₂O₃)", value: "< 1.5% – 2.2% max" },
      { label: "Silica (SiO₂)", value: "62% – 66% typical" },
      { label: "Assay Verification", value: "SGS / Intertek / Alfred H Knight optional" },
    ],
    complianceNote:
      "Supplied with mine-origin traceability, independent pre-shipment assay certificates, and NEPC-compliant export documentation.",
  },
  {
    id: "gold",
    code: "GM-AU-02",
    name: "Gold Ore & Alluvial Concentrates",
    subtitle: "Assayed Precious Metal Feedstock",
    formula: "Au",
    category: "Precious Metals",
    grade: "Assay-Certified (Lab Verified)",
    purityHighlight: "Laboratory-tested recovery & traceable chain of custody",
    forms: ["Raw Quartz Ore", "Alluvial Concentrate", "Gravity Concentrate"],
    defaultUnit: "Metric Tons (MT)",
    moq: "1 Metric Ton · Subject to Lot Assay",
    origin: "North-Central & North-West Schist Belt, Nigeria",
    terms: ["Ex-Works", "Secure Escort / Vault Collection"],
    image: "/images/minerals/gold.png",
    description:
      "Primary gold-bearing quartz vein ore and gravity-concentrated alluvial feedstock handled under strict chain-of-custody protocols, with fire-assay recovery reports verified prior to commercial settlement.",
    hsCode: "2616.90",
    leadTime: "By scheduled secure lot allocation",
    packagingOptions: [
      "Tamper-Evident Sealed Steel Security Drums",
      "Numbered Heavy-Duty Security Pouches",
      "Verified Sample Splitting for Independent Fire Assay",
    ],
    applications: [
      "Licensed metallurgical gold refining and bullion recovery",
      "Gravity and hydrometallurgical processing plants",
      "Institutional precious-metal reserve supply chains",
    ],
    physicalSpecs: [
      { label: "Deposit Type", value: "Primary hydrothermal quartz & alluvial placer" },
      { label: "Particle Profile", value: "Crushed ore (< 25mm) or fine concentrate" },
      { label: "Recovery Method", value: "Gravity / CIL laboratory-tested yields" },
      { label: "Custody Standard", value: "Sealed serialized lot tracking" },
    ],
    chemicalSpecs: [
      { label: "Gold Content (Au)", value: "Confirmed via independent fire assay" },
      { label: "Associated Minerals", value: "Quartz (SiO₂), minor iron sulfides" },
      { label: "Moisture", value: "< 1.0% on sealed concentrate" },
      { label: "Witness Sampling", value: "Buyer representative permitted at split" },
    ],
    complianceNote:
      "Strictly transacted under verified Nigerian mining title, chain-of-custody logs, and certified independent fire assay reports.",
  },
  {
    id: "tin",
    code: "GM-SN-03",
    name: "Tin Ore",
    subtitle: "Cassiterite Concentrate (SnO₂)",
    formula: "SnO₂",
    category: "Industrial Ores",
    grade: "65% – 72% Sn",
    purityHighlight: "65%–72% Sn concentrate · Low-impurity smelting grade",
    forms: ["Alluvial Concentrate", "Hard-Rock Crushed", "Washed Fines"],
    defaultUnit: "Metric Tons (MT)",
    moq: "30 Metric Tons / 1 × 20ft Container",
    origin: "Jos Plateau & North-Central Tin Belt, Nigeria",
    terms: ["Ex-Works", "Delivered Site", "FOB Lagos"],
    image: "/images/minerals/tin.png",
    description:
      "High-gravity alluvial and hard-rock cassiterite concentrate extracted from Nigeria's historic Jos Plateau mineral belt, washed and electromagnetically separated to meet international smelter purity tolerances.",
    hsCode: "2609.00",
    leadTime: "7 – 12 business days per container lot",
    packagingOptions: [
      "50 kg Double-Woven Polypropylene Sacks (20 MT / 20ft FCL)",
      "1,000 kg Export FIBC Jumbo Bags",
      "Sealed Steel Drums (High-Grade Concentrate)",
    ],
    applications: [
      "Primary tin smelting and lead-free electronics solder manufacturing",
      "Tinplate food-grade steel coating and chemical stabilizers",
      "Bronze, babbitt bearing, and specialty industrial alloys",
    ],
    physicalSpecs: [
      { label: "Mineral Form", value: "Cassiterite (Tin Dioxide Concentrate)" },
      { label: "Specific Gravity", value: "6.8 – 7.1 g/cm³" },
      { label: "Particle Size", value: "0.1mm – 4mm gravity concentrate" },
      { label: "Moisture Content", value: "< 1.5% max" },
    ],
    chemicalSpecs: [
      { label: "Tin Content (Sn)", value: "65.0% – 72.0% guaranteed range" },
      { label: "Lead / Arsenic (Pb / As)", value: "< 0.15% combined low impurity" },
      { label: "Sulfur (S)", value: "< 0.10% max" },
      { label: "Radiation Screening", value: "Cleared below international export limits" },
    ],
    complianceNote:
      "Delivered with XRF/wet-chemistry tin assay and export radiation clearance documentation upon container stuffing.",
  },
  {
    id: "coltan",
    code: "GM-TA-04",
    name: "Columbite & Tantalite (Coltan)",
    subtitle: "High Ta₂O₅ / Nb₂O₅ Ratio Concentrates",
    formula: "(Fe,Mn)(Nb,Ta)₂O₆",
    category: "Battery & Critical",
    grade: "High Ta₂O₅ / Nb₂O₅ Assay",
    purityHighlight: "Radiation-cleared & assay-certified for aerospace & electronics",
    forms: ["Concentrate", "Crushed Ore", "Raw Lump"],
    defaultUnit: "Metric Tons (MT)",
    moq: "1 × 20ft Container (20 MT) / Air Lot on Review",
    origin: "North-Central Pegmatite Belt, Nigeria",
    terms: ["Ex-Works", "FOB Lagos", "CIF Inquiry"],
    image: "/images/minerals/coltan.png",
    description:
      "High-density columbite-tantalite concentrates processed for electronics capacitor manufacturing, superalloys, and aerospace metallurgy, accompanied by rigorous radiation screening and elemental XRF/ICP assays.",
    hsCode: "2615.90",
    leadTime: "10 – 18 business days including clearance",
    packagingOptions: [
      "50 kg Lined Steel Drums / Double PP Sacks",
      "1,000 kg Palletized FIBC Jumbo Bags",
      "Tamper-Sealed Export Containers",
    ],
    applications: [
      "Tantalum electrolytic capacitors for semiconductors and 5G hardware",
      "Nickel-niobium superalloys for jet turbines and aerospace structures",
      "High-strength micro-alloyed structural steel production",
    ],
    physicalSpecs: [
      { label: "Mineral Series", value: "Ferrocolumbite – Tantalite" },
      { label: "Specific Gravity", value: "5.3 – 7.8 g/cm³ (grade dependent)" },
      { label: "Grain Size", value: "0.2mm – 12mm sorted concentrate" },
      { label: "Moisture", value: "< 1.0% max" },
    ],
    chemicalSpecs: [
      { label: "Ta₂O₅ + Nb₂O₅ Combined", value: "45% – 68%+ (lot-specific split)" },
      { label: "Titanium (TiO₂)", value: "< 3.0% typical" },
      { label: "Uranium / Thorium (U+Th)", value: "Below 0.05% IAEA Class-7 threshold" },
      { label: "Certification", value: "Independent assay & radiological report" },
    ],
    complianceNote:
      "Every consignment undergoes mandatory radiological screening and independent lab verification to satisfy international carrier and off-taker rules.",
  },
  {
    id: "lead-zinc",
    code: "GM-PBZN-05",
    name: "Lead & Zinc Ore",
    subtitle: "Galena & Sphalerite Sulfide Concentrates",
    formula: "PbS · ZnS",
    category: "Industrial Ores",
    grade: "55%+ Pb / 50%+ Zn",
    purityHighlight: "High-grade sulfide concentrates (55%+ Pb / 50%+ Zn)",
    forms: ["Concentrate", "Crushed Ore", "Raw Lump"],
    defaultUnit: "Metric Tons (MT)",
    moq: "30 Metric Tons / 1 Tipper Truck",
    origin: "Benue Trough Mineral Corridor, Nigeria",
    terms: ["Ex-Works", "Delivered Site", "FOB Lagos", "FOB Port Harcourt"],
    image: "/images/minerals/lead-zinc.png",
    description:
      "High-grade galena (lead sulfide) and sphalerite (zinc sulfide) ores sourced from Nigeria's prolific Benue Trough belt, separated for smelting, galvanizing steel mills, and industrial battery fabrication.",
    hsCode: "2607.00 / 2608.00",
    leadTime: "7 – 14 business days",
    packagingOptions: [
      "1,000 kg Export Jumbo Bags (FIBC)",
      "50 kg Heavy-Duty PP Bags",
      "Bulk 30T Tipper Haulage (Inland)",
    ],
    applications: [
      "Industrial lead-acid storage batteries and radiation shielding",
      "Hot-dip zinc galvanizing for structural steel protection",
      "Die-casting alloys, brass metallurgy, and zinc oxide chemicals",
    ],
    physicalSpecs: [
      { label: "Ore Mineralogy", value: "Galena (PbS) / Sphalerite (ZnS)" },
      { label: "Sizing", value: "Lump (20–120mm) or beneficiated concentrate" },
      { label: "Moisture", value: "< 3.0% max at loading" },
      { label: "Lot Capacity", value: "500 – 3,000 MT monthly supply capacity" },
    ],
    chemicalSpecs: [
      { label: "Lead Grade (Galena)", value: "55% – 70% Pb" },
      { label: "Zinc Grade (Sphalerite)", value: "50% – 58% Zn" },
      { label: "Silver Credit (Ag)", value: "Assayed per lot where present" },
      { label: "Silica / Gangue", value: "< 8.0% typical on concentrate" },
    ],
    complianceNote:
      "Sorted separately by lead or zinc dominance upon request, with full weighbridge and pre-shipment assay certificates.",
  },
  {
    id: "iron",
    code: "GM-FE-06",
    name: "Iron Ore",
    subtitle: "Hematite & Magnetite",
    formula: "Fe₂O₃ · Fe₃O₄",
    category: "Industrial Ores",
    grade: "60% – 65% Fe",
    purityHighlight: "60%–65% Fe content · Calibrated lump & fines for steelworks",
    forms: ["Crushed Lump (10–50mm)", "Fines (0–10mm)", "Raw Ore"],
    defaultUnit: "Metric Tons (MT)",
    moq: "30 Metric Tons / 1 Tipper Truck",
    origin: "Kogi & Niger Iron Ore Belt, Nigeria",
    terms: ["Ex-Works", "Delivered Site", "FOB Port Harcourt"],
    image: "/images/minerals/iron.png",
    description:
      "Dense hematite and magnetite iron ore calibrated into blast-furnace lump or sinter fines, delivering consistent Fe grades and low deleterious gangue for domestic foundries, cement kilns, and export steelmaking.",
    hsCode: "2601.11",
    leadTime: "5 – 10 business days",
    packagingOptions: [
      "Bulk 30T / 45T Articulated Dump Trucks",
      "1,000 kg / 1,500 kg Jumbo FIBC Export Bags",
      "Bulk Containerized or Breakbulk Port Staging",
    ],
    applications: [
      "Integrated steelmaking, direct reduction (DRI), and rolling mills",
      "Portland cement clinker iron-corrective additive",
      "Heavy aggregate ballast and high-density concrete weighting",
    ],
    physicalSpecs: [
      { label: "Ore Types", value: "High-grade Hematite & Magnetite" },
      { label: "Lump Calibration", value: "10mm – 50mm (max 10% fines)" },
      { label: "Fines Sizing", value: "0mm – 10mm sinter feed" },
      { label: "Moisture", value: "< 4.0% dry season / < 6.0% wet season" },
    ],
    chemicalSpecs: [
      { label: "Total Iron (Fe)", value: "60.0% – 65.0%" },
      { label: "Silica (SiO₂)", value: "< 4.5% – 6.0%" },
      { label: "Alumina (Al₂O₃)", value: "< 2.5%" },
      { label: "Phosphorus & Sulfur", value: "P < 0.06% · S < 0.05%" },
    ],
    complianceNote:
      "Supplied with certified quarry weighbridge tickets and laboratory Fe/gangue elemental breakdown.",
  },
  {
    id: "limestone",
    code: "GM-CA-07",
    name: "Limestone & Marble Aggregates",
    subtitle: "High-Calcium Carbonate Stone",
    formula: "CaCO₃",
    category: "Construction & Quarry",
    grade: "> 92% CaCO₃",
    purityHighlight: "High-calcium (>92% CaCO₃) for cement, industry & architecture",
    forms: ["Crushed Aggregates", "Dimension Blocks", "Ground Powder (CaCO₃)"],
    defaultUnit: "Metric Tons (MT)",
    moq: "30 Metric Tons / 1 Tipper Truck",
    origin: "F.C.T. / Kogi / Edo Limestone Belt, Nigeria",
    terms: ["Ex-Works", "Delivered Site", "FOB Lagos"],
    image: "/images/minerals/limestone.png",
    description:
      "High-purity sedimentary limestone and architectural marble blocks extracted for clinker cement manufacturing, hydrated lime production, flue-gas desulfurization, and prestige commercial stone finishing.",
    hsCode: "2521.00 / 2515.11",
    leadTime: "3 – 7 business days",
    packagingOptions: [
      "Bulk 30T Tipper Truck Delivery",
      "1,000 kg Jumbo Bags (Crushed / Micronized Powder)",
      "Raw Quarry Marble Blocks (Flatbed Haulage)",
    ],
    applications: [
      "Cement clinker manufacturing and quicklime / hydrated lime kilns",
      "Calcium carbonate industrial filler (paint, PVC, paper, agriculture)",
      "Architectural marble cladding, flooring, and civil infrastructure stone",
    ],
    physicalSpecs: [
      { label: "Rock Classification", value: "High-Calcium Limestone / Crystalline Marble" },
      { label: "Whiteness (Marble/Powder)", value: "85% – 94% CIE Whiteness (grade dependent)" },
      { label: "Specific Gravity", value: "2.65 – 2.72 g/cm³" },
      { label: "Mesh Options (Powder)", value: "200 – 400 Mesh available on order" },
    ],
    chemicalSpecs: [
      { label: "Calcium Carbonate (CaCO₃)", value: "92.0% – 96.5%" },
      { label: "Magnesium Oxide (MgO)", value: "< 1.8%" },
      { label: "Silica (SiO₂)", value: "< 2.5%" },
      { label: "Iron Oxide (Fe₂O₃)", value: "< 0.4%" },
    ],
    complianceNote:
      "Bulk schedules tailored for continuous cement-plant feeding and commercial building contractors across Abuja and nationwide.",
  },
  {
    id: "aggregates",
    code: "GM-AG-08",
    name: "Granite Aggregates, Laterite & Sharp Sand",
    subtitle: "Civil Works Quarry & Earthworks Supply",
    formula: "SiO₂ · Crushed Stone",
    category: "Construction & Quarry",
    grade: "BS / NIS Quarry Specification",
    purityHighlight: "1/2\", 3/4\" granite, stone dust, road-base laterite & washed sand",
    forms: ['1/2" Granite', '3/4" Granite', "Stone Dust", "Road-Base Laterite", "Washed Sharp Sand"],
    defaultUnit: "30T Tipper Trucks",
    moq: "1 Tipper Truck (20 – 30 Metric Tons)",
    origin: "F.C.T. Abuja & Nasarawa Quarry Corridor",
    terms: ["Delivered Site", "Ex-Works"],
    image: "/images/minerals/aggregates.png",
    description:
      "Screened igneous crushed granite aggregates, compacted-grade highway laterite, and washed river sharp sand dispatched directly by Gargati haulage fleet to civil engineering, bridge, estate, and roadworks sites.",
    hsCode: "2517.10 / 2505.10",
    leadTime: "24 – 72 hours within F.C.T. Abuja & environs",
    packagingOptions: [
      "20-Ton / 30-Ton Hydraulic Tipper Trucks (Site Tipping)",
      "Scheduled Multi-Truck Daily Contractor Dispatch",
      "Direct Ex-Quarry Loading for Client Haulage",
    ],
    applications: [
      "Structural reinforced concrete batching (bridges, high-rises, foundations)",
      "Asphalt wearing course, highway sub-base, and drainage stabilization",
      "Residential and industrial estate civil works across Abuja F.C.T.",
    ],
    physicalSpecs: [
      { label: "Granite Sizing", value: '3/8", 1/2" (12mm), 3/4" (20mm), Hardcore, Dust' },
      { label: "Aggregate Impact Value", value: "Meets BS 812 / FMW civil specs" },
      { label: "Sand Silt Content", value: "< 3% clean washed river sharp sand" },
      { label: "Laterite Quality", value: "Low-plasticity compacted road-base grade" },
    ],
    chemicalSpecs: [
      { label: "Composition", value: "Crystalline Granite / Quartzose Silica (SiO₂)" },
      { label: "Water Absorption", value: "< 0.8% (granite aggregates)" },
      { label: "Organic Impurities", value: "Nil (washed sand & virgin quarry face)" },
      { label: "Dispatch Control", value: "Serialized waybill & weighbridge slip" },
    ],
    complianceNote:
      "Backed by Gargati's active Abuja fleet for uninterrupted multi-truck site schedules and contractor credit/PO fulfillment.",
  },
]
