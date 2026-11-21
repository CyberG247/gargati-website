export type Mineral = {
  id: string
  name: string
  subtitle: string
  formula: string
  grade: string
  forms: string[]
  moq: string
  origin: string
  terms: string[]
  category: string
  image: string
  description: string
  color: string
}

export const minerals: Mineral[] = [
  { id: "lithium", name: "Lithium Ore", subtitle: "Spodumene & Lepidolite", formula: "Li₂O", grade: "4.5–6.2% Li₂O", forms: ["Raw lump", "Crushed", "Concentrate"], moq: "30 metric tons / tipper", origin: "Nigeria · Nasarawa / Kogi belt", terms: ["Ex-Works", "Delivered site", "FOB Lagos"], category: "Battery minerals", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85", description: "Hard-rock lithium feedstock with documented source information, prepared to buyer requirements for battery-material processing.", color: "#c4a27a" },
  { id: "gold", name: "Gold Ore & Concentrates", subtitle: "Assayed precious metal feedstock", formula: "Au", grade: "Assay on request", forms: ["Raw ore", "Alluvial concentrate"], moq: "1 metric ton · subject to assay", origin: "Nigeria · North-central belt", terms: ["Ex-Works", "Secure collection"], category: "Precious metals", image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=85", description: "Traceable ore and alluvial concentrate supplied with independent laboratory assay and chain-of-custody documentation.", color: "#b98732" },
  { id: "tin", name: "Tin Ore", subtitle: "Cassiterite concentrate", formula: "SnO₂", grade: "65–72% Sn", forms: ["Crushed", "Concentrate"], moq: "30 metric tons", origin: "Nigeria · Jos Plateau", terms: ["Ex-Works", "Delivered site", "FOB Lagos"], category: "Industrial minerals", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85", description: "Cassiterite feed with commercial concentrate grades for smelting, solder and industrial alloy applications.", color: "#79828b" },
  { id: "coltan", name: "Columbite & Tantalite", subtitle: "Coltan · assay certified", formula: "(Fe,Mn)(Nb,Ta)₂O₆", grade: "Ta₂O₅ / Nb₂O₅ by assay", forms: ["Raw lump", "Concentrate"], moq: "1 × 20 ft container", origin: "Nigeria · North-central belt", terms: ["Ex-Works", "FOB Lagos"], category: "Battery minerals", image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=1000&q=85", description: "Columbite-tantalite ores for electronics and aerospace supply chains, available with assay and radiation screening documentation.", color: "#6c6060" },
  { id: "lead-zinc", name: "Lead & Zinc Ore", subtitle: "Galena & Sphalerite", formula: "PbS · ZnS", grade: "55%+ Pb / 50%+ Zn", forms: ["Raw lump", "Crushed", "Concentrate"], moq: "30 metric tons", origin: "Nigeria · Benue Trough", terms: ["Ex-Works", "Delivered site", "FOB Lagos"], category: "Industrial minerals", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85", description: "Sulfide ore and concentrate for smelting and industrial use, with product grade and logistics confirmed against each lot.", color: "#73797c" },
  { id: "iron", name: "Iron Ore", subtitle: "Hematite & Magnetite", formula: "Fe₂O₃ · Fe₃O₄", grade: "60–65% Fe", forms: ["Crushed lump", "Fines"], moq: "30 metric tons / tipper", origin: "Nigeria · Kogi / Niger belt", terms: ["Ex-Works", "Delivered site", "FOB Port Harcourt"], category: "Industrial minerals", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85", description: "Hematite and magnetite grades for steelmaking and heavy industry, available as calibrated lump or fines.", color: "#995e45" },
  { id: "limestone", name: "Limestone & Marble", subtitle: "High-calcium stone", formula: "CaCO₃", grade: ">92% CaCO₃ typical", forms: ["Aggregates", "Dimension stone", "Powder"], moq: "30 metric tons / tipper", origin: "Nigeria · FCT / Kogi belt", terms: ["Ex-Works", "Delivered site"], category: "Construction", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85", description: "High-calcium limestone and selected marble for cement, chemical processing and architectural applications.", color: "#b7aa90" },
  { id: "aggregates", name: "Granite, Laterite & Sand", subtitle: "Construction aggregates", formula: "Crushed stone · SiO₂", grade: "Quarry specification", forms: ["½\" granite", "¾\" granite", "Stone dust", "Laterite", "Washed sand"], moq: "1 tipper truck", origin: "Nigeria · Abuja & environs", terms: ["Delivered site", "Ex-Works"], category: "Construction", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85", description: "Quarry products and road-base materials for civil works, with truck-based delivery to project sites across Abuja and beyond.", color: "#958a7b" },
]
