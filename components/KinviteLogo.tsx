"use client";

import React from "react";
import Image from "next/image";

interface KinviteLogoProps {
  className?: string;
  showText?: boolean;
  theme?: "light" | "dark" | "colored";
  priority?: boolean;
}

export function KinviteLogo({ 
  className = "size-8", 
  showText = false, 
  theme = "dark",
  priority = true
}: KinviteLogoProps) {
  const textClass = theme === "light" ? "text-neutral-900" : "text-white";

  return (
    <div className={`flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      <div className="relative aspect-square w-full h-full flex items-center justify-center">
        <Image
          src="/Logo.png"
          alt="Kinvite Brand Logo"
          width={120}
          height={120}
          priority={priority}
          className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(155,27,48,0.2)] transition-transform duration-300 hover:scale-105"
        />
      </div>

      {showText && (
        <span className={`font-outfit font-extrabold tracking-tight text-base sm:text-lg ${textClass}`}>
          Kinvite
        </span>
      )}
    </div>
  );
}
