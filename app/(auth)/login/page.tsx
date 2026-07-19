"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Heart,
  ArrowRight,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
      } else {
        toast.success("Welcome back! Loading your wedding dashboard...");
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 800);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#120F0F] text-[#F3EFEA] px-4">
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
              className="w-12 h-12 rounded-xl bg-linear-to-tr from-[#D4AF37] to-[#B76E79] flex items-center justify-center mb-4 shadow-lg shadow-[#D4AF37]/10"
            >
              <Heart className="w-5 h-5 text-[#120F0F] fill-[#120F0F]" />
            </motion.div>
            <h1 className="font-heading text-3xl font-bold tracking-wide text-[#FAF9F6] mb-2 uppercase">
              KInvite Portal
            </h1>
            <p className="text-zinc-400 text-sm">
              Enter your credentials to manage your wedding invitations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
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
                className="bg-transparent border-b-zinc-800 focus-visible:border-b-[#D4AF37] text-zinc-100 placeholder:text-zinc-600"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" /> Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#c5a059] hover:text-[#FAF9F6] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-transparent border-b-zinc-800 focus-visible:border-b-[#D4AF37] pr-10 text-zinc-100 placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-[#D4AF37] to-[#B76E79] hover:opacity-90 text-[#120F0F] font-bold rounded-xl shadow-lg shadow-[#D4AF37]/5 flex items-center justify-center gap-2 border-0 group relative overflow-hidden transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 z-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800/80"></div>
            </div>
            <span className="relative px-3 text-xs uppercase tracking-wider text-zinc-500 bg-transparent">
              Or
            </span>
          </div>

          {/* Footer Link */}
          <div className="text-center text-sm text-zinc-400 relative z-10">
            Need an planner account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#E6C575] hover:text-[#FAF9F6] transition-colors underline underline-offset-4"
            >
              Create one here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center bg-[#120F0F] text-[#F3EFEA]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
