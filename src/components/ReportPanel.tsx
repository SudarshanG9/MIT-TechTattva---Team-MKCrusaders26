"use client";
import { SCENARIOS } from "../data/scenarios";
import { CRITICAL_RANKING } from "../data/criticalRanking";
import { X, Printer } from "lucide-react";

interface ReportPanelProps {
  scenarioKey: string;
  onClose: () => void;
}

export default function ReportPanel({ scenarioKey, onClose }: ReportPanelProps) {
  const scenario = SCENARIOS[scenarioKey];
  const imp = scenario.impact;
  const now = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 z-[900] overflow-auto"
      style={{ background: "rgba(7,11,18,0.96)", backdropFilter: "blur(4px)" }}
    >
      {/* Close + print toolbar (no-print) */}
      <div
        className="no-print sticky top-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(11,16,28,0.98)", borderBottom: "1px solid #1e2d40" }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
          PDF Report Preview — {scenario.label}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl px-4 py-2"
            style={{ background: "#10b981", color: "#064e3b", fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer" }}
          >
            <Printer size={14} /> Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 flex items-center gap-1"
            style={{ background: "#141d2e", color: "#94a3b8", fontSize: 12, border: "1px solid #1e2d40", cursor: "pointer" }}
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>

      {/* Printable report body */}
      <div
        className="print-page max-w-3xl mx-auto my-8 rounded-2xl no-print-shadow p-8"
        style={{ background: "#0f1623", border: "1px solid #1e2d40" }}
      >
        {/* Report header */}
        <div style={{ borderBottom: "2px solid #1e2d40", paddingBottom: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", marginBottom: 6 }}>
            VARUNA — INFRASTRUCTURE RESILIENCE DIGITAL TWIN
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
            Cascading Failure Analysis Report
          </h1>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
            Srirangapatna Taluk, Mandya District, Karnataka
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Scenario", value: scenario.label },
              { label: "Date Generated", value: now },
              { label: "Status", value: "Prototype Demo" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg p-2.5" style={{ background: "#0a1120", border: "1px solid #1e2d40" }}>
                <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em" }}>{m.label.toUpperCase()}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginTop: 2 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: "#06b6d4", marginBottom: 12, letterSpacing: "0.04em" }}>
            1. EXECUTIVE SUMMARY
          </h2>
          <div
            className="rounded-xl p-4"
            style={{ background: "#0a1120", border: "1px solid #1e2d40", fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}
          >
            The VARUNA cascading failure simulator was used to analyse the impact of a{" "}
            <strong style={{ color: "#e2e8f0" }}>{scenario.label.toLowerCase()}</strong> on the
            Srirangapatna taluk infrastructure network (25 assets, 34 links). The simulation propagated
            through {imp.cascadeDepth} rounds and resulted in{" "}
            <strong style={{ color: "#ef4444" }}>{imp.populationIsolated.toLocaleString()} people isolated</strong>,{" "}
            {imp.facilitiesAffected} facilities affected, and {imp.roadsFailed} roads/bridges failed.
            Network resilience degraded from a baseline of 0.92 to{" "}
            <strong style={{ color: "#f59e0b" }}>{imp.resilienceScore.toFixed(2)}</strong>.
            The critical bottleneck asset is <strong style={{ color: "#e2e8f0" }}>{imp.criticalAsset}</strong>.
          </div>
        </section>

        {/* 2. Impact Metrics */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: "#06b6d4", marginBottom: 12, letterSpacing: "0.04em" }}>
            2. IMPACT METRICS
          </h2>
          <table className="print-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#141d2e" }}>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#e2e8f0", border: "1px solid #1e2d40", fontWeight: 700 }}>Metric</th>
                <th style={{ textAlign: "right", padding: "8px 12px", color: "#22c55e", border: "1px solid #1e2d40", fontWeight: 700 }}>Baseline</th>
                <th style={{ textAlign: "right", padding: "8px 12px", color: "#06b6d4", border: "1px solid #1e2d40", fontWeight: 700 }}>This Scenario</th>
                <th style={{ textAlign: "right", padding: "8px 12px", color: "#10b981", border: "1px solid #1e2d40", fontWeight: 700 }}>Post-Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {[
                { m: "Population Isolated", b: "0", s: imp.populationIsolated.toLocaleString(), mit: "850" },
                { m: "Resilience Score (0–1)", b: "0.92", s: imp.resilienceScore.toFixed(2), mit: "0.71" },
                { m: "Facilities Affected", b: "0", s: String(imp.facilitiesAffected), mit: "1" },
                { m: "Roads / Bridges Failed", b: "0", s: String(imp.roadsFailed), mit: "2" },
                { m: "Cascade Depth (rounds)", b: "—", s: String(imp.cascadeDepth), mit: "1" },
                { m: "Estimated Repair Cost", b: "₹0", s: `₹${imp.repairCostMin}–${imp.repairCostMax}L`, mit: "₹14–22L" },
              ].map((r, i) => (
                <tr key={r.m} style={{ background: i % 2 === 0 ? "#0a1120" : "#0f1623" }}>
                  <td style={{ padding: "8px 12px", color: "#94a3b8", border: "1px solid #1e2d40" }}>{r.m}</td>
                  <td style={{ textAlign: "right", padding: "8px 12px", color: "#22c55e", border: "1px solid #1e2d40" }}>{r.b}</td>
                  <td style={{ textAlign: "right", padding: "8px 12px", color: "#e2e8f0", fontWeight: 700, border: "1px solid #1e2d40" }}>{r.s}</td>
                  <td style={{ textAlign: "right", padding: "8px 12px", color: "#10b981", border: "1px solid #1e2d40" }}>{r.mit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 3. Critical Infrastructure Ranking */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: "#06b6d4", marginBottom: 12, letterSpacing: "0.04em" }}>
            3. CRITICAL INFRASTRUCTURE RANKING
          </h2>
          <table className="print-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#141d2e" }}>
                <th style={{ padding: "8px 12px", color: "#e2e8f0", border: "1px solid #1e2d40", textAlign: "center", fontWeight: 700 }}>#</th>
                <th style={{ padding: "8px 12px", color: "#e2e8f0", border: "1px solid #1e2d40", textAlign: "left", fontWeight: 700 }}>Asset</th>
                <th style={{ padding: "8px 12px", color: "#e2e8f0", border: "1px solid #1e2d40", textAlign: "right", fontWeight: 700 }}>Crit. Score</th>
                <th style={{ padding: "8px 12px", color: "#e2e8f0", border: "1px solid #1e2d40", textAlign: "right", fontWeight: 700 }}>Pop. at Risk</th>
                <th style={{ padding: "8px 12px", color: "#e2e8f0", border: "1px solid #1e2d40", textAlign: "left", fontWeight: 700 }}>Intervention</th>
                <th style={{ padding: "8px 12px", color: "#e2e8f0", border: "1px solid #1e2d40", textAlign: "right", fontWeight: 700 }}>Cost Est.</th>
              </tr>
            </thead>
            <tbody>
              {CRITICAL_RANKING.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "#0a1120" : "#0f1623" }}>
                  <td style={{ textAlign: "center", padding: "7px 12px", color: r.rank === 1 ? "#ef4444" : "#64748b", fontWeight: 800, border: "1px solid #1e2d40" }}>
                    {r.rank}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#e2e8f0", fontWeight: 600, border: "1px solid #1e2d40" }}>{r.label}</td>
                  <td style={{ textAlign: "right", padding: "7px 12px", color: r.criticality > 80 ? "#ef4444" : "#f59e0b", fontWeight: 700, border: "1px solid #1e2d40" }}>
                    {r.criticality}%
                  </td>
                  <td style={{ textAlign: "right", padding: "7px 12px", color: "#94a3b8", border: "1px solid #1e2d40" }}>
                    {r.populationAtRisk.toLocaleString()}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#6ee7b7", border: "1px solid #1e2d40", fontSize: 10 }}>
                    {r.interventionLabel}
                  </td>
                  <td style={{ textAlign: "right", padding: "7px 12px", color: "#fcd34d", fontWeight: 700, border: "1px solid #1e2d40" }}>
                    {r.interventionCost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 4. Data Provenance Note */}
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: "#06b6d4", marginBottom: 12, letterSpacing: "0.04em" }}>
            4. DATA PROVENANCE & CONFIDENCE
          </h2>
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 11, color: "#fcd34d", lineHeight: 1.7 }}
          >
            <strong>All metrics are deterministic mock outputs for prototype demonstration.</strong> The
            infrastructure asset data is sourced from OpenStreetMap (road geometry, hospital/school
            locations), Census/SECC (population), and PMGSY (road classification). Dependency edges
            are inferred via KD-tree proximity + Dijkstra path analysis. Two dependency edges were
            reviewed and corrected by the user during this session. Repair cost estimates are based on
            Karnataka PWD Schedule of Rates 2023 (illustrative). All cascade propagation uses the
            Motter-Lai load-redistribution model with α=0.3. Monte Carlo uncertainty quantification is
            deferred to the production build.
          </div>
          <div style={{ fontSize: 10, color: "#334155", marginTop: 12, textAlign: "center" }}>
            VARUNA Prototype · MIT Manipal Tech Tatva 2024 · Not for procurement decision use
          </div>
        </section>
      </div>
    </div>
  );
}
