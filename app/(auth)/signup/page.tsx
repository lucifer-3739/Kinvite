"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Heart, ArrowRight, User } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Planner name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simple live password strength scoring
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: "", color: "bg-transparent" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score, text: "Weak", color: "bg-red-500" };
      case 2:
        return { score, text: "Medium", color: "bg-orange-500" };
      case 3:
        return { score, text: "Strong", color: "bg-[#D4AF37]" };
      case 4:
        return { score, text: "Exquisite", color: "bg-gradient-to-r from-[#D4AF37] to-[#B76E79] shadow-[0_0_8px_rgba(212,175,55,0.5)]" };
      default:
        return { score: 0, text: "Too short", color: "bg-red-500/50" };
    }
  };

  const strength = getPasswordStrength();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = signupSchema.safeParse({ name, email, password, confirmPassword });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Something went wrong during sign up");
      } else {
        toast.success("Account created successfully! Loading your dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
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
        className="w-full max-w-md my-8"
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
              Join KInvite
            </h1>
            <p className="text-zinc-400 text-sm">
              Create an account to start planning your perfect invitations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5 relative z-10">
            {/* Full Name Field */}
            <div className="space-y-1.5 relative">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-transparent border-b-zinc-800 focus-visible:border-b-[#D4AF37] text-zinc-100 placeholder:text-zinc-600"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 relative">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
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
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Live indicator */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-400">
                    <span>Complexity</span>
                    <span className="font-semibold">{strength.text}</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5 relative">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-transparent border-b-zinc-800 focus-visible:border-b-[#D4AF37] text-zinc-100 placeholder:text-zinc-600"
              />
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
                  Sign Up
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
            Already have an planner account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#E6C575] hover:text-[#FAF9F6] transition-colors underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
