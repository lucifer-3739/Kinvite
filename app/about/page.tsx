"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Sparkles,
  DollarSign,
  Info,
  Mail,
  Sun,
  Moon,
  Loader2,
  Heart,
  Users,
  Compass,
  Layers,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isLoggedIn = !!session;

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = "About Us | Knivite";
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden ${
      theme === "dark" ? "bg-neutral-950 text-neutral-50" : "bg-zinc-50 text-neutral-950"
    } transition-colors duration-500 font-sans`}>
      
      {/* Ambient Blur Backgrounds */}
      <AnimatePresence>
        {theme === "dark" ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-[140px] pointer-events-none z-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.06 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-1/4 w-[700px] h-[700px] bg-[#B76E79] rounded-full blur-[160px] pointer-events-none z-0"
            />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E6C575]/20 rounded-full blur-[120px] pointer-events-none z-0"
            />
          </>
        )}
      </AnimatePresence>

      {/* Header */}
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
            <Link href="/" className={`font-bold text-lg leading-7 tracking-tight transition-colors duration-300 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-950"
            }`}>
              Knivite
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Home", href: "/", icon: Home },
              { label: "Features", href: "/#features", icon: Sparkles },
              { label: "Pricing", href: "/pricing", icon: DollarSign },
              { label: "About", href: "/about", icon: Info, active: true },
              { label: "Contact", href: "/contact", icon: Mail },
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`font-semibold rounded-lg text-sm leading-5 flex px-3 py-2 items-center gap-1.5 cursor-pointer transition-all ${
                    link.active
                      ? theme === "dark"
                        ? "text-neutral-50 border-neutral-50 border-t-0 border-r-0 border-b-2 border-l-0 border-solid"
                        : "text-neutral-950 border-neutral-950 border-t-0 border-r-0 border-b-2 border-l-0 border-solid"
                      : theme === "dark"
                        ? "text-neutral-400 hover:text-neutral-50"
                        : "text-neutral-500 hover:text-neutral-955"
                  }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
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

      {/* Main Body */}
      <main className="max-w-[1140px] mx-auto w-full px-6 md:px-8 py-16 flex-grow flex flex-col gap-20">
        
        {/* Section 1: Hero */}
        <section className="text-center flex flex-col items-center gap-6 max-w-3xl mx-auto">
          <div className={`inline-flex font-medium rounded-full text-xs leading-4 px-4 py-2 items-center gap-2 w-fit ${
            theme === "dark" ? "bg-neutral-800 text-neutral-100" : "bg-neutral-200/60 text-neutral-900 border border-neutral-300/40"
          }`}>
            <Heart className="size-3.5 text-rose-500 animate-pulse" />
            Connecting Family & Friends
          </div>
          <h1 className={`font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight transition-colors duration-300 ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}>
            Make every celebration feel like home
          </h1>
          <p className={`text-lg leading-7 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
            Knivite was founded with a single purpose: to turn digital invitations into visually immersive, emotional, and interactive portals that connect families across the globe.
          </p>
        </section>

        {/* Section 2: Mission & Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left">
            <span className="font-semibold uppercase text-xs tracking-wider text-amber-500">
              Our Vision
            </span>
            <h2 className={`font-bold text-3xl tracking-tight ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
              Cinematic themes that tell your story
            </h2>
            <p className={`text-sm leading-6 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
              Traditional invitation links are sterile and static. We believe your invitations should feel as beautiful and immersive as the event itself. By marrying custom animation engines with relationship-mapping technology, Knivite lets hosts build a central hub where guests don't just RSVP—they connect.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <div className="size-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                  ✓
                </div>
                <span className={`text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-750"}`}>
                  Interactive family maps that show who's coming.
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <div className="size-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                  ✓
                </div>
                <span className={`text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-750"}`}>
                  Adaptive styles tailored for traditional and modern events.
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-solid shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="People raising glasses in celebration at outdoor event"
              className="object-cover w-full h-full"
            />
          </div>
        </section>

        {/* Section 3: Core Values */}
        <section className="flex flex-col gap-8">
          <div className="text-center">
            <span className="font-semibold uppercase text-xs tracking-wider text-amber-500">
              Our Values
            </span>
            <h2 className={`font-bold text-3xl tracking-tight mt-2 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
              Designed with love and care
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Cinematic Atmosphere",
                desc: "We focus heavily on rich aesthetics, animations, and typography to make your invitation stand out.",
                icon: Compass
              },
              {
                title: "Family Unity",
                desc: "Our custom relation maps allow families and friends to see how everyone relates, bridging the distance.",
                icon: Users
              },
              {
                title: "Safety & Validation",
                desc: "Secure databases, schema validation, and verified RSVP portals guarantee that your privacy is protected.",
                icon: Layers
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className={`p-6 border border-solid rounded-2xl text-left flex flex-col gap-4 ${
                  theme === "dark" ? "bg-neutral-900 border-white/10" : "bg-white border-neutral-200 shadow-md"
                }`}>
                  <div className="size-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                  <h3 className={`font-bold text-lg ${theme === "dark" ? "text-neutral-50" : "text-neutral-900"}`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm leading-5 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
                    {value.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call to action */}
        <section className={`rounded-3xl p-8 border border-solid text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
          theme === "dark" 
            ? "bg-[radial-gradient(circle_at_top_right,oklch(0.3_0_0),oklch(0.16_0_0))] bg-neutral-900 border-white/10" 
            : "bg-zinc-100 border-neutral-200 shadow-md"
        }`}>
          <div className="flex flex-col gap-2">
            <h3 className={`font-bold text-2xl ${theme === "dark" ? "text-neutral-50" : "text-neutral-900"}`}>
              Let's craft your milestone event
            </h3>
            <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-650"}`}>
              Pick a theme, invite your friends, and track responses. Free to test.
            </p>
          </div>
          <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
            <Button className={`gap-2 font-bold px-6 h-11 border-0 rounded-xl transition-all ${
              theme === "dark" ? "bg-neutral-50 text-neutral-900 hover:bg-neutral-200" : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800"
            }`}>
              Get Started <ArrowRight className="size-4" />
            </Button>
          </Link>
        </section>

      </main>

      {/* Footer */}
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
            <Link href="#" className={`text-sm leading-5 cursor-pointer transition-colors ${
              theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-600 hover:text-neutral-955"
            }`}>Privacy</Link>
            <Link href="#" className={`text-sm leading-5 cursor-pointer transition-colors ${
              theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-600 hover:text-neutral-955"
            }`}>Terms</Link>
            <Link href="#" className={`text-sm leading-5 cursor-pointer transition-colors ${
              theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-600 hover:text-neutral-955"
            }`}>Support</Link>
          </nav>

          <div className="text-center text-sm leading-5 transition-colors duration-300 text-neutral-500">
            © 2026 KInvite. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
