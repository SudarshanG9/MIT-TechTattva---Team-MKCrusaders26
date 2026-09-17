"use client";
import { useState, useEffect } from "react";
import StepNav from "../components/StepNav";
import Step1Landing from "../components/Step1Landing";
import Step2Network from "../components/Step2Network";
import Step3Dependencies from "../components/Step3Dependencies";
import Step4Failure from "../components/Step4Failure";
import Step5Cascade from "../components/Step5Cascade";
import Step6Impact from "../components/Step6Impact";
import Step7Report from "../components/Step7Report";
import ReportPanel from "../components/ReportPanel";
import type { NodeStatus } from "../data/nodes";

export default function Home() {
  const [step, setStep] = useState(1);
  const [scenarioKey, setScenarioKey] = useState("bridge_b1");
  const [finalStatus, setFinalStatus] = useState<Record<string, NodeStatus>>({});
  const [showReport, setShowReport] = useState(false);

  // Loading state when transitioning from Step 1 → Step 2
  const [loading, setLoading] = useState(false);

  function handleLoadDistrict() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  }

  function handleSelectScenario(key: string) {
    setScenarioKey(key);
    setStep(5);
  }

  function handleCascadeComplete(status: Record<string, NodeStatus>) {
    setFinalStatus(status);
    setStep(6);
  }

  // Ensure Leaflet CSS is not tree-shaken (belt-and-suspenders)
  useEffect(() => {
    // Leaflet CSS is already imported in globals.css via @import
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#070b12" }}>
      {/* Report overlay */}
      {showReport && (
        <ReportPanel scenarioKey={scenarioKey} onClose={() => setShowReport(false)} />
      )}

      {/* Step navigator (hidden on step 1 — landing page) */}
      {step > 1 && (
        <StepNav
          currentStep={step}
          onStepClick={(n) => {
            // Allow navigating back to completed steps
            if (n < step) setStep(n);
          }}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ background: "#070b12" }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid #1e2d40",
              borderTop: "3px solid #06b6d4",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <div style={{ fontSize: 13, color: "#06b6d4", fontWeight: 700, letterSpacing: "0.08em" }}>
            LOADING SRIRANGAPATNA TALUK
          </div>
          <div style={{ fontSize: 10, color: "#334155" }}>
            Fusing OSM · Census · PMGSY · PMGSY road network…
          </div>
        </div>
      )}

      {/* Step content */}
      {!loading && (
        <main>
          {step === 1 && <Step1Landing onLoad={handleLoadDistrict} />}

          {step === 2 && (
            <Step2Network onNext={() => setStep(3)} />
          )}

          {step === 3 && (
            <Step3Dependencies
              onNext={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <Step4Failure onSelect={handleSelectScenario} />
          )}

          {step === 5 && (
            <Step5Cascade
              scenarioKey={scenarioKey}
              onNext={handleCascadeComplete}
            />
          )}

          {step === 6 && (
            <Step6Impact
              scenarioKey={scenarioKey}
              finalStatus={finalStatus}
              onNext={() => setStep(7)}
            />
          )}

          {step === 7 && (
            <Step7Report
              scenarioKey={scenarioKey}
              onReport={() => setShowReport(true)}
            />
          )}
        </main>
      )}

      {/* CSS spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
