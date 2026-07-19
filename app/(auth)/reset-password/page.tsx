"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Heart,
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid request. Missing validation token.");
      return;
    }

    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password.");
      } else {
        toast.success("Password reset successfully!");
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-[#1A1616]/40 backdrop-blur-xl border border-[#D4AF37]/15 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold tracking-wide text-white uppercase">
            Invalid Reset Session
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The password reset link is invalid, expired, or is missing the verification token.
          </p>
        </div>
        <Link href="/forgot-password" className="block">
          <Button className="w-full h-11 bg-zinc-950 border border-zinc-800 text-xs text-[#E6C575] hover:bg-zinc-900 transition-all rounded-xl cursor-pointer">
            Request New Reset Link
          </Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-[#1A1616]/40 backdrop-blur-xl border border-[#D4AF37]/15 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#B76E79] flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/10">
          <CheckCircle2 className="w-5 h-5 text-[#120F0F]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-wide text-[#FAF9F6] uppercase">
            Success!
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your password has been successfully updated. Redirecting you to the portal log in...
          </p>
        </div>
      </div>
    );
  }

  return (
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
          Reset Password
        </h1>
        <p className="text-zinc-400 text-sm">
          Please enter and confirm your new password below
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {/* New Password Field */}
        <div className="space-y-1.5 relative">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> New Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border-b-zinc-800 focus-visible:border-b-[#D4AF37] text-zinc-100 placeholder:text-zinc-600 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5 pt-1"
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-400 uppercase font-semibold">Security Score</span>
                <span className="font-bold text-[#E6C575]">{strength.text}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5 relative">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-transparent border-b-zinc-800 focus-visible:border-b-[#D4AF37] text-zinc-100 placeholder:text-zinc-600 rounded-lg"
          />
        </div>

        {/* Action Button */}
        <div className="pt-4 space-y-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-[#D4AF37] via-[#DFBA4F] to-[#B76E79] hover:opacity-95 text-[#120F0F] font-bold rounded-xl flex items-center justify-center gap-2 border-0 shadow-lg shadow-[#D4AF37]/10 cursor-pointer select-none transition-all duration-300 hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#120F0F]" />
                Updating Password...
              </>
            ) : (
              <>
                Update Password
                <ArrowRight className="w-4 h-4 text-[#120F0F]" />
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-[#E6C575] hover:text-[#FAF9F6] transition-colors"
            >
              Cancel & Return to Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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
        className="w-full max-w-md my-8"
      >
        <Suspense
          fallback={
            <div className="bg-[#1A1616]/40 backdrop-blur-xl border border-[#D4AF37]/15 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
              <p className="text-xs text-zinc-400">Loading reset session info...</p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
