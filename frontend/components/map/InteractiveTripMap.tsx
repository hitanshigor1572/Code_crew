"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Plane, Compass, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { CityStop } from "@/types/trip";
import { Badge } from "@/components/ui/badge";

interface InteractiveTripMapProps {
  stops: CityStop[];
  activeStopIndex?: number;
  onSelectStop?: (index: number) => void;
}

export function InteractiveTripMap({
  stops = [],
  activeStopIndex = 0,
  onSelectStop,
}: InteractiveTripMapProps) {
  // SVG coordinates for world map projection points
  const points = stops.map((stop, idx) => {
    // Relative coordinates mapping for visually pleasing curved layout
    const x = 120 + idx * 180;
    const y = 140 + (idx % 2 === 0 ? -40 : 50);
    return { ...stop, x, y };
  });

  return (
    <div className="relative w-full h-[380px] md:h-[440px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-zinc-950 border border-zinc-800 shadow-2xl p-6 flex flex-col justify-between select-none">
      {/* Background Map Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Map Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="glass" className="text-xs px-3 py-1 font-bold text-white bg-white/10 border-white/20">
            <Compass className="h-3.5 w-3.5 mr-1.5 text-secondary animate-[spin_8s_linear_infinite]" />
            Live Route Visualizer
          </Badge>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
            {stops.length} Waypoints Connected
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-1 rounded-2xl">
          <button type="button" className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" title="Satellite Layer">
            <Layers className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" title="Zoom In">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" title="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-2">
        <svg
          viewBox="0 0 700 280"
          className="w-full h-full max-h-[280px] overflow-visible"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Route Curved Lines between stops */}
          {points.map((p, idx) => {
            if (idx === points.length - 1) return null;
            const nextP = points[idx + 1];
            const midX = (p.x + nextP.x) / 2;
            const midY = (p.y + nextP.y) / 2 - 40;
            const pathD = `M ${p.x} ${p.y} Q ${midX} ${midY} ${nextP.x} ${nextP.y}`;

            return (
              <g key={`path-${idx}`}>
                {/* Glow under-layer */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="6"
                  opacity="0.3"
                  filter="url(#glow)"
                />
                {/* Dashed animated stroke line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-[dash_20s_linear_infinite]"
                />
              </g>
            );
          })}

          {/* Render Waypoint Nodes & Pulsing Pins */}
          {points.map((p, idx) => {
            const isActive = idx === activeStopIndex;

            return (
              <g
                key={`node-${p.id || idx}`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectStop && onSelectStop(idx)}
              >
                {/* Outer pulsing beacon ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 22 : 14}
                  className={isActive ? "fill-primary/20 animate-ping" : "fill-sky-500/10"}
                />

                {/* Main Node Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 12 : 9}
                  className={isActive ? "fill-primary stroke-white stroke-2" : "fill-slate-800 stroke-sky-400 stroke-2"}
                />

                {/* Stop Order Number */}
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  className="text-[10px] font-extrabold fill-white pointer-events-none"
                >
                  {idx + 1}
                </text>

                {/* Destination Label Pill */}
                <g transform={`translate(${p.x - 50}, ${p.y + 18})`}>
                  <rect
                    width="100"
                    height="24"
                    rx="12"
                    className={
                      isActive
                        ? "fill-primary stroke-white/40 stroke-1 shadow-lg"
                        : "fill-zinc-900/90 stroke-zinc-700 stroke-1"
                    }
                  />
                  <text
                    x="50"
                    y="16"
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-white pointer-events-none"
                  >
                    {p.cityName}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Route Quick Selector */}
      <div className="relative z-10 flex items-center justify-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {stops.map((stop, idx) => (
          <button
            key={stop.id || idx}
            type="button"
            onClick={() => onSelectStop && onSelectStop(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              idx === activeStopIndex
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-zinc-900/70 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <span className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span>{stop.cityName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
