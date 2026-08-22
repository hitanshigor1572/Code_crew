"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Compass, Sun, Moon, Sparkles, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto rounded-3xl border border-white/20 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-2xl px-5 sm:px-6 h-16 flex items-center justify-between shadow-glass dark:shadow-glass-dark transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Compass className="h-6 w-6 animate-[spin_16s_linear_infinite]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            GlobeTrotter
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          <Link href="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#destinations" className="hover:text-primary transition-colors">
            Destinations
          </Link>
          <Link href="#itinerary" className="hover:text-primary transition-colors">
            Itinerary Demo
          </Link>
          <Link href="#testimonials" className="hover:text-primary transition-colors">
            Reviews
          </Link>
          <Link href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Right CTA & Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 rounded-2xl text-zinc-600 dark:text-zinc-300"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/login">
            <Button variant="ghost" className="rounded-2xl text-xs font-bold px-4">
              Sign In
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="rounded-2xl text-xs font-bold px-5 shadow-md shadow-primary/20 gap-1.5">
              <span>Start Planning</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-10 w-10 rounded-2xl"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 p-5 rounded-3xl border border-white/20 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl flex flex-col gap-3">
          <Link
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Features
          </Link>
          <Link
            href="#destinations"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Destinations
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            FAQ
          </Link>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full rounded-2xl">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded-2xl">Start Planning</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
