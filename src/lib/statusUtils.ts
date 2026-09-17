import type { NodeStatus, NodeType } from "../data/nodes";

export function statusToClasses(status: NodeStatus): {
  iconBg: string;
  iconBorder: string;
  labelBg: string;
  labelBorder: string;
  labelText: string;
  glow: string;
  pinClass: string;
} {
  switch (status) {
    case "operational":
      return {
        iconBg: "#0f172a",
        iconBorder: "#334155",
        labelBg: "rgba(15,23,42,0.9)",
        labelBorder: "#334155",
        labelText: "#94a3b8",
        glow: "none",
        pinClass: "status-operational",
      };
    case "stressed":
      return {
        iconBg: "rgba(245,158,11,0.2)",
        iconBorder: "#f59e0b",
        labelBg: "#f59e0b",
        labelBorder: "#fbbf24",
        labelText: "#111827",
        glow: "0 0 18px rgba(245,158,11,0.6)",
        pinClass: "status-stressed",
      };
    case "failed":
      return {
        iconBg: "#ef4444",
        iconBorder: "#f87171",
        labelBg: "#ef4444",
        labelBorder: "#f87171",
        labelText: "#ffffff",
        glow: "0 0 24px rgba(239,68,68,0.9)",
        pinClass: "status-failed",
      };
    case "isolated":
      return {
        iconBg: "#1f2937",
        iconBorder: "#374151",
        labelBg: "#1f2937",
        labelBorder: "#374151",
        labelText: "#9ca3af",
        glow: "0 0 10px rgba(107,114,128,0.4)",
        pinClass: "status-isolated",
      };
  }
}

export function statusToLabel(status: NodeStatus): string {
  switch (status) {
    case "operational": return "Operational";
    case "stressed":    return "Stressed";
    case "failed":      return "Failed";
    case "isolated":    return "Isolated";
  }
}

export function statusToBadgeStyle(status: NodeStatus): React.CSSProperties {
  switch (status) {
    case "operational":
      return { background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" };
    case "stressed":
      return { background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.4)" };
    case "failed":
      return { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" };
    case "isolated":
      return { background: "rgba(107,114,128,0.15)", color: "#9ca3af", border: "1px solid rgba(107,114,128,0.3)" };
  }
}

export function typeToColor(type: NodeType): string {
  switch (type) {
    case "source":     return "#3b82f6";
    case "pump":       return "#f59e0b";
    case "feeder":     return "#facc15";
    case "tank":       return "#0ea5e9";
    case "zone":       return "#94a3b8";
    case "village":    return "#38bdf8";
    case "school":     return "#a78bfa";
    case "anganwadi":  return "#f472b6";
    case "phc":        return "#f43f5e";
  }
}

export function typeToLabel(type: NodeType): string {
  switch (type) {
    case "source":     return "Source";
    case "pump":       return "Pump House";
    case "feeder":     return "Power Feeder";
    case "tank":       return "Storage Tank";
    case "zone":       return "Pipeline Zone";
    case "village":    return "Village";
    case "school":     return "School";
    case "anganwadi":  return "Anganwadi";
    case "phc":        return "PHC";
  }
}
