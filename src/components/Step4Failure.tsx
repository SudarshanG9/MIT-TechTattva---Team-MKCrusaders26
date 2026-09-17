"use client";
import { Construction, Zap, Droplets, Bomb } from "lucide-react";
import { SCENARIOS } from "../data/scenarios";

interface Step4Props {
  onSelect: (scenarioKey: string) => void;
}

const SCENARIO_CARDS = [
  {
    key: "feeder_t1",
    icon: Zap,
    tagline: "11kV feeder T1 trips — P1 loses power",
    severity: "High",
    severityColor: "#f97316",
    cardBorder: "rgba(249,115,22,0.35)",
    cardBg: "rgba(249,115,22,0.06)",
    iconBg: "rgba(249,115,22,0.12)",
    iconColor: "#fb923c",
    recommendation: true,
  },
  {
    key: "pipeline_pz3",
    icon: Construction,
    tagline: "Burst in PZ3 central distribution pipe",
    severity: "Medium",
    severityColor: "#0ea5e9",
    cardBorder: "rgba(14,165,233,0.35)",
    cardBg: "rgba(14,165,233,0.06)",
    iconBg: "rgba(14,165,233,0.12)",
    iconColor: "#38bdf8",
    recommendation: false,
  },
  {
    key: "source_bw1",
    icon: Droplets,
    tagline: "BW1 yield drops to 35% of rated",
    severity: "Critical",
    severityColor: "#a78bfa",
    cardBorder: "rgba(167,139,250,0.35)",
    cardBg: "rgba(167,139,250,0.06)",
    iconBg: "rgba(167,139,250,0.12)",
    iconColor: "#c4b5fd",
    recommendation: false,
  },
  {
    key: "worstcase",
    icon: Bomb,
    tagline: "Simultaneous T1 trip AND P2 failure",
    severity: "Critical",
    severityColor: "#dc2626",
    cardBorder: "rgba(220,38,38,0.5)",
    cardBg: "rgba(220,38,38,0.08)",
    iconBg: "rgba(220,38,38,0.15)",
    iconColor: "#ef4444",
    recommendation: false,
  },
];

export default function Step4Failure({ onSelect }: Step4Props) {
  return (
    <div
      className="min-h-full flex flex-col items-center justify-start px-4 py-8"
      style={{ background: "#070b12" }}
    >
      <div className="w-full max-w-3xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", fontSize: 10, color: "#f87171", fontWeight: 700, letterSpacing: "0.1em" }}
          >
            STEP 4 — INTRODUCE FAILURE
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Choose a Failure Scenario
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", maxWidth: 480, margin: "0 auto" }}>
            Select a failure type to simulate. The cascade engine will propagate effects round-by-round
            through the interdependent network.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {SCENARIO_CARDS.map((card) => {
            const scenario = SCENARIOS[card.key];
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                onClick={() => onSelect(card.key)}
                className="text-left rounded-2xl p-5 transition-all group"
                style={{
                  background: card.cardBg,
                  border: `1px solid ${card.cardBorder}`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${card.cardBorder}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: card.iconBg }}
                  >
                    <Icon size={18} style={{ color: card.iconColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#ffffff", lineHeight: 1.3 }}>
                        {scenario.label}
                        {card.recommendation && (
                          <span
                            className="inline-flex ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold align-middle"
                            style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}
                          >
                            START HERE
                          </span>
                        )}
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full shrink-0"
                        style={{ fontSize: 9, fontWeight: 700, color: card.severityColor, background: `${card.severityColor}20`, border: `1px solid ${card.severityColor}40` }}
                      >
                        {card.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>
                      {card.tagline}
                    </div>
                  </div>
                </div>

                {/* Projected impact — shown before running */}
                <div
                  className="mt-4 grid grid-cols-3 gap-2"
                >
                  {[
                    { label: "No Water", value: scenario.impact.populationWithoutWater.toLocaleString() },
                    { label: "Hours (Max)", value: String(scenario.impact.timeToCriticalHours) },
                    { label: "Resilience", value: scenario.impact.resilienceScore.toFixed(2) },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg p-2 text-center"
                      style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#ffffff" }}>{m.value}</div>
                      <div style={{ fontSize: 9, color: "#475569" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-3 rounded-lg px-3 py-2"
                  style={{ background: "rgba(0,0,0,0.2)", fontSize: 10, color: "#64748b", lineHeight: 1.5 }}
                >
                  {scenario.impact.summary}
                </div>

                <div
                  className="mt-3 w-full rounded-lg py-2 text-center font-bold transition-colors"
                  style={{ fontSize: 11, color: card.iconColor, background: card.iconBg, border: `1px solid ${card.cardBorder}` }}
                >
                  Simulate →
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 10, color: "#334155", textAlign: "center" }}>
          All scenarios use pre-computed, deterministic cascades — no solver latency. Results are
          reproducible for demo and review.
        </div>
      </div>
    </div>
  );
}
