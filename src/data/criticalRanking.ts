export interface CriticalAsset {
  rank: number;
  id: string;
  label: string;
  type: string;
  criticality: number;
  populationAtRisk: number;
  plainReason: string;
  technicalReason: string;
  interventionLabel: string;
  interventionCost: string;
}

export const CRITICAL_RANKING: CriticalAsset[] = [
  {
    rank: 1,
    id: "BW1",
    label: "BW1 — Borewell Source Chakur",
    type: "Source",
    criticality: 88,
    populationAtRisk: 8140,
    plainReason: "Sole groundwater source. Failure isolates the entire scheme with no alternate supply.",
    technicalReason: "Absolute articulation point — removal isolates the entire demand graph.",
    interventionLabel: "Drill alternate borewell + interconnect to P1",
    interventionCost: "₹8–16 Lakh",
  },
  {
    rank: 2,
    id: "P1",
    label: "P1 — Main Pump House",
    type: "Pump",
    criticality: 91,
    populationAtRisk: 5660,
    plainReason: "No dedicated backup pump. Failure drains the largest tank within 6 hours.",
    technicalReason: "High betweenness centrality — sits on supply path for 4 zones and 3 facilities.",
    interventionLabel: "Install 100% standby pump parallel to P1",
    interventionCost: "₹3–7 Lakh",
  },
  {
    rank: 3,
    id: "T1",
    label: "T1 — 11kV Feeder 1 (North)",
    type: "Feeder",
    criticality: 84,
    populationAtRisk: 5660,
    plainReason: "Powers P1. Transformer trips are the most frequent cause of north-zone water disruption.",
    technicalReason: "Power dependency root for the scheme's highest-population sub-graph.",
    interventionLabel: "Install DG backup for P1 / dedicated express feeder",
    interventionCost: "₹6–12 Lakh",
  },
  {
    rank: 4,
    id: "OHT1",
    label: "OHT1 — North Zone Tank",
    type: "Tank",
    criticality: 79,
    populationAtRisk: 3700,
    plainReason: "Feeds 3 pipeline zones. Lowest storage-buffer to demand ratio in the scheme.",
    technicalReason: "Shortest time-to-criticality (4-6h) upon upstream failure due to 55 LPCD demand vs 50kL capacity.",
    interventionLabel: "Construct additional 30kL balancing reservoir",
    interventionCost: "₹4–8 Lakh",
  },
  {
    rank: 5,
    id: "PHC1",
    label: "PHC1 — PHC Chakur",
    type: "PHC",
    criticality: 77,
    populationAtRisk: 6400,
    plainReason: "Only health facility. Water loss halts OPD and sterilisation within 4 hours.",
    technicalReason: "High empirical criticality driven by strict operational water pressure thresholds.",
    interventionLabel: "Install dedicated 5kL syntax tank + solar pump",
    interventionCost: "₹2–4 Lakh",
  },
  {
    rank: 6,
    id: "PZ1",
    label: "PZ1 — North Zone Pipeline",
    type: "Zone",
    criticality: 72,
    populationAtRisk: 1820,
    plainReason: "Serves the largest single habitation and the PHC. Oldest GI pipe section.",
    technicalReason: "High load concentration — pipe segment with maximum downstream nodes.",
    interventionLabel: "Replace aging GI section with HDPE + install pressure sensors",
    interventionCost: "₹2–4 Lakh",
  },
];
