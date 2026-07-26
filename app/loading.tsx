import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Background Mesh Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      {/* Hairline Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Breathing Logo Wrapper */}
        <div className="relative size-16 rounded-full bg-white text-neutral-950 flex items-center justify-center font-outfit font-extrabold text-2xl shadow-2xl animate-pulse">
          K
          {/* Subtle outer rings */}
          <div className="absolute -inset-2 rounded-full border border-solid border-white/5 animate-ping opacity-25" />
        </div>

        {/* Text and progress indicators */}
        <div className="text-center space-y-3.5">
          <h3 className="font-outfit font-extrabold text-xs uppercase tracking-[0.2em] text-white">
            Kinvite
          </h3>
          
          <div className="w-36 h-[3px] rounded-full bg-white/5 overflow-hidden mx-auto relative border border-solid border-white/5">
            <div className="h-full bg-amber-500 rounded-full w-1/2 absolute left-0 top-0 animate-infinite-loading" />
          </div>
          
          <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block">
            Syncing workspace assets...
          </span>
        </div>
      </div>
    </div>
  );
}
