"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Star,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe2,
  Layers,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedGlobeHero } from "@/components/map/AnimatedGlobeHero";
import { DestinationCard } from "@/components/trip/DestinationCard";
import { MOCK_CITIES, MOCK_TRIPS } from "@/data/mock";

export default function LandingPage() {
  const [searchDestination, setSearchDestination] = React.useState("");

  const stats = [
    { label: "Trips Planned", value: "120,000+", icon: Compass },
    { label: "Countries Explored", value: "94 Countries", icon: Globe2 },
    { label: "User Rating", value: "4.95 / 5.0", icon: Star },
    { label: "Travel Expenses Saved", value: "$3.4M+", icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: "Sophia Vance",
      role: "Solo Travel Photographer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      content:
        "GlobeTrotter feels like Notion met Google Maps and Airbnb. I planned my 14-day Japan rail tour in under 30 minutes without a single schedule overlap!",
      rating: 5,
      destination: "Japan Odyssey",
    },
    {
      name: "Marcus & Liam",
      role: "Digital Nomads & Founders",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      content:
        "The real-time currency converter, collaborative split-expense tracker, and interactive flight paths made our European road trip completely stress-free.",
      rating: 5,
      destination: "Swiss Alps & Riviera",
    },
    {
      name: "Aria Chen",
      role: "Family Travel Planner",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      content:
        "The AI Copilot generated customized kid-friendly morning schedules and booked our Colosseum tickets smoothly. Absolutely indispensable.",
      rating: 5,
      destination: "Rome & Amalfi Coast",
    },
  ];

  const faqs = [
    {
      question: "How does GlobeTrotter differ from regular travel apps?",
      answer:
        "GlobeTrotter is built as a complete intelligent workspace: combining Notion-style drag-and-drop daily schedules, animated Google Maps route visualizers, live Recharts budget tracking, and an AI Copilot for secret local recommendations.",
    },
    {
      question: "Can I collaborate with friends on a group trip?",
      answer:
        "Yes! You can invite co-travelers via email or a secure public link. Everyone can propose activity blocks, vote on hotels, and track split expenses in real time.",
    },
    {
      question: "Does GlobeTrotter work offline or support printing?",
      answer:
        "Absolutely. You can export complete printable PDF travel dossiers with QR codes, flight confirmation tags, hotel vouchers, and day-by-day maps.",
    },
    {
      question: "Is GlobeTrotter free for solo travelers?",
      answer:
        "Yes! Create unlimited trips, explore over 400+ mapped cities, build interactive timelines, and track your multi-currency budget for free.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-primary/20 selection:text-primary">
      <LandingNavbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background gradient ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/15 via-secondary/10 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Next-Gen Personalized Travel Architecture</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
              >
                The intelligent way to{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  plan, explore & budget
                </span>{" "}
                the world.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Blend the elegance of Notion, the visual luxury of Airbnb, and the route power of Google Maps. Build multi-city dream itineraries with live budget tracking and AI suggestions.
              </motion.p>

              {/* Floating Hero Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-2"
              >
                <div className="p-2 sm:p-3 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-2xl backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-2.5 max-w-xl mx-auto lg:mx-0">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-primary" />
                    <Input
                      type="text"
                      placeholder="Where do you want to explore? (e.g. Tokyo, Paris, Alps...)"
                      value={searchDestination}
                      onChange={(e) => setSearchDestination(e.target.value)}
                      className="pl-12 h-12 rounded-2xl border-transparent bg-transparent text-sm font-medium focus-visible:ring-0"
                    />
                  </div>
                  <Link href={searchDestination ? `/discover?q=${searchDestination}` : "/trips/create"}>
                    <Button className="w-full sm:w-auto h-12 px-6 rounded-2xl font-bold shadow-md shadow-primary/20 gap-2">
                      <span>Plan Your Trip</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Verified Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-2 text-xs font-semibold text-zinc-500"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free multi-city planner
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time expense breakdown
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Collaborative group sharing
                </span>
              </motion.div>
            </div>

            {/* Right Hero Globe Graphic (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <AnimatedGlobeHero />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-4 rounded-3xl">
                  <div className="h-10 w-10 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {s.value}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS */}
      <section id="destinations" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider mb-2">
                Curated Global Destinations
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Trending Escapes Across Continents
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                Explore handpicked cities with accurate daily budget indices, live weather, and must-see cultural highlights.
              </p>
            </div>

            <Link href="/discover">
              <Button variant="outline" className="rounded-2xl gap-2 font-semibold">
                <span>View All 16+ Cities</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CITIES.slice(0, 6).map((city) => (
              <DestinationCard key={city.id} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. ITINERARY BUILDER SHOWCASE (Notion + Google Maps Experience) */}
      <section id="itinerary" className="py-20 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="glass" className="text-xs text-white border-white/20">
              Flagship Innovation
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Drag-and-Drop Itinerary Architecture
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Experience the power of modular blocks. Add city stops, reorder activities, assign hotel vouchers, and track transit carbon footprint seamlessly.
            </p>
          </div>

          {/* Interactive Feature Mock UI */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 shadow-2xl backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Itinerary Blocks */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Paris & French Riviera (Sample 4-Day Plan)
                </span>
                <Badge variant="outline" className="text-xs font-mono text-zinc-300">
                  $3,400 Total Budget
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Paris • 4 Nights</h4>
                    <p className="text-xs text-zinc-400">Sep 12 – Sep 15 • Hôtel Pavillon de la Reine</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">Confirmed</Badge>
              </div>

              <div className="pl-6 py-1 border-l-2 border-dashed border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
                <span>🚄 High-speed TGV 1st Class (Paris → Nice) • 5h 40m</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-xl bg-secondary text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Nice & Riviera • 3 Nights</h4>
                    <p className="text-xs text-zinc-400">Sep 16 – Sep 18 • Hotel Le Negresco</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">Scheduled</Badge>
              </div>

              <div className="pt-2">
                <Link href="/trips/trip-paris-exp/builder">
                  <Button className="w-full rounded-2xl font-bold gap-2">
                    <span>Try Interactive Demo Builder</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 via-zinc-900 to-zinc-900 border border-primary/30 space-y-2">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Zero Scheduling Conflicts</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Automatic intelligent transit calculation ensures you never book conflicting flights, overlap hotel check-ins, or miss museum reservations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/20 via-zinc-900 to-zinc-900 border border-accent/30 space-y-2">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Live Budget Safety Cap</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Categorized expense trackers flag potential budget overruns across flights, stays, dining, and activities before they happen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS & COMMUNITY REVIEWS */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider">
              Traveler Reviews
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Loved by 120,000+ Explorers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card
                key={idx}
                className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                    &quot;{t.content}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{t.name}</p>
                      <p className="text-[11px] text-zinc-400">{t.role}</p>
                    </div>
                  </div>
                  <Badge variant="glass" className="text-[10px]">
                    {t.destination}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider">
              Common Questions
            </Badge>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left font-bold text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Build Your Next Unforgettable Itinerary?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join the modern travel era. Craft personalized stops, invite friends, and budget with confidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button size="lg" variant="glass" className="rounded-2xl font-extrabold text-sm px-8 text-zinc-900 dark:text-white bg-white/90 dark:bg-zinc-900/90 shadow-xl">
                Open GlobeTrotter Dashboard
              </Button>
            </Link>
            <Link href="/trips/create">
              <Button size="lg" className="rounded-2xl font-extrabold text-sm px-8 bg-zinc-900 text-white hover:bg-black shadow-xl">
                Plan New Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
