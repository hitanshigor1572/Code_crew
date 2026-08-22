"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  LayoutDashboard,
  PlaneTakeoff,
  PlusCircle,
  Sparkles,
  PieChart,
  Calendar,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MapPin,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/services/user.service";
import { UserProfile } from "@/types/user";

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAIAssistant?: () => void;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "My Trips",
    href: "/trips",
    icon: PlaneTakeoff,
    badge: "6",
  },
  {
    title: "Plan New Trip",
    href: "/trips/create",
    icon: PlusCircle,
    badge: "New",
    highlight: true,
  },
  {
    title: "Discover Cities",
    href: "/discover",
    icon: Compass,
    badge: null,
  },
  {
    title: "Activity Search",
    href: "/discover/activities",
    icon: MapPin,
    badge: null,
  },
  {
    title: "Budget & Spend",
    href: "/budget",
    icon: PieChart,
    badge: null,
  },
  {
    title: "Calendar Timeline",
    href: "/calendar",
    icon: Calendar,
    badge: null,
  },
  {
    title: "Profile & Badges",
    href: "/profile",
    icon: User,
    badge: "5",
  },
  {
    title: "Admin Analytics",
    href: "/admin",
    icon: ShieldCheck,
    badge: "Pro",
  },
];

export function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
  onOpenAIAssistant,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    getCurrentUser().then(setUser).catch(() => undefined);
  }, []);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-all duration-300 z-30 h-screen sticky top-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-5 border-b border-zinc-100 dark:border-zinc-800/60">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-md shadow-primary/20 text-white group-hover:scale-105 transition-transform">
            <Compass className="h-6 w-6 animate-[spin_12s_linear_infinite]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GlobeTrotter
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
                Intelligent Travel
              </span>
            </div>
          )}
        </Link>

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 no-scrollbar">
        {navItems.filter((item) => item.href !== "/admin" || user?.email.toLowerCase() === "jayprajapati3117@gmail.com").map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/trips/create" && item.href !== "/discover/activities");
          const Icon = item.icon;

          const content = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "text-primary dark:text-white bg-primary/10 dark:bg-primary/20 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-primary dark:text-primary-foreground" : "text-zinc-400 dark:text-zinc-500 group-hover:text-primary"
                )}
              />
              {!isCollapsed && (
                <span className="flex-1 truncate">{item.title}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    item.highlight
                      ? "bg-accent/20 text-accent dark:bg-accent/30 dark:text-teal-300"
                      : "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return content;
        })}

        {/* AI Travel Assistant Trigger */}
        {onOpenAIAssistant && (
          <div className="pt-3">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={onOpenAIAssistant}
                className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 dark:border-primary/30 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-bold text-xs">
                  <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                  <span>AI Travel Copilot</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Ask recommendations, itinerary tweaks & packing lists
                </p>
              </button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="glass"
                    size="icon"
                    onClick={onOpenAIAssistant}
                    className="w-full h-11 rounded-2xl text-primary hover:text-primary"
                  >
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">AI Travel Copilot</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/60">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-colors",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} />
            <AvatarFallback>{(user?.name || "User").substring(0, 2)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.name || "Loading profile..."}
              </span>
              <span className="text-xs text-zinc-400 truncate">
                {user?.location || "Update your profile"}
              </span>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
