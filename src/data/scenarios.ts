import type { NodeStatus } from "./nodes";

export interface CascadeEvent {
  nodeId: string;
  next: NodeStatus;
  reason: string;
}

export interface CascadeStep {
  round: number;
  title: string;
  timeLabel: string; // human-readable time offset from failure (e.g. "T+0h", "T+6h")
  events: CascadeEvent[];
}

export interface ScenarioImpact {
  populationWithoutWater: number;
  facilitiesAffected: number;     // PHCs + schools + anganwadis
  timeToCriticalHours: number;    // hours until first village hits 0% storage
  cascadeDepth: number;
  resilienceScore: number;
  lpcdDelivered: number;          // % of JJM 55 LPCD norm
  criticalAsset: string;
  repairCostMin: number;
  repairCostMax: number;
  summary: string;
}

export interface ScenarioDef {
  key: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  description: string;
  cascade: CascadeStep[];
  impact: ScenarioImpact;
  finalStatus: Record<string, NodeStatus>;
  affectedByCategory: Record<string, number>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 55 LPCD norm → daily demand per village (approximate kL/day)
// BW1 yield: 3.6 lakh L/day = 360 kL/day
// OHT1: 50 kL | OHT2: 40 kL | OHT3: 30 kL
// North-zone demand (V1+V2+V3 + SCH1+AW1): ~(1820+640+1240)×55 + (280+45)×45
//   = 3700×55 + 325×45 = 203,500 + 14,625 = ~218 kL/day = ~9.1 kL/hour
// OHT1 at 70% fill = 35 kL → time to critical ≈ 35/9.1 ≈ 3.8 h → ~4–6 h incl. ramp
// ─────────────────────────────────────────────────────────────────────────────

export const SCENARIOS: Record<string, ScenarioDef> = {

  // ── 1. Transformer T1 Trip (most likely failure type for this scheme) ───────
  feeder_t1: {
    key: "feeder_t1",
    label: "Transformer T1 Trip",
    shortLabel: "T1 Trip",
    icon: "Zap",
    color: "#f97316",
    description: "11kV feeder T1 trips — MSEDCL fault. P1 loses power, north-zone tank OHT1 begins draining immediately.",
    cascade: [
      {
        round: 0,
        timeLabel: "T+0h",
        title: "Transformer T1 TRIPS — P1 loses power",
        events: [
          { nodeId: "T1", next: "failed", reason: "MSEDCL feeder fault — transformer trip confirmed" },
          { nodeId: "P1", next: "failed", reason: "P1 loses mains power from T1 — pump stops immediately" },
        ],
      },
      {
        round: 1,
        timeLabel: "T+2h",
        title: "OHT1 draining — north zone tanks stressed",
        events: [
          { nodeId: "OHT1", next: "stressed", reason: "OHT1 no longer filling. 9.1 kL/hr drain rate → at 30% in ~2 h" },
          { nodeId: "OHT2", next: "stressed", reason: "OHT2 also stops filling — both rising mains are from P1" },
        ],
      },
      {
        round: 2,
        timeLabel: "T+4h",
        title: "PHC1 and north pipeline zones lose pressure",
        events: [
          { nodeId: "PZ1", next: "stressed", reason: "OHT1 at 30% — PZ1 pressure dropping, intermittent supply" },
          { nodeId: "PHC1", next: "stressed", reason: "PHC1 water pressure below surgical threshold — OPD disrupted" },
          { nodeId: "PZ3", next: "stressed", reason: "PZ3 pressure dropping — Anganwadi water reduced" },
        ],
      },
      {
        round: 3,
        timeLabel: "T+6h",
        title: "OHT1 depleted — north zone isolated",
        events: [
          { nodeId: "OHT1", next: "failed", reason: "OHT1 storage exhausted — gravity feed to PZ1/PZ2/PZ3 ceases" },
          { nodeId: "PZ1", next: "failed", reason: "PZ1 has no supply — V1, SCH1, PHC1 without water" },
          { nodeId: "PZ2", next: "failed", reason: "PZ2 has no supply — V2 (tanda) without water" },
          { nodeId: "PZ3", next: "failed", reason: "PZ3 has no supply — V3 and AW1 without water" },
          { nodeId: "V1",  next: "isolated", reason: "V1 (1,820 people) — taps dry" },
          { nodeId: "V2",  next: "isolated", reason: "V2 (640 people, tanda) — taps dry, no alternate source" },
          { nodeId: "V3",  next: "isolated", reason: "V3 (1,240 people) — taps dry" },
          { nodeId: "SCH1",next: "isolated", reason: "ZP School — mid-day meal water unavailable" },
          { nodeId: "AW1", next: "isolated", reason: "Anganwadi — supplementary nutrition disrupted" },
          { nodeId: "PHC1",next: "failed",   reason: "PHC water storage exhausted — OPD + sterilisation halted" },
        ],
      },
      {
        round: 4,
        timeLabel: "T+8h",
        title: "Cascade stabilised — OHT2 also draining, south zone unaffected",
        events: [
          { nodeId: "OHT2", next: "failed",   reason: "OHT2 exhausted — PZ4 distribution stops" },
          { nodeId: "PZ4",  next: "failed",   reason: "PZ4 has no supply" },
          { nodeId: "V4",   next: "isolated", reason: "V4 (960 people) — taps dry" },
        ],
      },
    ],
    impact: {
      populationWithoutWater: 5660,
      facilitiesAffected: 4,
      timeToCriticalHours: 6,
      cascadeDepth: 4,
      resilienceScore: 0.38,
      lpcdDelivered: 0,
      criticalAsset: "T1 — 11kV Feeder (no backup power to P1)",
      repairCostMin: 6,
      repairCostMax: 14,
      summary: "5,660 people without water in 6 hours. PHC halted. South zone (OHT3/P2) unaffected.",
    },
    finalStatus: {
      T1: "failed", P1: "failed", OHT1: "failed", OHT2: "failed",
      PZ1: "failed", PZ2: "failed", PZ3: "failed", PZ4: "failed",
      V1: "isolated", V2: "isolated", V3: "isolated", V4: "isolated",
      SCH1: "isolated", AW1: "isolated", PHC1: "failed",
    },
    affectedByCategory: { Sources: 0, Pumps: 1, Feeders: 1, Tanks: 2, Zones: 4, Villages: 4, Facilities: 3 },
  },

  // ── 2. Pipeline Burst PZ3 (physical pipe failure) ────────────────────────
  pipeline_pz3: {
    key: "pipeline_pz3",
    label: "Pipeline Burst — Zone PZ3",
    shortLabel: "PZ3 Burst",
    icon: "Pipette",
    color: "#0ea5e9",
    description: "Burst in PZ3 central distribution pipe — V3 and AW1 lose supply immediately, OHT1 drains faster.",
    cascade: [
      {
        round: 0,
        timeLabel: "T+0h",
        title: "PZ3 pipe bursts — V3 and AW1 lose supply",
        events: [
          { nodeId: "PZ3", next: "failed",   reason: "DN63 HDPE pipe failure — pressure drop to zero in zone" },
          { nodeId: "V3",  next: "isolated", reason: "V3 (1,240 people) immediately without water" },
          { nodeId: "AW1", next: "isolated", reason: "Anganwadi AW1 — water supply severed" },
        ],
      },
      {
        round: 1,
        timeLabel: "T+2h",
        title: "OHT1 draining faster — uncontrolled burst outflow",
        events: [
          { nodeId: "OHT1", next: "stressed", reason: "Burst wastes ~2 kL/hr extra from OHT1. Storage drops to 40% in 2h" },
          { nodeId: "PZ1",  next: "stressed", reason: "PZ1 pressure reduced by shared OHT1 draw-down" },
        ],
      },
      {
        round: 2,
        timeLabel: "T+4h",
        title: "OHT1 nearly depleted — cascade spreads to north cluster",
        events: [
          { nodeId: "OHT1", next: "failed",   reason: "OHT1 exhausted faster than T1 scenario — burst accelerates drain" },
          { nodeId: "PZ1",  next: "failed",   reason: "PZ1 loses supply — gravity feed from OHT1 ceases" },
          { nodeId: "PZ2",  next: "failed",   reason: "PZ2 loses supply" },
          { nodeId: "V1",   next: "stressed", reason: "V1 taps dry — residents begin walking to open wells" },
          { nodeId: "V2",   next: "isolated", reason: "V2 tanda — isolated, no alternate source" },
          { nodeId: "PHC1", next: "stressed", reason: "PHC1 pressure dropping — stored reserves only" },
        ],
      },
      {
        round: 3,
        timeLabel: "T+5h",
        title: "Cascade stabilised — south zone unaffected",
        events: [
          { nodeId: "SCH1", next: "isolated", reason: "ZP School runs out of stored water" },
          { nodeId: "V1",   next: "isolated", reason: "V1 fully without supply — demand surges elsewhere" },
          { nodeId: "PHC1", next: "failed",   reason: "PHC stored water exhausted" },
        ],
      },
    ],
    impact: {
      populationWithoutWater: 3700,
      facilitiesAffected: 3,
      timeToCriticalHours: 4,
      cascadeDepth: 3,
      resilienceScore: 0.46,
      lpcdDelivered: 12,
      criticalAsset: "PZ3 — Central distribution pipeline",
      repairCostMin: 1,
      repairCostMax: 3,
      summary: "3,700 people without water within 4 hours. Burst accelerates OHT1 drain across north zone.",
    },
    finalStatus: {
      PZ3: "failed", V3: "isolated", AW1: "isolated",
      OHT1: "failed", PZ1: "failed", PZ2: "failed",
      V1: "isolated", V2: "isolated", SCH1: "isolated", PHC1: "failed",
    },
    affectedByCategory: { Sources: 0, Pumps: 0, Feeders: 0, Tanks: 1, Zones: 3, Villages: 3, Facilities: 2 },
  },

  // ── 3. Borewell Source Decline (seasonal / drought depletion) ─────────────
  source_bw1: {
    key: "source_bw1",
    label: "Borewell Source Decline",
    shortLabel: "BW1 Decline",
    icon: "TrendingDown",
    color: "#a78bfa",
    description: "BW1 yield drops to 35% of rated (pre-monsoon basaltic aquifer depletion). Slow-cascade over days — the hardest failure to detect early.",
    cascade: [
      {
        round: 0,
        timeLabel: "Day 1",
        title: "BW1 yield at 35% — pumps under-filling all tanks",
        events: [
          { nodeId: "BW1",  next: "stressed", reason: "Aquifer drawdown — yield drops to 1.26 lakh L/day (35% of rated)" },
          { nodeId: "P1",   next: "stressed", reason: "P1 output reduced — insufficient water to fully fill OHT1 and OHT2" },
          { nodeId: "P2",   next: "stressed", reason: "P2 output reduced — OHT3 filling slower than demand" },
        ],
      },
      {
        round: 1,
        timeLabel: "Day 2",
        title: "All three tanks failing to refill overnight — stress spreads",
        events: [
          { nodeId: "OHT1", next: "stressed", reason: "OHT1 ends day at 45% fill — cumulative deficit building" },
          { nodeId: "OHT2", next: "stressed", reason: "OHT2 ends day at 50% fill" },
          { nodeId: "OHT3", next: "stressed", reason: "OHT3 ends day at 55% fill — P2 marginally better" },
          { nodeId: "PZ1",  next: "stressed", reason: "PZ1 supply hours reduced to 4h/day (from 8h)" },
          { nodeId: "PZ5",  next: "stressed", reason: "PZ5 supply hours reduced" },
          { nodeId: "V5",   next: "stressed", reason: "V5 (2,100 people) receiving ~32 LPCD, below 55 norm" },
        ],
      },
      {
        round: 2,
        timeLabel: "Day 4",
        title: "Tanks nearing critical — fringe habitations isolated",
        events: [
          { nodeId: "OHT3", next: "failed",   reason: "OHT3 exhausted by Day 4 afternoon" },
          { nodeId: "PZ5",  next: "failed",   reason: "PZ5 — no supply from OHT3" },
          { nodeId: "PZ6",  next: "failed",   reason: "PZ6 — no supply from OHT3" },
          { nodeId: "V5",   next: "isolated", reason: "V5 (2,100 people) — taps dry" },
          { nodeId: "V6",   next: "isolated", reason: "V6 (1,380 people) — taps dry" },
          { nodeId: "SCH2", next: "isolated", reason: "ZP School Wadgaon — mid-day meal water gone" },
          { nodeId: "AW2",  next: "isolated", reason: "Anganwadi Chincholi — water for nutrition preparation stopped" },
        ],
      },
      {
        round: 3,
        timeLabel: "Day 6",
        title: "North zone collapses — entire scheme critical",
        events: [
          { nodeId: "OHT1", next: "failed",   reason: "OHT1 exhausted by Day 6" },
          { nodeId: "OHT2", next: "stressed", reason: "OHT2 still 20% — marginally holding" },
          { nodeId: "PZ1",  next: "failed",   reason: "PZ1 — no gravity supply" },
          { nodeId: "PZ2",  next: "failed",   reason: "PZ2 — no supply" },
          { nodeId: "PZ3",  next: "failed",   reason: "PZ3 — no supply" },
          { nodeId: "V1",   next: "isolated", reason: "V1 (1,820) — taps dry" },
          { nodeId: "V2",   next: "isolated", reason: "V2 (640, tanda) — taps dry" },
          { nodeId: "V3",   next: "isolated", reason: "V3 (1,240) — taps dry" },
          { nodeId: "PHC1", next: "failed",   reason: "PHC water storage gone — clinical operations halted" },
        ],
      },
    ],
    impact: {
      populationWithoutWater: 8140,
      facilitiesAffected: 5,
      timeToCriticalHours: 96, // 4 days
      cascadeDepth: 3,
      resilienceScore: 0.21,
      lpcdDelivered: 5,
      criticalAsset: "BW1 — Sole groundwater source (no alternate)",
      repairCostMin: 12,
      repairCostMax: 22,
      summary: "All 8,140 residents below 55 LPCD by Day 6. No alternate source exists — requires emergency tanker or new borewell.",
    },
    finalStatus: {
      BW1: "stressed", P1: "stressed", P2: "stressed",
      OHT1: "failed", OHT2: "stressed", OHT3: "failed",
      PZ1: "failed", PZ2: "failed", PZ3: "failed", PZ5: "failed", PZ6: "failed",
      V1: "isolated", V2: "isolated", V3: "isolated", V5: "isolated", V6: "isolated",
      SCH2: "isolated", AW2: "isolated", PHC1: "failed",
    },
    affectedByCategory: { Sources: 1, Pumps: 2, Feeders: 0, Tanks: 2, Zones: 5, Villages: 5, Facilities: 3 },
  },

  // ── 4. Worst Case — T1 + P2 simultaneous failure ─────────────────────────
  worstcase: {
    key: "worstcase",
    label: "Worst-Case Scenario",
    shortLabel: "Worst Case",
    icon: "Bomb",
    color: "#dc2626",
    description: "T1 transformer trips AND P2 mechanical failure simultaneously — north zone dark, south zone has no pump. Complete scheme collapse within 8 hours.",
    cascade: [
      {
        round: 0,
        timeLabel: "T+0h",
        title: "T1 trips AND P2 fails simultaneously",
        events: [
          { nodeId: "T1", next: "failed", reason: "T1 transformer fault" },
          { nodeId: "P1", next: "failed", reason: "P1 loses power from T1" },
          { nodeId: "P2", next: "failed", reason: "P2 mechanical seizure — bearing failure" },
        ],
      },
      {
        round: 1,
        timeLabel: "T+2h",
        title: "All three tanks draining — no pump in operation",
        events: [
          { nodeId: "OHT1", next: "stressed", reason: "OHT1 draining at 9.1 kL/hr — 30% in 2h" },
          { nodeId: "OHT2", next: "stressed", reason: "OHT2 draining — P1 down" },
          { nodeId: "OHT3", next: "stressed", reason: "OHT3 draining — P2 down" },
          { nodeId: "BW1",  next: "isolated", reason: "BW1 functionally isolated — no operational pump to draw from it" },
        ],
      },
      {
        round: 2,
        timeLabel: "T+4h",
        title: "PHC1 critical — south zone begins collapsing",
        events: [
          { nodeId: "PHC1", next: "failed",   reason: "PHC1 water storage exhausted — OPD halted at T+4h" },
          { nodeId: "OHT3", next: "failed",   reason: "OHT3 exhausted — smallest tank, first to empty" },
          { nodeId: "PZ5",  next: "failed",   reason: "PZ5 no supply" },
          { nodeId: "PZ6",  next: "failed",   reason: "PZ6 no supply" },
          { nodeId: "V5",   next: "isolated", reason: "V5 (2,100 people) — taps dry" },
          { nodeId: "V6",   next: "isolated", reason: "V6 (1,380 people) — taps dry" },
          { nodeId: "SCH2", next: "isolated", reason: "SCH2 without water" },
          { nodeId: "AW2",  next: "isolated", reason: "AW2 without water" },
        ],
      },
      {
        round: 3,
        timeLabel: "T+6–8h",
        title: "Full scheme collapse — all 8,140 people without water",
        events: [
          { nodeId: "OHT1", next: "failed",   reason: "OHT1 exhausted" },
          { nodeId: "OHT2", next: "failed",   reason: "OHT2 exhausted" },
          { nodeId: "PZ1",  next: "failed",   reason: "PZ1 — no gravity supply" },
          { nodeId: "PZ2",  next: "failed",   reason: "PZ2 — no supply" },
          { nodeId: "PZ3",  next: "failed",   reason: "PZ3 — no supply" },
          { nodeId: "PZ4",  next: "failed",   reason: "PZ4 — no supply" },
          { nodeId: "V1",   next: "isolated", reason: "V1 (1,820) — taps dry" },
          { nodeId: "V2",   next: "isolated", reason: "V2 (640) — taps dry" },
          { nodeId: "V3",   next: "isolated", reason: "V3 (1,240) — taps dry" },
          { nodeId: "V4",   next: "isolated", reason: "V4 (960) — taps dry" },
          { nodeId: "SCH1", next: "isolated", reason: "SCH1 without water" },
          { nodeId: "AW1",  next: "isolated", reason: "AW1 without water" },
        ],
      },
    ],
    impact: {
      populationWithoutWater: 8140,
      facilitiesAffected: 6,
      timeToCriticalHours: 4,
      cascadeDepth: 3,
      resilienceScore: 0.06,
      lpcdDelivered: 0,
      criticalAsset: "T1 + P2 combined — no single-point redundancy in scheme",
      repairCostMin: 18,
      repairCostMax: 32,
      summary: "All 8,140 residents without water by T+8h. PHC halted at T+4h. Emergency tanker deployment required.",
    },
    finalStatus: {
      T1: "failed", P1: "failed", P2: "failed", BW1: "isolated",
      OHT1: "failed", OHT2: "failed", OHT3: "failed",
      PZ1: "failed", PZ2: "failed", PZ3: "failed", PZ4: "failed", PZ5: "failed", PZ6: "failed",
      V1: "isolated", V2: "isolated", V3: "isolated", V4: "isolated", V5: "isolated", V6: "isolated",
      SCH1: "isolated", SCH2: "isolated", AW1: "isolated", AW2: "isolated", PHC1: "failed",
    },
    affectedByCategory: { Sources: 1, Pumps: 2, Feeders: 1, Tanks: 3, Zones: 6, Villages: 6, Facilities: 4 },
  },
};

export const BASELINE_IMPACT = {
  populationWithoutWater: 0,
  facilitiesAffected: 0,
  timeToCriticalHours: 999,
  cascadeDepth: 0,
  resilienceScore: 0.91,
  lpcdDelivered: 100,
  criticalAsset: "—",
  repairCostMin: 0, repairCostMax: 0,
  summary: "All 25 scheme assets operational — 8,140 residents receiving ≥55 LPCD.",
};

export const MITIGATED_IMPACT = {
  populationWithoutWater: 960,
  facilitiesAffected: 0,
  timeToCriticalHours: 22,
  cascadeDepth: 1,
  resilienceScore: 0.74,
  lpcdDelivered: 88,
  criticalAsset: "T1 (with DG backup installed)",
  repairCostMin: 6, repairCostMax: 10,
  summary: "After DG backup for P1: 960 people affected vs 5,660. Resilience 0.74 vs 0.38.",
};
