"use client";
import { MapPinned, ChevronRight, Layers, ShieldCheck } from "lucide-react";

const PIPELINE_STEPS = [
  "JJM/IMIS Data → Real-coordinate Source-to-Tap Graph",
  "Dependency Inference + Confidence Scoring",
  "Failure Coupling (Pump/Power/Source/Pipe)",
  "Storage Draining & Waterfall Propagation",
  "Impact Analysis — Population, LPCD, Resilience",
  "Criticality Ranking — Time-to-criticality",
  "Scenario Comparison + Decision Report",
];

interface Step1Props {
  onLoad: () => void;
}

export default function Step1Landing({ onLoad }: Step1Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#070b12" }}
    >
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-start">

        {/* LEFT — hero text */}
        <div className="space-y-6 animate-slide-up">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.3)",
              fontSize: 10,
              color: "#06b6d4",
              letterSpacing: "0.12em",
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={12} />
            COMMAND-CENTER PROTOTYPE · FRONTEND DEMO
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#e2e8f0",
            }}
          >
            JalRakshak
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Water Resilience
            </span>
            <br />
            Digital Twin
          </h1>

          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#94a3b8", maxWidth: 480 }}>
            Model borewells, pumps, overhead tanks, and distribution zones as a{" "}
            <span style={{ color: "#e2e8f0" }}>single interdependent water network</span>.
            Introduce failures, watch storage drain round-by-round, identify
            bottlenecks, and test interventions — all from one map.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "25", l: "Infrastructure assets" },
              { k: "34", l: "Network links" },
              { k: "4",  l: "Cascade scenarios" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl p-3 text-center"
                style={{ background: "#0f1623", border: "1px solid #1e2d40" }}
              >
                <div style={{ fontSize: 22, fontWeight: 900, color: "#ffffff" }}>{s.k}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Location selector */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #1e2d40" }}>
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid #1e2d40", fontSize: 10, color: "#475569", letterSpacing: "0.12em", fontWeight: 700 }}
            >
              SELECT SCHEME TO LOAD DIGITAL TWIN
            </div>
            <div className="p-3 space-y-2" style={{ background: "#0f1623" }}>
              {/* Active district */}
              <button
                onClick={onLoad}
                className="w-full text-left rounded-xl p-4 transition-all group"
                style={{ background: "#141d2e", border: "1px solid #06b6d4" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(6,182,212,0.15)" }}
                    >
                      <MapPinned size={18} style={{ color: "#06b6d4" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                        Chakur Block
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        8,140 pop · Latur District, Maharashtra
                      </div>
                      <div style={{ fontSize: 10, color: "#06b6d4", marginTop: 2 }}>
                        25 assets · 34 links · JJM Scheme
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: "#06b6d4" }} />
                </div>
              </button>

              {/* Coming soon districts */}
              {[
                { name: "Nilanga Block", pop: "12,860 pop · Maharashtra", note: "Multi-village scheme" },
                { name: "Srirangapatna Taluk", pop: "9,120 pop · Karnataka", note: "Cauvery river corridor" },
              ].map((d) => (
                <div
                  key={d.name}
                  className="rounded-xl p-4 opacity-40"
                  style={{ background: "#0a1120", border: "1px solid #1e2d40" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ background: "#141d2e" }}
                    >
                      <MapPinned size={18} style={{ color: "#475569" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{d.pop}</div>
                      <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>
                        Calibrating data pipeline…
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="px-4 py-2"
              style={{ borderTop: "1px solid #1e2d40", fontSize: 10, color: "#334155" }}
            >
              All districts use identical pipeline · Same 11-stage architecture · Different population calibrations
            </div>
          </div>
        </div>

        {/* RIGHT — pipeline preview */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "#0f1623", border: "1px solid #1e2d40" }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#475569", fontWeight: 700 }}>
            SYSTEM PIPELINE
          </div>
          <div className="space-y-2">
            {PIPELINE_STEPS.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                style={{ background: "#0a1120", border: "1px solid #1e2d40" }}
              >
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(6,182,212,0.12)",
                    border: "1px solid rgba(6,182,212,0.25)",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#06b6d4",
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Judge callout */}
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>
              DEMO FLOW (2 minutes)
            </div>
            <div style={{ fontSize: 11, color: "#fcd34d", lineHeight: 1.6 }}>
              Select district → Inspect network → Correct 1 dependency → Pick failure → Watch cascade
              animate round-by-round → View impact + criticality → Compare scenarios → Generate report
            </div>
          </div>

          {/* Leaflet map mini-preview placeholder */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid #1e2d40", height: 140, background: "#070b12", position: "relative" }}
          >
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 6,
            }}>
              <Layers size={24} style={{ color: "#1e2d40" }} />
              <span style={{ fontSize: 10, color: "#334155", letterSpacing: "0.1em" }}>
                REAL MAP LOADS ON DISTRICT SELECT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
