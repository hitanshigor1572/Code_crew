"use client";

import * as React from "react";
import { Globe2, Mountain, MapPin, Coins, UtensilsCrossed, Award, Sparkles } from "lucide-react";
import { AchievementBadge } from "@/types/user";
import { formatDate } from "@/lib/utils";

interface BadgeListProps {
  badges: AchievementBadge[];
}

const iconMap: Record<string, any> = {
  Globe2,
  Mountain,
  MapPin,
  Coins,
  UtensilsCrossed,
};

const tierColors: Record<string, { bg: string; text: string; border: string }> = {
  bronze: { bg: "from-amber-700/20 to-amber-900/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-700/30" },
  silver: { bg: "from-slate-300/30 to-slate-400/20", text: "text-slate-600 dark:text-slate-300", border: "border-slate-400/40" },
  gold: { bg: "from-amber-400/20 to-yellow-500/20", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-400/40" },
  platinum: { bg: "from-cyan-400/20 to-blue-500/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-400/40" },
};

export function BadgeList({ badges }: BadgeListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => {
        const IconComponent = iconMap[badge.icon] || Award;
        const style = tierColors[badge.tier] || tierColors.gold;

        return (
          <div
            key={badge.id}
            className={`p-4 rounded-3xl border ${style.border} bg-gradient-to-br ${style.bg} backdrop-blur-sm relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`h-12 w-12 rounded-2xl bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center ${style.text} shrink-0`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                    {badge.tier}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {formatDate(badge.unlockedAt)}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate mt-0.5">
                  {badge.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
