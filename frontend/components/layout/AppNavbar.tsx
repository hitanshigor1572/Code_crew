"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  DollarSign,
  Plus,
  Compass,
  Check,
  Plane,
  Heart,
  Settings,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { MOCK_USER } from "@/data/mock";

interface AppNavbarProps {
  onOpenAIAssistant?: () => void;
  onOpenCurrencyConverter?: () => void;
  onOpenMobileMenu?: () => void;
}

export function AppNavbar({
  onOpenAIAssistant,
  onOpenCurrencyConverter,
  onOpenMobileMenu,
}: AppNavbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notifications = [
    {
      id: "n1",
      title: "Paris Trip in 3 Weeks",
      desc: "Don't forget to finalize your Day 3 Versailles booking.",
      time: "10m ago",
      read: false,
      icon: Plane,
    },
    {
      id: "n2",
      title: "Flight Price Drop Alert",
      desc: "Tokyo flights dropped by 18% for October dates.",
      time: "2h ago",
      read: false,
      icon: DollarSign,
    },
    {
      id: "n3",
      title: "Elena Rostova accepted invite",
      desc: "Now collaborating on Paris Explorer & Riviera Escape.",
      time: "1d ago",
      read: true,
      icon: User,
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 md:px-8 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80">
      {/* Mobile Menu Button & Brand */}
      <div className="flex items-center gap-3 md:hidden">
        {onOpenMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileMenu}
            className="rounded-2xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GlobeTrotter
          </span>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search destinations, activities, or trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-11 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border-transparent focus-visible:border-primary focus-visible:bg-white dark:focus-visible:bg-zinc-950"
          />
        </form>
      </div>

      {/* Action Controls & Utilities */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Currency Converter Trigger */}
        {onOpenCurrencyConverter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCurrencyConverter}
            className="hidden sm:inline-flex rounded-2xl text-xs font-semibold gap-1.5 h-9"
          >
            <DollarSign className="h-3.5 w-3.5 text-accent" />
            <span>USD ($)</span>
          </Button>
        )}

        {/* AI Assistant Trigger */}
        {onOpenAIAssistant && (
          <Button
            variant="glass"
            size="sm"
            onClick={onOpenAIAssistant}
            className="rounded-2xl text-xs font-semibold gap-1.5 h-9 border-primary/20 text-primary dark:text-blue-400 hover:bg-primary/10"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
            <span className="hidden sm:inline">AI Copilot</span>
          </Button>
        )}

        {/* Plan Trip Quick CTA */}
        <Link href="/trips/create" className="hidden lg:inline-flex">
          <Button size="sm" className="rounded-2xl text-xs font-semibold gap-1.5 h-9">
            <Plus className="h-3.5 w-3.5" />
            <span>Plan Trip</span>
          </Button>
        </Link>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-2xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-zinc-950" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Notifications</span>
                <Badge variant="default" className="text-[10px] h-5 px-1.5">
                  2 New
                </Badge>
              </div>
              <button type="button" className="text-xs text-primary font-medium hover:underline">
                Mark all read
              </button>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`p-3.5 flex gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${
                      !n.read ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-zinc-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all trip alerts
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl text-zinc-600 dark:text-zinc-300"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4 mr-2 text-amber-500" /> Light Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4 mr-2 text-blue-500" /> Dark Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Settings className="h-4 w-4 mr-2" /> System Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                <AvatarFallback>{MOCK_USER.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl">
            <div className="px-2 py-1.5">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{MOCK_USER.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{MOCK_USER.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="h-4 w-4 mr-2 text-primary" /> Profile & Badges
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/trips" className="cursor-pointer">
                <Plane className="h-4 w-4 mr-2 text-secondary" /> My Trips
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <Heart className="h-4 w-4 mr-2 text-danger" /> Saved Wishlist
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="cursor-pointer text-danger focus:text-danger">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
