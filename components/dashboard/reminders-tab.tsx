"use client";

import React, { useState } from "react";
import { 
  Clock, CheckCircle2, ShieldAlert, Edit, Trash, Bell, Check, Plus 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface RemindersTabProps {
  theme: "light" | "dark";
}

export default function RemindersTab({ theme }: RemindersTabProps) {
  const [autoSendRsvp, setAutoSendRsvp] = useState(true);
  const [dayBeforeReminder, setDayBeforeReminder] = useState(true);
  const [thankYouNotes, setThankYouNotes] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Theme styling constants
  const cardBg = theme === "dark" ? "bg-neutral-905 border-white/5" : "bg-white border-zinc-200";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";
  const borderCol = theme === "dark" ? "border-white/5" : "border-zinc-200";

  return (
    <div className="space-y-6 animate-fade font-semibold">

      {/* Three Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${cardBg} rounded-2xl p-4 border border-solid flex flex-col justify-between h-20`}>
          <div className="flex justify-between items-center text-zinc-500 font-bold text-[9px] uppercase tracking-wider">
            <span>Scheduled</span>
            <Clock className="size-3.5 text-sky-500" />
          </div>
          <span className={`text-xl font-extrabold mt-1.5 ${titleCol}`}>8</span>
        </div>

        <div className={`${cardBg} rounded-2xl p-4 border border-solid flex flex-col justify-between h-20`}>
          <div className="flex justify-between items-center text-zinc-500 font-bold text-[9px] uppercase tracking-wider">
            <span>Sent Today</span>
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          </div>
          <span className="text-xl font-extrabold text-emerald-500 mt-1.5">3</span>
        </div>

        <div className={`${cardBg} rounded-2xl p-4 border border-solid flex flex-col justify-between h-20`}>
          <div className="flex justify-between items-center text-zinc-500 font-bold text-[9px] uppercase tracking-wider">
            <span>Failed</span>
            <ShieldAlert className="size-3.5 text-rose-500" />
          </div>
          <span className="text-xl font-extrabold text-rose-500 mt-1.5">1</span>
        </div>
      </div>

      {/* Split layout: Left column = Upcoming Reminders, Right column = Reminder Settings / History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Upcoming Reminders */}
        <div className={`lg:col-span-2 space-y-4 border border-solid rounded-3xl p-5 ${cardBg} shadow-md`}>
          <h3 className={`font-bold text-base border-b border-solid pb-2 ${borderCol} ${titleCol}`}>Upcoming Reminders</h3>
          <span className="text-zinc-550 text-[11px] block -mt-2">Your scheduled and recently sent reminders</span>
          
          <div className="space-y-3 mt-4">
            {[
              { title: "RSVP Deadline — Wedding Ceremony", date: "Jul 20, 2025", channel: "Email", status: "Scheduled" },
              { title: "Event Reminder — Birthday Bash", date: "Aug 10, 2025", channel: "SMS", status: "Scheduled" },
              { title: "Last Call RSVP — Office Party", date: "Sep 3, 2025", channel: "Email", status: "Sent" },
              { title: "Day Before Reminder — Family Reunion", date: "Oct 17, 2025", channel: "Email", status: "Scheduled" },
              { title: "Thank You Note — Farewell Dinner", date: "Nov 3, 2025", channel: "Email", status: "Scheduled" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 border border-solid rounded-2xl bg-neutral-900/30 border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-850 border border-white/5">
                    <Bell className="size-4 text-amber-500" />
                  </div>
                  <div className="text-left font-semibold">
                    <span className={`font-bold text-xs block ${titleCol}`}>{item.title}</span>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-550">
                      <span>{item.date}</span>
                      <span className="size-1 rounded-full bg-zinc-650" />
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-bold uppercase tracking-wider text-[8px] text-zinc-400">{item.channel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === "Scheduled" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {item.status}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => toast.info(`Editing: ${item.title}`)} className="p-1 cursor-pointer border-0 bg-transparent text-zinc-550 hover:text-white transition-colors">
                      <Edit className="size-3.5" />
                    </button>
                    <button onClick={() => toast.info(`Deleting: ${item.title}`)} className="p-1 cursor-pointer border-0 bg-transparent text-zinc-550 hover:text-red-500 transition-colors">
                      <Trash className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Reminder Settings & Reminder History */}
        <div className="space-y-6">
          
          {/* Reminder Settings */}
          <div className={`border border-solid rounded-3xl p-5 ${cardBg} shadow-md`}>
            <h3 className={`font-bold text-base border-b border-solid pb-2 ${borderCol} ${titleCol}`}>Reminder Settings</h3>
            
            <div className="space-y-4 mt-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <div className="text-left pr-4">
                  <span className={`font-bold block ${titleCol}`}>Auto-send RSVP reminders</span>
                  <span className="text-[9px] text-zinc-500 leading-snug">Automatically remind guests who haven't responded yet</span>
                </div>
                <button
                  onClick={() => setAutoSendRsvp(!autoSendRsvp)}
                  className={`size-8 rounded-lg border cursor-pointer flex items-center justify-center font-bold transition-all duration-300 ${
                    autoSendRsvp 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-zinc-800 border-zinc-700 text-zinc-500"
                  }`}
                >
                  {autoSendRsvp ? "ON" : "OFF"}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-left pr-4">
                  <span className={`font-bold block ${titleCol}`}>Send day-before reminders</span>
                  <span className="text-[9px] text-zinc-500 leading-snug">Notify guests one day before the event date</span>
                </div>
                <button
                  onClick={() => setDayBeforeReminder(!dayBeforeReminder)}
                  className={`size-8 rounded-lg border cursor-pointer flex items-center justify-center font-bold transition-all duration-300 ${
                    dayBeforeReminder 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-zinc-800 border-zinc-700 text-zinc-500"
                  }`}
                >
                  {dayBeforeReminder ? "ON" : "OFF"}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-left pr-4">
                  <span className={`font-bold block ${titleCol}`}>Send thank-you notes</span>
                  <span className="text-[9px] text-zinc-500 leading-snug">Send a note to attendees after the event finishes</span>
                </div>
                <button
                  onClick={() => setThankYouNotes(!thankYouNotes)}
                  className={`size-8 rounded-lg border cursor-pointer flex items-center justify-center font-bold transition-all duration-300 ${
                    thankYouNotes 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-zinc-800 border-zinc-700 text-zinc-500"
                  }`}
                >
                  {thankYouNotes ? "ON" : "OFF"}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-left pr-4">
                  <span className={`font-bold block ${titleCol}`}>SMS notifications</span>
                  <span className="text-[9px] text-zinc-500 leading-snug">Send reminders via text message</span>
                </div>
                <button
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  className={`size-8 rounded-lg border cursor-pointer flex items-center justify-center font-bold transition-all duration-300 ${
                    smsNotifications 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-zinc-800 border-zinc-700 text-zinc-500"
                  }`}
                >
                  {smsNotifications ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Reminder History */}
          <div className={`border border-solid rounded-3xl p-5 ${cardBg} shadow-md`}>
            <h3 className={`font-bold text-base border-b border-solid pb-2 ${borderCol} ${titleCol}`}>Reminder History</h3>
            
            <div className="space-y-3 mt-4 text-xs font-semibold">
              {[
                { title: "Last Call RSVP", event: "Office Party", date: "Sent Sep 3, 2025" },
                { title: "Save the Date", event: "Wedding Ceremony", date: "Sent Jun 28, 2025" },
                { title: "Welcome Note", event: "Birthday Bash", date: "Sent Jun 15, 2025" }
              ].map((hist, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="text-left">
                    <span className={`font-bold block ${titleCol}`}>{hist.title}</span>
                    <span className="text-[9px] text-zinc-500">{hist.event} • {hist.date}</span>
                  </div>
                  <Check className="size-4 text-emerald-500 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
