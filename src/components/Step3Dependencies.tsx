"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { NODES } from "../data/nodes";
import { EDGES, REVIEW_EDGES } from "../data/edges";
import { AlertTriangle, Check, Edit3, ArrowRight, RefreshCw, ChevronDown } from "lucide-react";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface DepCorrection {
  edgeIndex: number;
  confirmed: boolean;
  correctedTo: string | null; // node ID if corrected, null if confirmed-as-is
}

interface Step3Props {
  onNext: (corrections: DepCorrection[]) => void;
}

const CORRECTION_OPTIONS: Record<string, { id: string; label: string }[]> = {
  // P1's power source — correction = T2
  "P1->T1": [
    { id: "T1", label: "T1 — 11kV Feeder 1 (current inference)" },
    { id: "T2", label: "T2 — 11kV Feeder 2 (South) ← Correct (shared breaker)" },
  ],
  // OHT2's backup supply — correction = P1 (no backup)
  "OHT2->P2": [
    { id: "P2", label: "P2 — South Booster (current inference)" },
    { id: "P1", label: "P1 — Main Pump House ← Correct (sole supply)" },
  ],
};

export default function Step3Dependencies({ onNext }: Step3Props) {
  const [calibrationScore, setCalibrationScore] = useState(71);
  const [corrections, setCorrections] = useState<DepCorrection[]>(
    REVIEW_EDGES.map((_, i) => ({ edgeIndex: i, confirmed: false, correctedTo: null }))
  );
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const edge1 = REVIEW_EDGES[0]; // P1 → T1
  const edge2 = REVIEW_EDGES[1]; // OHT2 → P2

  const allDone = corrections.every((c) => c.confirmed);

  function handleConfirm(idx: number) {
    setCorrections((prev) => prev.map((c, i) => i === idx ? { ...c, confirmed: true } : c));
    setCalibrationScore((s) => Math.min(s + 3, 88));
  }

  function handleCorrect(idx: number, newId: string) {
    setCorrections((prev) =>
      prev.map((c, i) =>
        i === idx ? { ...c, confirmed: true, correctedTo: newId } : c
      )
    );
    setCalibrationScore((s) => Math.min(s + 6, 88));
    setShowDropdown(null);
  }

  // Build live status — highlight the edges being reviewed
  const liveStatus = {};

  const reviewEdges = [edge1, edge2];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 110px)", background: "#070b12" }}>
      <div className="flex flex-1 overflow-hidden">

        {/* Map — dimmed slightly */}
        <div className="flex-1 relative" style={{ opacity: 0.8 }}>
          <MapView
            liveStatus={liveStatus}
            selectedId={null}
            onNodeSelect={() => {}}
            highlightIds={["P1", "T1", "T2", "OHT2", "P2"]}
          />
          {/* Dim overlay */}
          <div
            style={{
              position: "absolute", inset: 0,
              background: "rgba(7,11,18,0.35)",
              pointerEvents: "none", zIndex: 400,
            }}
          />
        </div>

        {/* Right panel — correction UI */}
        <aside
          className="flex flex-col"
          style={{ width: 360, borderLeft: "1px solid #1e2d40", background: "#0b1120", flexShrink: 0 }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-start gap-3"
            style={{ borderBottom: "1px solid #1e2d40" }}
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
            >
              <AlertTriangle size={14} style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>
                2 Inferred Dependencies Need Review
              </div>
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                System used proximity inference. Please confirm or correct.
              </div>
            </div>
          </div>

          {/* Calibration score */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid #1e2d40", background: "rgba(6,182,212,0.05)" }}
          >
            <div>
              <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", fontWeight: 700 }}>
                SYSTEM CALIBRATION SCORE
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>
                Improves as you correct inferences
              </div>
            </div>
            <div
              key={calibrationScore}
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#06b6d4",
                animation: "calibrationTick 0.3s ease",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {calibrationScore}%
            </div>
          </div>

          {/* Dependency items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {reviewEdges.map((edge, idx) => {
              const fromNode = NODES.find((n) => n.id === edge.from)!;
              const toNode = NODES.find((n) => n.id === edge.to)!;
              const correction = corrections[idx];
              const edgeKey = `${edge.from}->${edge.to}`;
              const options = CORRECTION_OPTIONS[edgeKey] ?? [];

              return (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: correction.confirmed
                      ? "1px solid rgba(16,185,129,0.4)"
                      : "1px solid rgba(245,158,11,0.3)",
                    background: correction.confirmed
                      ? "rgba(16,185,129,0.05)"
                      : "rgba(245,158,11,0.05)",
                  }}
                >
                  {/* Status bar */}
                  <div
                    className="px-3 py-2 flex items-center justify-between"
                    style={{
                      background: correction.confirmed
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(245,158,11,0.1)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: correction.confirmed ? "#10b981" : "#f59e0b",
                      }}
                    >
                      {correction.confirmed
                        ? correction.correctedTo
                          ? "✓ CORRECTED — USER CONFIRMED"
                          : "✓ CONFIRMED AS-IS"
                        : "⚠ AWAITING REVIEW"}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "#475569",
                        background: "rgba(245,158,11,0.15)",
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {edge.confidence === "inferred-low" ? "68% confident" : "85% confident"}
                    </span>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* The edge */}
                    <div className="flex items-center gap-2">
                      <div
                        className="rounded-lg px-2 py-1.5 text-center"
                        style={{ background: "#141d2e", border: "1px solid #1e2d40", minWidth: 50 }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#06b6d4" }}>
                          {fromNode.shortLabel}
                        </div>
                        <div style={{ fontSize: 8, color: "#475569" }}>{fromNode.type}</div>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ borderTop: "1px dashed #334155", position: "relative" }}>
                          <span
                            style={{
                              position: "absolute",
                              top: -9,
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontSize: 8,
                              color: "#475569",
                              background: "#0b1120",
                              padding: "0 4px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {edge.label}
                          </span>
                        </div>
                        {correction.correctedTo && (
                          <div style={{ fontSize: 9, color: "#10b981", marginTop: 8, fontWeight: 700 }}>
                            → corrected to {correction.correctedTo}
                          </div>
                        )}
                      </div>
                      <div
                        className="rounded-lg px-2 py-1.5 text-center"
                        style={{
                          background: correction.correctedTo ? "rgba(16,185,129,0.1)" : "#141d2e",
                          border: `1px solid ${correction.correctedTo ? "rgba(16,185,129,0.4)" : "#1e2d40"}`,
                          minWidth: 50,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: correction.correctedTo ? "#10b981" : "#94a3b8",
                          }}
                        >
                          {correction.correctedTo ?? toNode.shortLabel}
                        </div>
                        <div style={{ fontSize: 8, color: "#475569" }}>{correction.correctedTo ? "corrected" : toNode.type}</div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div
                      className="rounded-lg px-2.5 py-2"
                      style={{ background: "#0a1120", border: "1px solid #1e2d40" }}
                    >
                      <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>
                        {edge.reviewReason}
                      </div>
                    </div>

                    {/* Action buttons */}
                    {!correction.confirmed && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirm(idx)}
                          className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5 transition-colors hover:opacity-80"
                          style={{ background: "#141d2e", border: "1px solid #334155", fontSize: 11, fontWeight: 700, color: "#94a3b8" }}
                        >
                          <Check size={12} /> Confirm
                        </button>
                        <div className="relative flex-1">
                          <button
                            onClick={() => setShowDropdown(showDropdown === idx ? null : idx)}
                            className="w-full rounded-lg py-2 flex items-center justify-center gap-1.5 transition-colors hover:opacity-80"
                            style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", fontSize: 11, fontWeight: 700, color: "#06b6d4" }}
                          >
                            <Edit3 size={12} /> Correct <ChevronDown size={10} />
                          </button>
                          {showDropdown === idx && (
                            <div
                              className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50"
                              style={{ background: "#141d2e", border: "1px solid #1e2d40", minWidth: 220, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                            >
                              {options.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => handleCorrect(idx, opt.id)}
                                  className="w-full text-left px-3 py-2.5 transition-colors hover:bg-slate-800"
                                  style={{ fontSize: 11, color: opt.id !== toNode.id ? "#10b981" : "#94a3b8", display: "block" }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {correction.confirmed && (
                      <div
                        className="rounded-lg py-2 flex items-center justify-center gap-1.5"
                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", fontSize: 11, color: "#10b981", fontWeight: 700 }}
                      >
                        <Check size={12} /> Dependency {correction.correctedTo ? "corrected" : "confirmed"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Info note */}
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)" }}
            >
              <div style={{ fontSize: 10, color: "#06b6d4", fontWeight: 700, marginBottom: 4 }}>
                WHY THIS MATTERS
              </div>
              <div style={{ fontSize: 11, color: "#7dd3fc", lineHeight: 1.5 }}>
                A misassigned power or pump dependency means a village's cascade path is wrong — leading to incorrect
                criticality rankings. Corrections like this are logged to the Calibration Engine and improve
                system accuracy over time.
              </div>
            </div>
          </div>

          {/* Advance */}
          <div className="p-4" style={{ borderTop: "1px solid #1e2d40" }}>
            <button
              onClick={() => allDone && onNext(corrections)}
              className="w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all"
              style={{
                background: allDone ? "#06b6d4" : "#1e2d40",
                color: allDone ? "#0f172a" : "#334155",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.06em",
                border: "none",
                cursor: allDone ? "pointer" : "not-allowed",
                boxShadow: allDone ? "0 0 20px rgba(6,182,212,0.35)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <ArrowRight size={14} />
              INTRODUCE FAILURE
            </button>
            <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 6 }}>
              {allDone
                ? "Dependencies locked — network graph updated"
                : `Review ${corrections.filter((c) => !c.confirmed).length} remaining item(s)`}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
