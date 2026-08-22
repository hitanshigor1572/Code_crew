import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-zinc-950">
      {/* Left Form Area (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GlobeTrotter
            </span>
          </Link>
        </div>

        <div className="my-auto py-8">
          <LoginForm />
        </div>

        <div className="text-xs text-zinc-400 text-center sm:text-left">
          © 2026 GlobeTrotter Inc. • Intelligent Travel Planning
        </div>
      </div>

      {/* Right Hero Image (7 cols) */}
      <div className="hidden lg:block lg:col-span-7 relative bg-zinc-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop&q=80"
          alt="Paris Travel View"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-16 left-16 right-16 text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Featured Itinerary: Paris & Riviera Odyssey</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            &quot;The most seamless travel workspace I&apos;ve ever used.&quot;
          </h2>
          <p className="text-sm text-zinc-300 max-w-lg">
            Plan multi-city stops, track real-time budgets, and share interactive route maps with friends worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}
