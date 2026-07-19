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
  Pen
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
  const [activeStep, setActiveStep] = useState(1);
  const [showDemo, setShowDemo] = useState(false);

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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#120F0F] text-[#F3EFEA]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden ${theme === "dark" ? "bg-neutral-950 text-neutral-50" : "bg-zinc-50 text-neutral-950"} transition-colors duration-500 font-sans`}>
      
      {/* Dynamic Ambient Blur Background Elements */}
      <AnimatePresence>
        {theme === "dark" ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-[140px] pointer-events-none z-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/4 w-[700px] h-[700px] bg-[#B76E79] rounded-full blur-[160px] pointer-events-none z-0"
            />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E6C575]/30 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-[#B76E79]/15 rounded-full blur-[140px] pointer-events-none z-0"
            />
          </>
        )}
      </AnimatePresence>

      {/* 1. STICKY HEADER WITH PREMIUM GLASSMORPHIC NAVIGATION */}
      <header className={`sticky z-50 backdrop-blur-lg shadow-sm border-b border-solid top-0 w-full transition-colors duration-300 ${
        theme === "dark" ? "bg-neutral-900/70 border-white/10" : "bg-white/70 border-neutral-200/40"
      }`}>
        <div className="max-w-[1140px] flex mx-auto px-6 md:px-8 justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className={`size-9 rounded-lg flex justify-center items-center shadow-md transition-colors duration-300 ${
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

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Home", href: "/", icon: Home, active: true },
              { label: "Features", href: "/#features", icon: Sparkles },
              { label: "Pricing", href: "/pricing", icon: DollarSign },
              { label: "About", href: "/about", icon: Info },
              { label: "Contact", href: "/contact", icon: Mail },
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <a
                  key={idx}
                  href={link.href}
                  className={`font-semibold rounded-lg text-sm leading-5 flex px-3 py-2 items-center gap-1.5 cursor-pointer transition-all ${
                    link.active
                      ? theme === "dark"
                        ? "text-neutral-50 border-neutral-50 border-t-0 border-r-0 border-b-2 border-l-0 border-solid"
                        : "text-neutral-950 border-neutral-950 border-t-0 border-r-0 border-b-2 border-l-0 border-solid"
                      : theme === "dark"
                        ? "text-neutral-400 hover:text-neutral-50"
                        : "text-neutral-500 hover:text-neutral-950"
                  }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Sun/Moon Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg border border-solid transition-colors duration-300 cursor-pointer ${
                theme === "dark" ? "border-white/10 text-neutral-50 hover:bg-white/5" : "border-neutral-200 text-neutral-900 hover:bg-black/5"
              }`}
              aria-label="Toggle Theme Mode"
            >
              {theme === "dark" ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-neutral-800" />
              )}
            </motion.button>

            {/* Better Auth dynamic session checks */}
            {sessionPending ? (
              <div className="w-20 h-9 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              </div>
            ) : isLoggedIn ? (
              <Link href="/dashboard">
                <Button className={`text-sm leading-5 font-bold rounded-lg px-4 h-9 shadow transition-colors duration-300 border-0 ${
                  theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                }`}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className={`text-sm leading-5 font-semibold transition-colors ${
                    theme === "dark" ? "text-neutral-50 hover:bg-white/5" : "text-neutral-900 hover:bg-black/5"
                  }`}>
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className={`text-sm leading-5 font-bold rounded-lg px-4 h-9 shadow transition-colors duration-300 border-0 ${
                    theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                  }`}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="max-w-[1140px] mx-auto w-full">
        <section className="grid grid-cols-1 lg:grid-cols-2 px-6 md:px-8 py-12 lg:py-16 items-center gap-12 h-screen">
          <div className="flex flex-col gap-6 text-left">
            <div className={`inline-flex font-medium rounded-full text-xs leading-4 px-4 py-2 items-center gap-2 w-fit ${
              theme === "dark" ? "bg-neutral-800 text-neutral-100" : "bg-neutral-200/60 text-neutral-900 border border-neutral-300/40"
            }`}>
              <Sparkles className="size-3.5 text-amber-500 animate-pulse" />
              Create beautiful invitations in minutes
            </div>
            <p className={`text-lg md:text-2xl leading-tight tracking-tight transition-colors duration-300 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-950"
            }`}>
              Knivite makes it effortless to craft stunning digital invitation cards
              for any occasion. Pick a template, personalize it, and share the joy
              in just a few clicks.
            </p>
            <div className="h-2" />

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className={`gap-2 font-bold h-12 px-6 rounded-xl transition-colors duration-300 border-0 ${
                    theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                  }`}>
                    <Pen className="size-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className={`gap-2 font-bold h-12 px-6 rounded-xl transition-colors duration-300 border-0 ${
                    theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
                  }`}>
                    <Pen className="size-4" />
                    Create your card
                  </Button>
                </Link>
              )}
              
              <Button
                variant="outline"
                onClick={() => setShowDemo(true)}
                className={`bg-transparent gap-2 h-12 px-6 rounded-xl transition-all border border-solid ${
                  theme === "dark" ? "text-neutral-50 border-white/15 hover:bg-white/5" : "text-neutral-950 border-neutral-300 hover:bg-black/5"
                }`}
              >
                <Play className="size-4 fill-current text-amber-500" />
                Watch demo
              </Button>
            </div>

            <div className="flex pt-2 items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className={`font-bold text-2xl leading-8 transition-colors duration-300 ${
                  theme === "dark" ? "text-neutral-50" : "text-neutral-950"
                }`}>
                  120K+
                </span>
                <span className={`text-sm leading-5 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                  Invitations sent
                </span>
              </div>
              <div className={`w-px h-10 ${theme === "dark" ? "bg-white/10" : "bg-neutral-250"}`} />
              <div className="flex flex-col gap-1">
                <span className={`font-bold text-2xl leading-8 transition-colors duration-300 ${
                  theme === "dark" ? "text-neutral-50" : "text-neutral-950"
                }`}>
                  500+
                </span>
                <span className={`text-sm leading-5 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                  Templates
                </span>
              </div>
              <div className={`w-px h-10 ${theme === "dark" ? "bg-white/10" : "bg-neutral-250"}`} />
              <div className="flex flex-col gap-1">
                <span className={`font-bold text-2xl leading-8 transition-colors duration-300 ${
                  theme === "dark" ? "text-neutral-50" : "text-neutral-950"
                }`}>
                  4.9
                </span>
                <span className={`text-sm leading-5 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                  Average rating
                </span>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className={`shadow-sm aspect-[3/4] rounded-2xl border border-solid overflow-hidden ${
              theme === "dark" ? "border-white/10" : "border-neutral-200 shadow-md"
            }`}>
              <img
                src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Invitation card mockup design representation"
                className="object-cover w-full h-full transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className={`shadow-sm aspect-3/4 rounded-2xl border border-solid mt-8 overflow-hidden ${
              theme === "dark" ? "border-white/10" : "border-neutral-200 shadow-md"
            }`}>
              <img
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Event venue flower arrangements"
                className="object-cover w-full h-full transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            
            {/* Absolute Overlay Message Card */}
            <div className={`left-1/4 shadow-md rounded-xl border border-solid flex absolute -bottom-2 px-4 py-3 items-center gap-3 transition-colors duration-300 ${
              theme === "dark" ? "bg-neutral-900 border-white/10" : "bg-white border-neutral-250/70 shadow-lg"
            }`}>
              <div className={`size-9 rounded-full flex justify-center items-center transition-colors duration-300 ${
                theme === "dark" ? "bg-neutral-50 text-neutral-900" : "bg-neutral-950 text-neutral-50"
              }`}>
                <Send className="size-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className={`font-semibold text-sm leading-5 transition-colors ${
                  theme === "dark" ? "text-neutral-50" : "text-neutral-950"
                }`}>
                  Invitation sent!
                </span>
                <span className={`text-xs leading-4 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                  42 guests notified
                </span>
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
              See your guests grouped by relationship — family, close friends,
              colleagues, and more — all in one interactive view.
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
          © 2025 Knivite. All rights reserved.
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
