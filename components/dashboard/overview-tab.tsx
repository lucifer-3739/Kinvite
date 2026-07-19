"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, Users, CheckCircle2, Clock, Eye, Edit, Trash 
} from "lucide-react";
import { EventData, GuestData } from "./types";

interface OverviewTabProps {
  eventsList: EventData[];
  guestsList: GuestData[];
  theme: "light" | "dark";
  setActiveEvent: (evt: EventData | null) => void;
  onTabChange: (tabName: string) => void;
  onDeleteEvent: (eventId: string) => void;
  searchQuery: string;
}

export default function OverviewTab({
  eventsList,
  guestsList,
  theme,
  setActiveEvent,
  onTabChange,
  onDeleteEvent,
  searchQuery,
}: OverviewTabProps) {
  // Compute RSVPs across ALL events combined for global dashboard stats
  const allEventsTotalGuestsCount = guestsList.reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
  const allEventsAttendingGuestsCount = guestsList
    .filter(g => g.attendance === "yes")
    .reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
  const allEventsDeclinedGuestsCount = guestsList
    .filter(g => g.attendance === "no")
    .reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
  const allEventsPendingGuestsCount = guestsList
    .filter(g => g.attendance === "pending")
    .reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);

  // Theme styling constants
  const cardBg = theme === "dark" ? "bg-neutral-905 border-white/5" : "bg-white border-zinc-200";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";
  const subtextCol = theme === "dark" ? "text-zinc-400" : "text-neutral-600";
  const borderCol = theme === "dark" ? "border-white/5" : "border-zinc-200";

  // Compute attendance trend over the last 8 weeks dynamically
  const getAttendanceTrend = () => {
    const weeks = Array.from({ length: 8 }).map((_, i) => {
      const start = new Date();
      start.setDate(start.getDate() - (7 - i) * 7);
      return {
        label: `W${i + 1}`,
        start: start,
        count: 0
      };
    });
    
    guestsList.forEach(g => {
      if (g.attendance === "yes") {
        const gDate = new Date(g.createdAt || new Date());
        for (let i = 0; i < 8; i++) {
          const nextWeekStart = i < 7 ? weeks[i + 1].start : new Date();
          if (gDate >= weeks[i].start && gDate < nextWeekStart) {
            weeks[i].count += parseInt(g.guestCount || "1");
            break;
          }
        }
      }
    });

    let runningTotal = 0;
    return weeks.map(w => {
      runningTotal += w.count;
      return runningTotal;
    });
  };

  return (
    <div className="space-y-6 animate-fade">
      
      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Invitations */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider text-zinc-550 font-semibold">Total Invitations</span>
            <Mail className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-bold ${titleCol}`}>
              {eventsList.length}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-bold">
                +{eventsList.filter(e => {
                  const d = new Date(e.createdAt || new Date());
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length}
              </span> this month
            </div>
          </div>
        </div>

        {/* Total Guests */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider text-zinc-550 font-semibold">Total Guests</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-bold ${titleCol}`}>
              {allEventsTotalGuestsCount}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Across all events</div>
          </div>
        </div>

        {/* Confirmed RSVPs */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider text-zinc-550 font-semibold">Confirmed RSVPs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-500">
              {allEventsAttendingGuestsCount}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              {allEventsTotalGuestsCount > 0 ? Math.round((allEventsAttendingGuestsCount / allEventsTotalGuestsCount) * 100) : 0}% acceptance rate
            </div>
          </div>
        </div>

        {/* Pending RSVPs */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-wider text-zinc-550 font-semibold">Pending RSVPs</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-bold ${titleCol}`}>
              {allEventsPendingGuestsCount}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              {allEventsTotalGuestsCount > 0 ? Math.round((allEventsPendingGuestsCount / allEventsTotalGuestsCount) * 100) : 0}% still pending
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section with Recharts-like SVG Animated Motion Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart A: RSVP Overview Grouped Bar Chart */}
        <div className={`${cardBg} rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between`}>
          <div className="mb-4">
            <h3 className={`font-bold text-lg ${titleCol}`}>RSVP Overview</h3>
            <span className="text-zinc-550 text-xs">Analytics across events</span>
          </div>
          
          {/* Grouped Horizontal Bars Chart layout */}
          <div className="space-y-4 py-4 relative">
            
            {/* Vertical grid lines behind bars */}
            <div className="absolute inset-0 flex justify-between pointer-events-none pl-[120px] pr-4">
              <div className={`w-px h-[90%] ${theme === "dark" ? "bg-white/5" : "bg-neutral-250/50"}`} />
              <div className={`w-px h-[90%] ${theme === "dark" ? "bg-white/5" : "bg-neutral-250/50"}`} />
              <div className={`w-px h-[90%] ${theme === "dark" ? "bg-white/5" : "bg-neutral-250/50"}`} />
              <div className={`w-px h-[90%] ${theme === "dark" ? "bg-white/5" : "bg-neutral-250/50"}`} />
            </div>

            {eventsList.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 font-light">
                Create an invitation to display RSVP analytics.
              </div>
            ) : (
              eventsList.slice(0, 5).map((evt, idx) => {
                const eventGuests = guestsList.filter(g => g.eventId === evt.id);
                const total = eventGuests.reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                const yes = eventGuests.filter(g => g.attendance === "yes").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                const pending = eventGuests.filter(g => g.attendance === "pending").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                const no = eventGuests.filter(g => g.attendance === "no").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                
                const yesPct = total > 0 ? (yes / total) * 100 : 0;
                const pendingPct = total > 0 ? (pending / total) * 100 : 0;
                const noPct = total > 0 ? (no / total) * 100 : 0;

                return (
                  <div key={evt.id} className="flex items-center gap-3">
                    {/* Y-axis label */}
                    <div className={`w-[110px] text-right text-[11px] font-semibold truncate ${theme === "dark" ? "text-zinc-300" : "text-neutral-700"}`} title={evt.title}>
                      {evt.title}
                    </div>
                    {/* Bars container */}
                    <div className="flex-1 flex flex-col gap-1.5 pl-2 relative">
                      {/* Confirmed Bar */}
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${yesPct * 0.7}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: idx * 0.05 }}
                          className="h-2 rounded bg-emerald-500 shadow-sm"
                        />
                      </div>
                      {/* Pending Bar */}
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pendingPct * 0.7}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: idx * 0.05 + 0.1 }}
                          className="h-2 rounded bg-amber-500 shadow-sm"
                        />
                      </div>
                      {/* Declined Bar */}
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${noPct * 0.7}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: idx * 0.05 + 0.2 }}
                          className="h-2 rounded bg-rose-500 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-zinc-500 pt-2 pl-[120px] pr-2">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex justify-start items-center gap-4 text-xs mt-4 pt-2 border-t border-solid border-[#D4AF37]/5">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className={subtextCol}>Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className={subtextCol}>Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500" />
              <span className={subtextCol}>Declined</span>
            </div>
          </div>
        </div>

        {/* Chart B: Response Breakdown (Donut Chart) */}
        <div className={`${cardBg} rounded-3xl p-6 flex flex-col justify-between`}>
          <div>
            <h3 className={`font-bold text-lg ${titleCol}`}>Response Breakdown</h3>
          </div>

          <div className="flex justify-center items-center py-6 relative">
            {(() => {
              const confirmedRatio = allEventsTotalGuestsCount > 0 ? (allEventsAttendingGuestsCount / allEventsTotalGuestsCount) : 0;
              const pendingRatio = allEventsTotalGuestsCount > 0 ? (allEventsPendingGuestsCount / allEventsTotalGuestsCount) : 0;
              const declinedRatio = allEventsTotalGuestsCount > 0 ? (allEventsDeclinedGuestsCount / allEventsTotalGuestsCount) : 0;

              const confirmedAngle = confirmedRatio * 360;
              const pendingAngle = (confirmedRatio + pendingRatio) * 360;

              return (
                <>
                  <svg className="w-40 h-40 transform -rotate-90">
                    {/* Base Track */}
                    <circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="transparent"
                      className={theme === "dark" ? "stroke-neutral-850" : "stroke-neutral-100"}
                      strokeWidth="14"
                    />
                    {/* Confirmed Segment */}
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray="345.5"
                      initial={{ strokeDashoffset: 345.5 }}
                      animate={{ strokeDashoffset: 345.5 - (345.5 * confirmedRatio) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                    {/* Pending Segment */}
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeDasharray="345.5"
                      initial={{ strokeDashoffset: 345.5 }}
                      animate={{ strokeDashoffset: 345.5 - (345.5 * pendingRatio) }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      style={{ transformOrigin: "80px 80px", transform: `rotate(${confirmedAngle}deg)` }}
                      strokeLinecap="round"
                    />
                    {/* Declined Segment */}
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="55"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="14"
                      strokeDasharray="345.5"
                      initial={{ strokeDashoffset: 345.5 }}
                      animate={{ strokeDashoffset: 345.5 - (345.5 * declinedRatio) }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                      style={{ transformOrigin: "80px 80px", transform: `rotate(${pendingAngle}deg)` }}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Donut Center text */}
                  <div className="absolute flex flex-col justify-center items-center text-center">
                    <span className={`text-3xl font-extrabold tracking-tight ${titleCol}`}>{allEventsTotalGuestsCount}</span>
                    <span className="text-[10px] text-zinc-550 uppercase tracking-widest font-bold mt-0.5">Guests</span>
                  </div>
                </>
              );
            })()}
          </div>

          {/* breakdown percentages */}
          <div className="space-y-2 border-t border-solid border-[#D4AF37]/5 pt-4 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span className={subtextCol}>Confirmed</span>
              </div>
              <span className={titleCol}>{allEventsTotalGuestsCount > 0 ? Math.round((allEventsAttendingGuestsCount / allEventsTotalGuestsCount) * 100) : 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-amber-500" />
                <span className={subtextCol}>Pending</span>
              </div>
              <span className={titleCol}>{allEventsTotalGuestsCount > 0 ? Math.round((allEventsPendingGuestsCount / allEventsTotalGuestsCount) * 100) : 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500" />
                <span className={subtextCol}>Declined</span>
              </div>
              <span className={titleCol}>{allEventsTotalGuestsCount > 0 ? Math.round((allEventsDeclinedGuestsCount / allEventsTotalGuestsCount) * 100) : 0}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Attendance line chart and activity cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart C: Smooth Curve Attendance Trend line chart */}
        <div className={`${cardBg} rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between`}>
          <div className="mb-4">
            <h3 className={`font-bold text-lg ${titleCol}`}>Guest Attendance Trend</h3>
            <span className="text-zinc-550 text-xs">Last 8 weeks</span>
          </div>

          <div className="relative h-44 w-full py-2">
            {(() => {
              const trendPoints = getAttendanceTrend();
              const maxTrendVal = Math.max(...trendPoints, 1);
              const svgCoords = trendPoints.map((val, idx) => {
                const x = 20 + idx * 41.4; // 20 to 310
                const y = 110 - (val / maxTrendVal) * 98;
                return { x, y };
              });

              let trendPathD = `M ${svgCoords[0].x},${svgCoords[0].y}`;
              for (let i = 1; i < svgCoords.length; i++) {
                const prev = svgCoords[i - 1];
                const curr = svgCoords[i];
                const cp1x = prev.x + 20;
                const cp1y = prev.y;
                const cp2x = curr.x - 20;
                const cp2y = curr.y;
                trendPathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
              }
              const trendAreaD = `${trendPathD} L 310,110 L 20,110 Z`;

              return (
                <svg className="w-full h-full" viewBox="0 0 320 120" preserveAspectRatio="none">
                  {/* Horizontal Helper Lines */}
                  <line x1="20" y1="20" x2="310" y2="20" className={theme === "dark" ? "stroke-white/5" : "stroke-neutral-200/50"} strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="50" x2="310" y2="50" className={theme === "dark" ? "stroke-white/5" : "stroke-neutral-200/50"} strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="80" x2="310" y2="80" className={theme === "dark" ? "stroke-white/5" : "stroke-neutral-200/50"} strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="110" x2="310" y2="110" className={theme === "dark" ? "stroke-white/10" : "stroke-neutral-200"} strokeWidth="1" />

                  {/* Line labels */}
                  <text x="5" y="24" fill="#6b7280" fontSize="8">{Math.round(maxTrendVal)}</text>
                  <text x="5" y="54" fill="#6b7280" fontSize="8">{Math.round(maxTrendVal * 0.75)}</text>
                  <text x="5" y="84" fill="#6b7280" fontSize="8">{Math.round(maxTrendVal * 0.5)}</text>
                  <text x="5" y="114" fill="#6b7280" fontSize="8">{Math.round(maxTrendVal * 0.25)}</text>

                  {/* Gradient Fill under Curve */}
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>
                  <path
                    d={trendAreaD}
                    fill="url(#areaGradient)"
                  />

                  {/* Smooth Curve drawing animation */}
                  <motion.path
                    d={trendPathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Data Dots along the path */}
                  {svgCoords.map((dot, idx) => (
                    <circle
                      key={idx}
                      cx={dot.x}
                      cy={dot.y}
                      r="3"
                      fill="#ffffff"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              );
            })()}

            {/* Week marks */}
            <div className="flex justify-between text-[10px] text-zinc-550 pt-2 px-1">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
              <span>W5</span>
              <span>W6</span>
              <span>W7</span>
              <span>W8</span>
            </div>
          </div>
        </div>

        {/* Card C2: Recent Guest Activity Logs */}
        <div className={`${cardBg} rounded-3xl p-6 flex flex-col justify-between`}>
          <div className="mb-4">
            <h3 className={`font-bold text-lg ${titleCol}`}>Recent Guest Activity</h3>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-48 scrollbar-thin">
            {(() => {
              const getTimeAgo = (dateStr: any) => {
                const d = new Date(dateStr);
                const now = new Date();
                const diffMs = now.getTime() - d.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);
                
                if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
                if (diffHours < 24) return `${diffHours}h ago`;
                return `${diffDays}d ago`;
              };

              const recentGuests = [...guestsList]
                .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                .slice(0, 5);

              if (recentGuests.length === 0) {
                return (
                  <div className="text-center py-12 text-zinc-550 text-xs font-light">
                    No recent guest activity.
                  </div>
                );
              }

              return recentGuests.map((item) => {
                const associatedEvent = eventsList.find(e => e.id === item.eventId);
                const eventName = associatedEvent ? associatedEvent.title : "Invitation Event";
                const timeAgo = item.createdAt ? getTimeAgo(item.createdAt) : "Just now";

                return (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      {/* Initials Badge */}
                      <div className={`size-8 rounded-full flex justify-center items-center text-[10px] font-bold ${
                        theme === "dark" ? "bg-neutral-850 text-white" : "bg-neutral-100 text-neutral-800 border"
                      }`}>
                        {item.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div className="text-left">
                        <span className={`font-bold ${titleCol}`}>{item.name}</span>
                        <p className="text-[10px] text-zinc-555 mt-0.5 truncate max-w-[120px]">{eventName}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-zinc-500">{timeAgo}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        item.attendance === "yes" ? "bg-emerald-500/10 text-emerald-400" :
                        item.attendance === "no" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.attendance === "yes" ? "Confirmed" :
                         item.attendance === "no" ? "Declined" : "Pending"}
                      </span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

      </div>

      {/* Bottom Invitations Table Roster */}
      <div className={`${cardBg} rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl`}>
        <div className="flex justify-between items-center pb-2">
          <h3 className={`font-bold text-lg ${titleCol}`}>My Invitations</h3>
          <button onClick={() => onTabChange("events")} className="text-xs text-amber-500 hover:underline cursor-pointer bg-transparent border-0 font-semibold">
            View all
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b ${borderCol} text-zinc-500 uppercase tracking-widest font-semibold pb-3`}>
                <th className="pb-3 pr-4 font-semibold text-[10px]">Event Name</th>
                <th className="pb-3 pr-4 font-semibold text-[10px]">Date</th>
                <th className="pb-3 pr-4 font-semibold text-[10px] text-center">Guests Invited</th>
                <th className="pb-3 pr-4 font-semibold text-[10px] text-center">Confirmed</th>
                <th className="pb-3 pr-4 font-semibold text-[10px] text-center">Pending</th>
                <th className="pb-3 pr-4 font-semibold text-[10px] text-center">Declined</th>
                <th className="pb-3 pr-4 font-semibold text-[10px]">Status</th>
                <th className="pb-3 font-semibold text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "dark" ? "divide-white/5" : "divide-neutral-200"}`}>
              {(() => {
                const filtered = eventsList.filter(evt =>
                  evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  evt.venue.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-zinc-500 font-light font-semibold">
                        {searchQuery ? "No invitations found matching your search." : 'No invitations currently configured. Click "+ Create Invitation" in My Invitations to get started.'}
                      </td>
                    </tr>
                  );
                }

                return filtered.map((evt) => {
                  const eventGuests = guestsList.filter(g => g.eventId === evt.id);
                  const total = eventGuests.reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                  const conf = eventGuests.filter(g => g.attendance === "yes").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                  const pend = eventGuests.filter(g => g.attendance === "pending").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                  const decl = eventGuests.filter(g => g.attendance === "no").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                  
                  const eventDate = new Date(evt.date);
                  const now = new Date();
                  const status = eventDate < now ? "Sent" : (eventGuests.length === 0 ? "Draft" : "Active");

                  return (
                    <tr key={evt.id} className="hover:bg-zinc-900/5">
                      <td className={`py-4 pr-4 font-bold text-sm ${titleCol}`}>{evt.title}</td>
                      <td className="py-4 pr-4 text-zinc-400 font-medium">
                        {new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-4 pr-4 text-center text-zinc-350">{total}</td>
                      <td className="py-4 pr-4 text-center text-emerald-500 font-bold">{conf}</td>
                      <td className="py-4 pr-4 text-center text-amber-500 font-bold">{pend}</td>
                      <td className="py-4 pr-4 text-center text-rose-500 font-bold">{decl}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          status === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                          status === "Sent" ? "bg-blue-500/10 text-blue-400" : "bg-zinc-500/10 text-zinc-400"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 text-right flex items-center justify-end gap-1.5">
                        <Link href={`/invite/${evt.slug}`} target="_blank" className="p-1.5 rounded-lg border hover:text-amber-500 hover:border-amber-500/35 transition-colors border-solid border-transparent">
                          <Eye className="size-4" />
                        </Link>
                        <button onClick={() => { setActiveEvent(evt); onTabChange("templates"); }} className="p-1.5 rounded-lg border hover:text-amber-500 hover:border-amber-500/35 transition-colors cursor-pointer border-solid border-transparent bg-transparent">
                          <Edit className="size-4" />
                        </button>
                        <button onClick={() => onDeleteEvent(evt.id)} className="p-1.5 rounded-lg border hover:text-red-500 hover:border-red-500/35 transition-colors cursor-pointer border-solid border-transparent bg-transparent">
                          <Trash className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
