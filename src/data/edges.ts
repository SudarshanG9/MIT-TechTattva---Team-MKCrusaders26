export type EdgeKind = "pipe" | "power" | "service";
export type ConfidenceTier = "user-confirmed" | "measured" | "inferred-high" | "inferred-low";

export interface InfraEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  label?: string;
  confidence?: ConfidenceTier;
  surfaceForReview?: boolean;
  reviewReason?: string;
}

export const EDGES: InfraEdge[] = [
  // ── Pipe connections (physical water flow) ─────────────────────────────────
  { from: "BW1",  to: "P1",   kind: "pipe", label: "raw water supply", confidence: "measured" },
  { from: "BW1",  to: "P2",   kind: "pipe", label: "raw water supply", confidence: "measured" },
  { from: "P1",   to: "OHT1", kind: "pipe", label: "rising main north", confidence: "measured" },
  { from: "P1",   to: "OHT2", kind: "pipe", label: "rising main east",  confidence: "measured" },
  { from: "P2",   to: "OHT3", kind: "pipe", label: "rising main south", confidence: "measured" },
  { from: "OHT1", to: "PZ1",  kind: "pipe", label: "gravity feed",      confidence: "measured" },
  { from: "OHT1", to: "PZ2",  kind: "pipe", label: "gravity feed",      confidence: "measured" },
  { from: "OHT1", to: "PZ3",  kind: "pipe", label: "gravity feed",      confidence: "measured" },
  { from: "OHT2", to: "PZ4",  kind: "pipe", label: "gravity feed",      confidence: "measured" },
  { from: "OHT3", to: "PZ5",  kind: "pipe", label: "gravity feed",      confidence: "measured" },
  { from: "OHT3", to: "PZ6",  kind: "pipe", label: "gravity feed",      confidence: "measured" },
  { from: "PZ1",  to: "V1",   kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ1",  to: "SCH1", kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ1",  to: "PHC1", kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ2",  to: "V2",   kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ3",  to: "V3",   kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ3",  to: "AW1",  kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ4",  to: "V4",   kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ5",  to: "V5",   kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ5",  to: "SCH2", kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ6",  to: "V6",   kind: "pipe", label: "distribution",      confidence: "measured" },
  { from: "PZ6",  to: "AW2",  kind: "pipe", label: "distribution",      confidence: "measured" },

  // ── Power dependencies (dashed in UI) ─────────────────────────────────────
  // P1's feeder: system infers T1 (nearest) — but T1 and T2 are on the same
  // MSEDCL section and P1 actually energises via T2 circuit breaker.
  // This is Dependency 1 surfaced for correction in Step 3.
  {
    from: "P1", to: "T1",
    kind: "power", label: "powered by",
    confidence: "inferred-low",
    surfaceForReview: true,
    reviewReason:
      "Inferred T1 by proximity (66% confident). However field records suggest P1's LT panel is wired to the T2 feeder circuit. Please confirm which MSEDCL breaker actually energises P1.",
  },
  // P2's feeder: confirmed T2
  { from: "P2", to: "T2", kind: "power", label: "powered by", confidence: "measured" },

  // OHT2's supply pump: system infers P1 (main pump, closest) —
  // but OHT2 is served by P1 via a dedicated rising main (confirmed),
  // while OHT3 is exclusively P2.
  // Dependency 2: the question is whether OHT2's rising main is truly independent
  // of P2 or if P2 was also plumbed into it as a backup.
  {
    from: "OHT2", to: "P2",
    kind: "power", label: "backup supply via",
    confidence: "inferred-low",
    surfaceForReview: true,
    reviewReason:
      "System inferred P2 as a backup supply path for OHT2 (71% confident — plumbing maps ambiguous). Block engineer or VWSC member: was P2's outlet ever connected to OHT2 as an emergency bypass? Please confirm or correct.",
  },
  // Service edges (population dependencies — for cascade scoring)
  { from: "V1",   to: "PHC1", kind: "service", label: "health access", confidence: "measured" },
  { from: "V2",   to: "PHC1", kind: "service", label: "health access", confidence: "measured" },
  { from: "V3",   to: "PHC1", kind: "service", label: "health access", confidence: "measured" },
  { from: "V4",   to: "PHC1", kind: "service", label: "health access", confidence: "measured" },
];

export const REVIEW_EDGES = EDGES.filter((e) => e.surfaceForReview);
