"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, UserPlus, Users, CheckCircle2, Clock, X, Eye, Trash, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventData, GuestData } from "./types";

interface GuestsTabProps {
  eventsList: EventData[];
  guestsList: GuestData[];
  theme: "light" | "dark";
  activeEvent: EventData | null;
  setActiveEvent: (evt: EventData | null) => void;
  onDeleteGuest: (guestId: string) => Promise<void>;
  onAddGuest: (data: {
    name: string;
    phone: string;
    relation: string;
    attendance: string;
    guestCount: string;
    side: string;
  }) => Promise<void>;
  isSubmittingGuest: boolean;
  searchQuery: string;
}

export default function GuestsTab({
  eventsList,
  guestsList,
  theme,
  activeEvent,
  setActiveEvent,
  onDeleteGuest,
  onAddGuest,
  isSubmittingGuest,
  searchQuery,
}: GuestsTabProps) {
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [selectedRelationFilter, setSelectedRelationFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [guestsPage, setGuestsPage] = useState(1);
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  React.useEffect(() => {
    setGuestsPage(1);
  }, [searchQuery]);

  // Form states
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestRelation, setGuestRelation] = useState("family");
  const [guestAttendance, setGuestAttendance] = useState("pending");
  const [guestCount, setGuestCount] = useState("1");
  const [guestSide, setGuestSide] = useState("groom_side");

  // Theme styling constants
  const cardBg = theme === "dark" ? "bg-neutral-905 border-white/5" : "bg-white border-zinc-200";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";
  const borderCol = theme === "dark" ? "border-white/5" : "border-zinc-200";

  // Filtered guest calculations for statistics
  const targetGuests = selectedEventFilter === "all"
    ? guestsList
    : guestsList.filter(g => g.eventId === selectedEventFilter);

  const gTotal = targetGuests.reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
  const gConfirmed = targetGuests.filter(g => g.attendance === "yes").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
  const gPending = targetGuests.filter(g => g.attendance === "pending").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
  const gDeclined = targetGuests.filter(g => g.attendance === "no").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);

  // Table filtering logic
  const filteredGuestsTable = targetGuests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (g.phone && g.phone.includes(searchQuery));
    if (!matchesSearch) return false;

    if (selectedRelationFilter !== "all" && g.relation !== selectedRelationFilter) return false;

    if (selectedStatusFilter !== "all") {
      const statusMap: Record<string, string> = { confirmed: "yes", pending: "pending", declined: "no" };
      if (g.attendance !== statusMap[selectedStatusFilter]) return false;
    }

    return true;
  });

  // Table pagination
  const guestsPerPage = 8;
  const totalPages = Math.ceil(filteredGuestsTable.length / guestsPerPage) || 1;
  const paginatedGuests = filteredGuestsTable.slice((guestsPage - 1) * guestsPerPage, guestsPage * guestsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddGuest({
      name: guestName,
      phone: guestPhone,
      relation: guestRelation,
      attendance: guestAttendance,
      guestCount: guestCount,
      side: guestSide
    });
    // Reset form
    setGuestName("");
    setGuestPhone("");
    setGuestRelation("family");
    setGuestAttendance("pending");
    setGuestCount("1");
    setGuestSide("groom_side");
    setIsAddingGuest(false);
  };

  return (
    <div className="space-y-6 animate-fade">

      {/* Four Statistic Metric Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Guests */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between h-24 relative overflow-hidden group`}>
          <div className="flex justify-between items-center text-zinc-500 font-semibold text-[10px] uppercase tracking-wider">
            <span>Total Guests</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <span className={`text-2xl font-extrabold mt-2 ${titleCol}`}>{gTotal}</span>
        </div>

        {/* Confirmed */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between h-24 relative overflow-hidden group`}>
          <div className="flex justify-between items-center text-zinc-500 font-semibold text-[10px] uppercase tracking-wider">
            <span>Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-500 mt-2">{gConfirmed}</span>
        </div>

        {/* Pending */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between h-24 relative overflow-hidden group`}>
          <div className="flex justify-between items-center text-zinc-500 font-semibold text-[10px] uppercase tracking-wider">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className={`text-2xl font-extrabold mt-2 ${titleCol}`}>{gPending}</span>
        </div>

        {/* Declined */}
        <div className={`${cardBg} rounded-2xl p-5 border border-solid hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between h-24 relative overflow-hidden group`}>
          <div className="flex justify-between items-center text-zinc-500 font-semibold text-[10px] uppercase tracking-wider">
            <span>Declined</span>
            <X className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-extrabold text-rose-500 mt-2">{gDeclined}</span>
        </div>
      </div>

      {/* Filters Panel: Events Dropdown, Relation Pills, Status Pills */}
      <div className="flex flex-col gap-4 border-b border-solid pb-4 border-[#D4AF37]/10">
        <div className="flex flex-wrap items-center gap-4">
          {/* Event selector Dropdown */}
          <div className="flex flex-col font-semibold">
            <label className="text-[9px] font-semibold uppercase tracking-wider text-zinc-550 mb-1">Event Registry</label>
            <select
              value={selectedEventFilter}
              onChange={(e) => {
                setSelectedEventFilter(e.target.value);
                setGuestsPage(1);
              }}
              className="h-9 border border-white/5 bg-neutral-900 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 rounded-lg px-3 cursor-pointer select-none"
            >
              <option value="all">All Events</option>
              {eventsList.map(evt => (
                <option key={evt.id} value={evt.id}>{evt.title}</option>
              ))}
            </select>
          </div>

          {/* Relation Category Filters */}
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-550 mb-1">Relation Groups</span>
            <div className="flex items-center gap-1.5">
              {["all", "family", "friend", "office"].map((rel) => {
                const isActive = selectedRelationFilter === rel;
                const labelMap: Record<string, string> = { all: "All", family: "Family", friend: "Friends", office: "Colleagues" };
                return (
                  <button
                    key={rel}
                    onClick={() => {
                      setSelectedRelationFilter(rel);
                      setGuestsPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer select-none ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/35 text-amber-500"
                        : "bg-neutral-900/40 border-white/5 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {labelMap[rel]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-550 mb-1">Attendance Status</span>
            <div className="flex items-center gap-1.5">
              {["all", "confirmed", "pending", "declined"].map((stat) => {
                const isActive = selectedStatusFilter === stat;
                return (
                  <button
                    key={stat}
                    onClick={() => {
                      setSelectedStatusFilter(stat);
                      setGuestsPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer select-none ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/35 text-amber-500"
                        : "bg-neutral-900/40 border-white/5 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {stat.charAt(0).toUpperCase() + stat.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Guest Registry Table */}
      <div className="space-y-4">
        <div className={`border border-solid rounded-3xl p-6 ${cardBg} overflow-x-auto shadow-md`}>
          {filteredGuestsTable.length === 0 ? (
            <div className="text-center py-12 text-zinc-550">
              No guests found matching selected filter criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${borderCol} text-zinc-550 uppercase tracking-widest font-semibold pb-3`}>
                  <th className="pb-3 pr-4 font-semibold text-[10px]">Guest</th>
                  <th className="pb-3 pr-4 font-semibold text-[10px]">Event</th>
                  <th className="pb-3 pr-4 font-semibold text-[10px]">Relation</th>
                  <th className="pb-3 pr-4 font-semibold text-[10px]">RSVP Status</th>
                  <th className="pb-3 pr-4 font-semibold text-[10px]">Invited On</th>
                  <th className="pb-3 font-semibold text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === "dark" ? "divide-white/5" : "divide-neutral-200"}`}>
                {paginatedGuests.map((g) => {
                  const associatedEvent = eventsList.find(e => e.id === g.eventId);
                  const eventName = associatedEvent ? associatedEvent.title : "Invitation Event";
                  const initials = g.name.split(" ").map(w => w[0]).join("").slice(0, 2);
                  const email = `${g.name.toLowerCase().replace(/\s+/g, '.')}@email.com`;
                  
                  let relationBg = "bg-purple-500/10 text-purple-400 border border-purple-500/20";
                  if (g.relation === "family") {
                    relationBg = "bg-amber-500/10 text-amber-450 border border-amber-500/20";
                  } else if (g.relation === "friend") {
                    relationBg = "bg-sky-500/10 text-sky-400 border border-sky-500/20";
                  }

                  return (
                    <tr key={g.id} className="hover:bg-zinc-900/5">
                      <td className="py-4 pr-4 flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          theme === "dark" ? "bg-neutral-850 text-white" : "bg-neutral-100 text-neutral-800 border"
                        }`}>
                          {initials}
                        </div>
                        <div className="text-left">
                          <span className={`font-bold block ${titleCol}`}>{g.name}</span>
                          <span className="text-[10px] text-zinc-500">{email}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-zinc-400 font-medium truncate max-w-[130px]" title={eventName}>{eventName}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${relationBg}`}>
                          {g.relation === "office" ? "Colleagues" : g.relation === "friend" ? "Friends" : "Family"}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          g.attendance === "yes" ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20" :
                          g.attendance === "no" ? "bg-rose-500/10 text-rose-455 border border-rose-500/20" : "bg-amber-500/10 text-amber-450 border border-amber-500/20"
                        }`}>
                          {g.attendance === "yes" ? "Confirmed" : g.attendance === "no" ? "Declined" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-zinc-400 font-medium">
                        {new Date(g.createdAt || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-4 text-right flex items-center justify-end gap-1.5">
                        {associatedEvent && (
                          <Link href={`/invite/${associatedEvent.slug}`} target="_blank" className="p-1.5 rounded-lg border hover:text-amber-500 border-zinc-800 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button onClick={() => onDeleteGuest(g.id)} className="p-1.5 rounded-lg border hover:text-red-500 border-zinc-800 transition-colors cursor-pointer bg-transparent">
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-1 text-xs pt-2">
            <button
              disabled={guestsPage === 1}
              onClick={() => setGuestsPage(prev => Math.max(1, prev - 1))}
              className={`px-3 py-1.5 rounded-lg border border-solid border-zinc-800 bg-transparent transition-colors font-bold cursor-pointer ${
                guestsPage === 1 ? "text-zinc-650 cursor-not-allowed opacity-50" : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              &lt; Prev
            </button>
            
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageNum = pageIdx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setGuestsPage(pageNum)}
                  className={`size-8 font-bold rounded-lg border-0 cursor-pointer ${
                    guestsPage === pageNum
                      ? "bg-white text-neutral-950"
                      : "bg-transparent text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={guestsPage === totalPages}
              onClick={() => setGuestsPage(prev => Math.min(totalPages, prev + 1))}
              className={`px-3 py-1.5 rounded-lg border border-solid border-zinc-800 bg-transparent transition-colors font-bold cursor-pointer ${
                guestsPage === totalPages ? "text-zinc-650 cursor-not-allowed opacity-50" : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>

      {/* ADD GUEST MODAL DIALOG */}
      {isAddingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-left text-neutral-100 font-semibold">
            <button
              onClick={() => setIsAddingGuest(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer border-0 bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-serif text-2xl text-white mb-2 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-amber-500" /> Add Guest Record
            </h3>
            <p className="text-zinc-550 text-xs mb-6">
              Create a new guest registry entry in your active event.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Guest Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="bg-neutral-950 border-white/10 text-xs h-10 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  className="bg-neutral-950 border-white/10 text-xs h-10 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Category</label>
                  <select
                    value={guestRelation}
                    onChange={(e) => setGuestRelation(e.target.value)}
                    className="w-full h-10 border border-white/10 bg-neutral-950 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 rounded-lg px-2 cursor-pointer"
                  >
                    <option value="family" className="bg-[#171313]">Family & Relative</option>
                    <option value="friend" className="bg-[#171313]">Friend Circle</option>
                    <option value="office" className="bg-[#171313]">Office Colleague</option>
                  </select>
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Party Count</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full h-10 border border-white/10 bg-neutral-950 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 rounded-lg px-2 cursor-pointer"
                  >
                    <option value="1" className="bg-[#171313]">1 Guest</option>
                    <option value="2" className="bg-[#171313]">2 Guests</option>
                    <option value="3" className="bg-[#171313]">3 Guests</option>
                    <option value="4" className="bg-[#171313]">4 Guests</option>
                    <option value="5" className="bg-[#171313]">5+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Side Association</label>
                <select
                  value={guestSide}
                  onChange={(e) => setGuestSide(e.target.value)}
                  className="w-full h-10 border border-white/10 bg-neutral-950 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 rounded-lg px-2 cursor-pointer"
                >
                  {activeEvent?.type === "wedding" ? (
                    <>
                      <option value="groom_side" className="bg-[#171313]">Groom's Association</option>
                      <option value="bride_side" className="bg-[#171313]">Bride's Association</option>
                    </>
                  ) : (
                    <>
                      <option value="family_side" className="bg-[#171313]">Family Side</option>
                      <option value="friends_side" className="bg-[#171313]">Friends Side</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Attendance RSVP</label>
                <select
                  value={guestAttendance}
                  onChange={(e) => setGuestAttendance(e.target.value)}
                  className="w-full h-10 border border-white/10 bg-neutral-950 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 rounded-lg px-2 cursor-pointer"
                >
                  <option value="pending" className="bg-[#171313]">Pending Response</option>
                  <option value="yes" className="bg-[#171313]">Attending (Confirmed)</option>
                  <option value="no" className="bg-[#171313]">Declined (Sadly Decline)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsAddingGuest(false)}
                  className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold rounded-lg text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingGuest}
                  className="flex-grow h-10 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs border-0 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingGuest ? (
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  ) : (
                    "Add Guest"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
