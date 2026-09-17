"use client";
import { SCENARIOS, BASELINE_IMPACT, MITIGATED_IMPACT } from "../data/scenarios";
import { FileText, ArrowRight } from "lucide-react";

interface Step7Props {
  scenarioKey: string;
  onReport: () => void;
}

const SCENARIO_ORDER = ["feeder_t1", "pipeline_pz3", "source_bw1", "worstcase"] as const;

// Column definitions for comparison table
function getComparisonRows(activeKey: string) {
  return [
    {
      metric: "Pop. Without Water",
      baseline: "0",
      mitigated: "0",
      current: SCENARIOS[activeKey].impact.populationWithoutWater.toLocaleString(),
      worst: SCENARIOS["worstcase"].impact.populationWithoutWater.toLocaleString(),
      highlight: true,
    },
    {
      metric: "Resilience Score",
      baseline: "0.92",
      mitigated: "0.81",
      current: SCENARIOS[activeKey].impact.resilienceScore.toFixed(2),
      worst: "0.12",
      highlight: false,
    },
    {
      metric: "Facilities Affected",
      baseline: "0",
      mitigated: "0",
      current: String(SCENARIOS[activeKey].impact.facilitiesAffected),
      worst: String(SCENARIOS["worstcase"].impact.facilitiesAffected),
      highlight: false,
    },
    {
      metric: "Assets Offline/Empty",
      baseline: "0",
      mitigated: "1",
      current: String(SCENARIOS[activeKey].impact.assetsFailed),
      worst: String(SCENARIOS["worstcase"].impact.assetsFailed),
      highlight: false,
    },
    {
      metric: "Time to Critical",
      baseline: "—",
      mitigated: "12 hours",
      current: `${SCENARIOS[activeKey].impact.timeToCriticalHours} hours`,
      worst: `${SCENARIOS["worstcase"].impact.timeToCriticalHours} hours`,
      highlight: false,
    },
    {
      metric: "Est. Repair Cost",
      baseline: "₹0",
      mitigated: "₹6–12L",
      current: `₹${SCENARIOS[activeKey].impact.repairCostMin}–${SCENARIOS[activeKey].impact.repairCostMax}L`,
      worst: `₹${SCENARIOS["worstcase"].impact.repairCostMin}–${SCENARIOS["worstcase"].impact.repairCostMax}L`,
      highlight: false,
    },
  ];
}

export default function Step7Report({ scenarioKey, onReport }: Step7Props) {
  const scenario = SCENARIOS[scenarioKey];
  const rows = getComparisonRows(scenarioKey);

  const COLS: { key: string; label: string; sub: string; color: string; dim: boolean; active?: boolean }[] = [
    { key: "baseline",  label: "Baseline",          sub: "Normal operation",     color: "#22c55e",  dim: false },
    { key: "mitigated", label: "T1 DG Backup",       sub: "Intervention applied", color: "#10b981",  dim: false },
    { key: "current",   label: scenario.shortLabel,  sub: "Active scenario",      color: "#06b6d4",  dim: false, active: true },
    { key: "worst",     label: "Worst Case",          sub: "T1 + P2",        color: "#ef4444",  dim: false },
  ];

  const barData = SCENARIO_ORDER.map((k) => ({
    label: SCENARIOS[k].shortLabel,
    pop: SCENARIOS[k].impact.populationWithoutWater,
    res: SCENARIOS[k].impact.resilienceScore,
    color: SCENARIOS[k].color,
    isActive: k === scenarioKey,
  }));

  const maxPop = Math.max(...barData.map((d) => d.pop));

  return (
    <div
      className="min-h-full px-4 sm:px-6 py-6"
      style={{ background: "#070b12", maxWidth: 1100, margin: "0 auto" }}
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-2"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", fontSize: 10, color: "#06b6d4", fontWeight: 700 }}
            >
              STEP 7 — SCENARIO COMPARISON & REPORT
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
              What should I fix first?
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              The table below compares all scenarios against a baseline and the mitigated (post-repair) state.
            </p>
          </div>
          <button
            onClick={onReport}
            className="flex items-center gap-2 rounded-xl px-4 py-3 shrink-0"
            style={{
              background: "#10b981",
              color: "#064e3b",
              fontSize: 12,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(16,185,129,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            <FileText size={14} /> Generate PDF Report
          </button>
        </div>

        {/* Comparison table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid #1e2d40" }}
        >
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2d40" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, color: "#475569", letterSpacing: "0.12em", fontWeight: 700, background: "#0f1623" }}>
                    METRIC
                  </th>
                  {COLS.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        background: col.active ? "rgba(6,182,212,0.08)" : "#0f1623",
                        borderLeft: col.active ? "1px solid rgba(6,182,212,0.2)" : "1px solid #1e2d40",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: col.color }}>{col.label}</div>
                      <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{col.sub}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={row.metric}
                    style={{ borderBottom: "1px solid #1e2d40", background: ri % 2 === 0 ? "#0a1120" : "#0f1623" }}
                  >
                    <td style={{ padding: "10px 16px", color: "#94a3b8", fontWeight: 600 }}>
                      {row.metric}
                    </td>
                    <td style={{ textAlign: "right", padding: "10px 16px", color: "#22c55e", fontWeight: 700, borderLeft: "1px solid #1e2d40" }}>
                      {row.baseline}
                    </td>
                    <td style={{ textAlign: "right", padding: "10px 16px", color: "#10b981", fontWeight: 700, borderLeft: "1px solid #1e2d40" }}>
                      {row.mitigated}
                    </td>
                    <td style={{ textAlign: "right", padding: "10px 16px", color: "#e2e8f0", fontWeight: 800, borderLeft: "1px solid rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.05)" }}>
                      {row.current}
                    </td>
                    <td style={{ textAlign: "right", padding: "10px 16px", color: "#ef4444", fontWeight: 700, borderLeft: "1px solid #1e2d40" }}>
                      {row.worst}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar chart — population isolated */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5" style={{ background: "#0f1623", border: "1px solid #1e2d40" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 700 }}>
              POPULATION W/O WATER BY SCENARIO
            </div>
            <div className="space-y-3">
              {barData.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 11, color: d.isActive ? "#e2e8f0" : "#64748b", fontWeight: d.isActive ? 700 : 400 }}>
                      {d.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: d.isActive ? "#ffffff" : "#64748b" }}>
                      {d.pop.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#141d2e" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.pop / maxPop) * 100}%`,
                        background: d.color,
                        opacity: d.isActive ? 1 : 0.4,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation box */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <div style={{ fontSize: 10, color: "#10b981", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>
              PLANNING RECOMMENDATION
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", lineHeight: 1.4 }}>
              Prioritise T1 Feeder backup power
            </div>
            <div style={{ fontSize: 12, color: "#6ee7b7", marginTop: 8, lineHeight: 1.6 }}>
              A ₹6–12 Lakh investment in a DG backup for P1 prevents entire scheme failure.
              Restores water security to <strong>5,660 people</strong> and prevents cascading tank drainage.
              Resilience improves from <strong>0.28 → 0.81</strong>.
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: "Pop. secured", value: "5,660", color: "#10b981" },
                { label: "Resilience gain", value: "+0.53", color: "#10b981" },
                { label: "Buffer added", value: "+6 hours", color: "#10b981" },
                { label: "Cost estimate", value: "₹6–12L", color: "#fcd34d" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl p-3"
                  style={{ background: "#0a1120", border: "1px solid #1e2d40" }}
                >
                  <div style={{ fontSize: 10, color: "#475569" }}>{m.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: m.color, marginTop: 2 }}>{m.value}</div>
                </div>
              ))}
            </div>

            <button
              onClick={onReport}
              className="mt-4 w-full rounded-xl py-3 flex items-center justify-center gap-2"
              style={{
                background: "#10b981",
                color: "#064e3b",
                fontSize: 12,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
              }}
            >
              <FileText size={14} /> Generate MJP Report PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
