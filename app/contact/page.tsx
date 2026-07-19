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
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters long"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export default function ContactPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isLoggedIn = !!session;

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | Knivite";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = contactFormSchema.safeParse({ name, email, subject, message });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Thank you! Your message has been sent to our support concierge.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
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
      <Toaster position="top-right" richColors />
      
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
              { label: "About", href: "/about", icon: Info },
              { label: "Contact", href: "/contact", icon: Mail, active: true },
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
      <main className="max-w-[1140px] mx-auto w-full px-6 md:px-8 py-16 flex-grow flex flex-col gap-12">
        
        {/* Title */}
        <section className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <span className="font-semibold uppercase text-xs tracking-wider text-amber-500">
            Contact Concierge
          </span>
          <h1 className={`font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight transition-colors duration-300 ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}>
            We'd love to hear from you
          </h1>
          <p className={`text-lg leading-7 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
            Have questions about templates, custom domain setups, or concierge styling options? Drop us a line.
          </p>
        </section>

        {/* Contact Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Block: Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <Card className={`p-6 border border-solid rounded-2xl text-left flex items-start gap-4 transition-colors ${
              theme === "dark" ? "bg-neutral-900/30 border-white/10" : "bg-white border-neutral-200 shadow-sm"
            }`}>
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                  Support Concierge
                </h3>
                <p className={`text-xs mt-1 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                  Reach out for help editing templates, uploading videos, or importing guest CSV files.
                </p>
                <a href="mailto:support@kinvite.com" className="text-sm font-semibold text-amber-500 mt-2 block hover:underline">
                  support@kinvite.com
                </a>
              </div>
            </Card>

            <Card className={`p-6 border border-solid rounded-2xl text-left flex items-start gap-4 transition-colors ${
              theme === "dark" ? "bg-neutral-900/30 border-white/10" : "bg-white border-neutral-200 shadow-sm"
            }`}>
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Globe className="size-5" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                  Custom Integrations
                </h3>
                <p className={`text-xs mt-1 ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                  For custom styling, dedicated subdomains, event planning software hooks, or bespoke layout templates.
                </p>
                <a href="mailto:concierge@kinvite.com" className="text-sm font-semibold text-amber-500 mt-2 block hover:underline">
                  concierge@kinvite.com
                </a>
              </div>
            </Card>

            {/* Quick Details List */}
            <div className="flex flex-col gap-4 px-2 mt-4">
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-amber-500 shrink-0" />
                <span className={`text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-700"}`}>
                  San Francisco, California, US
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-amber-500 shrink-0" />
                <span className={`text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-700"}`}>
                  +1 (555) 019-2834 (concierge hot line)
                </span>
              </div>
            </div>

          </div>

          {/* Right Block: Contact Form */}
          <div className="lg:col-span-7">
            <Card className={`border border-solid p-6 md:p-8 rounded-3xl ${
              theme === "dark" ? "bg-neutral-900/40 border-white/10" : "bg-white border-neutral-200 shadow-md"
            }`}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className={`text-xs font-semibold uppercase tracking-wider ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className={`h-11 px-4 text-sm rounded-xl border border-solid transition-colors outline-none focus:border-amber-500 ${
                        theme === "dark" ? "bg-neutral-950 border-white/10 text-neutral-50" : "bg-zinc-50 border-neutral-250 text-neutral-900"
                      }`}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className={`text-xs font-semibold uppercase tracking-wider ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`h-11 px-4 text-sm rounded-xl border border-solid transition-colors outline-none focus:border-amber-500 ${
                        theme === "dark" ? "bg-neutral-950 border-white/10 text-neutral-50" : "bg-zinc-50 border-neutral-250 text-neutral-900"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help you?"
                    className={`h-11 px-4 text-sm rounded-xl border border-solid transition-colors outline-none focus:border-amber-500 ${
                      theme === "dark" ? "bg-neutral-950 border-white/10 text-neutral-50" : "bg-zinc-50 border-neutral-250 text-neutral-900"
                    }`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your request in detail..."
                    className={`p-4 text-sm rounded-xl border border-solid transition-colors outline-none resize-none focus:border-amber-500 ${
                      theme === "dark" ? "bg-neutral-950 border-white/10 text-neutral-50" : "bg-zinc-50 border-neutral-250 text-neutral-900"
                    }`}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 text-neutral-955 font-bold h-12 rounded-xl transition-all border-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-neutral-955" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 text-neutral-955" />
                      Send Concierge Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
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
