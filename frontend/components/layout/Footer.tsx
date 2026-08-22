import * as React from "react";
import Link from "next/link";
import { Compass, Heart, Github, Twitter, Instagram, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Compass className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GlobeTrotter
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              The intelligent, personalized travel planner designed for modern nomads, couples, families, and wanderers seeking effortless multi-stop adventures.
            </p>

            {/* Newsletter */}
            <div className="pt-2 space-y-2 max-w-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Get weekly curated destination guides
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 rounded-2xl text-xs bg-zinc-100 dark:bg-zinc-900 border-transparent"
                />
                <Button className="h-11 rounded-2xl text-xs font-bold px-4 shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-primary transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link href="/trips/create" className="hover:text-primary transition-colors">
                  Itinerary Builder
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-primary transition-colors">
                  City Explorer
                </Link>
              </li>
              <li>
                <Link href="/budget" className="hover:text-primary transition-colors">
                  Budget Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Top Destinations
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <li>
                <Link href="/discover?q=Tokyo" className="hover:text-primary transition-colors">
                  Tokyo, Japan
                </Link>
              </li>
              <li>
                <Link href="/discover?q=Paris" className="hover:text-primary transition-colors">
                  Paris, France
                </Link>
              </li>
              <li>
                <Link href="/discover?q=Zurich" className="hover:text-primary transition-colors">
                  Swiss Alps
                </Link>
              </li>
              <li>
                <Link href="/discover?q=Rome" className="hover:text-primary transition-colors">
                  Rome, Italy
                </Link>
              </li>
              <li>
                <Link href="/discover?q=Bali" className="hover:text-primary transition-colors">
                  Bali, Indonesia
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <li>
                <Link href="/shared/gt-share-paris-7749" className="hover:text-primary transition-colors">
                  Public Itinerary
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Admin Analytics
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  User Badges
                </Link>
              </li>
              <li>
                <span className="text-zinc-400 text-xs">Privacy Policy</span>
              </li>
              <li>
                <span className="text-zinc-400 text-xs">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for global travelers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
