"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import { SCENARIOS } from "../data/scenarios";
import { computeLiveStatus, getTotalRounds } from "../lib/cascadeEngine";
import { ArrowRight, Activity, Play, CheckCircle2 } from "lucide-react";
import type { NodeStatus } from "../data/nodes";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface Step5Props {
  scenarioKey: string;
  onNext: (finalStatus: Record<string, NodeStatus>) => void;
}

export default function Step5Cascade({ scenarioKey, onNext }: Step5Props) {
  const scenario = SCENARIOS[scenarioKey];
  const totalRounds = getTotalRounds(scenarioKey);

  const [simRound, setSimRound] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const liveStatus = computeLiveStatus(scenarioKey, simRound);

  const startCascade = useCallback(() => {
    if (isRunning || isComplete) return;
    setIsRunning(true);
    setSimRound(0);

    let round = 0;
    intervalRef.current = setInterval(() => {
      round += 1;
      if (round >= totalRounds) {
        clearInterval(intervalRef.current!);
        setSimRound(totalRounds - 1);
        setIsRunning(false);
        setIsComplete(true);
      } else {
        setSimRound(round);
      }
    }, 1200);
  }, [isRunning, isComplete, totalRounds]);

  // Auto-scroll timeline
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [simRound]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const statusCounts = Object.values(liveStatus).reduce(
    (acc, s) => {
      acc[s as NodeStatus] = (acc[s as NodeStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<NodeStatus, number>
  );

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 110px)", background: "#070b12" }}>
      <div className="flex flex-1 overflow-hidden">

        {/* Map hero */}
        <div className="flex-1 relative">
          <MapView
            liveStatus={liveStatus}
            selectedId={null}
            onNodeSelect={() => {}}
            isRunning={isRunning}
          />

          {/* Top banner — cascade info */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-xl px-4 py-2.5"
            style={{
              background: "rgba(11,16,28,0.95)",
              border: isComplete
                ? "1px solid rgba(16,185,129,0.4)"
                : isRunning
                ? "1px solid rgba(6,182,212,0.4)"
                : "1px solid #1e2d40",
              backdropFilter: "blur(12px)",
              zIndex: 500,
              boxShadow: isRunning ? "0 0 20px rgba(6,182,212,0.2)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {isRunning ? (
              <>
                <Activity size={14} style={{ color: "#06b6d4", animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
                  {scenario.cascade[simRound]?.round} — {scenario.cascade[simRound]?.title ?? ""}
                </span>
              </>
            ) : isComplete ? (
              <>
                <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>
                  CASCADE STABILISED — {scenario.impact.populationWithoutWater.toLocaleString()} people without water
                </span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: "#475569" }}>
                {scenario.label} — Press RUN CASCADE to animate
              </span>
            )}
          </div>

          {/* Status pill counters */}
          {Object.keys(liveStatus).length > 0 && (
            <div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2"
              style={{ zIndex: 500 }}
            >
              {([
                { s: "failed" as NodeStatus, color: "#ef4444", label: "Failed" },
                { s: "stressed" as NodeStatus, color: "#f59e0b", label: "Stressed" },
                { s: "isolated" as NodeStatus, color: "#6b7280", label: "Isolated" },
              ] as const).map(({ s, color, label }) =>
                statusCounts[s] ? (
                  <div
                    key={s}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{ background: `${color}20`, border: `1px solid ${color}50` }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>{statusCounts[s]} {label}</span>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Right — timeline panel */}
        <aside
          className="flex flex-col"
          style={{ width: 340, borderLeft: "1px solid #1e2d40", background: "#0b1120", flexShrink: 0 }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid #1e2d40" }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.06em" }}>
              CASCADE TIMELINE
            </div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
              {scenario.label} · {totalRounds} stages
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 py-2" style={{ borderBottom: "1px solid #1e2d40" }}>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em" }}>PROGRESS</span>
              <span style={{ fontSize: 9, color: "#64748b" }}>
                {simRound < 0 ? 0 : simRound + 1} / {totalRounds} stages
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#1e2d40" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${simRound < 0 ? 0 : ((simRound + 1) / totalRounds) * 100}%`,
                  background: isComplete
                    ? "#10b981"
                    : "linear-gradient(90deg, #06b6d4, #3b82f6)",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* Timeline feed */}
          <div ref={timelineRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {simRound < 0 ? (
              <div style={{ textAlign: "center", color: "#334155", fontSize: 12, paddingTop: 30 }}>
                Press RUN CASCADE to start the simulation
              </div>
            ) : (
              scenario.cascade.slice(0, simRound + 1).map((step, stepIdx) => (
                <div
                  key={stepIdx}
                  className="rounded-xl p-3"
                  style={{
                    background:
                      stepIdx === simRound && isRunning
                        ? "rgba(6,182,212,0.1)"
                        : "#0a1120",
                    border: `1px solid ${
                      stepIdx === simRound && isRunning
                        ? "rgba(6,182,212,0.3)"
                        : "#1e2d40"
                    }`,
                    animation: "cascadeReveal 0.4s ease",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          stepIdx === simRound && isRunning ? "#06b6d4" : "#1e2d40",
                        fontSize: 9,
                        fontWeight: 800,
                        color: stepIdx === simRound && isRunning ? "#0f172a" : "#475569",
                        whiteSpace: "nowrap",
                        padding: "0 4px",
                      }}
                    >
                      {step.round}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color:
                          stepIdx === simRound && isRunning ? "#06b6d4" : "#e2e8f0",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.title}
                    </span>
                    {stepIdx === simRound && isRunning && (
                      <span
                        className="ml-auto h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: "#06b6d4", animation: "pulseAmber 1s infinite" }}
                      />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {step.events.map((ev) => (
                      <div key={ev.nodeId} className="flex items-start gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0"
                          style={{
                            background:
                              ev.next === "failed"
                                ? "#ef4444"
                                : ev.next === "stressed"
                                ? "#f59e0b"
                                : ev.next === "isolated"
                                ? "#6b7280"
                                : "#22c55e",
                          }}
                        />
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", fontFamily: "monospace" }}>
                            {ev.nodeId}
                          </span>
                          <span style={{ fontSize: 10, color: "#475569" }}> — {ev.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Controls */}
          <div className="p-4 space-y-3" style={{ borderTop: "1px solid #1e2d40" }}>
            {!isComplete && !isRunning && (
              <button
                onClick={startCascade}
                className="w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2"
                style={{
                  background: "#06b6d4",
                  color: "#0f172a",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  border: "none",
                  boxShadow: "0 0 24px rgba(6,182,212,0.45)",
                  cursor: "pointer",
                }}
              >
                <Play size={16} /> RUN CASCADE
              </button>
            )}

            {isRunning && (
              <div
                className="w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2"
                style={{ background: "#141d2e", border: "1px solid #1e2d40", fontSize: 13, fontWeight: 700, color: "#475569" }}
              >
                <Activity size={16} style={{ animation: "spin 1s linear infinite" }} /> SIMULATING…
              </div>
            )}

            {isComplete && (
              <>
                <div
                  className="rounded-xl px-4 py-3 flex items-center justify-center gap-2"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.35)", fontSize: 12, fontWeight: 700, color: "#10b981" }}
                >
                  <CheckCircle2 size={14} /> {totalRounds}-stage cascade complete
                </div>
                <button
                  onClick={() => onNext(scenario.finalStatus)}
                  className="w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2"
                  style={{
                    background: "#06b6d4",
                    color: "#0f172a",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    border: "none",
                    boxShadow: "0 0 20px rgba(6,182,212,0.35)",
                    cursor: "pointer",
                  }}
                >
                  <ArrowRight size={14} /> VIEW IMPACT & CRITICALITY
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
