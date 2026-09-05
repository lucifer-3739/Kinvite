import React from "react";
import { KinviteLogo } from "@/components/KinviteLogo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Background Mesh Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#9E1B32]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none z-0" />
      
      {/* Hairline Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Breathing Logo Wrapper */}
        <div className="relative animate-pulse flex justify-center items-center">
          <KinviteLogo className="size-24" showText={false} />
          {/* Subtle outer rings */}
          <div className="absolute -inset-4 rounded-full border border-solid border-[#D4AF37]/20 animate-ping opacity-30 pointer-events-none" />
        </div>

        {/* Text and progress indicators */}
        <div className="text-center space-y-3.5">
          <h3 className="font-outfit font-extrabold text-xs uppercase tracking-[0.25em] text-[#F5E6C8]">
            Kinvite
          </h3>
          
          <div className="w-36 h-[3px] rounded-full bg-white/10 overflow-hidden mx-auto relative border border-solid border-white/5">
            <div className="h-full bg-gradient-to-r from-[#9E1B32] via-[#D4AF37] to-[#F5E6C8] rounded-full w-1/2 absolute left-0 top-0 animate-infinite-loading" />
          </div>
          
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">
            Crafting celebration assets...
          </span>
        </div>
      </div>
    </div>
  );
}
