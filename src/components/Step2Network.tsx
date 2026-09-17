"use client";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { NODES, type InfraNode, type NodeStatus } from "../data/nodes";
import { EDGES } from "../data/edges";
import { typeToColor, typeToLabel, statusToLabel, statusToBadgeStyle } from "../lib/statusUtils";
import { Crosshair, ArrowRight, ChevronRight, Info } from "lucide-react";

// Leaflet must not SSR
const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface Step2Props {
  onNext: () => void;
}

const LEGEND_ITEMS = [
  { color: "#3b82f6", label: "Source" },
  { color: "#f59e0b", label: "Pump House" },
  { color: "#facc15", label: "Feeder" },
  { color: "#0ea5e9", label: "Tank" },
  { color: "#94a3b8", label: "Pipeline" },
  { color: "#38bdf8", label: "Village" },
  { color: "#f43f5e", label: "PHC" },
];

export default function Step2Network({ onNext }: Step2Props) {
  const [selectedId, setSelectedId] = useState<string | null>("BW1");
  const [readyToAdvance, setReadyToAdvance] = useState(false);

  const selectedNode = NODES.find((n) => n.id === selectedId);
  const connectedEdges = EDGES.filter((e) => e.from === selectedId || e.to === selectedId);

  // After 5 seconds, allow advancing
  useState(() => {
    const t = setTimeout(() => setReadyToAdvance(true), 3500);
    return () => clearTimeout(t);
  });

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setReadyToAdvance(true);
  }, []);

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 110px)", background: "#070b12" }}>
      <div className="flex flex-1 overflow-hidden">

        {/* Map — fills most of the space */}
        <div className="flex-1 relative">
          <MapView
            liveStatus={{}}
            selectedId={selectedId}
            onNodeSelect={handleSelect}
            highlightIds={["BW1", "T1"]}
          />

          {/* Floating legend */}
          <div
            className="absolute left-3 bottom-12 rounded-xl px-3 py-2.5 hidden sm:block"
            style={{ background: "rgba(11,16,28,0.92)", border: "1px solid #1e2d40", backdropFilter: "blur(8px)", zIndex: 500 }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.1em" }}>
              ASSET TYPES
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {LEGEND_ITEMS.map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: l.color }} />
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #1e2d40", marginTop: 8, paddingTop: 6, display: "flex", gap: 12 }}>
              <div className="flex items-center gap-1.5">
                <span style={{ display: "block", width: 14, height: 2, background: "#475569" }} />
                <span style={{ fontSize: 9, color: "#64748b" }}>Physical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ display: "block", width: 14, borderTop: "2px dashed #334155" }} />
                <span style={{ fontSize: 9, color: "#64748b" }}>Dependency</span>
              </div>
            </div>
          </div>

          {/* Top-right call-outs */}
          <div
            className="absolute top-3 left-3 rounded-xl px-3 py-2 sm:hidden"
            style={{ background: "rgba(11,16,28,0.9)", border: "1px solid #1e2d40", zIndex: 500 }}
          >
            <span style={{ fontSize: 11, color: "#94a3b8" }}>Tap any node to inspect</span>
          </div>
          <div
            className="absolute top-3 right-3 flex flex-col gap-2"
            style={{ zIndex: 500, maxWidth: 220 }}
          >
            <div
              className="rounded-xl px-3 py-2"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: "#f87171" }}>💧 BW1 — Sole source</span>
              <div style={{ fontSize: 10, color: "#fca5a5", marginTop: 2 }}>Entire scheme depends on it</div>
            </div>
            <div
              className="rounded-xl px-3 py-2"
              style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)" }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fde047" }}>⚡ T1 — Powers main pump</span>
              <div style={{ fontSize: 10, color: "#fef08a", marginTop: 2 }}>Frequent tripping history</div>
            </div>
          </div>
        </div>

        {/* Right panel — Asset Inspector */}
        <aside
          className="hidden lg:flex flex-col"
          style={{ width: 300, borderLeft: "1px solid #1e2d40", background: "#0b1120", flexShrink: 0 }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: "1px solid #1e2d40" }}
          >
            <Crosshair size={13} style={{ color: "#06b6d4" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.06em" }}>
              ASSET INSPECTOR
            </span>
            <span style={{ fontSize: 10, color: "#475569", marginLeft: "auto" }}>click any node</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedNode ? (
              <>
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "#0f172a",
                      border: `2px solid ${typeToColor(selectedNode.type)}`,
                    }}
                  >
                    <span style={{ color: typeToColor(selectedNode.type), fontSize: 16 }}>●</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
                      {selectedNode.label}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                      {selectedNode.description}
                    </div>
                    <div
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 mt-1.5"
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: typeToColor(selectedNode.type),
                        border: `1px solid ${typeToColor(selectedNode.type)}40`,
                        background: `${typeToColor(selectedNode.type)}15`,
                      }}
                    >
                      {typeToLabel(selectedNode.type).toUpperCase()} · {selectedNode.capacity}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ background: "#0f172a", border: "1px solid #1e2d40" }}
                  >
                    <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", marginBottom: 4 }}>STATUS</div>
                    <div
                      className="inline-flex rounded-full px-2 py-0.5"
                      style={{ fontSize: 10, fontWeight: 700, ...statusToBadgeStyle("operational") }}
                    >
                      OPERATIONAL
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-2.5"
                    style={{ background: "#0f172a", border: "1px solid #1e2d40" }}
                  >
                    <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", marginBottom: 4 }}>CRITICALITY</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#ffffff" }}>
                      {selectedNode.criticality}%
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden mt-1"
                      style={{ background: "#1e2d40" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${selectedNode.criticality}%`,
                          background:
                            selectedNode.criticality > 80
                              ? "#ef4444"
                              : selectedNode.criticality > 60
                              ? "#f59e0b"
                              : "#22c55e",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Criticality reason */}
                <div
                  className="rounded-xl p-2.5"
                  style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
                >
                  <div style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700, marginBottom: 3 }}>
                    WHY IT MATTERS
                  </div>
                  <div style={{ fontSize: 11, color: "#fcd34d", lineHeight: 1.5 }}>
                    {selectedNode.criticalityReason}
                  </div>
                </div>

                {/* Connected assets */}
                <div>
                  <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", marginBottom: 6 }}>
                    CONNECTED ASSETS
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {connectedEdges.slice(0, 8).map((e, i) => {
                      const otherId = e.from === selectedId ? e.to : e.from;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedId(otherId)}
                          className="rounded-full px-2 py-1 text-left transition-opacity hover:opacity-80"
                          style={{
                            fontSize: 10,
                            fontFamily: "monospace",
                            background: e.kind !== "pipe" ? "rgba(6,182,212,0.1)" : "#141d2e",
                            border: `1px ${e.kind !== "pipe" ? "dashed" : "solid"} ${
                              e.kind !== "pipe" ? "rgba(6,182,212,0.3)" : "#1e2d40"
                            }`,
                            color: e.kind !== "pipe" ? "#06b6d4" : "#94a3b8",
                          }}
                        >
                          {otherId}
                          <span style={{ opacity: 0.5, fontSize: 9 }}>
                            {" "}· {e.kind !== "pipe" ? (e.label ?? "dep") : "pipe"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Provenance */}
                <div
                  className="rounded-xl p-2.5"
                  style={{ background: "#0a1120", border: "1px solid #1e2d40" }}
                >
                  <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", marginBottom: 3 }}>
                    DATA PROVENANCE
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      background:
                        selectedNode.provenance === "measured"
                          ? "rgba(34,197,94,0.1)"
                          : selectedNode.provenance === "inferred-low"
                          ? "rgba(245,158,11,0.1)"
                          : "rgba(6,182,212,0.1)",
                      color:
                        selectedNode.provenance === "measured"
                          ? "#22c55e"
                          : selectedNode.provenance === "inferred-low"
                          ? "#f59e0b"
                          : "#06b6d4",
                      border: `1px solid ${
                        selectedNode.provenance === "measured"
                          ? "rgba(34,197,94,0.3)"
                          : "rgba(245,158,11,0.3)"
                      }`,
                    }}
                  >
                    {selectedNode.provenance === "measured"
                      ? "✓ Confirmed — JJM IMIS + GIS"
                      : selectedNode.provenance === "inferred-low"
                      ? "⚠ Inferred — review pending"
                      : "~ Inferred — high confidence"}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "#334155", fontSize: 13, paddingTop: 40 }}>
                <Info size={24} style={{ margin: "0 auto 8px", color: "#1e2d40" }} />
                Select an asset on the map
              </div>
            )}
          </div>

          {/* Advance button */}
          <div className="p-4" style={{ borderTop: "1px solid #1e2d40" }}>
            <button
              onClick={onNext}
              className="w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all"
              style={{
                background: readyToAdvance ? "#06b6d4" : "#1e2d40",
                color: readyToAdvance ? "#0f172a" : "#334155",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.06em",
                border: "none",
                cursor: readyToAdvance ? "pointer" : "not-allowed",
                boxShadow: readyToAdvance ? "0 0 20px rgba(6,182,212,0.35)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <ArrowRight size={14} />
              REVIEW DEPENDENCIES
            </button>
            <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 6 }}>
              {readyToAdvance ? "2 inferred dependencies need your review" : "Explore the network first…"}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile bottom bar */}
      <div
        className="lg:hidden p-3"
        style={{ borderTop: "1px solid #1e2d40", background: "#0b1120" }}
      >
        <button
          onClick={onNext}
          className="w-full rounded-xl py-3 flex items-center justify-center gap-2"
          style={{
            background: "#06b6d4", color: "#0f172a",
            fontSize: 12, fontWeight: 800, border: "none",
          }}
        >
          Review Dependencies <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
