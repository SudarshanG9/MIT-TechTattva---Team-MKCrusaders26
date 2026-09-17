"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { NODES, type InfraNode, type NodeStatus, type NodeType } from "../data/nodes";
import { EDGES } from "../data/edges";
import { statusToClasses, typeToColor } from "../lib/statusUtils";

// Node type icons (SVG paths as strings for DivIcon)
function getTypeIcon(type: NodeType, color: string, size = 16): string {
  const icons: Record<NodeType, string> = {
    source:     `<circle cx="12" cy="12" r="8" stroke="${color}" stroke-width="1.5" fill="none"/><path d="M12 16v-4m-2-2h4" stroke="${color}" stroke-width="1.5"/>`,
    pump:       `<path d="M12 2v20m-5-5l5 5 5-5m-5-15L7 7m5-5l5 5" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    feeder:     `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    tank:       `<ellipse cx="12" cy="6" rx="8" ry="3" stroke="${color}" stroke-width="1.5" fill="none"/><path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    zone:       `<path d="M4 12h16M12 4v16" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`,
    village:    `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    school:     `<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="${color}" stroke-width="1.5" fill="none"/><path d="M6 12v5c3.33 1.67 8.67 1.67 12 0v-5" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    anganwadi:  `<circle cx="12" cy="8" r="4" stroke="${color}" stroke-width="1.5" fill="none"/><path d="M6 20v-4a6 6 0 0 1 12 0v4" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    phc:        `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="${color}" stroke-width="1.5" fill="none"/><line x1="12" y1="11" x2="12" y2="17" stroke="${color}" stroke-width="1.5"/><line x1="9" y1="14" x2="15" y2="14" stroke="${color}" stroke-width="1.5"/>`,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">${icons[type]}</svg>`;
}

interface MapViewProps {
  liveStatus: Record<string, NodeStatus>;
  selectedId: string | null;
  onNodeSelect: (id: string) => void;
  highlightIds?: string[];
  isRunning?: boolean;
}

export default function MapView({
  liveStatus,
  selectedId,
  onNodeSelect,
  highlightIds = [],
  isRunning = false,
}: MapViewProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const markersRef = useRef<Record<string, any>>({});
  const polylinesRef = useRef<any[]>([]);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let L: typeof import("leaflet");

    async function init() {
      L = (await import("leaflet")).default;

      // Fix default icon path issue in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "",
        iconUrl: "",
        shadowUrl: "",
      });

      const map = L.map(containerRef.current!, {
        center: [17.925, 76.802],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      // Carto Dark Matter — no API key needed
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      mapRef.current = map;

      // Draw edges
      drawEdges(L, map);
      // Draw nodes
      drawNodes(L, map);

      setReady(true);
    }

    init();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  function drawEdges(L: any, map: LeafletMap) {
    // Remove old
    polylinesRef.current.forEach((p) => p.remove());
    polylinesRef.current = [];

    EDGES.forEach((edge) => {
      const fromNode = NODES.find((n) => n.id === edge.from);
      const toNode = NODES.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isDep = edge.kind === "power" || edge.kind === "service";
      const isReview = !!edge.surfaceForReview;

      const color = isDep
        ? isReview ? "#f59e0b" : "#334155"
        : "#475569";

      const poly = L.polyline(
        [[fromNode.lat, fromNode.lng], [toNode.lat, toNode.lng]],
        {
          color,
          weight: isDep ? 1.2 : 1.5,
          opacity: isDep ? 0.7 : 0.5,
          dashArray: isDep ? "5,4" : undefined,
          className: `edge-${edge.kind}`,
        }
      ).addTo(map);

      polylinesRef.current.push(poly);
    });
  }

  function buildPinHTML(node: InfraNode, status: NodeStatus, isSelected: boolean, isHighlighted: boolean): string {
    const sc = statusToClasses(status);
    const color = status === "operational" ? typeToColor(node.type) : "#ffffff";
    const iconSvg = getTypeIcon(node.type, color, 14);
    const sizeClass = ["source", "tank", "phc"].includes(node.type) ? "38px" : ["pump", "feeder"].includes(node.type) ? "36px" : "32px";

    const ring = isSelected
      ? "outline:2px solid #06b6d4;outline-offset:3px;"
      : isHighlighted
      ? "outline:2px solid #fde047;outline-offset:3px;"
      : "";

    const labelStyle = `
      background:${sc.labelBg};
      color:${sc.labelText};
      border:1px solid ${sc.labelBorder};
      font-size:8px;font-weight:700;padding:1px 5px;
      border-radius:4px;white-space:nowrap;
      backdrop-filter:blur(4px);
    `;

    return `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;">
        <div class="node-pin-icon ${sc.pinClass}" style="
          width:${sizeClass};height:${sizeClass};
          background:${sc.iconBg};
          border-color:${sc.iconBorder};
          box-shadow:${sc.glow};
          ${ring}
        ">
          ${iconSvg}
        </div>
        <span style="${labelStyle}">${node.shortLabel}</span>
      </div>
    `;
  }

  function drawNodes(L: any, map: LeafletMap) {
    NODES.forEach((node) => {
      const status: NodeStatus = (liveStatus[node.id] as NodeStatus) || "operational";
      const isSelected = selectedId === node.id;
      const isHighlighted = highlightIds.includes(node.id);

      const icon = L.divIcon({
        className: "",
        html: buildPinHTML(node, status, isSelected, isHighlighted),
        iconSize: [40, 50],
        iconAnchor: [20, 50],
      });

      const marker = L.marker([node.lat, node.lng], { icon, zIndexOffset: isSelected ? 1000 : 0 })
        .addTo(map)
        .on("click", () => onNodeSelect(node.id));

      markersRef.current[node.id] = marker;
    });
  }

  // Update markers when status or selection changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      const map = mapRef.current!;

      NODES.forEach((node) => {
        const marker = markersRef.current[node.id];
        if (!marker) return;

        const status: NodeStatus = (liveStatus[node.id] as NodeStatus) || "operational";
        const isSelected = selectedId === node.id;
        const isHighlighted = highlightIds.includes(node.id);

        const icon = L.divIcon({
          className: "",
          html: buildPinHTML(node, status, isSelected, isHighlighted),
          iconSize: [40, 50],
          iconAnchor: [20, 50],
        });

        marker.setIcon(icon);
        marker.setZIndexOffset(isSelected ? 1000 : 0);
      });
    }

    updateMarkers();
  }, [liveStatus, selectedId, highlightIds, ready]);

  // Update edge colours based on live status
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    polylinesRef.current.forEach((poly, idx) => {
      const edge = EDGES[idx];
      if (!edge) return;

      const fromStatus = liveStatus[edge.from];
      const toStatus = liveStatus[edge.to];
      const isActive =
        (fromStatus === "failed" || fromStatus === "stressed" ||
         toStatus === "failed" || toStatus === "stressed") &&
        Object.keys(liveStatus).length > 0;

      const isDep = edge.kind === "power" || edge.kind === "service";

      if (isActive) {
        poly.setStyle({
          color: isDep ? "#06b6d4" : "#f59e0b",
          weight: isDep ? 1.8 : 2.2,
          opacity: 0.95,
          dashArray: isDep ? "6,3" : undefined,
        });
      } else if (isDep && edge.surfaceForReview) {
        poly.setStyle({ color: "#f59e0b", weight: 1.2, opacity: 0.7, dashArray: "5,4" });
      } else if (isDep) {
        poly.setStyle({ color: "#334155", weight: 1.2, opacity: 0.7, dashArray: "5,4" });
      } else {
        poly.setStyle({ color: "#475569", weight: 1.5, opacity: 0.5, dashArray: undefined });
      }
    });
  }, [liveStatus, ready]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#070b12" }}
    />
  );
}
