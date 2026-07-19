"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error("Failed to sign out. Please try again.");
      } else {
        toast.success("Successfully signed out.");
        setTimeout(() => {
          router.push("/login");
          router.refresh();
        }, 800);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-[#B76E79] hover:bg-[#B76E79]/5 rounded-xl transition-all duration-300 select-none cursor-pointer"
    >
      {isLoggingOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
