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

      {/* 3. FEATURES SECTION */}
      <section id="features" className={`w-full transition-colors duration-500 ${
        theme === "dark" ? "bg-neutral-900/40" : "bg-neutral-100/50 border-y border-neutral-200/60"
      }`}>
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 py-12 lg:py-16 flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`font-semibold uppercase text-xs leading-4 tracking-[2.4px] transition-colors ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-550"
            }`}>
              Features
            </span>
            <h2 className={`font-bold text-3xl leading-9 tracking-tight transition-colors duration-300 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-950"
            }`}>
              Everything you need to invite in style
            </h2>
            <p className={`max-w-xl text-base leading-6 transition-colors ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}>
              From the first design to the final RSVP, Knivite handles it all so you
              can focus on celebrating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Beautiful templates",
                desc: "Choose from hundreds of professionally designed cards for weddings, birthdays, and more.",
                icon: LayoutTemplate,
              },
              {
                title: "Easy customization",
                desc: "Change colors, fonts, and photos with a simple drag-and-drop editor. No design skills needed.",
                icon: Palette,
              },
              {
                title: "Share instantly",
                desc: "Send your invites via link, email, or social media and watch your guest list fill up.",
                icon: Share2,
              },
              {
                title: "RSVP tracking",
                desc: "Keep track of who's coming in real time with built-in RSVP management.",
                icon: ClipboardCheck,
              },
              {
                title: "Smart reminders",
                desc: "Automatically remind your guests so no one ever misses your special moment.",
                icon: Bell,
              },
              {
                title: "Works everywhere",
                desc: "Your invitations look perfect on every device, from phones to desktops.",
                icon: Smartphone,
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} className={`shadow-sm border border-solid p-6 gap-4 flex flex-col justify-between rounded-2xl transition-all duration-300 ${
                  theme === "dark" ? "bg-neutral-900 border-white/10 hover:border-white/20" : "bg-white border-neutral-200/80 hover:border-neutral-300 shadow-md"
                }`}>
                  <CardHeader className="p-0 gap-2 text-left">
                    <div className={`size-10 rounded-lg flex justify-center items-center shadow-sm transition-colors duration-300 ${
                      theme === "dark" ? "bg-neutral-800 text-neutral-50" : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                    }`}>
                      <Icon className="size-5 text-amber-500" />
                    </div>
                    <CardTitle className={`font-semibold text-lg leading-7 transition-colors ${
                      theme === "dark" ? "text-neutral-50" : "text-neutral-950"
                    }`}>
                      {feat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 gap-2 text-left">
                    <p className={`text-sm leading-5 transition-colors ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                    }`}>
                      {feat.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <main className="max-w-[1140px] mx-auto w-full">
        <section id="how-it-works" className="grid grid-cols-1 lg:grid-cols-2 px-6 md:px-8 py-12 lg:py-16 items-center gap-12">
          <div className={`shadow-sm aspect-[4/3] rounded-2xl border border-solid overflow-hidden ${
            theme === "dark" ? "border-white/10" : "border-neutral-200 shadow-md"
          }`}>
            <img
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Friends celebrating dinner party with glasses raised"
              className="object-cover w-full h-full transform hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          <div className="flex flex-col gap-6 text-left">
            <span className={`font-semibold uppercase text-xs leading-4 tracking-[2.4px] transition-colors ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-550"
            }`}>
              How it works
            </span>
            <h2 className={`font-bold text-3xl leading-9 tracking-tight transition-colors ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-950"
            }`}>
              From idea to invite in three simple steps
            </h2>

            <div className="flex flex-col gap-6">
              {[
                {
                  step: 1,
                  title: "Pick a template",
                  desc: "Browse our collection and find the perfect design for your event."
                },
                {
                  step: 2,
                  title: "Personalize it",
                  desc: "Add your details, photos, and a personal touch in our editor."
                },
                {
                  step: 3,
                  title: "Share & collect",
                  desc: "Share your invitation and start collecting RSVPs instantly."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className={`size-9 shrink-0 font-semibold rounded-full text-sm leading-5 flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-neutral-50 text-neutral-900" : "bg-neutral-950 text-neutral-50"
                  }`}>
                    {item.step}
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <span className={`font-semibold text-base leading-6 transition-colors ${
                      theme === "dark" ? "text-neutral-50" : "text-neutral-950"
                    }`}>
                      {item.title}
                    </span>
                    <span className={`text-sm leading-5 transition-colors ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                    }`}>
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 5. RELATION TREE MAP SECTION (INTERACTIVE SVG DEMO) */}
      <section className={`w-full transition-colors duration-500 ${
        theme === "dark" ? "bg-neutral-950" : "bg-zinc-50 border-t border-neutral-200/60"
      }`}>
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 py-12 lg:py-16 flex-col items-center gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`font-semibold uppercase text-xs leading-4 tracking-[2.4px] transition-colors ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-550"
            }`}>
              Relation Tree Map
            </span>
            <h2 className={`font-bold text-3xl leading-9 tracking-tight transition-colors duration-300 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-950"
            }`}>
              Visualize who's coming and how they're connected
            </h2>
            <p className={`max-w-2xl text-base leading-6 transition-colors ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}>
              See your guests grouped by relationship ΓÇö family, close friends,
              colleagues, and more ΓÇö all in one interactive view.
            </p>
          </div>

          <div className={`shadow-sm rounded-2xl border border-solid p-6 md:p-8 w-full overflow-hidden transition-colors duration-300 ${
            theme === "dark" ? "bg-neutral-900 border-white/10" : "bg-white border-neutral-200/80 shadow-md"
          }`}>
            
            {/* Scrollable Container for Mobile Responsiveness */}
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 pb-3">
              <div className="relative mx-auto w-[780px] h-[340px] shrink-0">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 780 340"
                  fill="none"
                >
                  <path
                    d="M390 60 C 250 100, 180 100, 130 150"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M390 60 C 390 110, 390 110, 390 150"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M390 60 C 530 100, 600 100, 650 150"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M130 175 C 90 230, 70 240, 55 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M130 175 C 120 230, 115 240, 110 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M130 175 C 145 230, 150 240, 160 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M130 175 C 175 230, 195 240, 215 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M390 175 C 350 230, 335 240, 320 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M390 175 C 380 230, 378 240, 375 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M390 175 C 400 230, 402 240, 425 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M390 175 C 430 230, 460 240, 480 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M650 175 C 610 230, 595 240, 585 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M650 175 C 650 230, 650 240, 650 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                  <path
                    d="M650 175 C 690 230, 705 240, 715 270"
                    stroke={theme === "dark" ? "oklch(1 0 0 / 18%)" : "oklch(0 0 0 / 12%)"}
                    strokeWidth="2"
                  />
                </svg>
                
                {/* 15 Absolute positioned nodes sitting perfectly at coordinates */}
                <div className={`left-[390px] -translate-x-1/2 -translate-y-1/2 size-16 shadow-md font-semibold rounded-full text-sm leading-5 flex absolute top-[30px] justify-center items-center transition-colors duration-300 ${
                  theme === "dark" ? "bg-neutral-50 text-neutral-900" : "bg-neutral-950 text-neutral-50"
                }`}>
                  You
                </div>

                <div className="left-[130px] -translate-x-1/2 -translate-y-1/2 size-12 shadow font-semibold rounded-full bg-amber-500 text-neutral-950 text-xs leading-4 flex absolute top-[162px] justify-center items-center">
                  Family
                </div>
                <div className="left-[390px] -translate-x-1/2 -translate-y-1/2 size-12 shadow font-semibold rounded-full bg-sky-500 text-neutral-950 text-xs leading-4 flex absolute top-[162px] justify-center items-center">
                  Friends
                </div>
                <div className="left-[650px] -translate-x-1/2 -translate-y-1/2 size-12 shadow leading-tight font-semibold text-center rounded-full bg-violet-500 text-neutral-50 text-[10px] flex absolute top-[162px] justify-center items-center">
                  Colleagues
                </div>

                {/* Family nodes */}
                <div className="left-[55px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-amber-500/20 text-amber-300" : "bg-amber-500/15 text-amber-700"
                  }`}>
                    MO
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-emerald-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Mom</span>
                </div>

                <div className="left-[110px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-amber-500/20 text-amber-300" : "bg-amber-500/15 text-amber-700"
                  }`}>
                    DA
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-emerald-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Dad</span>
                </div>

                <div className="left-[160px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-amber-500/20 text-amber-300" : "bg-amber-500/15 text-amber-700"
                  }`}>
                    SI
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-amber-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Sister</span>
                </div>

                <div className="left-[215px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-amber-500/20 text-amber-300" : "bg-amber-500/15 text-amber-700"
                  }`}>
                    UN
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-rose-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Uncle</span>
                </div>

                {/* Friends nodes */}
                <div className="left-[320px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-sky-500/20 text-sky-300" : "bg-sky-500/15 text-sky-700"
                  }`}>
                    AR
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-emerald-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Aryan</span>
                </div>

                <div className="left-[375px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-sky-500/20 text-sky-300" : "bg-sky-500/15 text-sky-700"
                  }`}>
                    PR
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-amber-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Priya</span>
                </div>

                <div className="left-[425px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-sky-500/20 text-sky-300" : "bg-sky-500/15 text-sky-700"
                  }`}>
                    LE
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-emerald-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Leo</span>
                </div>

                <div className="left-[480px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-sky-500/20 text-sky-300" : "bg-sky-500/15 text-sky-700"
                  }`}>
                    MI
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-rose-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Mia</span>
                </div>

                {/* Colleagues nodes */}
                <div className="left-[585px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-violet-500/20 text-violet-300" : "bg-violet-500/15 text-violet-750"
                  }`}>
                    RA
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-emerald-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Rahul</span>
                </div>

                <div className="left-[650px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-violet-500/20 text-violet-300" : "bg-violet-500/15 text-violet-750"
                  }`}>
                    SA
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-amber-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Sara</span>
                </div>

                <div className="left-[715px] -translate-x-1/2 -translate-y-1/2 flex absolute top-[290px] flex-col items-center gap-1">
                  <div className={`relative size-10 font-semibold rounded-full flex justify-center items-center transition-colors duration-300 ${
                    theme === "dark" ? "bg-violet-500/20 text-violet-300" : "bg-violet-500/15 text-violet-750"
                  }`}>
                    TO
                    <span className="size-2.5 ring-2 ring-white dark:ring-neutral-900 rounded-full bg-emerald-400 absolute -right-0.5 -bottom-0.5" />
                  </div>
                  <span className={`text-[11px] font-medium transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Tom</span>
                </div>
              </div>
            </div>

            {/* Tree Map Legend & Actions panel */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
              <div className="rounded-full bg-amber-500/10 dark:bg-amber-500/15 flex px-3 py-1.5 items-center gap-2">
                <span className="size-3 rounded-full bg-amber-500" />
                <span className="font-semibold text-amber-700 dark:text-amber-300 text-xs leading-4">
                  Family
                </span>
              </div>
              <div className="rounded-full bg-sky-500/10 dark:bg-sky-500/15 flex px-3 py-1.5 items-center gap-2">
                <span className="size-3 rounded-full bg-sky-500" />
                <span className="font-semibold text-sky-700 dark:text-sky-300 text-xs leading-4">
                  Friends
                </span>
              </div>
              <div className="rounded-full bg-violet-500/10 dark:bg-violet-500/15 flex px-3 py-1.5 items-center gap-2">
                <span className="size-3 rounded-full bg-violet-500" />
                <span className="font-semibold text-violet-700 dark:text-violet-300 text-xs leading-4">
                  Colleagues
                </span>
              </div>
              
              <div className={`w-px h-5 ${theme === "dark" ? "bg-white/10" : "bg-neutral-200"}`} />
              
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className={`text-xs leading-4 transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Confirmed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className={`text-xs leading-4 transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-400" />
                <span className={`text-xs leading-4 transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>Declined</span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowDemo(true)}
                className={`text-sm leading-5 gap-2 cursor-pointer font-semibold transition-all ${
                  theme === "dark" ? "text-neutral-50 hover:bg-white/5" : "text-neutral-900 hover:bg-black/5"
                }`}
              >
                <MousePointer className="size-4 text-amber-500" />
                Try Demo
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CALL-TO-ACTION (CTA) SECTION */}
      <section className="max-w-[1140px] w-full mx-auto px-6 md:px-8 py-12">
        <div className={`relative rounded-3xl p-8 md:p-12 overflow-hidden border border-solid transition-colors duration-300 ${
          theme === "dark" 
            ? "bg-[radial-gradient(circle_at_top_right,oklch(0.3_0_0),oklch(0.16_0_0))] bg-neutral-900 border-white/10" 
            : "bg-[radial-gradient(circle_at_top_right,oklch(0.98_0_0),oklch(0.95_0_0))] bg-zinc-100 border-neutral-200 shadow-md"
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
            <div className="max-w-lg flex flex-col gap-3">
              <h2 className={`font-bold text-3xl leading-9 tracking-tight transition-colors duration-300 ${
                theme === "dark" ? "text-neutral-50" : "text-neutral-950"
              }`}>
                Ready to create your first invitation?
              </h2>
              <p className={`text-base leading-6 transition-colors duration-300 ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}>
                Join thousands of hosts who make their celebrations unforgettable
                with Knivite. It's free to get started.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-2.5 w-full md:w-auto shrink-0">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-full">
                  <Button className={`gap-2 font-bold w-full md:w-auto px-6 h-11 transition-colors duration-300 border-0 ${
                    theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                  }`}>
                    <Rocket className="size-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup" className="w-full">
                  <Button className={`gap-2 font-bold w-full md:w-auto px-6 h-11 transition-colors duration-300 border-0 ${
                    theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                  }`}>
                    <Rocket className="size-4" />
                    Start for free
                  </Button>
                </Link>
              )}
              <span className={`text-xs leading-4 transition-colors duration-300 ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}>
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREMIUM DUAL-THEME FOOTER WITH SOCIAL LINKS */}
      <footer className={`border-t border-solid w-full transition-colors duration-300 ${
        theme === "dark" ? "border-white/10" : "border-neutral-200 bg-zinc-100/30"
      }`}>
        <div className="max-w-[1140px] flex flex-col sm:flex-row mx-auto p-6 md:p-8 justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`size-9 rounded-lg flex justify-center items-center shadow transition-colors duration-300 ${
              theme === "dark" ? "bg-neutral-50 text-neutral-900" : "bg-neutral-950 text-neutral-50"
            }`}>
              <Mail className="size-5" />
            </div>
            <span className={`font-bold text-lg leading-7 tracking-tight transition-colors duration-300 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-950"
            }`}>
              Knivite
            </span>
          </div>

          <nav className="flex items-center gap-8">
            <a href="#" className={`text-sm leading-5 cursor-pointer transition-colors ${
              theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-600 hover:text-neutral-950"
            }`}>Privacy</a>
            <a href="#" className={`text-sm leading-5 cursor-pointer transition-colors ${
              theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-600 hover:text-neutral-950"
            }`}>Terms</a>
            <a href="#" className={`text-sm leading-5 cursor-pointer transition-colors ${
              theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-600 hover:text-neutral-950"
            }`}>Support</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className={`size-9 rounded-full flex justify-center items-center transition-all ${
                theme === "dark" 
                  ? "bg-neutral-800 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-700" 
                  : "bg-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-300"
              }`}
              title="Twitter/X"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className={`size-9 rounded-full flex justify-center items-center transition-all ${
                theme === "dark" 
                  ? "bg-neutral-800 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-700" 
                  : "bg-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-300"
              }`}
              title="Instagram"
            >
              <svg className="size-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className={`size-9 rounded-full flex justify-center items-center transition-all ${
                theme === "dark" 
                  ? "bg-neutral-800 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-700" 
                  : "bg-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-300"
              }`}
              title="Facebook"
            >
              <svg className="size-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className={`text-center text-sm leading-5 border-t border-solid py-4 transition-colors duration-300 ${
          theme === "dark" ? "text-neutral-400 border-white/10" : "text-neutral-550 border-neutral-200"
        }`}>
          ┬⌐ 2025 Knivite. All rights reserved.
        </div>
      </footer>

      {/* 8. WATCH DEMO MODAL DIALOG */}
      <AnimatePresence>
        {showDemo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              className={`border border-solid rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative transition-colors duration-300 ${
                theme === "dark" ? "bg-neutral-900 border-white/15" : "bg-white border-neutral-200"
              }`}
            >
              <button
                onClick={() => setShowDemo(false)}
                className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors ${
                  theme === "dark" ? "text-neutral-400 hover:text-white hover:bg-white/5" : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className={`font-bold text-lg transition-colors ${theme === "dark" ? "text-neutral-50" : "text-neutral-950"}`}>
                    Knivite Interactive Tour
                  </h3>
                </div>

                {/* Video Demo Mockup */}
                <div className={`aspect-video w-full rounded-2xl overflow-hidden border border-solid flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-inner relative transition-colors duration-300 ${
                  theme === "dark" ? "border-white/10 bg-neutral-950" : "border-neutral-200 bg-neutral-50"
                }`}>
                  <div className="size-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shadow-lg shadow-amber-500/5 z-10 animate-pulse">
                    <Heart className="w-8 h-8 text-amber-500 fill-amber-500" />
                  </div>
                  
                  <div className="space-y-1.5 z-10 max-w-sm">
                    <h4 className={`text-sm font-semibold transition-colors ${theme === "dark" ? "text-neutral-50" : "text-neutral-950"}`}>
                      Cinematic Interactive Demonstration
                    </h4>
                    <p className={`text-[12px] leading-relaxed transition-colors ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                      See how custom loading screen animations, love stories, live countdowns, and interactive guest relation tree maps appear on actual mobile and desktop invitations.
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowDemo(false)}
                    className={`font-bold text-xs h-9 px-5 rounded-lg border-0 z-10 transition-transform duration-300 hover:scale-[1.02] cursor-pointer ${
                      theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-250" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                    }`}
                  >
                    Start Crafting Your Own
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
