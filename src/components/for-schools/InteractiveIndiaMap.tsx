"use client";

import { useState } from "react";
import Image from "next/image";

export interface NetworkNode {
  id: string;
  name: string;
  region: "NORTH" | "WEST" | "SOUTH" | "EAST" | "CENTRAL" | "NORTH-EAST" | "ISLANDS";
  type: "primary" | "secondary" | "point";
  xPct: number;
  yPct: number;
}

export default function InteractiveIndiaMap() {
  const [activeNode, setActiveNode] = useState<NetworkNode | null>(null);

  const nodes: NetworkNode[] = [
    // NORTH
    { id: "delhi", name: "Delhi NCR", region: "NORTH", type: "primary", xPct: 38, yPct: 31 },
    { id: "chandigarh", name: "Chandigarh", region: "NORTH", type: "secondary", xPct: 34, yPct: 24 },
    { id: "jaipur", name: "Jaipur", region: "NORTH", type: "secondary", xPct: 31, yPct: 36 },
    { id: "lucknow", name: "Lucknow", region: "NORTH", type: "secondary", xPct: 47, yPct: 37 },
    { id: "dehradun", name: "Dehradun", region: "NORTH", type: "point", xPct: 40, yPct: 25 },
    { id: "shimla", name: "Shimla", region: "NORTH", type: "point", xPct: 37, yPct: 22 },
    { id: "srinagar", name: "Srinagar", region: "NORTH", type: "point", xPct: 30, yPct: 14 },

    // WEST
    { id: "mumbai", name: "Mumbai", region: "WEST", type: "primary", xPct: 26, yPct: 56 },
    { id: "pune", name: "Pune", region: "WEST", type: "secondary", xPct: 28, yPct: 60 },
    { id: "ahmedabad", name: "Ahmedabad", region: "WEST", type: "secondary", xPct: 22, yPct: 46 },
    { id: "surat", name: "Surat", region: "WEST", type: "point", xPct: 24, yPct: 52 },
    { id: "panaji", name: "Panaji (Goa)", region: "WEST", type: "point", xPct: 27, yPct: 69 },

    // SOUTH
    { id: "bengaluru", name: "Bengaluru", region: "SOUTH", type: "primary", xPct: 35, yPct: 76 },
    { id: "hyderabad", name: "Hyderabad", region: "SOUTH", type: "primary", xPct: 40, yPct: 62 },
    { id: "chennai", name: "Chennai", region: "SOUTH", type: "secondary", xPct: 43, yPct: 77 },
    { id: "kochi", name: "Kochi", region: "SOUTH", type: "secondary", xPct: 34, yPct: 85 },
    { id: "thiruvananthapuram", name: "Thiruvananthapuram", region: "SOUTH", type: "point", xPct: 35, yPct: 89 },
    { id: "mysuru", name: "Mysuru", region: "SOUTH", type: "point", xPct: 33, yPct: 79 },
    { id: "coimbatore", name: "Coimbatore", region: "SOUTH", type: "point", xPct: 36, yPct: 82 },

    // EAST
    { id: "kolkata", name: "Kolkata", region: "EAST", type: "primary", xPct: 66, yPct: 48 },
    { id: "bhubaneswar", name: "Bhubaneswar", region: "EAST", type: "secondary", xPct: 58, yPct: 55 },
    { id: "ranchi", name: "Ranchi", region: "EAST", type: "point", xPct: 56, yPct: 45 },
    { id: "patna", name: "Patna", region: "EAST", type: "secondary", xPct: 55, yPct: 39 },

    // CENTRAL
    { id: "bhopal", name: "Bhopal", region: "CENTRAL", type: "secondary", xPct: 38, yPct: 46 },
    { id: "raipur", name: "Raipur", region: "CENTRAL", type: "point", xPct: 48, yPct: 52 },
    { id: "nagpur", name: "Nagpur", region: "CENTRAL", type: "point", xPct: 40, yPct: 51 },
    { id: "indore", name: "Indore", region: "CENTRAL", type: "point", xPct: 32, yPct: 47 },

    // NORTH-EAST
    { id: "guwahati", name: "Guwahati", region: "NORTH-EAST", type: "primary", xPct: 80, yPct: 36 },
    { id: "shillong", name: "Shillong", region: "NORTH-EAST", type: "secondary", xPct: 81, yPct: 38 },
    { id: "agartala", name: "Agartala", region: "NORTH-EAST", type: "point", xPct: 79, yPct: 42 },
    { id: "aizawl", name: "Aizawl", region: "NORTH-EAST", type: "point", xPct: 83, yPct: 43 },
    { id: "imphal", name: "Imphal", region: "NORTH-EAST", type: "point", xPct: 87, yPct: 39 },
    { id: "kohima", name: "Kohima", region: "NORTH-EAST", type: "point", xPct: 88, yPct: 36 },
    { id: "itanagar", name: "Itanagar", region: "NORTH-EAST", type: "point", xPct: 87, yPct: 31 },
    { id: "gangtok", name: "Gangtok", region: "NORTH-EAST", type: "point", xPct: 73, yPct: 33 },

    // ISLANDS
    { id: "portblair", name: "Port Blair (A&N)", region: "ISLANDS", type: "secondary", xPct: 85, yPct: 84 },
    { id: "kavaratti", name: "Kavaratti (Lakshadweep)", region: "ISLANDS", type: "point", xPct: 22, yPct: 83 },
  ];

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] bg-slate-50 rounded-2xl border border-slate-200 p-2 sm:p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner">
      
      {/* Base Layer: Geographically Accurate SVG Map from /maps/india.svg */}
      <div className="relative w-full h-full max-w-[540px] max-h-[480px] flex items-center justify-center">
        <Image
          src="/maps/india.svg"
          alt="India Academic Network Map Base"
          width={540}
          height={500}
          className="w-full h-full object-contain opacity-75 filter drop-shadow-sm"
          priority
        />

        {/* Animated Connection Arcs (ONLY Primary Nodes Connected) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Delhi (38, 31) -> Mumbai (26, 56) */}
          <line x1="38" y1="31" x2="26" y2="56" stroke="#1E40AF" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.4" />
          {/* Delhi (38, 31) -> Kolkata (66, 48) */}
          <line x1="38" y1="31" x2="66" y2="48" stroke="#1E40AF" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.4" />
          {/* Mumbai (26, 56) -> Bengaluru (35, 76) */}
          <line x1="26" y1="56" x2="35" y2="76" stroke="#1E40AF" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.4" />
          {/* Bengaluru (35, 76) -> Hyderabad (40, 62) */}
          <line x1="35" y1="76" x2="40" y2="62" stroke="#10B981" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.5" />
          {/* Kolkata (66, 48) -> Guwahati (80, 36) */}
          <line x1="66" y1="48" x2="80" y2="36" stroke="#10B981" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.5" />
        </svg>

        {/* Multi-Tiered Network Node Overlay Markers */}
        {nodes.map((node) => {
          const isPrimary = node.type === "primary";
          const isSecondary = node.type === "secondary";
          const isSelected = activeNode?.id === node.id;

          return (
            <div
              key={node.id}
              style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 p-1"
              onMouseEnter={() => setActiveNode(node)}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => setActiveNode(node)}
            >
              {/* Primary Node Pulse */}
              {isPrimary && (
                <span className="absolute -inset-1 rounded-full bg-blue-600/30 animate-ping pointer-events-none" />
              )}
              {isSecondary && (
                <span className="absolute -inset-0.5 rounded-full bg-emerald-500/20 animate-pulse pointer-events-none" />
              )}

              {/* Marker Styling based on Hierarchy */}
              <span
                className={`relative block rounded-full transition-transform ${
                  isPrimary
                    ? "w-3 h-3 md:w-3.5 md:h-3.5 bg-blue-600 border-2 border-white shadow-md group-hover:scale-125"
                    : isSecondary
                    ? "w-2.5 h-2.5 bg-emerald-600 border border-white shadow-sm group-hover:scale-125"
                    : "w-2 h-2 sm:w-1.5 sm:h-1.5 bg-slate-600 border border-white group-hover:bg-blue-600 group-hover:scale-150"
                }`}
              />

              {/* Node City Label Badge (Visible across all screens for Primary & Secondary) */}
              {(isPrimary || isSecondary || isSelected) && (
                <span
                  className={`absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm pointer-events-none transition-all ${
                    isPrimary
                      ? "bg-white/95 text-slate-900 border-slate-300 shadow-sm group-hover:border-blue-500 group-hover:text-blue-700"
                      : isSelected
                      ? "bg-slate-900 text-white border-slate-700 shadow-md z-20"
                      : "bg-white/90 text-slate-700 border-slate-200"
                  }`}
                >
                  {node.name}
                </span>
              )}

              {/* Tooltip on Hover / Touch for All Nodes */}
              {isSelected && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-5 w-40 sm:w-44 bg-slate-900 text-white text-[10px] sm:text-[11px] p-2 rounded-xl shadow-xl border border-slate-700 z-30 pointer-events-none animate-fade-in text-center">
                  <span className="font-bold block text-blue-400 mb-0.5">{node.name}</span>
                  <span className="text-[10px] text-slate-300 block">{node.region} Region</span>
                  <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">Academic Participation Community</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Interactive Instruction Footnote */}
      <div className="w-full pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 border-t border-slate-200/60 mt-1">
        <span>💡 Tap any node on the map to inspect city academic details</span>
      </div>

    </div>
  );
}
