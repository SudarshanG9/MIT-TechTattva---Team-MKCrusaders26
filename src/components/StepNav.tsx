"use client";
import { Check, ChevronRight } from "lucide-react";

interface Step {
  n: number;
  label: string;
  sublabel: string;
}

const STEPS: Step[] = [
  { n: 1, label: "Select Location",    sublabel: "Load district" },
  { n: 2, label: "Explore Network",    sublabel: "Inspect assets" },
  { n: 3, label: "Review Dependencies",sublabel: "Correct inferences" },
  { n: 4, label: "Introduce Failure",  sublabel: "Choose scenario" },
  { n: 5, label: "Simulate Cascade",   sublabel: "Watch propagation" },
  { n: 6, label: "Impact & Criticality",sublabel: "Analyse effects" },
  { n: 7, label: "Compare & Report",   sublabel: "Export findings" },
];

interface StepNavProps {
  currentStep: number;
  onStepClick?: (n: number) => void;
}

export default function StepNav({ currentStep, onStepClick }: StepNavProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: "rgba(11,16,28,0.95)", borderColor: "#1e2d40", backdropFilter: "blur(12px)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 border-b"
        style={{ borderColor: "#1e2d40" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}
          >
            <span style={{ color: "#06b6d4", fontSize: 16 }}>⬡</span>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#06b6d4", fontWeight: 700 }}>
              VARUNA
            </div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: -2 }}>
              Infrastructure Resilience Digital Twin • Srirangapatna Taluk
            </div>
          </div>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "#10b981", animation: "pulseAmber 2s infinite" }}
          />
          <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: "0.08em" }}>
            LIVE PROTOTYPE
          </span>
        </div>
      </div>

      {/* Step stepper */}
      <div className="px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {STEPS.map((step, idx) => {
            const isDone    = currentStep > step.n;
            const isActive  = currentStep === step.n;
            const isFuture  = currentStep < step.n;

            return (
              <div key={step.n} className="flex items-center">
                <button
                  onClick={() => isDone && onStepClick?.(step.n)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    cursor: isDone ? "pointer" : "default",
                    background: isActive ? "rgba(6,182,212,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(6,182,212,0.3)" : "1px solid transparent",
                  }}
                >
                  {/* Circle */}
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isDone
                        ? "#06b6d4"
                        : isActive
                        ? "#06b6d4"
                        : "#1e2d40",
                      border: isFuture ? "1px solid #334155" : "none",
                    }}
                  >
                    {isDone ? (
                      <Check size={11} color="#0f172a" strokeWidth={3} />
                    ) : (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: isActive ? "#0f172a" : "#475569",
                        }}
                      >
                        {step.n}
                      </span>
                    )}
                  </div>
                  {/* Label — hidden on small screens except active */}
                  <div className={isActive ? "block" : "hidden sm:block"}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isDone ? "#64748b" : isActive ? "#e2e8f0" : "#475569",
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step.label}
                    </div>
                  </div>
                </button>
                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <ChevronRight
                    size={13}
                    style={{ color: isDone ? "#06b6d4" : "#1e2d40", margin: "0 2px", flexShrink: 0 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
