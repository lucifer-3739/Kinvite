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
  Check,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PricingPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isLoggedIn = !!session;

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Pricing | Knivite";
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

  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const borderCol = theme === "dark" ? "border-white/10" : "border-neutral-200/80";

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
              { label: "Pricing", href: "/pricing", icon: DollarSign, active: true },
              { label: "About", href: "/about", icon: Info },
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
        
        {/* Pricing Header */}
        <section className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <span className="font-semibold uppercase text-xs tracking-wider text-amber-500">
            Pricing Plans
          </span>
          <h1 className={`font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight transition-colors duration-300 ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}>
            Simple, transparent plans for hosts
          </h1>
          <p className={`text-lg leading-7 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
            Choose the perfect plan to organize your milestone event. Create drafts, test themes, and upgrade only when you are ready to publish.
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          
          {/* Plan 1: Free */}
          <motion.div
            whileHover={{ y: -6 }}
            className={`border border-solid rounded-3xl p-8 flex flex-col justify-between min-h-[460px] relative transition-all shadow-sm ${
              theme === "dark" ? "bg-neutral-900/40 border-white/10 hover:border-white/20" : "bg-white border-neutral-200/80 hover:shadow-lg shadow-md"
            }`}
          >
            <div>
              <h3 className="text-2xl font-bold mb-1">Intimate Free</h3>
              <p className={`text-xs uppercase tracking-wider mb-4 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                For small family events
              </p>
              <div className="text-5xl font-extrabold mb-6 mt-2">
                $0
              </div>
              
              <ul className="space-y-4 text-sm text-left">
                {[
                  "1 Live Event Microsite",
                  "Up to 50 Guest RSVPs",
                  "Core Tree Editor (React Flow)",
                  "Custom Countdown Timer",
                  "Basic email invitations"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className={theme === "dark" ? "text-neutral-300" : "text-neutral-700"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full mt-8">
              <Button className={`w-full h-12 text-sm font-bold border border-solid transition-colors rounded-xl cursor-pointer ${
                theme === "dark" ? "bg-transparent border-white/20 hover:bg-white/5 text-neutral-50" : "bg-transparent border-neutral-350 hover:bg-black/5 text-neutral-900"
              }`}>
                Get Started Free
              </Button>
            </Link>
          </motion.div>

          {/* Plan 2: Pro */}
          <motion.div
            whileHover={{ y: -6 }}
            className={`border-2 border-solid rounded-3xl p-8 flex flex-col justify-between min-h-[460px] relative transition-all shadow-xl ${
              theme === "dark" 
                ? "bg-gradient-to-br from-neutral-900/90 to-neutral-950 border-amber-500 shadow-amber-500/5" 
                : "bg-white border-amber-500 shadow-amber-500/10"
            }`}
          >
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md z-10">
              Best value
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-1 text-amber-500">Concierge Pro</h3>
              <p className={`text-xs uppercase tracking-wider mb-4 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                Complete luxury experience
              </p>
              <div className="text-5xl font-extrabold mb-6 mt-2">
                $29 <span className={`text-sm font-light ${theme === "dark" ? "text-neutral-500" : "text-neutral-400"}`}>/ event lifetime</span>
              </div>
              
              <ul className="space-y-4 text-sm text-left">
                {[
                  "Unlimited RSVPs & Invites",
                  "Full Cinematic Templates & Themes",
                  "Custom Background Audios & Video Overlays",
                  "Editable Guest Tree Flowcharts",
                  "Smart RSVP Reminders & Confirmation Messages",
                  "Private Photo & Video Guest Gallery"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className={theme === "dark" ? "text-neutral-200" : "text-neutral-900"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full mt-8">
              <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-sm border-0 shadow-lg shadow-amber-500/15 rounded-xl cursor-pointer">
                Upgrade to Pro
              </Button>
            </Link>
          </motion.div>

        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto w-full flex flex-col gap-8">
          <div className="text-center">
            <span className="font-semibold uppercase text-xs tracking-wider text-amber-500">
              FAQs
            </span>
            <h2 className={`font-bold text-3xl tracking-tight mt-2 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              {
                q: "What is an 'event lifetime' license?",
                a: "Our Concierge Pro is a one-time payment per event. Your customized invitation microsite remains active and online forever. There are no monthly recurring charges."
              },
              {
                q: "Can I update the event details after upgrading?",
                a: "Yes! You can edit any coordinates, timing schedules, wedding profiles, templates, and background assets inside your dashboard at any time, even after publishing."
              },
              {
                q: "How do guests RSVP?",
                a: "Your guests visit your private Knivite link, check your customized schedule, view the connection tree, and fill out the RSVP form. Responses are updated live on your dashboard overview."
              },
              {
                q: "Do my guests need to download an app?",
                a: "No. Knivite invitation cards render as clean, cinematic web pages directly inside any standard mobile or desktop web browser."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`border border-solid rounded-2xl p-5 text-left cursor-pointer transition-all ${
                  theme === "dark" ? "bg-neutral-900/30 border-white/10" : "bg-white border-neutral-200 shadow-sm"
                }`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className={`font-semibold text-base flex gap-2 items-center ${
                    theme === "dark" ? "text-neutral-100" : "text-neutral-900"
                  }`}>
                    <HelpCircle className="size-4 text-amber-500 shrink-0" />
                    {faq.q}
                  </h3>
                  <ChevronDown className={`size-4 text-neutral-450 transition-transform duration-300 ${
                    activeFaq === idx ? "rotate-180" : ""
                  }`} />
                </div>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: "12px" }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-neutral-450" : "text-neutral-600"}`}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
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
