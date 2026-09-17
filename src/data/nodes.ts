export type NodeType =
  | "source"     // borewell / surface intake / reservoir
  | "pump"       // pump house / booster
  | "feeder"     // 11kV transformer / power feeder
  | "tank"       // overhead storage tank / sump
  | "zone"       // pipeline distribution zone
  | "village"    // habitation cluster
  | "school"     // ZP school / govt school
  | "anganwadi"  // ICDS / AWC centre
  | "phc";       // primary health centre / sub-centre

export type NodeStatus = "operational" | "stressed" | "failed" | "isolated";

export type ProvenanceTier =
  | "user-confirmed"
  | "measured"
  | "inferred-high"
  | "inferred-low"
  | "unserved";

export interface InfraNode {
  id: string;
  label: string;
  shortLabel: string;
  type: NodeType;
  lat: number;
  lng: number;
  capacity: string;
  population?: number;       // for villages
  storageKL?: number;        // for tanks (kilolitres)
  demandLPCDTotal?: number;  // litres/day for demand nodes
  criticality: number;
  criticalityReason: string;
  provenance: ProvenanceTier;
  description: string;
  repairCostMin?: number;    // ₹ Lakh
  repairCostMax?: number;
  repairTime?: string;
  timeToCriticalHours?: number; // hours from failure to storage = 0
}

// ─── Chakur Block, Latur District, Maharashtra ──────────────────────────────
// Rural piped water scheme — JJM-covered, water-stressed, Marathwada region
// Centre approx 17.925°N, 76.802°E
// ─────────────────────────────────────────────────────────────────────────────

export const NODES: InfraNode[] = [

  // ── Water Sources ──────────────────────────────────────────────────────────
  {
    id: "BW1", label: "BW1 — Borewell Source Chakur", shortLabel: "BW1",
    type: "source", lat: 17.9252, lng: 76.8018,
    capacity: "3.6 lakh L/day yield", criticality: 88,
    criticalityReason: "Sole groundwater source — entire scheme depends on this one borewell.",
    provenance: "measured",
    description: "Primary borewell — 240m depth, basaltic aquifer, JJM commissioned 2022",
    repairCostMin: 8, repairCostMax: 16, repairTime: "12–48 hours",
    timeToCriticalHours: 0,
  },

  // ── Pump Houses ───────────────────────────────────────────────────────────
  {
    id: "P1", label: "P1 — Main Pump House", shortLabel: "P1",
    type: "pump", lat: 17.9198, lng: 76.8052,
    capacity: "5 HP submersible, 2.5 lakh L/day", criticality: 91,
    criticalityReason: "No dedicated backup — its failure drains OHT1 within 6 hours at peak demand.",
    provenance: "measured",
    description: "Main submersible pump, feeds OHT1 and OHT2 via rising main",
    repairCostMin: 3, repairCostMax: 7, repairTime: "4–8 hours",
    timeToCriticalHours: 6,
  },
  {
    id: "P2", label: "P2 — South Booster Pump", shortLabel: "P2",
    type: "pump", lat: 17.9182, lng: 76.8071,
    capacity: "3 HP booster, 1.2 lakh L/day", criticality: 67,
    criticalityReason: "Sole supply for OHT3 — south-zone villages have no alternate source.",
    provenance: "measured",
    description: "Dedicated booster pump for south zone OHT3",
    repairCostMin: 2, repairCostMax: 5, repairTime: "3–6 hours",
    timeToCriticalHours: 9,
  },

  // ── Power Feeders / Transformers ──────────────────────────────────────────
  {
    id: "T1", label: "T1 — 11kV Feeder 1 (North)", shortLabel: "T1",
    type: "feeder", lat: 17.9214, lng: 76.8038,
    capacity: "11/0.44 kV, 25 kVA", criticality: 84,
    criticalityReason: "Powers P1 — transformer trip is the most common outage cause for this scheme.",
    provenance: "measured",
    description: "Primary 11kV agricultural feeder — MSEDCL, unreliable in monsoon",
    repairCostMin: 6, repairCostMax: 12, repairTime: "6–12 hours",
    timeToCriticalHours: 6,
  },
  {
    id: "T2", label: "T2 — 11kV Feeder 2 (South)", shortLabel: "T2",
    type: "feeder", lat: 17.9197, lng: 76.8082,
    capacity: "11/0.44 kV, 15 kVA", criticality: 58,
    criticalityReason: "Powers P2 — south-zone backup feeder, shares MSEDCL line section with T1.",
    provenance: "inferred-low", // Surfaced for review — correction: T2 also powers P1 on the same circuit
    description: "Secondary feeder — P2 power source, and alternate for P1",
    repairCostMin: 4, repairCostMax: 9, repairTime: "4–8 hours",
    timeToCriticalHours: 9,
  },

  // ── Overhead Storage Tanks ─────────────────────────────────────────────────
  {
    id: "OHT1", label: "OHT1 — North Zone Tank (50 kL)", shortLabel: "OHT1",
    type: "tank", lat: 17.9352, lng: 76.7948,
    capacity: "50 kL, 12m staging", storageKL: 50, criticality: 79,
    criticalityReason: "Feeds 3 pipeline zones serving 3,700 people — largest tank in the scheme.",
    provenance: "measured",
    description: "Primary overhead tank — north and central distribution",
    repairCostMin: 4, repairCostMax: 8, repairTime: "24 hours (emergency refill)",
    timeToCriticalHours: 6,
  },
  {
    id: "OHT2", label: "OHT2 — East Zone Tank (40 kL)", shortLabel: "OHT2",
    type: "tank", lat: 17.9218, lng: 76.8204,
    capacity: "40 kL, 10m staging", storageKL: 40, criticality: 62,
    criticalityReason: "Serves east zone — PHC1 dependency makes it a health-critical asset.",
    provenance: "inferred-low", // Surfaced: is OHT2 fed by P1 or P2? Inferred P1, actually P1 via dedicated rising main
    description: "East zone overhead tank — serves Nagansur and PHC Chakur",
    repairCostMin: 3, repairCostMax: 6, repairTime: "18 hours",
    timeToCriticalHours: 8,
  },
  {
    id: "OHT3", label: "OHT3 — South Zone Tank (30 kL)", shortLabel: "OHT3",
    type: "tank", lat: 17.9079, lng: 76.7982,
    capacity: "30 kL, 10m staging", storageKL: 30, criticality: 55,
    criticalityReason: "Feeds 2,100-person south cluster — lower buffer, flood-isolated access.",
    provenance: "measured",
    description: "South zone overhead tank — Wadgaon and Chincholi supply",
    repairCostMin: 3, repairCostMax: 5, repairTime: "18 hours",
    timeToCriticalHours: 9,
  },

  // ── Pipeline Distribution Zones ───────────────────────────────────────────
  {
    id: "PZ1", label: "PZ1 — North Zone Pipeline", shortLabel: "PZ1",
    type: "zone", lat: 17.9398, lng: 76.7900,
    capacity: "DN80 GI pipe, 4.5 km", criticality: 72,
    criticalityReason: "Serves Chakur village, ZP School, and PHC — highest-population zone.",
    provenance: "measured", description: "North distribution zone — Chakur village + PHC",
    repairCostMin: 2, repairCostMax: 4, repairTime: "4–6 hours",
    timeToCriticalHours: 7,
  },
  {
    id: "PZ2", label: "PZ2 — NW Zone Pipeline", shortLabel: "PZ2",
    type: "zone", lat: 17.9381, lng: 76.7840,
    capacity: "DN63 HDPE pipe, 3.1 km", criticality: 43,
    criticalityReason: "Malegaon Tanda access — small but isolated tanda with no alternate supply.",
    provenance: "measured", description: "North-west distribution zone — Malegaon Tanda",
    repairCostMin: 1, repairCostMax: 3, repairTime: "3–5 hours",
    timeToCriticalHours: 7,
  },
  {
    id: "PZ3", label: "PZ3 — Central Zone Pipeline", shortLabel: "PZ3",
    type: "zone", lat: 17.9228, lng: 76.7898,
    capacity: "DN63 HDPE pipe, 2.8 km", criticality: 48,
    criticalityReason: "Central distribution — Anganwadi AWC1 dependency for child nutrition water.",
    provenance: "measured", description: "Central distribution zone — Hingoli Wadi + Anganwadi",
    repairCostMin: 1, repairCostMax: 3, repairTime: "3–5 hours",
    timeToCriticalHours: 7,
  },
  {
    id: "PZ4", label: "PZ4 — East Zone Pipeline", shortLabel: "PZ4",
    type: "zone", lat: 17.9195, lng: 76.8282,
    capacity: "DN63 HDPE pipe, 2.2 km", criticality: 64,
    criticalityReason: "PHC1 water supply route — failure means hospital water disruption.",
    provenance: "measured", description: "East distribution zone — Nagansur + PHC Chakur",
    repairCostMin: 2, repairCostMax: 3, repairTime: "2–4 hours",
    timeToCriticalHours: 8,
  },
  {
    id: "PZ5", label: "PZ5 — South Zone Pipeline", shortLabel: "PZ5",
    type: "zone", lat: 17.9048, lng: 76.7942,
    capacity: "DN80 GI pipe, 5.2 km", criticality: 57,
    criticalityReason: "Wadgaon — largest village in south zone, oldest pipeline section.",
    provenance: "measured", description: "South distribution zone — Wadgaon + ZP School",
    repairCostMin: 2, repairCostMax: 4, repairTime: "4–6 hours",
    timeToCriticalHours: 10,
  },
  {
    id: "PZ6", label: "PZ6 — SE Zone Pipeline", shortLabel: "PZ6",
    type: "zone", lat: 17.9018, lng: 76.8048,
    capacity: "DN50 HDPE pipe, 2.9 km", criticality: 39,
    criticalityReason: "South-east fringe — Chincholi, historically last to receive supply in shortage.",
    provenance: "measured", description: "South-east distribution zone — Chincholi + Anganwadi",
    repairCostMin: 1, repairCostMax: 2, repairTime: "2–4 hours",
    timeToCriticalHours: 10,
  },

  // ── Villages ───────────────────────────────────────────────────────────────
  {
    id: "V1", label: "V1 — Chakur Village", shortLabel: "V1",
    type: "village", lat: 17.9432, lng: 76.7868,
    capacity: "1,820 residents", population: 1820,
    demandLPCDTotal: Math.round(1820 * 55), criticality: 66,
    criticalityReason: "Largest settlement — north zone anchor habitation",
    provenance: "measured", description: "Gram Panchayat HQ habitation, north zone",
  },
  {
    id: "V2", label: "V2 — Malegaon Tanda", shortLabel: "V2",
    type: "village", lat: 17.9415, lng: 76.7808,
    capacity: "640 residents", population: 640,
    demandLPCDTotal: Math.round(640 * 55), criticality: 35,
    criticalityReason: "Small tanda — isolated from any alternate supply route",
    provenance: "measured", description: "Tribal hamlet — no alternate water source",
  },
  {
    id: "V3", label: "V3 — Hingoli Wadi", shortLabel: "V3",
    type: "village", lat: 17.9248, lng: 76.7858,
    capacity: "1,240 residents", population: 1240,
    demandLPCDTotal: Math.round(1240 * 55), criticality: 44,
    criticalityReason: "Central zone — Anganwadi co-located, child nutrition dependency",
    provenance: "measured", description: "Central zone habitation with Anganwadi",
  },
  {
    id: "V4", label: "V4 — Nagansur", shortLabel: "V4",
    type: "village", lat: 17.9188, lng: 76.8315,
    capacity: "960 residents", population: 960,
    demandLPCDTotal: Math.round(960 * 55), criticality: 51,
    criticalityReason: "East zone — PHC access road doubles as supply zone boundary",
    provenance: "measured", description: "East zone village, PHC proximity",
  },
  {
    id: "V5", label: "V5 — Wadgaon", shortLabel: "V5",
    type: "village", lat: 17.9021, lng: 76.7922,
    capacity: "2,100 residents", population: 2100,
    demandLPCDTotal: Math.round(2100 * 55), criticality: 52,
    criticalityReason: "Largest south-zone village — oldest pipeline, highest leak risk",
    provenance: "measured", description: "South zone anchor habitation, ZP school",
  },
  {
    id: "V6", label: "V6 — Chincholi", shortLabel: "V6",
    type: "village", lat: 17.8991, lng: 76.8082,
    capacity: "1,380 residents", population: 1380,
    demandLPCDTotal: Math.round(1380 * 55), criticality: 38,
    criticalityReason: "South-east fringe — chronically last in supply priority",
    provenance: "measured", description: "South-east fringe habitation, Anganwadi co-located",
  },

  // ── Schools ───────────────────────────────────────────────────────────────
  {
    id: "SCH1", label: "SCH1 — ZP School Chakur", shortLabel: "SCH1",
    type: "school", lat: 17.9452, lng: 76.7858,
    capacity: "280 students",
    demandLPCDTotal: 280 * 45, criticality: 28,
    criticalityReason: "North zone school — mid-day meal water dependency",
    provenance: "measured", description: "Zilla Parishad School — north zone, mid-day meal",
    repairCostMin: 1, repairCostMax: 2, repairTime: "same day",
  },
  {
    id: "SCH2", label: "SCH2 — ZP School Wadgaon", shortLabel: "SCH2",
    type: "school", lat: 17.9008, lng: 76.7902,
    capacity: "340 students",
    demandLPCDTotal: 340 * 45, criticality: 31,
    criticalityReason: "South zone school — sole drinking water facility for south cluster",
    provenance: "measured", description: "Zilla Parishad School — south zone, sole water point",
    repairCostMin: 1, repairCostMax: 2, repairTime: "same day",
  },

  // ── Anganwadis ────────────────────────────────────────────────────────────
  {
    id: "AW1", label: "AW1 — Anganwadi Hingoli Wadi", shortLabel: "AW1",
    type: "anganwadi", lat: 17.9258, lng: 76.7848,
    capacity: "45 children", demandLPCDTotal: 45 * 55, criticality: 29,
    criticalityReason: "Supplementary nutrition depends on clean water — disruption = ICDS closure",
    provenance: "measured", description: "ICDS Anganwadi Centre — central zone, child nutrition",
    repairCostMin: 0, repairCostMax: 1, repairTime: "same day",
  },
  {
    id: "AW2", label: "AW2 — Anganwadi Chincholi", shortLabel: "AW2",
    type: "anganwadi", lat: 17.8998, lng: 76.8062,
    capacity: "52 children", demandLPCDTotal: 52 * 55, criticality: 26,
    criticalityReason: "South-east fringe AWC — last to receive supply in any shortage",
    provenance: "measured", description: "ICDS Anganwadi Centre — south-east zone",
    repairCostMin: 0, repairCostMax: 1, repairTime: "same day",
  },

  // ── PHC ───────────────────────────────────────────────────────────────────
  {
    id: "PHC1", label: "PHC1 — PHC Chakur", shortLabel: "PHC1",
    type: "phc", lat: 17.9442, lng: 76.7878,
    capacity: "24 beds, OPD 40/day", demandLPCDTotal: 64 * 100, criticality: 77,
    criticalityReason: "Only health facility in 6-village area — water failure = OPD closure, zero sterilisation.",
    provenance: "measured", description: "Primary Health Centre — only referral in block",
    repairCostMin: 2, repairCostMax: 4, repairTime: "priority — 2 hours",
    timeToCriticalHours: 4, // PHC storage runs out faster than village tanks
  },
];
