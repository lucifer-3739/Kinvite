/*
THESIS: A sleek, high-fidelity SaaS dashboard visual world for invitations that replaces standard static landing pages with an interactive customizer playground.
OWN-WORLD: Deep charcoal slate grounds, subtle grid background patterns, glowing glassmorphic card boundaries, and Outfit display typography.
STORY: Visitors instantly configure a mock invitation and preview it on a dynamic phone mockup, driving them to create a free account.
FIRST VIEWPORT: Left: Large bold heading and primary CTAs. Right: An interactive live-preview phone frame floating above a tech grid.
FORM: Sleek Modern SaaS & Tech-Forward layout using Outfit/Inter typography, dark mode default, and subtle glowing micro-animations.
*/

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ClipboardCheck,
  DollarSign,
  Home,
  Info,
  LayoutTemplate,
  Mail,
  Palette,
  PenLine,
  Play,
  Rocket,
  Send,
  Share2,
  Smartphone,
  Sparkles,
  Heart,
  Sun,
  Moon,
  ChevronRight,
  X,
  Check,
  Loader2,
  MousePointer,
  Pen,
  Calendar,
  MapPin,
  Clock,
  Sparkle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeLandingPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isLoggedIn = !!session;

  // Theme Management
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Interactive Sandboxes states
  const [mockEventTitle, setMockEventTitle] = useState("Emma & Nathan's Wedding");
  const [mockAccent, setMockAccent] = useState("amber");
  const [mockTheme, setMockTheme] = useState("Sunset Gold");
  const [mockDate, setMockDate] = useState("December 18, 2026");
  const [mockLocation, setMockLocation] = useState("The Grand Pavilion, CA");

  // Mock RSVP Guest States
  const [mockGuests, setMockGuests] = useState([
    { name: "Mom", relation: "Family", status: "confirmed" },
    { name: "Aryan", relation: "Friend", status: "pending" },
    { name: "Sister", relation: "Family", status: "confirmed" },
    { name: "Tom", relation: "Colleague", status: "declined" }
  ]);

  // Billing states
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  useEffect(() => {
    // Sync theme on mount
    const savedTheme = localStorage.getItem("kinvite-theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("kinvite-theme", nextTheme);
  };

  const toggleGuestStatus = (index: number) => {
    setMockGuests(prev =>
      prev.map((g, i) => {
        if (i !== index) return g;
        const nextStatus =
          g.status === "confirmed"
            ? "pending"
            : g.status === "pending"
            ? "declined"
            : "confirmed";
        return { ...g, status: nextStatus };
      })
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Accent mapping helper
  const getAccentColorClass = (accent: string) => {
    switch (accent) {
      case "emerald":
        return "text-emerald-400 border-emerald-500 bg-emerald-500/10";
      case "indigo":
        return "text-indigo-400 border-indigo-500 bg-indigo-500/10";
      case "rose":
        return "text-rose-400 border-rose-500 bg-rose-500/10";
      case "amber":
      default:
        return "text-amber-400 border-amber-500 bg-amber-500/10";
    }
  };

  const getAccentBtnClass = (accent: string) => {
    switch (accent) {
      case "emerald":
        return "bg-emerald-500 hover:bg-emerald-600 text-emerald-950";
      case "indigo":
        return "bg-indigo-500 hover:bg-indigo-600 text-white";
      case "rose":
        return "bg-rose-500 hover:bg-rose-600 text-white";
      case "amber":
      default:
        return "bg-amber-500 hover:bg-amber-600 text-amber-950";
    }
  };

  const getPhoneBgClass = (styleName: string) => {
    switch (styleName) {
      case "Midnight Rose":
        return "bg-gradient-to-b from-purple-950/40 via-neutral-950 to-neutral-950";
      case "Classic Charcoal":
        return "bg-gradient-to-b from-zinc-900 to-neutral-950";
      case "Sunset Gold":
      default:
        return "bg-gradient-to-b from-amber-950/20 via-neutral-950 to-neutral-950";
    }
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-500 font-sans ${
        theme === "dark" ? "bg-neutral-950 text-neutral-50" : "bg-zinc-50 text-neutral-950"
      }`}
    >
      {/* Dynamic Ambient Blur Background Elements */}
      <AnimatePresence>
        {theme === "dark" ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.07 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/4 w-[700px] h-[700px] bg-rose-500 rounded-full blur-[160px] pointer-events-none z-0"
            />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/25 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none z-0"
            />
          </>
        )}
      </AnimatePresence>

      {/* Grid Pattern Overlay */}
      <div
        className={`absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0`}
      />

      {/* 1. STICKY HEADER WITH PREMIUM GLASSMORPHIC NAVIGATION */}
      <header
        className={`sticky z-50 backdrop-blur-lg border-b border-solid top-0 w-full transition-colors duration-300 ${
          theme === "dark" ? "bg-neutral-950/70 border-white/10" : "bg-white/70 border-neutral-200/40"
        }`}
      >
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div
              className={`size-9 rounded-lg flex justify-center items-center shadow-md transition-colors duration-300 ${
                theme === "dark" ? "bg-neutral-50 text-neutral-900" : "bg-neutral-950 text-neutral-50"
              }`}
            >
              <Mail className="size-5" />
            </div>
            <span
              className={`font-heading font-bold text-lg leading-7 tracking-tight transition-colors duration-300 ${
                theme === "dark" ? "text-neutral-50" : "text-neutral-950"
              }`}
            >
              Kinvite
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 font-semibold text-xs">
            {[
              { label: "Home", href: "/", icon: Home, active: true },
              { label: "Features", href: "/#features", icon: Sparkles },
              { label: "Pricing", href: "/pricing", icon: DollarSign },
              { label: "About", href: "/about", icon: Info },
              { label: "Contact", href: "/contact", icon: Mail }
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <a
                  key={idx}
                  href={link.href}
                  className={`rounded-lg leading-5 flex px-3.5 py-2 items-center gap-1.5 cursor-pointer transition-all ${
                    link.active
                      ? theme === "dark"
                        ? "text-white bg-white/5 border border-white/10"
                        : "text-neutral-950 bg-black/5 border border-black/5"
                      : theme === "dark"
                      ? "text-zinc-400 hover:text-neutral-50"
                      : "text-neutral-500 hover:text-neutral-955"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Sun/Moon Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border border-solid transition-colors duration-300 cursor-pointer ${
                theme === "dark"
                  ? "border-white/10 text-neutral-50 hover:bg-white/5"
                  : "border-neutral-200 text-neutral-900 hover:bg-black/5"
              }`}
              aria-label="Toggle Theme Mode"
            >
              {theme === "dark" ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-neutral-800" />
              )}
            </button>

            {/* Better Auth dynamic session checks */}
            {sessionPending ? (
              <div className="w-20 h-9 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              </div>
            ) : isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  className={`text-xs leading-5 font-bold rounded-lg px-4 h-9 shadow transition-colors duration-300 border-0 ${
                    theme === "dark"
                      ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200"
                      : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                  }`}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`text-xs leading-5 font-semibold transition-colors ${
                      theme === "dark" ? "text-neutral-50 hover:bg-white/5" : "text-neutral-900 hover:bg-black/5"
                    }`}
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className={`text-xs leading-5 font-bold rounded-lg px-4 h-9 shadow transition-colors duration-300 border-0 ${
                      theme === "dark"
                        ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200"
                        : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO PLAYGROUND SECTION */}
      <main className="max-w-[1140px] mx-auto w-full z-10">
        <section className="grid grid-cols-1 lg:grid-cols-2 px-6 md:px-8 py-16 lg:py-24 items-center gap-16 min-h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-6 text-left max-w-xl">
            <div
              className={`inline-flex font-semibold rounded-full text-[10px] uppercase tracking-wider px-3.5 py-1.5 items-center gap-2 w-fit border border-solid ${
                theme === "dark" ? "bg-neutral-900 border-white/5 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-neutral-800"
              }`}
            >
              <Sparkle className="size-3 text-amber-500 animate-spin" />
              Redesigned SaaS Invitation Builder
            </div>
            
            <h1
              className={`font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-neutral-950"
              }`}
            >
              Digital Invites, <br />
              <span className="text-amber-500">
                Reimagined.
              </span>
            </h1>

            <p
              className={`text-sm sm:text-base leading-relaxed font-medium transition-colors ${
                theme === "dark" ? "text-zinc-400" : "text-neutral-600"
              }`}
            >
              Kinvite fuses high-end visual invitation cards with back-office guest list management, real-time RSVPs, interactive seating relationship trees, and automated reminders.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button
                    className={`gap-2 font-bold h-11 px-6 rounded-xl transition-all duration-300 border-0 ${
                      theme === "dark"
                        ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200"
                        : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                    }`}
                  >
                    <Pen className="size-4" />
                    Go to Workspace
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button
                    className={`gap-2 font-bold h-11 px-6 rounded-xl transition-all duration-300 border-0 ${
                      theme === "dark"
                        ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200"
                        : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                    }`}
                  >
                    <Pen className="size-4" />
                    Create Your Card
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                onClick={() => setShowDemo(true)}
                className={`bg-transparent gap-2 h-11 px-6 rounded-xl transition-all border border-solid ${
                  theme === "dark"
                    ? "text-neutral-50 border-white/10 hover:bg-white/5"
                    : "text-neutral-950 border-neutral-300 hover:bg-black/5"
                }`}
              >
                <Play className="size-3.5 fill-current text-amber-500" />
                Live Demo Video
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="flex pt-4 items-center gap-6 border-t border-solid border-white/5 mt-2">
              <div className="flex flex-col">
                <span className={`font-outfit font-extrabold text-xl ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                  120K+
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                  Invites Sent
                </span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className={`font-outfit font-extrabold text-xl ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                  99.9%
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                  RSVP Delivery
                </span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className={`font-outfit font-extrabold text-xl ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                  4.9★
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                  Host Rating
                </span>
              </div>
            </div>
          </div>

          {/* 3. DYNAMIC INTERACTIVE CUSTOMIZER SHOWCASE */}
          <div className="relative w-full flex justify-center lg:justify-end">
            <div
              className={`w-full max-w-[500px] border border-solid rounded-3xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden text-left flex flex-col md:flex-row gap-5 ${
                theme === "dark" ? "bg-neutral-900/60 border-white/10" : "bg-white/80 border-zinc-200 shadow-xl"
              }`}
            >
              {/* Left Column: Configurator sandbox */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
                    Interactive Sandbox
                  </span>
                  <h3 className={`font-outfit font-extrabold text-sm ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                    Customize Live
                  </h3>
                </div>

                <div className="space-y-3 text-[11px] font-semibold">
                  {/* Title field */}
                  <div className="space-y-1">
                    <label className="text-zinc-500 block">Event Title</label>
                    <input
                      type="text"
                      value={mockEventTitle}
                      onChange={(e) => setMockEventTitle(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded-lg border border-solid border-white/10 bg-neutral-950/60 outline-none text-[11px] font-medium focus:border-amber-500 text-white`}
                    />
                  </div>

                  {/* Date field */}
                  <div className="space-y-1">
                    <label className="text-zinc-500 block">Date</label>
                    <input
                      type="text"
                      value={mockDate}
                      onChange={(e) => setMockDate(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded-lg border border-solid border-white/10 bg-neutral-950/60 outline-none text-[11px] font-medium focus:border-amber-500 text-white`}
                    />
                  </div>

                  {/* Accent selectors */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 block">Accent Palette</label>
                    <div className="flex gap-2">
                      {["amber", "emerald", "indigo", "rose"].map((accent) => (
                        <button
                          key={accent}
                          onClick={() => setMockAccent(accent)}
                          className={`size-5 rounded-full border border-solid cursor-pointer transition-all flex items-center justify-center ${
                            mockAccent === accent
                              ? "border-white scale-110"
                              : "border-transparent opacity-80 hover:opacity-100"
                          } ${
                            accent === "amber"
                              ? "bg-amber-500"
                              : accent === "emerald"
                              ? "bg-emerald-500"
                              : accent === "indigo"
                              ? "bg-indigo-500"
                              : "bg-rose-500"
                          }`}
                        >
                          {mockAccent === accent && <Check className="w-3 h-3 text-black font-extrabold" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style presets */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 block">Background Style</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Sunset Gold", "Classic Charcoal", "Midnight Rose"].map((styleName) => (
                        <button
                          key={styleName}
                          onClick={() => setMockTheme(styleName)}
                          className={`py-1 rounded text-[9px] font-bold border border-solid cursor-pointer transition-all ${
                            mockTheme === styleName
                              ? "border-amber-500 bg-amber-500/10 text-amber-400"
                              : "border-white/5 bg-neutral-950/40 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {styleName.split(" ")[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Phone Mockup */}
              <div className="w-[190px] h-[310px] shrink-0 mx-auto rounded-[32px] border-4 border-solid border-zinc-800 bg-neutral-950 overflow-hidden relative shadow-2xl flex flex-col justify-between p-4">
                {/* Speaker pill notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-full bg-zinc-800 flex items-center justify-center z-25">
                  <div className="size-1 rounded-full bg-zinc-900" />
                </div>

                {/* Live Preview Content Container */}
                <div
                  className={`absolute inset-0 z-10 transition-all duration-500 flex flex-col justify-between p-3 pt-7 text-center ${getPhoneBgClass(
                    mockTheme
                  )}`}
                >
                  <div className="space-y-2 mt-4">
                    <span
                      className={`text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-solid ${getAccentColorClass(
                        mockAccent
                      )}`}
                    >
                      Invitation
                    </span>
                    <h4 className="font-heading font-bold text-xs text-white leading-normal truncate px-1">
                      {mockEventTitle || "Celebrate With Us"}
                    </h4>
                    <div className="w-6 h-px bg-white/20 mx-auto" />
                  </div>

                  <div className="space-y-1.5 my-2">
                    <div className="flex items-center justify-center gap-1 text-[8px] text-zinc-300">
                      <Calendar className="size-2 text-zinc-400" />
                      <span>{mockDate || "Event Date"}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[8px] text-zinc-300">
                      <MapPin className="size-2 text-zinc-400" />
                      <span className="truncate max-w-[130px]">{mockLocation}</span>
                    </div>
                  </div>

                  {/* Mock Button */}
                  <div className="space-y-2 mb-3">
                    <button
                      className={`w-full py-1.5 rounded-lg text-[9px] font-bold shadow-md cursor-default border-0 ${getAccentBtnClass(
                        mockAccent
                      )}`}
                    >
                      RSVP Online
                    </button>
                    <span className="text-[7px] text-zinc-550 block font-medium">
                      Designed with Kinvite
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4. INTERACTIVE CAPABILITIES GRID */}
      <section
        id="features"
        className={`w-full transition-colors duration-500 z-10 ${
          theme === "dark" ? "bg-neutral-900/40" : "bg-neutral-100/50 border-y border-neutral-200/60"
        }`}
      >
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 py-20 flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="font-semibold uppercase text-xs leading-4 tracking-[2.4px] text-amber-500">
              Capabilities
            </span>
            <h2
              className={`font-outfit font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-neutral-950"
              }`}
            >
              Engineered for absolute control
            </h2>
            <p
              className={`max-w-xl text-xs sm:text-sm leading-relaxed transition-colors ${
                theme === "dark" ? "text-zinc-400" : "text-neutral-600"
              }`}
            >
              Every layout template is modular, every guest RSVP is interactive, and every custom theme keeps privacy controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CARD 1: Interactive templates */}
            <Card
              className={`shadow-sm border border-solid p-6 gap-6 flex flex-col justify-between rounded-2xl transition-all duration-300 text-left ${
                theme === "dark" ? "bg-neutral-900 border-white/10 hover:border-white/20" : "bg-white border-neutral-200 shadow-md"
              }`}
            >
              <CardHeader className="p-0 gap-2">
                <div className="size-9 rounded-lg flex justify-center items-center bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <LayoutTemplate className="size-4.5" />
                </div>
                <CardTitle className={`font-outfit font-bold text-base transition-colors ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                  Centralized Layout Registry
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-neutral-600"}`}>
                  Choose layouts from a dynamically resolved catalog (Weddings, Birthdays, Galas) configured under one structured registry.
                </p>
                <div className="flex gap-1.5">
                  <span className="px-2.5 py-1 rounded bg-neutral-950 text-[10px] text-zinc-400 border border-white/5 font-semibold">Wedding01</span>
                  <span className="px-2.5 py-1 rounded bg-neutral-950 text-[10px] text-zinc-400 border border-white/5 font-semibold">Birthday02</span>
                  <span className="px-2.5 py-1 rounded bg-neutral-950 text-[10px] text-zinc-400 border border-white/5 font-semibold">Gala01</span>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Interactive RSVP list */}
            <Card
              className={`shadow-sm border border-solid p-6 gap-6 flex flex-col justify-between rounded-2xl transition-all duration-300 text-left ${
                theme === "dark" ? "bg-neutral-900 border-white/10 hover:border-white/20" : "bg-white border-neutral-200/80 hover:border-neutral-300 shadow-md"
              }`}
            >
              <CardHeader className="p-0 gap-2">
                <div className="size-9 rounded-lg flex justify-center items-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <ClipboardCheck className="size-4.5" />
                </div>
                <CardTitle className={`font-outfit font-bold text-base transition-colors ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                  Interactive RSVP Roster
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-neutral-600"}`}>
                  Click guest status badges below to cycle and preview how the real-time RSVP database tracks responses instantly.
                </p>
                <div className="space-y-1.5">
                  {mockGuests.map((guest, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleGuestStatus(idx)}
                      className="flex justify-between items-center text-[10px] p-2 rounded-lg bg-neutral-950/60 border border-white/5 cursor-pointer hover:bg-neutral-950 transition-colors"
                    >
                      <span className="text-zinc-300 font-bold">{guest.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-extrabold uppercase text-[8px] tracking-wider ${
                          guest.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : guest.status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {guest.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CARD 3: Custom theme deletion controls */}
            <Card
              className={`shadow-sm border border-solid p-6 gap-6 flex flex-col justify-between rounded-2xl transition-all duration-300 text-left ${
                theme === "dark" ? "bg-neutral-900 border-white/10 hover:border-white/20" : "bg-white border-neutral-200 shadow-md"
              }`}
            >
              <CardHeader className="p-0 gap-2">
                <div className="size-9 rounded-lg flex justify-center items-center bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Palette className="size-4.5" />
                </div>
                <CardTitle className={`font-outfit font-bold text-base transition-colors ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                  Owner Theme Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-neutral-600"}`}>
                  Create custom themes privately. As creator, delete custom templates dynamically to remove them from your catalog and hide them from others.
                </p>
                <div className="flex justify-between items-center text-[10px] p-2.5 rounded-lg border border-dashed border-red-500/30 bg-red-950/10">
                  <span className="text-red-400 font-bold">Classic Gala (Custom)</span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold cursor-default">Delete</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. RELATION TREE PREVIEW (INTERACTIVE SEATING MAP) */}
      <section
        className={`w-full transition-colors duration-500 z-10 ${
          theme === "dark" ? "bg-neutral-950" : "bg-zinc-50 border-t border-neutral-200/60"
        }`}
      >
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 py-20 flex-col items-center gap-12">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="font-semibold uppercase text-xs leading-4 tracking-[2.4px] text-amber-500">
              Interactive Seating
            </span>
            <h2
              className={`font-outfit font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-neutral-950"
              }`}
            >
              Visualize guest networks in real time
            </h2>
            <p
              className={`max-w-2xl text-xs sm:text-sm leading-relaxed transition-colors ${
                theme === "dark" ? "text-zinc-400" : "text-neutral-600"
              }`}
            >
              Map relationships (family, coworkers, close friends) directly to your invitation seating plans with modern node diagrams.
            </p>
          </div>

          <div
            className={`rounded-2xl border border-solid p-6 md:p-8 w-full overflow-hidden transition-colors duration-300 ${
              theme === "dark" ? "bg-neutral-900/60 border-white/10" : "bg-white border-neutral-200 shadow-xl"
            }`}
          >
            {/* Scrollable Container for Mobile Responsiveness */}
            <div className="w-full overflow-x-auto pb-3 scrollbar-thin">
              <div className="relative mx-auto w-[760px] h-[260px] shrink-0">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 760 260" fill="none">
                  <path
                    d="M380 40 C 240 70, 180 70, 130 110"
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M380 40 C 380 75, 380 75, 380 110"
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M380 40 C 520 70, 580 70, 630 110"
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}
                    strokeWidth="2"
                  />
                  
                  {/* Child nodes paths */}
                  <path
                    d="M130 135 C 90 180, 80 180, 65 205"
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M130 135 C 130 180, 130 180, 130 205"
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M130 135 C 170 180, 180 180, 195 205"
                    stroke={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}
                    strokeWidth="1.5"
                  />
                </svg>

                {/* You node */}
                <div
                  className={`left-[380px] -translate-x-1/2 -translate-y-1/2 size-12 shadow-md font-bold rounded-full text-xs leading-5 flex absolute top-[40px] justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-white text-neutral-950" : "bg-neutral-950 text-white"
                  }`}
                >
                  Host
                </div>

                {/* Sub groups */}
                <div className="left-[130px] -translate-x-1/2 -translate-y-1/2 size-10 shadow font-bold rounded-full bg-amber-500 text-amber-950 text-[10px] leading-4 flex absolute top-[125px] justify-center items-center">
                  Family
                </div>
                <div className="left-[380px] -translate-x-1/2 -translate-y-1/2 size-10 shadow font-bold rounded-full bg-indigo-500 text-white text-[10px] leading-4 flex absolute top-[125px] justify-center items-center">
                  Friends
                </div>
                <div className="left-[630px] -translate-x-1/2 -translate-y-1/2 size-10 shadow font-bold rounded-full bg-emerald-500 text-emerald-950 text-[10px] leading-4 flex absolute top-[125px] justify-center items-center">
                  Colleagues
                </div>

                {/* Family details */}
                <div className="left-[65px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[215px] flex-col items-center gap-1">
                  <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[9px]">
                    Mom
                  </div>
                </div>
                <div className="left-[130px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[215px] flex-col items-center gap-1">
                  <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[9px]">
                    Dad
                  </div>
                </div>
                <div className="left-[195px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[215px] flex-col items-center gap-1">
                  <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[9px]">
                    Sis
                  </div>
                </div>
              </div>
            </div>

            {/* Tree Map Legend & Actions panel */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-4 border-t border-solid border-white/5 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-zinc-650"}`}>
                  Family
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-indigo-500" />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-zinc-650"}`}>
                  Friends
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-zinc-650"}`}>
                  Colleagues
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING TIER SECTION */}
      <section
        id="pricing"
        className={`w-full transition-colors duration-500 z-10 ${
          theme === "dark" ? "bg-neutral-900/20 border-t border-solid border-white/5" : "bg-zinc-50 border-t border-neutral-200/60"
        }`}
      >
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 py-20 flex-col gap-10">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="font-semibold uppercase text-xs leading-4 tracking-[2.4px] text-amber-500">
              Pricing Plans
            </span>
            <h2
              className={`font-outfit font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-neutral-950"
              }`}
            >
              Simple, transparent pricing
            </h2>
            <p
              className={`max-w-xl text-xs sm:text-sm leading-relaxed transition-colors ${
                theme === "dark" ? "text-zinc-400" : "text-neutral-600"
              }`}
            >
              Choose a plan that fits your guest list. Save up to 20% with yearly billing.
            </p>

            {/* Billing selector switch */}
            <div className="flex items-center gap-3 mt-4">
              <span className={`text-xs font-bold ${billingPeriod === "monthly" ? (theme === "dark" ? "text-white" : "text-neutral-950") : "text-zinc-500"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(p => (p === "monthly" ? "yearly" : "monthly"))}
                className="w-10 h-6 rounded-full p-1 bg-zinc-800 border border-zinc-700 cursor-pointer flex items-center justify-start transition-all"
              >
                <div
                  className={`size-4 rounded-full bg-amber-500 transition-all ${
                    billingPeriod === "yearly" ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-bold ${billingPeriod === "yearly" ? (theme === "dark" ? "text-white" : "text-neutral-950") : "text-zinc-500"}`}>
                Yearly <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold ml-1">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">
            {/* Free Plan */}
            <Card
              className={`border border-solid p-8 rounded-3xl flex flex-col justify-between text-left ${
                theme === "dark" ? "bg-neutral-900 border-white/5" : "bg-white border-neutral-200 shadow-lg"
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className={`font-outfit font-extrabold text-lg ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                    Free Plan
                  </h3>
                  <p className="text-zinc-500 text-xs">For small, intimate family milestones</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`font-outfit font-extrabold text-3xl ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                    $0
                  </span>
                  <span className="text-zinc-500 text-xs font-semibold">/ forever</span>
                </div>
                <div className="w-full h-px bg-white/5" />
                <ul className="space-y-2.5 text-xs text-zinc-400 font-semibold">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Up to 40 guest invitations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Access to classic theme templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Real-time RSVP registry tracking</span>
                  </li>
                </ul>
              </div>
              <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full mt-8">
                <Button className="w-full h-10 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl">
                  {isLoggedIn ? "Go to Dashboard" : "Start for Free"}
                </Button>
              </Link>
            </Card>

            {/* Pro Plan */}
            <Card
              className={`border border-solid p-8 rounded-3xl flex flex-col justify-between text-left relative ${
                theme === "dark"
                  ? "bg-neutral-900 border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent"
                  : "bg-white border-amber-500/40 shadow-xl"
              }`}
            >
              <div className="absolute top-4 right-4 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Popular
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className={`font-outfit font-extrabold text-lg ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                    Pro Plan
                  </h3>
                  <p className="text-zinc-500 text-xs">For weddings, galas, and corporate events</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`font-outfit font-extrabold text-3xl ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                    {billingPeriod === "yearly" ? "$12" : "$15"}
                  </span>
                  <span className="text-zinc-500 text-xs font-semibold">/ month</span>
                </div>
                <div className="w-full h-px bg-white/5" />
                <ul className="space-y-2.5 text-xs text-zinc-400 font-semibold">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Unlimited guest invitations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Access all custom premium templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Interactive guest relation seating maps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp reminder delivery campaigns</span>
                  </li>
                </ul>
              </div>
              <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full mt-8">
                <Button className="w-full h-10 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-amber-950 border-0 shadow-lg shadow-amber-500/10 rounded-xl">
                  Upgrade to Pro
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. CALL-TO-ACTION (CTA) SECTION */}
      <section className="max-w-[1140px] w-full mx-auto px-6 md:px-8 py-16 z-10">
        <div
          className={`relative rounded-3xl p-8 md:p-12 overflow-hidden border border-solid transition-colors duration-300 ${
            theme === "dark"
              ? "bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent)] bg-neutral-900 border-white/10"
              : "bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.06),transparent)] bg-zinc-100 border-neutral-200 shadow-md"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
            <div className="max-w-lg flex flex-col gap-3">
              <h2
                className={`font-outfit font-extrabold text-3xl leading-tight transition-colors duration-300 ${
                  theme === "dark" ? "text-white" : "text-neutral-950"
                }`}
              >
                Ready to create your first card?
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                  theme === "dark" ? "text-zinc-400" : "text-neutral-600"
                }`}
              >
                Join thousands of modern hosts who manage guest lists and invite in style with Kinvite. No credit card required.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2.5 w-full md:w-auto shrink-0">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-full">
                  <Button
                    className="gap-2 font-bold w-full md:w-auto px-6 h-11 transition-colors duration-300 border-0 bg-amber-500 hover:bg-amber-600 text-amber-950"
                  >
                    <Rocket className="size-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup" className="w-full">
                  <Button
                    className="gap-2 font-bold w-full md:w-auto px-6 h-11 transition-colors duration-300 border-0 bg-amber-500 hover:bg-amber-600 text-amber-950"
                  >
                    <Rocket className="size-4" />
                    Start Crafting for Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. PREMIUM FOOTER */}
      <footer
        className={`border-t border-solid w-full transition-colors duration-300 ${
          theme === "dark" ? "border-white/5 bg-neutral-950" : "border-neutral-200 bg-zinc-100/30"
        }`}
      >
        <div className="max-w-[1140px] flex flex-col sm:flex-row mx-auto p-8 justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`size-9 rounded-lg flex justify-center items-center shadow transition-colors duration-300 ${
                theme === "dark" ? "bg-neutral-50 text-neutral-900" : "bg-neutral-950 text-neutral-50"
              }`}
            >
              <Mail className="size-5" />
            </div>
            <span
              className={`font-outfit font-extrabold text-base leading-7 tracking-tight transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-neutral-950"
              }`}
            >
              Kinvite
            </span>
          </div>

          <nav className="flex items-center gap-8 font-semibold text-xs text-zinc-500">
            <a href="#" className="hover:text-amber-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-amber-500 transition-colors">
              Support
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className={`size-8 rounded-full flex justify-center items-center transition-all ${
                theme === "dark"
                  ? "bg-neutral-900 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-300"
              }`}
              title="Twitter/X"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className={`size-8 rounded-full flex justify-center items-center transition-all ${
                theme === "dark"
                  ? "bg-neutral-900 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-300"
              }`}
              title="Instagram"
            >
              <svg
                className="size-3.5 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        <div
          className={`text-center text-[10px] font-bold uppercase tracking-wider border-t border-solid py-4 transition-colors duration-300 ${
            theme === "dark" ? "text-zinc-600 border-white/5" : "text-zinc-400 border-neutral-200"
          }`}
        >
          © 2026 Kinvite. All rights reserved.
        </div>
      </footer>

      {/* 9. WATCH DEMO MODAL DIALOG */}
      <AnimatePresence>
        {showDemo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className={`border border-solid rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative transition-colors duration-300 ${
                theme === "dark" ? "bg-neutral-900 border-white/10" : "bg-white border-neutral-200"
              }`}
            >
              <button
                onClick={() => setShowDemo(false)}
                className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-white hover:bg-white/5"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className={`font-outfit font-extrabold text-sm transition-colors ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                    Kinvite Workspace Tour
                  </h3>
                </div>

                <div
                  className={`aspect-video w-full rounded-2xl overflow-hidden border border-solid flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-inner relative transition-colors duration-300 ${
                    theme === "dark" ? "border-white/10 bg-neutral-950" : "border-neutral-200 bg-neutral-50"
                  }`}
                >
                  <div className="size-14 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shadow-lg shadow-amber-500/5 z-10">
                    <Heart className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
                  </div>

                  <div className="space-y-1.5 z-10 max-w-xs">
                    <h4 className={`text-xs font-bold transition-colors ${theme === "dark" ? "text-white" : "text-neutral-950"}`}>
                      Personalization & RSVP Workflow
                    </h4>
                    <p className={`text-[10px] leading-relaxed transition-colors ${theme === "dark" ? "text-zinc-400" : "text-neutral-600"}`}>
                      See how custom loading screen animations, love stories, live countdowns, and interactive guest relation tree maps appear on actual mobile and desktop invitations.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowDemo(false);
                      router.push("/signup");
                    }}
                    className="font-bold text-[10px] h-8 px-5 rounded-lg border-0 z-10 transition-transform duration-300 hover:scale-[1.02] cursor-pointer bg-amber-500 hover:bg-amber-600 text-amber-950"
                  >
                    Start Crafting for Free
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
