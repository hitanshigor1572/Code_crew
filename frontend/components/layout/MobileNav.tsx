"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlaneTakeoff,
  Plus,
  Compass,
  User,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Trips",
      href: "/trips",
      icon: PlaneTakeoff,
    },
    {
      title: "Create",
      href: "/trips/create",
      icon: Plus,
      isCenter: true,
    },
    {
      title: "Discover",
      href: "/discover",
      icon: Compass,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-200/80 dark:border-zinc-800/80 px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/trips/create");
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="h-13 w-13 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-lg shadow-primary/30 group-active:scale-95 transition-transform flex items-center justify-center">
                  <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white">
                    <Plus className="h-6 w-6 stroke-[2.5]" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-primary mt-1">Plan</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "text-primary dark:text-white font-bold"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive ? "scale-110 text-primary dark:text-white" : ""
                )}
              />
              <span className="text-[10px] font-medium tracking-tight">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
