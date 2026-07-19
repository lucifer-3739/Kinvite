"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Sun, Moon, Search, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { z } from "zod";

// Shared Types
import { EventData, GuestData } from "@/components/dashboard/types";

// Broken down components
import Sidebar from "@/components/dashboard/sidebar";
import OverviewTab from "@/components/dashboard/overview-tab";
import InvitationsTab from "@/components/dashboard/invitations-tab";
import GuestsTab from "@/components/dashboard/guests-tab";
import TemplatesTab from "@/components/dashboard/templates-tab";
import RemindersTab from "@/components/dashboard/reminders-tab";
import SettingsTab from "@/components/dashboard/settings-tab";
import RelationTreeTab from "@/components/dashboard/relation-tree-tab";

// Server Actions
import {
  createEventAction,
  deleteEventAction,
  addGuestAction,
  deleteGuestAction,
  updateEventThemeAction,
  updateUserProfileAction,
  saveRelationshipTreeAction,
  getGuestsAction
} from "@/app/actions/dashboard";

// CSS overrides creator for dynamic accent coloring
const getAccentCssOverrides = (accent: string) => {
  let hex = "#f59e0b"; // amber-500
  let hoverHex = "#d97706"; // amber-600
  let lightHex = "rgba(245, 158, 11, 0.1)";
  let borderHex = "rgba(245, 158, 11, 0.25)";

  if (accent === "emerald") {
    hex = "#10b981";
    hoverHex = "#059669";
    lightHex = "rgba(16, 185, 129, 0.1)";
    borderHex = "rgba(16, 185, 129, 0.25)";
  } else if (accent === "indigo") {
    hex = "#6366f1";
    hoverHex = "#4f46e5";
    lightHex = "rgba(99, 102, 241, 0.1)";
    borderHex = "rgba(99, 102, 241, 0.25)";
  } else if (accent === "rose") {
    hex = "#f43f5e";
    hoverHex = "#e11d48";
    lightHex = "rgba(244, 63, 94, 0.1)";
    borderHex = "rgba(244, 63, 94, 0.25)";
  } else if (accent === "slate") {
    hex = "#64748b";
    hoverHex = "#475569";
    lightHex = "rgba(100, 116, 139, 0.1)";
    borderHex = "rgba(100, 116, 139, 0.25)";
  }

  return `
    /* Accent color overrides dynamically generated */
    .text-amber-500, .text-amber-400 { color: ${hex} !important; }
    .bg-amber-500, .bg-amber-600 { background-color: ${hex} !important; }
    .hover\\:bg-amber-600:hover { background-color: ${hoverHex} !important; }
    .border-amber-500 { border-color: ${hex} !important; }
    .bg-amber-500\\/10 { background-color: ${lightHex} !important; }
    .border-amber-500\\/20, .border-amber-500\\/25, .border-amber-500\\/30 { border-color: ${borderHex} !important; }
    .text-amber-600 { color: ${hoverHex} !important; }
    .focus\\:border-amber-500:focus { border-color: ${hex} !important; }
    .text-amber-500\\/10 { color: ${lightHex} !important; }
    input[type="checkbox"]:checked {
      background-color: ${hex} !important;
      border-color: ${hex} !important;
    }
  `;
};

interface DashboardProps {
  initialEvents: EventData[];
  initialGuests: GuestData[];
  activeTab: string;
  currentUser: any;
}

// ---------------- ZOD VALIDATION SCHEMAS ----------------
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum([
    "wedding",
    "birthday",
    "engagement",
    "baby_shower",
    "office_party",
    "family_reunion",
    "farewell_dinner",
    "anniversary_gala"
  ]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Please choose a valid date"),
  venue: z.string().min(5, "Venue location must be at least 5 characters"),
  description: z.string().optional(),
  theme: z.string().optional()
});

const guestSchema = z.object({
  name: z.string().min(2, "Guest name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  relation: z.enum(["family", "friend", "office"]),
  attendance: z.enum(["yes", "no", "pending"]),
  guestCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Guest count must be positive"),
  side: z.string()
});

export function DashboardClient({ initialEvents, initialGuests, activeTab: serverTab, currentUser }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(serverTab || "overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [accentColor, setAccentColor] = useState<string>("amber");
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Core Data States
  const [eventsList, setEventsList] = useState<EventData[]>(initialEvents);
  const [guestsList, setGuestsList] = useState<GuestData[]>(initialGuests);
  const [activeEvent, setActiveEvent] = useState<EventData | null>(initialEvents[0] || null);

  // Settings states
  const [profileName, setProfileName] = useState(currentUser?.name || "Rahul Gupta");
  const [profilePlan, setProfilePlan] = useState(currentUser?.plan || "free");
  const [profileImage, setProfileImage] = useState(currentUser?.image || null);

  // Loading States
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("kinvite-theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark");
    }
    const savedAccent = localStorage.getItem("kinvite-accent");
    if (savedAccent) {
      setAccentColor(savedAccent);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("kinvite-theme", nextTheme);
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    setSearchQuery("");
    window.history.pushState(null, "", `/dashboard?tab=${tabName}`);
  };
  
  useEffect(() => {
    if (serverTab) {
      setActiveTab(serverTab);
    }
  }, [serverTab]);

  // Real-time synchronization background polling (every 8 seconds)
  const syncGuestsList = useCallback(async (silent = false) => {
    if (!activeEvent) return;
    try {
      const response = await getGuestsAction(activeEvent.id);
      if (response.success && response.guests) {
        setGuestsList((prev) => {
          const others = prev.filter((g) => g.eventId !== activeEvent.id);
          return [...others, ...response.guests];
        });
      }
    } catch (err) {
      console.error("Failed to sync guest registry:", err);
    }
  }, [activeEvent]);

  useEffect(() => {
    if (!activeEvent) return;
    syncGuestsList(true);
    const interval = setInterval(() => {
      syncGuestsList(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeEvent, syncGuestsList]);

  // 1. CREATE EVENT
  const handleCreateEvent = async (data: {
    title: string;
    type: string;
    date: string;
    venue: string;
    description: string;
    theme: string;
  }) => {
    const validation = eventSchema.safeParse(data);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsSubmittingEvent(true);
    try {
      const response = await createEventAction(data);

      if (response.success && response.eventId) {
        toast.success("Event created successfully!");
        
        const newEvt: EventData = {
          id: response.eventId,
          userId: activeEvent?.userId || "user-id",
          title: data.title,
          slug: response.slug || "new-event",
          type: data.type,
          date: new Date(data.date),
          venue: data.venue,
          coverImage: "/wedding_hero.png",
          theme: data.theme,
          description: data.description,
          relationshipTree: null
        };

        setEventsList([newEvt, ...eventsList]);
        setActiveEvent(newEvt);
      } else {
        toast.error(response.error || "Failed to create event.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  // 2. DELETE EVENT
  const handleDeleteEvent = async (eventId: string) => {
    const confirm = window.confirm("Are you absolutely sure you want to delete this event? This will permanently remove all guest lists and relationship trees associated with it.");
    if (!confirm) return;

    try {
      const response = await deleteEventAction(eventId);
      if (response.success) {
        toast.success("Event deleted successfully.");
        const updated = eventsList.filter(e => e.id !== eventId);
        setEventsList(updated);
        setActiveEvent(updated[0] || null);
      } else {
        toast.error(response.error || "Failed to delete event.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  // 3. ADD GUEST
  const handleAddGuest = async (data: {
    name: string;
    phone: string;
    relation: string;
    attendance: string;
    guestCount: string;
    side: string;
  }) => {
    if (!activeEvent) {
      toast.error("Please select an active event first.");
      return;
    }

    const validation = guestSchema.safeParse(data);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsSubmittingGuest(true);
    try {
      const response = await addGuestAction({
        eventId: activeEvent.id,
        name: data.name,
        phone: data.phone,
        relation: data.relation as "family" | "friend" | "office",
        attendance: data.attendance as "yes" | "no" | "pending",
        guestCount: data.guestCount,
        side: data.side
      });

      if (response.success && response.guestId) {
        toast.success("Guest added to registry.");
        const newGuest: GuestData = {
          id: response.guestId,
          eventId: activeEvent.id,
          name: data.name,
          phone: data.phone,
          relation: data.relation,
          attendance: data.attendance,
          guestCount: data.guestCount,
          side: data.side,
          createdAt: new Date()
        };
        setGuestsList([newGuest, ...guestsList]);
      } else {
        toast.error(response.error || "Failed to add guest.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmittingGuest(false);
    }
  };

  // 4. DELETE GUEST
  const handleDeleteGuest = async (guestId: string) => {
    if (!activeEvent) return;
    try {
      const response = await deleteGuestAction(guestId, activeEvent.id);
      if (response.success) {
        toast.success("Guest removed from registry.");
        setGuestsList(guestsList.filter(g => g.id !== guestId));
      } else {
        toast.error(response.error || "Failed to remove guest.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  // 5. UPDATE EVENT TEMPLATE
  const handleSelectTemplate = async (
    themeName: string,
    details?: {
      title?: string;
      date?: string;
      venue?: string;
      description?: string;
      coverImage?: string;
    }
  ) => {
    if (!activeEvent) {
      toast.error("No active event selected.");
      return;
    }

    try {
      const response = await updateEventThemeAction(activeEvent.id, themeName, details);
      if (response.success) {
        toast.success(`Template successfully updated!`);
        const updatedEvent = {
          ...activeEvent,
          theme: themeName,
          ...(details?.title && { title: details.title }),
          ...(details?.date && { date: new Date(details.date) }),
          ...(details?.venue && { venue: details.venue }),
          ...(details?.description !== undefined && { description: details.description }),
          ...(details?.coverImage !== undefined && { coverImage: details.coverImage }),
        };
        setActiveEvent(updatedEvent);
        setEventsList(eventsList.map(e => e.id === activeEvent.id ? updatedEvent : e));
      } else {
        toast.error(response.error || "Failed to change template.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  // 5b. TOGGLE EVENT PUBLISHED STATUS
  const handleTogglePublish = async (evt: EventData) => {
    try {
      const nextPublished = !evt.published;
      const response = await updateEventThemeAction(evt.id, undefined, {
        published: nextPublished
      });
      if (response.success) {
        toast.success(nextPublished ? "Event published successfully!" : "Event set to draft.");
        const updatedEvent: EventData = {
          ...evt,
          published: nextPublished
        };
        if (activeEvent && activeEvent.id === evt.id) {
          setActiveEvent(updatedEvent);
        }
        setEventsList(eventsList.map(e => e.id === evt.id ? updatedEvent : e));
      } else {
        toast.error(response.error || "Failed to update status.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  // 6. UPDATE PROFILE SETTINGS
  const handleUpdateSettings = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    image: string | null;
    plan?: string;
  }) => {
    const combinedName = `${data.firstName} ${data.lastName}`.trim();
    const updatedPlan = data.plan || profilePlan;
    
    setIsUpdatingSettings(true);
    try {
      const response = await updateUserProfileAction({
        name: combinedName,
        email: data.email,
        phone: data.phone || null,
        bio: data.bio || null,
        location: data.location || null,
        image: data.image || null,
        plan: updatedPlan as "free" | "pro"
      });
      if (response.success) {
        setProfileName(combinedName);
        setProfileImage(data.image);
        setProfilePlan(updatedPlan);
        toast.success("Profile status successfully updated!");
      } else {
        toast.error(response.error || "Failed to update settings.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // 7. SAVE RELATIONSHIP TREE
  const handleSaveTree = async (treeJson: string): Promise<boolean> => {
    if (!activeEvent) return false;
    try {
      const response = await saveRelationshipTreeAction(activeEvent.id, treeJson);
      if (response.success) {
        setActiveEvent({ ...activeEvent, relationshipTree: treeJson });
        setEventsList(eventsList.map(e => e.id === activeEvent.id ? { ...e, relationshipTree: treeJson } : e));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50 font-semibold">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // --- Theme Style Mappings ---
  const pageBg = theme === "dark" ? "bg-neutral-950 text-neutral-50" : "bg-zinc-50 text-neutral-900";
  const headerBg = theme === "dark" ? "bg-neutral-900/90 border-white/10 text-neutral-50" : "bg-white border-neutral-200 text-neutral-955 shadow-sm";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";

  return (
    <div className={`min-h-screen flex ${pageBg} font-sans relative w-full overflow-hidden transition-colors duration-500`}>
      <style dangerouslySetInnerHTML={{__html: getAccentCssOverrides(accentColor)}} />
      <Toaster position="top-right" richColors />

      {/* MOBILE SIDEBAR DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={theme}
        profileName={profileName}
        profilePlan={profilePlan}
        profileImage={profileImage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {/* Spacer to reserve layout space for the fixed sidebar on desktop */}
      <div className="hidden md:block w-64 shrink-0 pointer-events-none" />

      {/* 2. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
        {/* HEADER BAR */}
        <header className={`border-b border-solid ${headerBg} px-6 py-4 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 w-full`}>
          <div className="flex items-center gap-3">
            <button
              className={`md:hidden cursor-pointer mr-2 p-1 ${theme === "dark" ? "text-zinc-300 hover:text-white" : "text-neutral-600 hover:text-neutral-955"}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-lg sm:text-2xl font-bold tracking-tight capitalize ${titleCol} truncate max-w-[120px] xs:max-w-none`}>
              {activeTab === "overview" ? "Dashboard" : 
               activeTab === "events" ? "My Invitations" :
               activeTab === "guests" ? "Guests" :
               activeTab === "templates" ? "Templates" :
               activeTab === "reminders" ? "Reminders" : 
               activeTab === "tree" ? "Tree Map" : "Settings"}
            </h1>
          </div>

          {/* Centered or Right-aligned Search Bar */}
          {["overview", "events", "guests", "templates"].includes(activeTab) && (
            <div className="relative flex-1 max-w-[140px] xs:max-w-[180px] sm:max-w-xs mx-2 sm:mx-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <Input
                type="text"
                placeholder={
                  activeTab === "overview" ? "Search dashboard..." :
                  activeTab === "events" ? "Search invitations..." :
                  activeTab === "guests" ? "Search guests..." : "Search templates..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 text-xs h-9 rounded-lg transition-all border border-solid w-full ${
                  theme === "dark" 
                    ? "bg-neutral-950/50 border-white/10 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50" 
                    : "bg-zinc-100/50 border-neutral-200 text-neutral-900 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                }`}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Create Event Button */}
            {["overview", "events"].includes(activeTab) && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeTab !== "events") {
                    handleTabChange("events");
                  }
                  setIsCreatingEvent(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs border-0 cursor-pointer shadow-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-955" />
                <span className="hidden xs:inline">Create Event</span>
              </motion.button>
            )}

            {/* Sun/Moon Toggle in Header */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg border border-solid transition-colors duration-300 cursor-pointer ${
                theme === "dark" ? "border-white/10 text-neutral-50 hover:bg-white/5" : "border-neutral-200 text-neutral-900 hover:bg-black/5"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-neutral-800" />
              )}
            </motion.button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 px-4 sm:px-6 py-6 w-full max-w-7xl mx-auto space-y-8 text-left">

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <OverviewTab
              eventsList={eventsList}
              guestsList={guestsList}
              theme={theme}
              setActiveEvent={setActiveEvent}
              onTabChange={handleTabChange}
              onDeleteEvent={handleDeleteEvent}
              searchQuery={searchQuery}
            />
          )}

          {/* TAB 2: MY INVITATIONS */}
          {activeTab === "events" && (
            <InvitationsTab
              eventsList={eventsList}
              guestsList={guestsList}
              theme={theme}
              onDeleteEvent={handleDeleteEvent}
              onCreateEvent={handleCreateEvent}
              setActiveEvent={setActiveEvent}
              onTabChange={handleTabChange}
              onTogglePublish={handleTogglePublish}
              isSubmittingEvent={isSubmittingEvent}
              searchQuery={searchQuery}
              isCreatingEvent={isCreatingEvent}
              setIsCreatingEvent={setIsCreatingEvent}
              currentUser={currentUser}
            />
          )}

          {/* TAB 3: GUESTS ROSTER */}
          {activeTab === "guests" && (
            <GuestsTab
              eventsList={eventsList}
              guestsList={guestsList}
              theme={theme}
              activeEvent={activeEvent}
              setActiveEvent={setActiveEvent}
              onDeleteGuest={handleDeleteGuest}
              onAddGuest={handleAddGuest}
              isSubmittingGuest={isSubmittingGuest}
              searchQuery={searchQuery}
            />
          )}

          {/* TAB 4: TEMPLATES */}
          {activeTab === "templates" && (
            <TemplatesTab
              activeEvent={activeEvent}
              theme={theme}
              onSelectTemplate={handleSelectTemplate}
              searchQuery={searchQuery}
              currentUser={currentUser}
            />
          )}

          {/* TAB 5: REMINDERS */}
          {activeTab === "reminders" && (
            <RemindersTab
              theme={theme}
            />
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <SettingsTab
              theme={theme}
              setTheme={(nextTheme) => {
                setTheme(nextTheme);
                localStorage.setItem("kinvite-theme", nextTheme);
              }}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              currentUser={currentUser}
              onUpdateSettings={handleUpdateSettings}
              isUpdatingSettings={isUpdatingSettings}
            />
          )}

          {/* TAB 7: RELATIONSHIP TREE BUILDER */}
          {activeTab === "tree" && activeEvent && (
            <RelationTreeTab
              activeEvent={activeEvent}
              guestsList={guestsList}
              theme={theme}
              onSaveTree={handleSaveTree}
            />
          )}

        </main>
      </div>
    </div>
  );
}
