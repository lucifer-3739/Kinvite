"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, Plus, Calendar, Users, Eye, Edit, Trash, LayoutDashboard, 
  Cake, Briefcase, Home, Utensils, Diamond, Sparkles, Heart, PlusCircle, X, Network 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventData, GuestData } from "./types";
import { themesRegistry } from "@/components/invitaion-cards/registry";

interface InvitationsTabProps {
  eventsList: EventData[];
  guestsList: GuestData[];
  theme: "light" | "dark";
  onDeleteEvent: (eventId: string) => Promise<void>;
  onCreateEvent: (data: { 
    title: string; 
    type: string; 
    date: string; 
    venue: string; 
    description: string; 
    theme: string; 
  }) => Promise<void>;
  setActiveEvent: (evt: EventData | null) => void;
  onTabChange: (tabName: string) => void;
  onTogglePublish: (evt: EventData) => Promise<void> | void;
  isSubmittingEvent: boolean;
  searchQuery: string;
  isCreatingEvent: boolean;
  setIsCreatingEvent: (open: boolean) => void;
  currentUser?: any;
}

export default function InvitationsTab({
  eventsList,
  guestsList,
  theme,
  onDeleteEvent,
  onCreateEvent,
  setActiveEvent,
  onTabChange,
  onTogglePublish,
  isSubmittingEvent,
  searchQuery,
  isCreatingEvent,
  setIsCreatingEvent,
  currentUser,
}: InvitationsTabProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [eventStatusFilter, setEventStatusFilter] = useState("all");
  const [eventsPage, setEventsPage] = useState(1);
  
  // Track deleted themes from localStorage
  const [deletedThemes, setDeletedThemes] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("deleted_themes") || "[]");
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const visibleThemes = themesRegistry.filter(
    (t) => (!t.creatorId || t.creatorId === currentUser?.id) && !deletedThemes.includes(t.id)
  );

  React.useEffect(() => {
    setEventsPage(1);
  }, [searchQuery]);

  // Form states
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventTheme, setEventTheme] = useState("Wedding03");

  // Theme styling constants
  const cardBg = theme === "dark" ? "bg-neutral-905 border-white/5" : "bg-white border-zinc-200";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";
  const borderCol = theme === "dark" ? "border-white/5" : "border-zinc-200";

  const getEventStatus = (evt: EventData) => {
    const eventDate = new Date(evt.date);
    const now = new Date();
    if (eventDate < now) {
      return "Sent";
    }
    if (evt.published) {
      return "Active";
    }
    return "Draft";
  };

  const getEventIconAndBg = (type: string) => {
    const size = "w-4 h-4";
    switch (type) {
      case "wedding":
        return {
          icon: <Heart className={`${size} text-rose-500 fill-rose-500`} />,
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-500"
        };
      case "birthday":
        return {
          icon: <Cake className={`${size} text-amber-500`} />,
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-500"
        };
      case "office_party":
        return {
          icon: <Briefcase className={`${size} text-blue-500`} />,
          bg: "bg-blue-500/10 border-blue-500/20 text-blue-500"
        };
      case "family_reunion":
        return {
          icon: <Home className={`${size} text-emerald-500`} />,
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        };
      case "farewell_dinner":
        return {
          icon: <Utensils className={`${size} text-cyan-500`} />,
          bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500"
        };
      case "anniversary_gala":
        return {
          icon: <Diamond className={`${size} text-yellow-500`} />,
          bg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
        };
      default:
        return {
          icon: <Sparkles className={`${size} text-purple-500`} />,
          bg: "bg-purple-500/10 border-purple-500/20 text-purple-500"
        };
    }
  };

  // Filters
  const filteredEvents = eventsList.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (eventStatusFilter !== "all") {
      const status = getEventStatus(evt).toLowerCase();
      if (status !== eventStatusFilter.toLowerCase()) return false;
    }
    return true;
  });

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice((eventsPage - 1) * itemsPerPage, eventsPage * itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateEvent({
      title: eventTitle,
      type: eventType,
      date: eventDate,
      venue: eventVenue,
      description: eventDesc,
      theme: eventTheme
    });
    // Reset form
    setEventTitle("");
    setEventType("wedding");
    setEventDate("");
    setEventVenue("");
    setEventDesc("");
    setEventTheme("minimal_elegant");
    setIsCreatingEvent(false);
  };

  return (
    <div className="space-y-6 animate-fade">

      {/* Filter Pills row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {["all", "active", "draft", "sent"].map((statusOpt) => {
            const isActive = eventStatusFilter === statusOpt;
            return (
              <button
                key={statusOpt}
                onClick={() => {
                  setEventStatusFilter(statusOpt);
                  setEventsPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize select-none cursor-pointer transition-all duration-300 border ${
                  isActive
                    ? "bg-white text-neutral-950 border-white shadow"
                    : theme === "dark"
                      ? "bg-neutral-900 border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/10"
                      : "bg-white border-zinc-200 text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {statusOpt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Content Grid / List */}
      {filteredEvents.length === 0 ? (
        <div 
          onClick={() => setIsCreatingEvent(true)}
          className="text-center py-16 text-zinc-550 border border-dashed rounded-3xl cursor-pointer hover:border-amber-500/50 hover:text-zinc-300 transition-colors"
        >
          No invitations found. Click "+ Create Invitation" to build a new one.
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((evt) => {
                const status = getEventStatus(evt);
                const { icon, bg } = getEventIconAndBg(evt.type);
                
                // Count guests
                const eventGuests = guestsList.filter(g => g.eventId === evt.id);
                const total = eventGuests.reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                const conf = eventGuests.filter(g => g.attendance === "yes").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                const pend = eventGuests.filter(g => g.attendance === "pending").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);
                const decl = eventGuests.filter(g => g.attendance === "no").reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);

                const yesPct = total > 0 ? (conf / total) * 100 : 0;
                const pendingPct = total > 0 ? (pend / total) * 100 : 0;
                const noPct = total > 0 ? (decl / total) * 100 : 0;

                return (
                  <div
                    key={evt.id}
                    className={`border border-solid rounded-3xl p-5 flex flex-col justify-between h-64 transition-all duration-300 ${cardBg} hover:scale-[1.015] hover:shadow-lg`}
                  >
                    <div className="space-y-3 font-semibold">
                      {/* Badge and Icon header */}
                      <div className="flex justify-between items-center">
                        <div className={`p-2 rounded-xl border ${bg} flex items-center justify-center`}>
                          {icon}
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          status === "Active" ? "bg-emerald-500/10 text-emerald-450" :
                          status === "Sent" ? "bg-blue-500/10 text-blue-405" : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {status}
                        </span>
                      </div>

                      {/* Title and Venue */}
                      <div>
                        <h3 className={`text-base font-bold truncate ${titleCol}`}>{evt.title}</h3>
                        
                        {/* Date and Guests info */}
                        <div className="flex flex-col gap-1.5 mt-3 text-xs text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-555" />
                            <span>
                              {new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-zinc-555" />
                            <span>{total} guests</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ratios & Actions footer */}
                    <div className="space-y-4 pt-4 border-t border-solid border-[#D4AF37]/5">
                      {/* RSVP progress bar */}
                      <div className="space-y-1">
                        <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-zinc-800">
                          <div className="bg-emerald-500" style={{ width: `${yesPct}%` }} title={`Confirmed: ${conf}`} />
                          <div className="bg-amber-500" style={{ width: `${pendingPct}%` }} title={`Pending: ${pend}`} />
                          <div className="bg-rose-500" style={{ width: `${noPct}%` }} title={`Declined: ${decl}`} />
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex items-center justify-between text-zinc-400">
                        <div className="flex gap-2">
                          <Link
                            href={`/invite/${evt.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border hover:text-amber-500 hover:border-amber-500/35 border-zinc-800 transition-colors"
                            title="View Public Invite"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => { setActiveEvent(evt); onTabChange("templates"); }}
                            className="p-1.5 rounded-lg border hover:text-amber-500 hover:border-amber-500/35 border-zinc-800 transition-colors cursor-pointer bg-transparent"
                            title="Edit Invitation"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setActiveEvent(evt); onTabChange("tree"); }}
                            className="p-1.5 rounded-lg border hover:text-amber-500 hover:border-amber-500/35 border-zinc-800 transition-colors cursor-pointer bg-transparent"
                            title="Tree Map connection"
                          >
                            <Network className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onTogglePublish(evt)}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all duration-300 cursor-pointer bg-transparent ${
                              evt.published 
                                ? "border-emerald-500/30 text-emerald-450 hover:bg-emerald-500/10" 
                                : "border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }`}
                            title={evt.published ? "Set to Draft" : "Publish (Active)"}
                          >
                            {evt.published ? "Active" : "Draft"}
                          </button>
                          <button
                            onClick={() => onDeleteEvent(evt.id)}
                            className="p-1.5 rounded-lg border hover:text-red-500 hover:border-red-500/35 border-zinc-800 transition-colors cursor-pointer bg-transparent"
                            title="Delete Event"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className={`border border-solid rounded-3xl p-6 ${cardBg} overflow-x-auto shadow-md`}>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${borderCol} text-zinc-555 uppercase tracking-widest font-semibold pb-3`}>
                    <th className="pb-3 pr-4 font-semibold text-[10px]">Type</th>
                    <th className="pb-3 pr-4 font-semibold text-[10px]">Title</th>
                    <th className="pb-3 pr-4 font-semibold text-[10px]">Date</th>
                    <th className="pb-3 pr-4 font-semibold text-[10px]">Venue</th>
                    <th className="pb-3 pr-4 font-semibold text-[10px] text-center">Headcount</th>
                    <th className="pb-3 pr-4 font-semibold text-[10px]">Status</th>
                    <th className="pb-3 font-semibold text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === "dark" ? "divide-white/5" : "divide-neutral-200"}`}>
                  {paginatedEvents.map((evt) => {
                    const status = getEventStatus(evt);
                    const { icon, bg } = getEventIconAndBg(evt.type);
                    const eventGuests = guestsList.filter(g => g.eventId === evt.id);
                    const total = eventGuests.reduce((acc, g) => acc + parseInt(g.guestCount || "1"), 0);

                    return (
                      <tr key={evt.id} className="hover:bg-zinc-900/5">
                        <td className="py-4 pr-4">
                          <span className={`inline-flex p-1.5 rounded-lg border ${bg}`}>
                            {icon}
                          </span>
                        </td>
                        <td className={`py-4 pr-4 font-bold text-sm ${titleCol}`}>{evt.title}</td>
                        <td className="py-4 pr-4 text-zinc-400 font-medium">
                          {new Date(evt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-4 pr-4 text-zinc-400 truncate max-w-[150px]" title={evt.venue}>{evt.venue}</td>
                        <td className="py-4 pr-4 text-center text-zinc-350">{total} Guests</td>
                        <td className="py-4 pr-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            status === "Active" ? "bg-emerald-500/10 text-emerald-450" :
                            status === "Sent" ? "bg-blue-500/10 text-blue-405" : "bg-zinc-805 text-zinc-450"
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-4 text-right flex items-center justify-end gap-2">
                          <Link href={`/invite/${evt.slug}`} target="_blank" className="p-1.5 rounded-lg border hover:text-amber-500 border-zinc-800 transition-colors" title="View Public Invite">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => { setActiveEvent(evt); onTabChange("templates"); }} className="p-1.5 rounded-lg border hover:text-amber-500 border-zinc-800 transition-colors cursor-pointer bg-transparent" title="Edit Invitation">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { setActiveEvent(evt); onTabChange("tree"); }} className="p-1.5 rounded-lg border hover:text-amber-500 border-zinc-800 transition-colors cursor-pointer bg-transparent" title="Tree Map connection">
                            <Network className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onTogglePublish(evt)}
                            className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all duration-300 cursor-pointer bg-transparent ${
                              evt.published 
                                ? "border-emerald-500/30 text-emerald-450 hover:bg-emerald-500/10" 
                                : "border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }`}
                            title={evt.published ? "Set to Draft" : "Publish (Active)"}
                          >
                            {evt.published ? "Active" : "Draft"}
                          </button>
                          <button onClick={() => onDeleteEvent(evt.id)} className="p-1.5 rounded-lg border hover:text-red-500 border-zinc-800 transition-colors cursor-pointer bg-transparent" title="Delete Event">
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-solid border-[#D4AF37]/5">
            {/* Grid / List Selector Toggle */}
            <div className={`flex rounded-xl p-0.5 border border-solid ${borderCol} overflow-hidden bg-neutral-900/50`}>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors duration-300 border-0 bg-transparent ${
                  viewMode === "grid"
                    ? theme === "dark"
                      ? "bg-zinc-805 text-white"
                      : "bg-neutral-100 text-neutral-950 font-bold"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <LayoutDashboard className="size-3.5" /> Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors duration-300 border-0 bg-transparent ${
                  viewMode === "list"
                    ? theme === "dark"
                      ? "bg-zinc-805 text-white"
                      : "bg-neutral-100 text-neutral-950 font-bold"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <Users className="size-3.5" /> List
              </button>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  disabled={eventsPage === 1}
                  onClick={() => setEventsPage(prev => Math.max(1, prev - 1))}
                  className={`px-3 py-1.5 rounded-lg border border-solid border-zinc-800 bg-transparent transition-colors font-bold cursor-pointer ${
                    eventsPage === 1 ? "text-zinc-650 cursor-not-allowed opacity-50" : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  &lt; Previous
                </button>
                
                {Array.from({ length: totalPages }).map((_, pageIdx) => {
                  const pageNum = pageIdx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setEventsPage(pageNum)}
                      className={`size-8 font-bold rounded-lg border-0 cursor-pointer ${
                        eventsPage === pageNum
                          ? "bg-white text-neutral-950"
                          : "bg-transparent text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={eventsPage === totalPages}
                  onClick={() => setEventsPage(prev => Math.min(totalPages, prev + 1))}
                  className={`px-3 py-1.5 rounded-lg border border-solid border-zinc-800 bg-transparent transition-colors font-bold cursor-pointer ${
                    eventsPage === totalPages ? "text-zinc-650 cursor-not-allowed opacity-50" : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  Next &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL BOX DIALOG */}
      {isCreatingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative text-left text-neutral-100">
            <button
              onClick={() => setIsCreatingEvent(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer border-0 bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-serif text-2xl text-white mb-2 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-amber-500" /> Create Celebration Invite
            </h3>
            <p className="text-zinc-550 text-xs mb-6 font-semibold">
              Complete the details to generate your customized invitation microsite.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-semibold">
              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Event Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Rahul & Priya's Wedding"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  className="bg-neutral-950 border-white/10 text-xs h-10 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full h-10 border border-white/10 bg-neutral-950 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 rounded-lg px-2 cursor-pointer"
                  >
                    <option value="wedding" className="bg-[#171313]">Wedding Ceremony</option>
                    <option value="birthday" className="bg-[#171313]">Birthday Party</option>
                    <option value="engagement" className="bg-[#171313]">Engagement Gala</option>
                    <option value="baby_shower" className="bg-[#171313]">Baby Shower</option>
                    <option value="office_party" className="bg-[#171313]">Office Party</option>
                    <option value="family_reunion" className="bg-[#171313]">Family Reunion</option>
                    <option value="farewell_dinner" className="bg-[#171313]">Farewell Dinner</option>
                    <option value="anniversary_gala" className="bg-[#171313]">Anniversary Gala</option>
                  </select>
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Event Date</label>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="bg-neutral-950 border-white/10 text-xs h-10 rounded-lg text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Venue Location</label>
                <Input
                  type="text"
                  placeholder="e.g. Udaipur Palace Gardens"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  required
                  className="bg-neutral-950 border-white/10 text-xs h-10 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Description</label>
                <Input
                  type="text"
                  placeholder="e.g. Two families coming together to celebrate life."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="bg-neutral-950 border-white/10 text-xs h-10 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Template / Theme</label>
                <select
                  value={eventTheme}
                  onChange={(e) => setEventTheme(e.target.value)}
                  className="w-full h-10 border border-white/10 bg-neutral-950 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 rounded-lg px-2 cursor-pointer"
                >
                  {visibleThemes.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#171313]">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold rounded-lg text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingEvent}
                  className="flex-grow h-10 bg-amber-500 hover:bg-amber-600 text-[#120F0F] font-bold text-xs border-0 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingEvent ? "Saving Draft..." : "Save Invitation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
