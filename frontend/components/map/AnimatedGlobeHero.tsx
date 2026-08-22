"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plane, Sparkles, MapPin, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AnimatedGlobeHero() {
  const destinations = [
    { name: "Paris", x: "25%", y: "30%", price: "$220/d", temp: "19°C" },
    { name: "Tokyo", x: "75%", y: "35%", price: "$210/d", temp: "21°C" },
    { name: "Rome", x: "32%", y: "55%", price: "$175/d", temp: "24°C" },
    { name: "Bali", x: "80%", y: "70%", price: "$85/d", temp: "29°C" },
    { name: "Zurich", x: "42%", y: "25%", price: "$310/d", temp: "16°C" },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center select-none">
      {/* Outer ambient glow circles */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/20 blur-3xl animate-pulse" />
      <div className="absolute inset-4 rounded-full border border-primary/20 animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-12 rounded-full border border-dashed border-secondary/20 animate-[spin_40s_linear_infinite_reverse]" />

      {/* Center 3D Simulated Globe Sphere */}
      <div className="relative h-[340px] w-[340px] md:h-[420px] md:w-[420px] rounded-full bg-gradient-to-br from-slate-900 via-blue-950 to-zinc-950 border border-primary/40 shadow-[0_0_80px_rgba(37,99,235,0.35)] overflow-hidden flex items-center justify-center">
        {/* World Grid Map Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:18px_18px] opacity-40 animate-[spin_120s_linear_infinite]" />

        {/* Continental Gradient Shapes */}
        <div className="absolute top-1/4 left-1/4 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-44 h-44 bg-sky-500/15 rounded-full blur-2xl" />

        {/* Orbit Flight Arc */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            stroke="url(#orbitGradient)"
            strokeWidth="1.5"
            strokeDasharray="8 8"
            className="animate-[spin_30s_linear_infinite]"
          />
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Flying Plane Indicator */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-full h-full flex items-center justify-start pointer-events-none"
        >
          <div className="h-9 w-9 -ml-3 rounded-full bg-white text-primary shadow-lg shadow-primary/40 flex items-center justify-center">
            <Plane className="h-5 w-5 rotate-45 stroke-[2.5]" />
          </div>
        </motion.div>

        {/* Center Logo Watermark */}
        <div className="z-10 text-center pointer-events-none">
          <div className="h-14 w-14 mx-auto rounded-3xl bg-gradient-to-tr from-primary to-accent p-0.5 shadow-xl shadow-primary/30 flex items-center justify-center text-white mb-2">
            <Compass className="h-8 w-8 animate-[spin_20s_linear_infinite]" />
          </div>
          <span className="text-xs font-extrabold tracking-widest uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            GlobeTrotter
          </span>
        </div>
      </div>

      {/* Floating Destination Glass Cards around Globe */}
      {destinations.map((dest, idx) => (
        <motion.div
          key={dest.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: idx * 0.7,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: dest.x,
            top: dest.y,
            transform: "translate(-50%, -50%)",
          }}
          className="z-20 hidden sm:block"
        >
          <div className="px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/40 dark:border-zinc-700/60 shadow-xl flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <p className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                {dest.name}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                {dest.temp} • {dest.price}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
