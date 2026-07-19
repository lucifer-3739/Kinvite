"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  Mail,
  Loader2,
  Heart,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error(error.message || "Failed to submit request.");
      } else {
        toast.success("Reset link generated successfully!");
        setIsSubmitted(true);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#120F0F] text-[#F3EFEA] px-4 font-sans">
        {/* Ambient background glow orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-[100px] pointer-events-none" />

        <Toaster position="top-right" richColors />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-[#1A1616]/40 backdrop-blur-xl border border-[#D4AF37]/15 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#B76E79] flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/10">
              <Mail className="w-5 h-5 text-[#120F0F] fill-[#120F0F]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold tracking-wide text-[#FAF9F6] uppercase">
                Link Generated
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We have generated a password reset link for <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div className="p-4 bg-zinc-950/60 border border-[#D4AF37]/10 rounded-xl space-y-3 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E6C575] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                Local Dev Environment
              </span>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Because there is no active live SMTP server in this development setup, the password reset link has been written directly to a file:
              </p>
              <code className="text-[11px] text-white block bg-[#1A1616] px-2 py-1.5 rounded font-mono border border-zinc-800 break-all">
                reset_password_link.txt
              </code>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Please open this file in your editor, copy the link, and paste it into your browser to complete your password reset.
              </p>
            </div>

            <Link href="/login" className="block">
              <Button className="w-full h-11 bg-zinc-950 border border-zinc-800 text-xs text-[#E6C575] hover:bg-zinc-900 transition-all rounded-xl cursor-pointer">
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#120F0F] text-[#F3EFEA] px-4 font-sans">
      {/* Wedding Theme Ambient Background Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#B76E79]/5 rounded-full blur-[100px] pointer-events-none" />

      <Toaster position="top-right" richColors />

      {/* Floating Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1A1616]/40 backdrop-blur-xl border border-[#D4AF37]/15 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#B76E79] flex items-center justify-center mb-4 shadow-lg shadow-[#D4AF37]/10"
            >
              <Heart className="w-5 h-5 text-[#120F0F] fill-[#120F0F]" />
            </motion.div>
            <h1 className="font-heading text-3xl font-bold tracking-wide text-[#FAF9F6] mb-2 uppercase">
              Forgot Password
            </h1>
            <p className="text-zinc-400 text-sm">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email Field */}
            <div className="space-y-1.5 relative">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-b-zinc-800 focus-visible:border-b-[#D4AF37] text-zinc-100 placeholder:text-zinc-600 rounded-lg"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-[#D4AF37] via-[#DFBA4F] to-[#B76E79] hover:opacity-95 text-[#120F0F] font-bold rounded-xl flex items-center justify-center gap-2 border-0 shadow-lg shadow-[#D4AF37]/10 cursor-pointer select-none transition-all duration-300 hover:scale-[1.01]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#120F0F]" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4 text-[#120F0F]" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-[#E6C575] hover:text-[#FAF9F6] transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
