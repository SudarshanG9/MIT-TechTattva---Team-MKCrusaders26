"use client";
import { useState } from "react";
import { SCENARIOS } from "../data/scenarios";
import { CRITICAL_RANKING } from "../data/criticalRanking";
import { Users, Hospital, Route, Layers, ArrowRight, BarChart3, ShieldCheck, Info } from "lucide-react";
import type { NodeStatus } from "../data/nodes";

interface Step6Props {
  scenarioKey: string;
  finalStatus: Record<string, NodeStatus>;
  onNext: () => void;
}

type Tab = "impact" | "criticality";

export default function Step6Impact({ scenarioKey, finalStatus, onNext }: Step6Props) {
  const [tab, setTab] = useState<Tab>("impact");
  const [selectedCritId, setSelectedCritId] = useState<string | null>(null);
  const scenario = SCENARIOS[scenarioKey];
  const imp = scenario.impact;

  const IMPACT_CARDS = [
    {
      label: "Pop. Without Water",
      value: imp.populationWithoutWater.toLocaleString(),
      sub: `${((imp.populationWithoutWater / 8140) * 100).toFixed(0)}% of scheme`,
      icon: Users,
      color: "#38bdf8",
    },
    {
      label: "Facilities Affected",
      value: String(imp.facilitiesAffected),
      sub: "PHCs + Anganwadis",
      icon: Hospital,
      color: "#f43f5e",
    },
    {
      label: "Assets Offline/Empty",
      value: String(imp.assetsFailed),
      sub: "Tanks drained, pumps off",
      icon: Layers,
      color: "#f59e0b",
    },
    {
      label: "Time to Critical",
      value: `${imp.timeToCriticalHours} hours`,
      sub: "Buffer time available",
      icon: Layers,
      color: "#a78bfa",
    },
  ];

  return (
    <div
      className="min-h-full px-4 sm:px-6 py-6"
      style={{ background: "#070b12", maxWidth: 1100, margin: "0 auto" }}
    >
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6">
        {(["impact", "criticality"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all"
            style={{
              background: tab === t ? "#141d2e" : "transparent",
              border: `1px solid ${tab === t ? "#06b6d4" : "#1e2d40"}`,
              color: tab === t ? "#06b6d4" : "#64748b",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
            }}
          >
            {t === "impact" ? <BarChart3 size={13} /> : <ShieldCheck size={13} />}
            {t === "impact" ? "Impact Dashboard" : "Criticality Ranking"}
          </button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={onNext}
            className="flex items-center gap-2 rounded-xl px-4 py-2"
            style={{
              background: "#06b6d4",
              color: "#0f172a",
              fontSize: 12,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(6,182,212,0.3)",
            }}
          >
            Compare Scenarios <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {tab === "impact" && (
        <div className="space-y-5 animate-fade-in">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {IMPACT_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  className="rounded-2xl p-4"
                  style={{ background: "#0f1623", border: "1px solid #1e2d40" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={13} style={{ color: c.color }} />
                    <span style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", fontWeight: 600 }}>
                      {c.label.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                    {c.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{c.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Resilience + Repair row */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Resilience score */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "#0f1623", border: "1px solid #1e2d40" }}
            >
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>
                NETWORK RESILIENCE SCORE
              </div>
              <div className="flex items-end gap-4">
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    color:
                      imp.resilienceScore > 0.6
                        ? "#22c55e"
                        : imp.resilienceScore > 0.35
                        ? "#f59e0b"
                        : "#ef4444",
                    lineHeight: 1,
                  }}
                >
                  {imp.resilienceScore.toFixed(2)}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        imp.resilienceScore > 0.6
                          ? "#22c55e"
                          : imp.resilienceScore > 0.35
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  >
                    {imp.resilienceScore > 0.6
                      ? "Resilient"
                      : imp.resilienceScore > 0.35
                      ? "Degraded"
                      : "Critical"}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569" }}>out of 1.0</div>
                </div>
              </div>
              <div className="h-2.5 rounded-full mt-3 overflow-hidden" style={{ background: "#141d2e" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${imp.resilienceScore * 100}%`,
                    background:
                      imp.resilienceScore > 0.6
                        ? "#22c55e"
                        : imp.resilienceScore > 0.35
                        ? "#f59e0b"
                        : "#ef4444",
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <div
                className="mt-4 rounded-xl p-3"
                style={{ background: "#0a1120", border: "1px solid #1e2d40", fontSize: 12, color: "#94a3b8" }}
              >
                {imp.summary}
              </div>
            </div>

            {/* Repair cost estimate */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "#0f1623", border: "1px solid #1e2d40" }}
            >
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>
                ESTIMATED RESTORATION COST
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                ₹{imp.repairCostMin}–{imp.repairCostMax}L
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                Based on MJP Schedule of Rates 2023-24 · Illustrative
              </div>

              <div className="space-y-2 mt-4">
                {Object.entries(scenario.affectedByCategory)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "#0a1120", border: "1px solid #1e2d40" }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{k}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#ffffff" }}>
                        {v} asset{v > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
              </div>

              <div
                className="mt-3 rounded-xl p-3"
                style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", fontSize: 11, color: "#7dd3fc" }}
              >
                <span style={{ fontWeight: 700 }}>Priority intervention:</span> {imp.criticalAsset}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "criticality" && (
        <div className="space-y-4 animate-fade-in">
          {/* Network cohesion headline */}
          <div
            className="rounded-2xl p-4 flex items-start gap-4"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <Info size={16} style={{ color: "#f87171", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5" }}>
                Network Cohesion: 0.41 / 1.0 — Fragile
              </div>
              <div style={{ fontSize: 11, color: "#fca5a5", opacity: 0.8, marginTop: 2 }}>
                Fiedler algebraic connectivity = 0.41. Values below 0.5 indicate the network is near-partition —
                one additional failure could split it into permanently disconnected components.
              </div>
            </div>
          </div>

          {/* Critical asset list */}
          <div className="grid md:grid-cols-2 gap-4">
            {CRITICAL_RANKING.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedCritId(selectedCritId === r.id ? null : r.id)}
                className="text-left rounded-2xl p-4 transition-all"
                style={{
                  background: selectedCritId === r.id ? "#141d2e" : "#0f1623",
                  border: `1px solid ${selectedCritId === r.id ? "#06b6d4" : "#1e2d40"}`,
                  cursor: "pointer",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background:
                        r.rank === 1 ? "#ef4444" : r.rank === 2 ? "rgba(239,68,68,0.2)" : "#141d2e",
                      fontSize: 13,
                      fontWeight: 900,
                      color: r.rank === 1 ? "#ffffff" : r.rank <= 3 ? "#ef4444" : "#64748b",
                    }}
                  >
                    {r.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>{r.label}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{r.type} · {r.populationAtRisk.toLocaleString()} at risk</div>

                    {/* Criticality bar */}
                    <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "#1e2d40" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.criticality}%`,
                          background: r.criticality > 80 ? "#ef4444" : r.criticality > 60 ? "#f59e0b" : "#22c55e",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Criticality {r.criticality}%</div>

                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>
                      {r.plainReason}
                    </div>
                  </div>
                </div>

                {selectedCritId === r.id && (
                  <div className="mt-4 space-y-2 animate-fade-in">
                    <div
                      className="rounded-lg p-2.5"
                      style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)", fontSize: 10, color: "#7dd3fc" }}
                    >
                      <span style={{ fontWeight: 700 }}>Technical: </span>{r.technicalReason}
                    </div>
                    <div
                      className="rounded-lg p-2.5 flex items-center justify-between"
                      style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981" }}>Intervention</div>
                        <div style={{ fontSize: 10, color: "#6ee7b7", marginTop: 1 }}>{r.interventionLabel}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "#10b981", whiteSpace: "nowrap" }}>
                        {r.interventionCost}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
