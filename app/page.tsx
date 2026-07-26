/*
THESIS: An immersive Awwwards-tier landing page experience combining the split-column hero customizer with highly interactive Bento feature widgets, step timelines, and a reactive relation tree map.
OWN-WORLD: OLED black backgrounds, radial mesh orbs, infinite outlined marquees, and Outfit display typography.
STORY: Hosts preview card customizers, interact with typography/template selectors in feature widgets, toggle family relationships in tree maps, and start onboarding.
FIRST VIEWPORT: Left: Large bold heading and primary CTAs. Right: Configurator previewer in double-bezel.
FORM: Integrated premium SaaS & Tech-Forward theme with Outfit/Geist typography, dark mode default, and custom spring animations.
*/

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ClipboardCheck,
  LayoutTemplate,
  Mail,
  Palette,
  Play,
  Rocket,
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
  Sparkle,
  ArrowRight,
  Send,
  Eye
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeLandingPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isLoggedIn = !!session;

  // Theme Management
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Interactive Sandboxes states (Hero)
  const [mockEventTitle, setMockEventTitle] = useState("Emma & Nathan's Wedding");
  const [mockAccent, setMockAccent] = useState("amber");
  const [mockTheme, setMockTheme] = useState("Sunset Gold");
  const [mockDate, setMockDate] = useState("December 18, 2026");
  const [mockLocation, setMockLocation] = useState("The Grand Pavilion, CA");

  // Bento Interactive States
  const [bentoTemplate, setBentoTemplate] = useState<"wedding" | "birthday" | "gala">("wedding");
  const [bentoFontWeight, setBentoFontWeight] = useState<string>("font-extrabold");
  const [bentoFontSize, setBentoFontSize] = useState<string>("text-sm");
  const [bentoActiveTab, setBentoActiveTab] = useState<string>("link");

  // Mock RSVP Guest States
  const [mockGuests, setMockGuests] = useState([
    { name: "Mother", relation: "Family", status: "confirmed" },
    { name: "Aryan", relation: "Friend", status: "pending" },
    { name: "Sister", relation: "Family", status: "confirmed" },
    { name: "Thomas", relation: "Colleague", status: "declined" }
  ]);

  // Seating Map Active Group Hover
  const [seatingHoveredGroup, setSeatingHoveredGroup] = useState<string | null>(null);
  const [selectedGuestNode, setSelectedGuestNode] = useState<{ name: string; relation: string; status: string } | null>(null);

  // How it works active step
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
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
    setMockGuests((prev) =>
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

  // Helper classes for colors
  const getAccentColorClass = (accent: string) => {
    switch (accent) {
      case "emerald":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
      case "indigo":
        return "text-indigo-400 border-indigo-500/20 bg-indigo-500/10";
      case "rose":
        return "text-rose-400 border-rose-500/20 bg-rose-500/10";
      case "amber":
      default:
        return "text-amber-400 border-amber-500/20 bg-amber-500/10";
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
        theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-zinc-50 text-neutral-900"
      }`}
    >
      {/* Background Mesh Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-screen bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.06),transparent_65%)] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hairline Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none z-0" />

      {/* 1. FLOATING NAV */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
        <header className="w-full h-14 rounded-full border border-solid border-white/10 bg-neutral-950/80 backdrop-blur-xl px-6 flex justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-white text-neutral-950 flex justify-center items-center font-outfit font-extrabold text-sm">
              K
            </div>
            <span className="font-outfit font-bold tracking-tight text-sm text-white">Kinvite</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-semibold text-[11px] uppercase tracking-wider text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Process</a>
            <a href="#seating-map" className="hover:text-white transition-colors">Seating</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-solid border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle theme mode"
            >
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>

            {sessionPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            ) : isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="h-8 rounded-full text-[10px] font-bold px-4 bg-white text-neutral-950 hover:bg-zinc-200">
                  Workspace
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-[10px] font-bold cursor-pointer text-zinc-400 hover:text-white transition-colors px-1">
                    Sign in
                  </span>
                </Link>
                <Link href="/signup">
                  <Button className="h-8 rounded-full text-[10px] font-bold px-4 bg-amber-500 text-amber-950 hover:bg-amber-600 border-0">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>
      </div>

      {/* 2. SPLIT HERO SECTION */}
      <main className="max-w-7xl mx-auto w-full z-10">
        <section className="grid grid-cols-1 lg:grid-cols-12 px-6 md:px-8 pt-36 pb-20 items-center gap-12 min-h-screen">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-medium border border-solid border-white/10 bg-white/5 text-zinc-400 w-fit">
              <Sparkle className="size-3 text-amber-500 animate-pulse inline-block mr-1.5 align-middle" />
              Redesigned SaaS invitation builder
            </div>

            <h1 className="font-outfit text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
              Digital Invites, <br />
              <span className="text-amber-500">
                Reimagined.
              </span>
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed font-medium text-zinc-400 max-w-xl">
              Kinvite fuses high-end visual invitation cards with back-office guest list management, real-time RSVPs, interactive seating relationship trees, and automated reminders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                <button className="group h-12 pl-6 pr-2 rounded-full font-bold text-xs bg-white text-neutral-950 hover:bg-zinc-200 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3 border-0 active:scale-[0.98]">
                  <span>Create your card</span>
                  <div className="size-8 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                    <Pen className="size-3.5" />
                  </div>
                </button>
              </Link>

              <button
                onClick={() => setShowDemo(true)}
                className="group h-12 pl-6 pr-2 rounded-full font-bold text-xs bg-neutral-900 border border-solid border-white/10 text-white hover:bg-neutral-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3 active:scale-[0.98]"
              >
                <span>Live demo video</span>
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="size-3 text-amber-500 fill-amber-500" />
                </div>
              </button>
            </div>

            {/* Core Metrics */}
            <div className="flex pt-6 items-center gap-6 border-t border-solid border-white/5 mt-4">
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-xl text-white">
                  120K+
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                  Invites sent
                </span>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-xl text-white">
                  99.9%
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                  RSVP delivery
                </span>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-xl text-white">
                  4.9★
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                  Host rating
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer previewer in Double-Bezel layout */}
          <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[500px] rounded-[2rem] p-2 bg-white/5 border border-solid border-white/10 backdrop-blur-md shadow-2xl">
              <div className="rounded-[calc(2rem-0.5rem)] p-5 bg-neutral-950/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col sm:flex-row gap-5 text-left">
                
                {/* Configuration panel */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block">
                      Real-time customize
                    </span>
                    <h3 className="font-outfit font-extrabold text-xs text-white">
                      Dashboard customs previewer
                    </h3>
                  </div>

                  <div className="space-y-3 text-[11px] font-semibold">
                    <div className="space-y-1">
                      <label className="text-zinc-500 block">Event Title</label>
                      <input
                        type="text"
                        value={mockEventTitle}
                        onChange={(e) => setMockEventTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-solid border-white/10 bg-neutral-900 outline-none text-[11px] font-medium focus:border-amber-500 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-500 block">Date</label>
                      <input
                        type="text"
                        value={mockDate}
                        onChange={(e) => setMockDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-solid border-white/10 bg-neutral-900 outline-none text-[11px] font-medium focus:border-amber-500 text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-500 block">Accent Palette</label>
                      <div className="flex gap-2">
                        {["amber", "emerald", "indigo", "rose"].map((accent) => (
                          <button
                            key={accent}
                            onClick={() => setMockAccent(accent)}
                            className={`size-5 rounded-full border border-solid cursor-pointer transition-all flex items-center justify-center ${
                              mockAccent === accent ? "border-white scale-110" : "border-transparent opacity-80 hover:opacity-100"
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

                    <div className="space-y-1.5">
                      <label className="text-zinc-500 block">Background Style</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {["Sunset Gold", "Classic Charcoal", "Midnight Rose"].map((st) => (
                          <button
                            key={st}
                            onClick={() => setMockTheme(st)}
                            className={`py-1 rounded text-[9px] font-bold border border-solid cursor-pointer transition-all ${
                              mockTheme === st
                                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                                : "border-white/5 bg-neutral-900 text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            {st.split(" ")[1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Mockup */}
                <div className="w-[190px] h-[300px] shrink-0 mx-auto rounded-[32px] border-4 border-solid border-zinc-800 bg-neutral-950 overflow-hidden relative shadow-2xl flex flex-col justify-between p-4">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-full bg-zinc-800 flex items-center justify-center z-25">
                    <div className="size-1 rounded-full bg-zinc-900" />
                  </div>

                  <div
                    className={`absolute inset-0 z-10 transition-all duration-500 flex flex-col justify-between p-3 pt-7 text-center ${getPhoneBgClass(
                      mockTheme
                    )}`}
                  >
                    <div className="space-y-2 mt-4">
                      <span
                        className={`text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-solid font-bold ${getAccentColorClass(
                          mockAccent
                        )}`}
                      >
                        Invitation
                      </span>
                      <h4 className="font-heading font-bold text-xs text-white leading-normal truncate px-1">
                        {mockEventTitle || "Emma & Nathan's Wedding"}
                      </h4>
                      <div className="w-6 h-px bg-white/20 mx-auto" />
                    </div>

                    <div className="space-y-1.5 my-2">
                      <div className="flex items-center justify-center gap-1 text-[8px] text-zinc-300 font-medium">
                        <Calendar className="size-2 text-zinc-400" />
                        <span>{mockDate}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[8px] text-zinc-300 font-medium">
                        <MapPin className="size-2 text-zinc-400" />
                        <span className="truncate max-w-[130px]">{mockLocation}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <button
                        className={`w-full py-1.5 rounded-lg text-[9px] font-bold shadow-md cursor-default border-0 ${getAccentBtnClass(
                          mockAccent
                        )}`}
                      >
                        RSVP Online
                      </button>
                      <span className="text-[7px] text-zinc-550 block font-semibold">
                        Designed with Kinvite
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </section>
      </main>

      {/* Outlined Marquee */}
      <section className="w-full bg-[#050505] border-y border-solid border-white/5 py-10 overflow-hidden relative z-10">
        <div className="flex gap-16 animate-marquee whitespace-nowrap text-2xl sm:text-3xl font-outfit font-extrabold uppercase text-zinc-700 tracking-widest select-none">
          <span>Digital wedding layouts</span>
          <span className="text-amber-500">•</span>
          <span>Bespoke milestone customizers</span>
          <span className="text-amber-500">•</span>
          <span>Interactive relation trees</span>
          <span className="text-amber-500">•</span>
          <span>Automated text notifications</span>
          <span className="text-amber-500">•</span>

          <span>Digital wedding layouts</span>
          <span className="text-amber-500">•</span>
          <span>Bespoke milestone customizers</span>
          <span className="text-amber-500">•</span>
          <span>Interactive relation trees</span>
          <span className="text-amber-500">•</span>
          <span>Automated text notifications</span>
          <span className="text-amber-500">•</span>

          <span>Digital wedding layouts</span>
          <span className="text-amber-500">•</span>
          <span>Bespoke milestone customizers</span>
          <span className="text-amber-500">•</span>
          <span>Interactive relation trees</span>
          <span className="text-amber-500">•</span>
          <span>Automated text notifications</span>
        </div>
      </section>

      {/* 3. INTERACTIVE BENTO GRID CAPABILITIES */}
      <section
        id="features"
        className="w-full bg-[#050505] py-24 md:py-36 relative z-10"
      >
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 flex-col gap-16">
          
          <div className="text-center flex flex-col items-center gap-3">
            <span className="font-bold uppercase text-[9px] tracking-[0.2em] text-amber-500">
              Features Suite
            </span>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl leading-none text-white tracking-tight">
              Everything you need to invite in style
            </h2>
            <p className="max-w-xl text-xs leading-relaxed text-zinc-450">
              From the first design layout to the final RSVP, Kinvite handles it all in a breathing bento workspace.
            </p>
          </div>

          {/* Interactive Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1 (Col span 2): Beautiful templates live switcher */}
            <div className="md:col-span-2 rounded-[2rem] p-1.5 bg-white/5 border border-solid border-white/10 backdrop-blur-md">
              <div className="rounded-[calc(2rem-0.375rem)] p-6 bg-neutral-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row justify-between gap-6 min-h-[300px] text-left">
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-3">
                    <div className="size-9 rounded-full bg-white/5 border border-solid border-white/10 flex items-center justify-center text-amber-500">
                      <LayoutTemplate className="size-4.5" />
                    </div>
                    <h3 className="font-outfit font-extrabold text-base text-white">
                      Beautiful templates
                    </h3>
                    <p className="text-[11px] leading-relaxed text-zinc-400 max-w-sm">
                      Choose from hundreds of professionally designed cards for weddings, birthdays, and anniversaries. Toggle presets on the right to preview layouts.
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    {["wedding", "birthday", "gala"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setBentoTemplate(t as "wedding" | "birthday" | "gala")}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border border-solid cursor-pointer transition-all ${
                          bentoTemplate === t
                            ? "border-amber-500 bg-amber-500/10 text-amber-400"
                            : "border-white/5 bg-neutral-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Card Mini-Preview Mockup */}
                <div className="w-full md:w-[220px] rounded-2xl bg-neutral-900/60 border border-solid border-white/5 p-4 flex flex-col justify-between text-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                  
                  <span className="text-[7px] uppercase font-bold tracking-widest text-zinc-550">
                    Live Preset Preview
                  </span>

                  <div className="space-y-1.5 py-6">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-amber-500">
                      Invitation
                    </span>
                    <h4 className="font-outfit font-extrabold text-sm text-white">
                      {bentoTemplate === "wedding" ? "Emma & Nathan" : bentoTemplate === "birthday" ? "Marcus turns 30" : "Anniversary Gala"}
                    </h4>
                    <p className="text-[8px] text-zinc-400">
                      {bentoTemplate === "wedding" ? "December 18, 2026" : bentoTemplate === "birthday" ? "September 12, 2026" : "November 05, 2026"}
                    </p>
                  </div>

                  <span className="text-[7px] text-zinc-650 font-bold block">
                    Catalog Preset
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Card 2 (Col span 1): Easy customization font playground */}
            <div className="rounded-[2rem] p-1.5 bg-white/5 border border-solid border-white/10 backdrop-blur-md">
              <div className="rounded-[calc(2rem-0.375rem)] p-6 bg-neutral-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[300px] text-left">
                <div className="space-y-3">
                  <div className="size-9 rounded-full bg-white/5 border border-solid border-white/10 flex items-center justify-center text-amber-500">
                    <Palette className="size-4.5" />
                  </div>
                  <h3 className="font-outfit font-extrabold text-base text-white">
                    Easy customization
                  </h3>
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Change colors, fonts, and photos with a simple editor. Test layout typography below.
                  </p>
                </div>

                <div className="border border-solid border-white/5 rounded-xl p-3 bg-neutral-900/60 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-450 border-b border-solid border-white/5 pb-2">
                    <span>Font Weights</span>
                    <div className="flex gap-1.5">
                      {["font-normal", "font-bold", "font-extrabold"].map((w) => (
                        <button
                          key={w}
                          onClick={() => setBentoFontWeight(w)}
                          className={`px-1.5 py-0.5 rounded text-[8px] border border-solid cursor-pointer ${
                            bentoFontWeight === w ? "border-amber-500 text-amber-400 bg-amber-500/10" : "border-white/5 text-zinc-400"
                          }`}
                        >
                          {w.split("-")[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className={`font-outfit text-center text-white ${bentoFontWeight}`}>
                    Kinvite Display Title
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (Col span 1): Share instantly toggle tab */}
            <div className="rounded-[2rem] p-1.5 bg-white/5 border border-solid border-white/10 backdrop-blur-md">
              <div className="rounded-[calc(2rem-0.375rem)] p-6 bg-neutral-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[300px] text-left">
                <div className="space-y-3">
                  <div className="size-9 rounded-full bg-white/5 border border-solid border-white/10 flex items-center justify-center text-amber-500">
                    <Share2 className="size-4.5" />
                  </div>
                  <h3 className="font-outfit font-extrabold text-base text-white">
                    Share instantly
                  </h3>
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Send your invites via link, email, or social media and watch your guest list fill up.
                  </p>
                </div>

                <div className="space-y-2 border border-solid border-white/5 rounded-xl p-3 bg-neutral-900/60">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400">
                    <span>Copyable Invitation Link</span>
                    <button className="text-amber-500 text-[8px] font-bold uppercase hover:text-amber-450">
                      Copy
                    </button>
                  </div>
                  <div className="w-full bg-neutral-950/60 border border-solid border-white/5 rounded px-2.5 py-1 text-[8px] text-zinc-400 truncate">
                    https://kinvite.app/invite/emma-nathan-wedding
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 4 (Col span 2): RSVP tracking guest counters */}
            <div className="md:col-span-2 rounded-[2rem] p-1.5 bg-white/5 border border-solid border-white/10 backdrop-blur-md">
              <div className="rounded-[calc(2rem-0.375rem)] p-6 bg-neutral-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row justify-between gap-6 min-h-[300px] text-left">
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-3">
                    <div className="size-9 rounded-full bg-white/5 border border-solid border-white/10 flex items-center justify-center text-amber-500">
                      <ClipboardCheck className="size-4.5" />
                    </div>
                    <h3 className="font-outfit font-extrabold text-base text-white">
                      RSVP tracking
                    </h3>
                    <p className="text-[11px] leading-relaxed text-zinc-400 max-w-sm">
                      Keep track of who is coming in real time with built-in RSVP management. Click guest badges on the right to toggle database statuses.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider font-bold text-zinc-550 mt-4">
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-400" /> Confirmed</span>
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-amber-400" /> Pending</span>
                    <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-rose-450" /> Declined</span>
                  </div>
                </div>

                {/* RSVP Clickable Roster List */}
                <div className="w-full md:w-[220px] rounded-2xl bg-neutral-900/60 border border-solid border-white/5 p-4 flex flex-col gap-2 shrink-0 justify-center">
                  {mockGuests.map((guest, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleGuestStatus(idx)}
                      className="flex justify-between items-center text-[10px] p-2.5 rounded-xl bg-neutral-950/60 border border-solid border-white/5 cursor-pointer hover:bg-neutral-900 transition-colors"
                    >
                      <span className="text-zinc-350 font-bold text-[9px]">{guest.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-extrabold uppercase text-[7px] tracking-wider ${
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
              </div>
            </div>

            {/* Bento Card 5 (Col span 1): Smart reminders */}
            <div className="rounded-[2rem] p-1.5 bg-white/5 border border-solid border-white/10 backdrop-blur-md">
              <div className="rounded-[calc(2rem-0.375rem)] p-6 bg-neutral-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between min-h-[300px] text-left">
                <div className="space-y-3">
                  <div className="size-9 rounded-full bg-white/5 border border-solid border-white/10 flex items-center justify-center text-amber-500">
                    <Bell className="size-4.5" />
                  </div>
                  <h3 className="font-outfit font-extrabold text-base text-white">
                    Smart reminders
                  </h3>
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Automatically remind your guests so no one ever misses your special moment.
                  </p>
                </div>

                <div className="border border-solid border-white/5 rounded-xl p-3 bg-neutral-900/60 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Send className="size-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h5 className="text-[9px] font-bold text-white uppercase tracking-wider">Auto-reminders active</h5>
                    <p className="text-[8px] text-zinc-450 leading-normal">Invites auto-resend to pending guests 48h before RSVPs close.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 6 (Col span 2): Works everywhere */}
            <div className="md:col-span-2 rounded-[2rem] p-1.5 bg-white/5 border border-solid border-white/10 backdrop-blur-md">
              <div className="rounded-[calc(2rem-0.375rem)] p-6 bg-neutral-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row justify-between gap-6 min-h-[300px] text-left">
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-3">
                    <div className="size-9 rounded-full bg-white/5 border border-solid border-white/10 flex items-center justify-center text-amber-500">
                      <Smartphone className="size-4.5" />
                    </div>
                    <h3 className="font-outfit font-extrabold text-base text-white">
                      Works everywhere
                    </h3>
                    <p className="text-[11px] leading-relaxed text-zinc-400 max-w-sm">
                      Your invitations look perfect on every device, scaling fluidly from mobile smartphones to ultra-wide desktop monitors.
                    </p>
                  </div>
                  
                  <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-550 block mt-4">
                    Adaptive Rendering Engine
                  </span>
                </div>

                {/* Device responsive preview wireframe */}
                <div className="w-full md:w-[220px] rounded-2xl bg-neutral-900/60 border border-solid border-white/5 p-4 flex flex-col gap-4 shrink-0 justify-center items-center">
                  <div className="w-28 h-20 rounded border border-solid border-white/10 bg-neutral-950/60 p-2 relative flex flex-col justify-between">
                    <div className="w-10 h-1 bg-white/10 rounded" />
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-white/5 rounded" />
                      <div className="w-8 h-1 bg-white/5 rounded" />
                    </div>
                    <span className="absolute bottom-1 right-2 text-[5px] uppercase font-bold text-zinc-650">Desktop</span>
                  </div>
                  <div className="w-12 h-20 rounded-xl border border-solid border-white/10 bg-neutral-950/60 p-2 relative flex flex-col justify-between">
                    <div className="w-4 h-1 bg-white/10 rounded mx-auto" />
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-white/5 rounded" />
                      <div className="w-6 h-1 bg-white/5 rounded" />
                    </div>
                    <span className="absolute bottom-1 left-0 right-0 text-center text-[5px] uppercase font-bold text-zinc-650">Mobile</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        className="w-full bg-[#050505] py-24 md:py-36 border-t border-solid border-white/5 relative z-10"
      >
        <div className="max-w-[1140px] mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          
          {/* Dynamic Interactive Preview Mockup Box */}
          <div className="rounded-[2.5rem] p-2 bg-white/5 border border-solid border-white/10 backdrop-blur-md shadow-2xl">
            <div className="rounded-[calc(2.5rem-0.5rem)] h-[340px] border border-solid border-white/15 bg-neutral-950 relative flex items-center justify-center overflow-hidden p-6">
              
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex flex-col justify-between"
                  >
                    <span className="text-[8px] uppercase tracking-widest text-zinc-550 font-bold block text-left">
                      Template Selection Workspace
                    </span>
                    
                    {/* Fan stacked mockup templates */}
                    <div className="relative flex justify-center items-center h-44 mt-4 w-full">
                      {/* Left card */}
                      <div className="absolute -translate-x-14 -rotate-12 w-28 h-40 rounded-xl bg-gradient-to-b from-purple-950/40 to-neutral-900 border border-solid border-white/5 p-3 flex flex-col justify-between text-center select-none opacity-60">
                        <span className="text-[6px] uppercase tracking-widest text-purple-400 font-bold">Midnight Rose</span>
                        <div className="w-5 h-px bg-white/20 mx-auto" />
                        <span className="text-[6px] text-zinc-600 font-semibold">Gala</span>
                      </div>

                      {/* Right card */}
                      <div className="absolute translate-x-14 rotate-12 w-28 h-40 rounded-xl bg-gradient-to-b from-zinc-900 to-neutral-950 border border-solid border-white/5 p-3 flex flex-col justify-between text-center select-none opacity-60">
                        <span className="text-[6px] uppercase tracking-widest text-zinc-400 font-bold">Classic Charcoal</span>
                        <div className="w-5 h-px bg-white/20 mx-auto" />
                        <span className="text-[6px] text-zinc-600 font-semibold">Birthday</span>
                      </div>

                      {/* Main Center Active card */}
                      <div className="absolute z-10 w-32 h-44 rounded-2xl bg-gradient-to-b from-amber-950/20 to-neutral-900 border border-solid border-amber-500/30 p-3 flex flex-col justify-between text-center shadow-2xl">
                        <span className="text-[7px] uppercase tracking-widest text-amber-500 font-bold">Sunset Gold</span>
                        <div className="space-y-1">
                          <h5 className="font-outfit font-bold text-[10px] text-white">Emma & Nathan</h5>
                          <p className="text-[6px] text-zinc-450">Wedding ceremony invite</p>
                        </div>
                        <div className="w-6 h-px bg-white/20 mx-auto" />
                        <span className="text-[6px] text-zinc-650 font-bold">Recommended</span>
                      </div>
                    </div>

                    <span className="text-[7px] text-zinc-650 font-bold text-left block">
                      Choose from fanned visual formats
                    </span>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex flex-col justify-between text-left"
                  >
                    <span className="text-[8px] uppercase tracking-widest text-zinc-550 font-bold block">
                      Visual Editor Sandbox
                    </span>

                    <div className="flex gap-4 items-center my-auto">
                      {/* Customizer Sidebar controls mockup */}
                      <div className="w-36 space-y-2 border border-solid border-white/5 rounded-xl p-2.5 bg-neutral-900/60 text-[9px] font-bold">
                        <div className="space-y-1">
                          <span className="text-zinc-500 block text-[7px] uppercase">Font Family</span>
                          <div className="w-full py-1 px-2 rounded bg-neutral-950 text-white border border-solid border-white/5 flex justify-between items-center font-medium">
                            <span>Outfit Display</span>
                            <ChevronRight className="size-2 text-zinc-500" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-500 block text-[7px] uppercase">Accent Theme</span>
                          <div className="flex gap-1">
                            <span className="size-3.5 rounded-full bg-amber-500 border border-white" />
                            <span className="size-3.5 rounded-full bg-emerald-500" />
                            <span className="size-3.5 rounded-full bg-indigo-500" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-500 block text-[7px] uppercase">Card Scale</span>
                          <div className="w-full h-1 bg-white/10 rounded relative flex items-center">
                            <div className="w-2/3 h-full bg-amber-500 rounded" />
                            <div className="size-2.5 rounded-full bg-white absolute left-2/3 -translate-x-1/2" />
                          </div>
                        </div>
                      </div>

                      {/* Card layout preview mockup */}
                      <div className="flex-1 h-36 rounded-xl bg-gradient-to-b from-amber-950/10 to-neutral-950 border border-solid border-white/10 p-3 flex flex-col justify-between text-center">
                        <span className="text-[6px] uppercase tracking-widest text-amber-400 font-bold">Invitation Card</span>
                        <h4 className="font-outfit font-extrabold text-[11px] text-white">Emma & Nathan</h4>
                        <div className="w-6 h-px bg-white/20 mx-auto" />
                        <span className="text-[6px] text-zinc-600 block">Personalized in real-time</span>
                      </div>
                    </div>

                    <span className="text-[7px] text-zinc-650 font-bold block">
                      Edit typography variables dynamically
                    </span>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex flex-col justify-between text-left"
                  >
                    <span className="text-[8px] uppercase tracking-widest text-zinc-550 font-bold block">
                      Instant Delivery & Sync
                    </span>

                    <div className="flex flex-col sm:flex-row gap-4 items-center my-auto">
                      {/* Messaging chat thread mockup */}
                      <div className="w-48 space-y-2 border border-solid border-white/5 rounded-xl p-2.5 bg-neutral-900/60 text-[8px] leading-relaxed font-bold">
                        <div className="rounded bg-neutral-950/60 p-2 border border-solid border-white/5 text-zinc-400">
                          <span className="text-amber-500 font-bold block text-[6px] uppercase tracking-wider mb-0.5">Inviter link</span>
                          Hey, checkout the wedding invite link: kinvite.app/invite/emma-nathan
                        </div>
                        <div className="rounded bg-emerald-500/10 p-2 border border-solid border-emerald-500/20 text-emerald-400 w-fit ml-auto">
                          Confirmed! RSVP list synced!
                        </div>
                      </div>

                      {/* Delivery Status dashboard */}
                      <div className="flex-1 flex flex-col items-center justify-center space-y-2 text-center p-3 rounded-xl border border-solid border-white/5 bg-neutral-950/80">
                        <span className="text-[7px] uppercase font-bold text-zinc-550">RSVP Status</span>
                        <div className="relative size-14 flex items-center justify-center">
                          <svg className="size-full -rotate-95" viewBox="0 0 36 36">
                            <path className="text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-amber-500" stroke="currentColor" strokeWidth="3" strokeDasharray="88, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <span className="absolute font-outfit font-extrabold text-[9px] text-white">88%</span>
                        </div>
                        <span className="text-[6px] text-zinc-550 block font-semibold">Delivery active</span>
                      </div>
                    </div>

                    <span className="text-[7px] text-zinc-650 font-bold block">
                      Collect responses instantly with real-time logs
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Interactive Steps timelines */}
          <div className="flex flex-col gap-6 text-left">
            <span className="font-bold uppercase text-[9px] tracking-[0.2em] text-amber-500">
              How it works
            </span>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight text-white">
              From idea to invite in three simple steps
            </h2>

            <div className="flex flex-col gap-4 mt-4">
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
              ].map((item) => {
                const isActive = activeStep === item.step;
                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveStep(item.step)}
                    className={`flex gap-4 p-4 rounded-2xl border border-solid cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isActive
                        ? "border-white/15 bg-white/5"
                        : "border-transparent bg-transparent hover:bg-white/2"
                    }`}
                  >
                    <div className={`size-9 shrink-0 font-outfit font-extrabold rounded-full text-xs border border-solid flex justify-center items-center transition-colors duration-500 ${
                      isActive ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-white/10 bg-white/5 text-zinc-400"
                    }`}>
                      {item.step}
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <h4 className={`font-outfit font-bold text-sm transition-colors ${isActive ? "text-white" : "text-zinc-350"}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-zinc-450">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 5. RELATION TREE MAP SECTION (INTERACTIVE SVG DEMO WITH HOVER GLOWS) */}
      <section
        id="seating-map"
        className="w-full bg-[#050505] py-24 md:py-36 border-t border-solid border-white/5 relative z-10"
      >
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 flex-col items-center gap-16">
          
          <div className="text-center flex flex-col items-center gap-3">
            <span className="font-bold uppercase text-[9px] tracking-[0.2em] text-amber-500">
              Relation Tree Map
            </span>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight text-white">
              Visualize who's coming and how they're connected
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-zinc-400">
              See your guests grouped by relationship (family, close friends, colleagues) all in one interactive workspace. Hover on groups below to illuminate connection links.
            </p>
          </div>

          {/* Double-Bezel Card frame */}
          <div className="w-full rounded-[2.5rem] p-2.5 bg-white/5 border border-solid border-white/10 backdrop-blur-md shadow-2xl">
            <div className="rounded-[calc(2.5rem-0.625rem)] p-6 md:p-8 bg-neutral-950/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] w-full overflow-hidden relative">
              
              {/* Floating Node Status Inspector Overlay */}
              <AnimatePresence>
                {selectedGuestNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-4 right-4 z-30 w-52 rounded-xl p-3 border border-solid border-white/10 bg-neutral-900/90 backdrop-blur-md text-left text-[10px] space-y-2 shadow-2xl"
                  >
                    <div className="flex justify-between items-center border-b border-solid border-white/5 pb-1.5">
                      <span className="font-bold text-white">{selectedGuestNode.name}</span>
                      <button
                        onClick={() => setSelectedGuestNode(null)}
                        className="text-zinc-500 hover:text-white p-0.5 border-0 bg-transparent"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-zinc-450">
                        <span>Group</span>
                        <span className="font-bold text-zinc-300">{selectedGuestNode.relation}</span>
                      </div>
                      <div className="flex justify-between text-zinc-450 font-semibold">
                        <span>Status</span>
                        <span className={`uppercase text-[8px] font-extrabold ${
                          selectedGuestNode.status === "confirmed" ? "text-emerald-450" : selectedGuestNode.status === "pending" ? "text-amber-500" : "text-rose-500"
                        }`}>{selectedGuestNode.status}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scrollable Container for Mobile Responsiveness */}
              <div className="w-full overflow-x-auto scrollbar-none pb-4">
                <div className="relative mx-auto w-[780px] h-[340px] shrink-0">
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 780 340"
                    fill="none"
                  >
                    {/* Paths to Family */}
                    <path
                      d="M390 60 C 250 100, 180 100, 130 150"
                      stroke="rgba(245, 158, 11, 0.4)"
                      strokeWidth={seatingHoveredGroup === "family" ? "3" : "1"}
                      className="transition-all duration-300"
                    />
                    {/* Paths to Friends */}
                    <path
                      d="M390 60 C 390 110, 390 110, 390 150"
                      stroke="rgba(14, 165, 233, 0.4)"
                      strokeWidth={seatingHoveredGroup === "friends" ? "3" : "1"}
                      className="transition-all duration-300"
                    />
                    {/* Paths to Colleagues */}
                    <path
                      d="M390 60 C 530 100, 600 100, 650 150"
                      stroke="rgba(139, 92, 246, 0.4)"
                      strokeWidth={seatingHoveredGroup === "colleagues" ? "3" : "1"}
                      className="transition-all duration-300"
                    />

                    {/* Leaf connections (Family) */}
                    {["55", "110", "160", "215"].map((xVal) => (
                      <path
                        key={xVal}
                        d={`M130 175 C ${xVal} 230, ${xVal} 240, ${xVal} 270`}
                        stroke="rgba(245, 158, 11, 0.3)"
                        strokeWidth={seatingHoveredGroup === "family" ? "2" : "0.5"}
                        className="transition-all duration-300"
                      />
                    ))}

                    {/* Leaf connections (Friends) */}
                    {["320", "375", "425", "480"].map((xVal) => (
                      <path
                        key={xVal}
                        d={`M390 175 C ${xVal} 230, ${xVal} 240, ${xVal} 270`}
                        stroke="rgba(14, 165, 233, 0.3)"
                        strokeWidth={seatingHoveredGroup === "friends" ? "2" : "0.5"}
                        className="transition-all duration-300"
                      />
                    ))}

                    {/* Leaf connections (Colleagues) */}
                    {["585", "650", "715"].map((xVal) => (
                      <path
                        key={xVal}
                        d={`M650 175 C ${xVal} 230, ${xVal} 240, ${xVal} 270`}
                        stroke="rgba(139, 92, 246, 0.3)"
                        strokeWidth={seatingHoveredGroup === "colleagues" ? "2" : "0.5"}
                        className="transition-all duration-300"
                      />
                    ))}
                  </svg>
                  
                  {/* Host node */}
                  <div className="left-[390px] -translate-x-1/2 -translate-y-1/2 size-14 shadow-md font-outfit font-extrabold rounded-full text-xs leading-5 flex absolute top-[30px] justify-center items-center bg-white text-neutral-950 border border-white/20 select-none">
                    You
                  </div>

                  {/* Mid tier groups */}
                  <div
                    onMouseEnter={() => setSeatingHoveredGroup("family")}
                    onMouseLeave={() => setSeatingHoveredGroup(null)}
                    className="left-[130px] -translate-x-1/2 -translate-y-1/2 size-11 shadow font-outfit font-bold rounded-full bg-amber-500/10 border border-solid border-amber-500/30 text-amber-500 text-[10px] flex absolute top-[162px] justify-center items-center cursor-pointer transition-all hover:scale-105"
                  >
                    Family
                  </div>
                  <div
                    onMouseEnter={() => setSeatingHoveredGroup("friends")}
                    onMouseLeave={() => setSeatingHoveredGroup(null)}
                    className="left-[390px] -translate-x-1/2 -translate-y-1/2 size-11 shadow font-outfit font-bold rounded-full bg-sky-500/10 border border-solid border-sky-500/30 text-sky-400 text-[10px] flex absolute top-[162px] justify-center items-center cursor-pointer transition-all hover:scale-105"
                  >
                    Friends
                  </div>
                  <div
                    onMouseEnter={() => setSeatingHoveredGroup("colleagues")}
                    onMouseLeave={() => setSeatingHoveredGroup(null)}
                    className="left-[650px] -translate-x-1/2 -translate-y-1/2 size-11 shadow font-outfit font-bold rounded-full bg-violet-500/10 border border-solid border-violet-500/30 text-violet-400 text-[10px] flex absolute top-[162px] justify-center items-center cursor-pointer transition-all hover:scale-105"
                  >
                    Colleagues
                  </div>

                  {/* Leaf nodes */}
                  {/* Family */}
                  {[
                    { name: "Mom", key: "MO", left: "55px", status: "confirmed" },
                    { name: "Dad", key: "DA", left: "110px", status: "confirmed" },
                    { name: "Sister", key: "SI", left: "160px", status: "pending" },
                    { name: "Uncle", key: "UN", left: "215px", status: "declined" }
                  ].map((node) => (
                    <div
                      key={node.name}
                      onClick={() => setSelectedGuestNode({ name: node.name, relation: "Family", status: node.status })}
                      className="flex flex-col items-center gap-1 absolute top-[290px] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: node.left }}
                    >
                      <div className={`relative size-9 font-bold rounded-full bg-neutral-900 border border-solid flex justify-center items-center text-[9px] transition-all duration-300 ${
                        seatingHoveredGroup === "family" ? "border-amber-500 text-amber-400 scale-105 shadow-md shadow-amber-500/5" : "border-white/10 text-amber-500"
                      }`}>
                        {node.key}
                        <span className={`size-2 rounded-full absolute -right-0.5 -bottom-0.5 border border-black ${
                          node.status === "confirmed" ? "bg-emerald-400" : node.status === "pending" ? "bg-amber-400" : "bg-rose-455"
                        }`} />
                      </div>
                      <span className="text-[9px] font-bold text-zinc-550">{node.name}</span>
                    </div>
                  ))}

                  {/* Friends */}
                  {[
                    { name: "Aryan", key: "AR", left: "320px", status: "confirmed" },
                    { name: "Priya", key: "PR", left: "375px", status: "pending" },
                    { name: "Leo", key: "LE", left: "425px", status: "confirmed" },
                    { name: "Mia", key: "MI", left: "480px", status: "declined" }
                  ].map((node) => (
                    <div
                      key={node.name}
                      onClick={() => setSelectedGuestNode({ name: node.name, relation: "Friend", status: node.status })}
                      className="flex flex-col items-center gap-1 absolute top-[290px] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: node.left }}
                    >
                      <div className={`relative size-9 font-bold rounded-full bg-neutral-900 border border-solid flex justify-center items-center text-[9px] transition-all duration-300 ${
                        seatingHoveredGroup === "friends" ? "border-sky-500 text-sky-400 scale-105 shadow-md shadow-sky-500/5" : "border-white/10 text-sky-400"
                      }`}>
                        {node.key}
                        <span className={`size-2 rounded-full absolute -right-0.5 -bottom-0.5 border border-black ${
                          node.status === "confirmed" ? "bg-emerald-400" : node.status === "pending" ? "bg-amber-400" : "bg-rose-455"
                        }`} />
                      </div>
                      <span className="text-[9px] font-bold text-zinc-550">{node.name}</span>
                    </div>
                  ))}

                  {/* Colleagues */}
                  {[
                    { name: "Rahul", key: "RA", left: "585px", status: "confirmed" },
                    { name: "Sara", key: "SA", left: "650px", status: "pending" },
                    { name: "Tom", key: "TO", left: "715px", status: "confirmed" }
                  ].map((node) => (
                    <div
                      key={node.name}
                      onClick={() => setSelectedGuestNode({ name: node.name, relation: "Colleague", status: node.status })}
                      className="flex flex-col items-center gap-1 absolute top-[290px] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: node.left }}
                    >
                      <div className={`relative size-9 font-bold rounded-full bg-neutral-900 border border-solid flex justify-center items-center text-[9px] transition-all duration-300 ${
                        seatingHoveredGroup === "colleagues" ? "border-violet-500 text-violet-400 scale-105 shadow-md shadow-violet-500/5" : "border-white/10 text-violet-400"
                      }`}>
                        {node.key}
                        <span className={`size-2 rounded-full absolute -right-0.5 -bottom-0.5 border border-black ${
                          node.status === "confirmed" ? "bg-emerald-400" : node.status === "pending" ? "bg-amber-400" : "bg-rose-455"
                        }`} />
                      </div>
                      <span className="text-[9px] font-bold text-zinc-550">{node.name}</span>
                    </div>
                  ))}

                </div>
              </div>

              {/* Seating Map Interactive Legends */}
              <div className="flex flex-wrap justify-center items-center gap-3.5 mt-8 border-t border-solid border-white/5 pt-6 select-none">
                <button
                  onMouseEnter={() => setSeatingHoveredGroup("family")}
                  onMouseLeave={() => setSeatingHoveredGroup(null)}
                  className={`rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-wider font-bold border border-solid transition-all duration-300 ${
                    seatingHoveredGroup === "family"
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-amber-500/20 bg-amber-500/5 text-amber-500/80"
                  }`}
                >
                  Family
                </button>
                <button
                  onMouseEnter={() => setSeatingHoveredGroup("friends")}
                  onMouseLeave={() => setSeatingHoveredGroup(null)}
                  className={`rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-wider font-bold border border-solid transition-all duration-300 ${
                    seatingHoveredGroup === "friends"
                      ? "border-sky-500 bg-sky-500/10 text-sky-400"
                      : "border-sky-500/20 bg-sky-500/5 text-sky-400/80"
                  }`}
                >
                  Friends
                </button>
                <button
                  onMouseEnter={() => setSeatingHoveredGroup("colleagues")}
                  onMouseLeave={() => setSeatingHoveredGroup(null)}
                  className={`rounded-full px-3.5 py-1.5 text-[9px] uppercase tracking-wider font-bold border border-solid transition-all duration-300 ${
                    seatingHoveredGroup === "colleagues"
                      ? "border-violet-500 bg-violet-500/10 text-violet-400"
                      : "border-violet-500/20 bg-violet-500/5 text-violet-400/80"
                  }`}
                >
                  Colleagues
                </button>
                
                <div className="w-px h-4 bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Confirmed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-450" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Declined</span>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowDemo(true)}
                  className="group h-10 pl-5 pr-2 rounded-full font-bold text-[10px] bg-neutral-900 border border-solid border-white/10 text-white hover:bg-neutral-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3 active:scale-[0.98]"
                >
                  <span>Interactive Workspace Demo</span>
                  <div className="size-6 rounded-full bg-white/10 flex items-center justify-center">
                    <MousePointer className="size-3 text-amber-500" />
                  </div>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="max-w-[1140px] w-full mx-auto px-6 md:px-8 py-12 relative z-10">
        <div className="rounded-[2.5rem] p-2 bg-white/5 border border-solid border-white/10 backdrop-blur-md shadow-2xl">
          <div className="rounded-[calc(2.5rem-0.5rem)] p-10 md:p-14 bg-gradient-to-tr from-neutral-950 to-neutral-900/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
            
            <div className="max-w-lg space-y-3">
              <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white">
                Ready to create your first invitation?
              </h2>
              <p className="text-xs leading-relaxed text-zinc-450">
                Join thousands of hosts who make their celebrations unforgettable with Kinvite. It is free to get started.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 w-full md:w-auto shrink-0">
              <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full">
                <button className="group h-12 pl-6 pr-2 rounded-full font-bold text-xs bg-amber-500 text-amber-950 hover:bg-amber-600 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center gap-3 border-0 active:scale-[0.98] w-full">
                  <span>Start crafting for free</span>
                  <div className="size-8 rounded-full bg-amber-950/10 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                    <ArrowRight className="size-3.5 stroke-[2.5]" />
                  </div>
                </button>
              </Link>
              <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">
                No credit card required
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-solid border-white/5 bg-neutral-950 w-full py-12 z-10">
        <div className="max-w-[1140px] flex flex-col sm:flex-row mx-auto px-6 md:px-8 justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-wider text-zinc-650">
          
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-white text-neutral-950 flex items-center justify-center font-outfit font-extrabold text-xs">
              K
            </div>
            <span className="font-outfit font-bold tracking-tight text-white normal-case">Kinvite</span>
          </div>

          <nav className="flex gap-8 text-zinc-550">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Support</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {[
              { title: "Twitter", href: "https://twitter.com", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { title: "Instagram", href: "https://instagram.com", rect: true },
              { title: "Facebook", href: "https://facebook.com", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }
            ].map((social, sIdx) => (
              <a
                key={sIdx}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="size-8 rounded-full bg-white/5 border border-solid border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title={social.title}
              >
                {social.rect ? (
                  <svg className="size-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                ) : (
                  <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                )}
              </a>
            ))}
          </div>

        </div>
        
        <div className="text-center text-[9px] font-bold uppercase tracking-wider text-zinc-650 border-t border-solid border-white/5 pt-6 mt-6 max-w-[1140px] mx-auto px-6">
          © 2026 Kinvite. All rights reserved.
        </div>
      </footer>

      {/* 9. WATCH DEMO MODAL */}
      <AnimatePresence>
        {showDemo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="border border-solid border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative bg-neutral-950 text-left"
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 p-2 rounded-full cursor-pointer text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <h3 className="font-outfit font-extrabold text-xs uppercase tracking-wider text-zinc-400">
                    Kinvite Workspace Tour
                  </h3>
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-solid border-white/5 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-inner relative bg-neutral-900/60">
                  <div className="size-14 rounded-full bg-amber-500/10 border border-solid border-amber-500/25 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
                  </div>

                  <div className="space-y-1.5 max-w-xs">
                    <h4 className="text-xs font-bold text-white">Personalization & RSVP Workflow</h4>
                    <p className="text-[10px] leading-relaxed text-zinc-450">
                      See how custom loading screen animations, love stories, live countdowns, and interactive guest relation maps appear on actual invitations.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowDemo(false);
                      router.push("/signup");
                    }}
                    className="font-bold text-[10px] h-8 px-5 rounded-lg border-0 bg-amber-500 hover:bg-amber-600 text-amber-950"
                  >
                    Start crafting
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
