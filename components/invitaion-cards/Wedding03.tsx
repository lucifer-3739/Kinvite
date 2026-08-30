"use client";

import { useState, useEffect } from "react";
import { 
  Heart, Calendar, MapPin, Sparkles, Clock, Check, X, 
  Share2, Copy, Crown, Utensils, Music, GlassWater, ChevronRight, Camera, Hotel
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRsvpAction } from "@/app/actions/rsvp";
import { COLOR_COMBOS, COLOR_COMBOS_LIST, getColorCombo, ColorCombo } from "./color-palettes";

interface EventData {
  id: string;
  userId: string;
  title: string;
  slug: string;
  type: string;
  date: Date;
  venue: string;
  coverImage: string | null;
  theme: string | null;
  description: string | null;
  relationshipTree: string | null;
}

interface GuestData {
  id: string;
  eventId: string;
  name: string;
  phone: string | null;
  relation: string | null;
  attendance: string | null;
  guestCount: string | null;
  side: string | null;
}

interface Wedding03Props {
  event: EventData;
  initialGuests: GuestData[];
  defaultColorCombo?: string;
}

export default function Wedding03({ event, initialGuests, defaultColorCombo }: Wedding03Props) {
  const getInitialCombo = () => {
    if (defaultColorCombo && COLOR_COMBOS[defaultColorCombo]) return defaultColorCombo;
    if (event.coverImage) {
      try {
        const parsed = JSON.parse(event.coverImage);
        if (parsed.selectedVariant && COLOR_COMBOS[parsed.selectedVariant]) {
          return parsed.selectedVariant;
        }
      } catch (e) {
        // fallback
      }
    }
    return "sage_serenity"; // Elegant botanical sage default for wedding
  };

  const [activeComboKey, setActiveComboKey] = useState<string>(getInitialCombo());
  const combo: ColorCombo = getColorCombo(activeComboKey);

  // Extract initials from title
  const getInitials = (title: string) => {
    const clean = (title || "Emma & James").replace(/Wedding|Celebration/gi, "").trim();
    const parts = clean.split(/\s*&\s*|\s+and\s+/i);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)} & ${parts[1].charAt(0)}`;
    }
    return clean.slice(0, 2).toUpperCase();
  };

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpSide, setRsvpSide] = useState("bride_side");
  const [rsvpMeal, setRsvpMeal] = useState("standard");
  const [rsvpChoice, setRsvpChoice] = useState<"yes" | "no" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(event.date).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event.date]);

  // Share link handler
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Wedding invitation link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        toast.error("Failed to copy link.");
      }
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpChoice) {
      toast.error("Please select whether you will attend the wedding.");
      return;
    }
    if (!rsvpName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!rsvpPhone.trim() || rsvpPhone.trim().length < 8) {
      toast.error("Please enter a valid phone number (at least 8 digits).");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createRsvpAction({
        eventId: event.id,
        name: rsvpName,
        phone: rsvpPhone,
        attendance: rsvpChoice,
        guestCount: rsvpGuests,
        relation: `Meal: ${rsvpMeal}`,
        side: rsvpSide
      });
      if (result.success) {
        setIsSubmitted(true);
        toast.success(rsvpChoice === "yes" ? "We look forward to celebrating our special day with you!" : "Thank you for letting us know.");
      } else {
        toast.error(result.error || "Failed to submit RSVP.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full font-sans transition-colors duration-700 select-none pb-20"
      style={{ 
        backgroundColor: combo.c1, 
        color: combo.c4 
      }}
    >
      {/* 1. Theme Color Switcher Bar */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between transition-colors duration-500"
        style={{ 
          backgroundColor: `${combo.c1}CC`,
          borderColor: `${combo.c2}40`
        }}
      >
        <div className="flex items-center gap-2">
          <Crown className="size-4" style={{ color: combo.c3 }} />
          <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: combo.c4 }}>
            Theme: <span style={{ color: combo.c3 }}>{combo.name}</span>
          </span>
        </div>

        {/* Color Palette Switcher Bubbles */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[65%] scrollbar-none py-1">
          {COLOR_COMBOS_LIST.map((c) => {
            const isSelected = c.id === activeComboKey;
            return (
              <button
                key={c.id}
                onClick={() => setActiveComboKey(c.id)}
                title={c.name}
                className="group relative size-7 rounded-full transition-transform duration-300 flex items-center justify-center p-0.5"
                style={{
                  border: isSelected ? `2px solid ${c.c3}` : `1px solid ${c.c2}80`,
                  transform: isSelected ? "scale(1.15)" : "scale(1)"
                }}
              >
                <div 
                  className="w-full h-full rounded-full flex overflow-hidden shadow-inner"
                  style={{ backgroundColor: c.c1 }}
                >
                  <div className="w-1/2 h-full" style={{ backgroundColor: c.c3 }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: c.c2 }} />
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-xl mx-auto px-4 pt-10 pb-6 text-center space-y-8">
        
        {/* Monogram Crest */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="size-20 rounded-full mx-auto flex items-center justify-center border-2 shadow-2xl transition-all"
          style={{
            borderColor: combo.c3,
            backgroundColor: `${combo.c2}25`,
            color: combo.c3
          }}
        >
          <span className="font-serif italic font-extrabold text-xl tracking-wider">
            {getInitials(event.title)}
          </span>
        </motion.div>

        {/* Formal Invitation Wording */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] block" style={{ color: combo.c3 }}>
            Together With Their Families
          </span>
          <h1 
            className="text-4xl sm:text-5xl font-extrabold tracking-tight font-outfit"
            style={{ color: combo.c4 }}
          >
            {event.title || "Emma & James"}
          </h1>
          <p 
            className="text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed"
            style={{ color: `${combo.c4}CC` }}
          >
            {event.description || "Request the honor of your presence at their wedding celebration as they exchange vows and begin their journey forever."}
          </p>
        </div>

        {/* 3. Live Countdown Timer */}
        <div 
          className="rounded-3xl p-6 shadow-2xl backdrop-blur-xl border transition-all duration-500"
          style={{
            backgroundColor: `${combo.c2}25`,
            borderColor: `${combo.c3}40`
          }}
        >
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] block mb-4" style={{ color: combo.c3 }}>
            Wedding Countdown
          </span>
          <div className="grid grid-cols-4 gap-3">
            {[
              { val: timeLeft.days, label: "Days" },
              { val: timeLeft.hours, label: "Hours" },
              { val: timeLeft.minutes, label: "Mins" },
              { val: timeLeft.seconds, label: "Secs" }
            ].map((t, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-2xl border flex flex-col items-center"
                style={{
                  backgroundColor: `${combo.c1}80`,
                  borderColor: `${combo.c2}50`
                }}
              >
                <span className="text-2xl sm:text-3xl font-extrabold font-outfit" style={{ color: combo.c3 }}>
                  {String(t.val).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-bold mt-1" style={{ color: `${combo.c4}99` }}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Wedding Date, Time & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Date & Time */}
          <div 
            className="p-5 rounded-2xl border flex items-start gap-4 transition-all"
            style={{
              backgroundColor: `${combo.c2}20`,
              borderColor: `${combo.c2}40`
            }}
          >
            <div 
              className="p-3 rounded-xl shrink-0"
              style={{ backgroundColor: `${combo.c3}25`, color: combo.c3 }}
            >
              <Calendar className="size-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider block" style={{ color: combo.c3 }}>
                Ceremony Date
              </span>
              <p className="font-bold text-sm mt-0.5" style={{ color: combo.c4 }}>
                {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
              </p>
              <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: `${combo.c4}AA` }}>
                <Clock className="size-3" />
                {new Date(event.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Venue & Location */}
          <div 
            className="p-5 rounded-2xl border flex items-start gap-4 transition-all"
            style={{
              backgroundColor: `${combo.c2}20`,
              borderColor: `${combo.c2}40`
            }}
          >
            <div 
              className="p-3 rounded-xl shrink-0"
              style={{ backgroundColor: `${combo.c3}25`, color: combo.c3 }}
            >
              <MapPin className="size-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider block" style={{ color: combo.c3 }}>
                Venue Location
              </span>
              <p className="font-bold text-sm mt-0.5" style={{ color: combo.c4 }}>
                {event.venue || "The St. Regis Grand Ballroom"}
              </p>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(event.venue || "Wedding Venue")}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold mt-1 inline-flex items-center gap-1 hover:underline"
                style={{ color: combo.c3 }}
              >
                <span>Google Maps</span>
                <ChevronRight className="size-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 5. Wedding Itinerary */}
        <div 
          className="rounded-3xl p-6 border text-left space-y-4"
          style={{
            backgroundColor: `${combo.c2}15`,
            borderColor: `${combo.c2}35`
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" style={{ color: combo.c3 }} />
            <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: combo.c4 }}>
              Order of Celebration
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { time: "2:00 PM", title: "Guest Arrival & Welcome Refreshments", icon: GlassWater },
              { time: "3:30 PM", title: "Vows & Nuptial Ceremony", icon: Crown },
              { time: "4:45 PM", title: "Garden Cocktail Hour & Photography", icon: Camera },
              { time: "6:30 PM", title: "Grand Banquet Dinner & Speeches", icon: Utensils },
              { time: "8:30 PM", title: "First Dance & Late Night Reception", icon: Music }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl border transition-all"
                style={{
                  backgroundColor: `${combo.c1}60`,
                  borderColor: `${combo.c2}30`
                }}
              >
                <div 
                  className="size-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${combo.c3}20`, color: combo.c3 }}
                >
                  <item.icon className="size-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block" style={{ color: combo.c3 }}>
                    {item.time}
                  </span>
                  <p className="text-xs font-semibold" style={{ color: combo.c4 }}>
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. RSVP Section */}
        <div 
          id="rsvp-section"
          className="rounded-3xl p-6 sm:p-8 border shadow-2xl text-left space-y-6"
          style={{
            backgroundColor: `${combo.c2}25`,
            borderColor: `${combo.c3}50`
          }}
        >
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.25em]" style={{ color: combo.c3 }}>
              RSVP
            </span>
            <h3 className="text-2xl font-extrabold font-outfit" style={{ color: combo.c4 }}>
              Will You Celebrate With Us?
            </h3>
            <p className="text-xs" style={{ color: `${combo.c4}AA` }}>
              Kindly reply by submitting your confirmation below.
            </p>
          </div>

          {isSubmitted ? (
            <div 
              className="p-6 rounded-2xl border text-center space-y-3"
              style={{
                backgroundColor: `${combo.c1}90`,
                borderColor: `${combo.c3}60`
              }}
            >
              <div 
                className="size-12 rounded-full mx-auto flex items-center justify-center"
                style={{ backgroundColor: `${combo.c3}30`, color: combo.c3 }}
              >
                <Check className="size-6" />
              </div>
              <h4 className="font-extrabold text-base" style={{ color: combo.c4 }}>
                RSVP Received!
              </h4>
              <p className="text-xs" style={{ color: `${combo.c4}CC` }}>
                Thank you, {rsvpName}! Your seat at our wedding celebration is saved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              {/* Attendance Choice */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpChoice("yes")}
                  className="p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  style={{
                    backgroundColor: rsvpChoice === "yes" ? combo.c3 : `${combo.c1}80`,
                    color: rsvpChoice === "yes" ? combo.c1 : combo.c4,
                    borderColor: rsvpChoice === "yes" ? combo.c3 : `${combo.c2}60`
                  }}
                >
                  <Check className="size-4" />
                  <span>Accepts With Pleasure</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRsvpChoice("no")}
                  className="p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  style={{
                    backgroundColor: rsvpChoice === "no" ? `${combo.c2}80` : `${combo.c1}80`,
                    color: combo.c4,
                    borderColor: rsvpChoice === "no" ? combo.c4 : `${combo.c2}60`
                  }}
                >
                  <X className="size-4" />
                  <span>Declines With Regret</span>
                </button>
              </div>

              {/* Guest Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: combo.c4 }}>
                  Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="h-11 rounded-xl border text-sm"
                  style={{
                    backgroundColor: `${combo.c1}90`,
                    borderColor: `${combo.c2}60`,
                    color: combo.c4
                  }}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: combo.c4 }}>
                  Phone Number *
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="e.g. +1 555 345 6789"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  className="h-11 rounded-xl border text-sm"
                  style={{
                    backgroundColor: `${combo.c1}90`,
                    borderColor: `${combo.c2}60`,
                    color: combo.c4
                  }}
                />
              </div>

              {/* Side & Total Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: combo.c4 }}>
                    Side / Group
                  </label>
                  <select
                    value={rsvpSide}
                    onChange={(e) => setRsvpSide(e.target.value)}
                    className="w-full h-11 rounded-xl border text-sm px-3 font-semibold focus:outline-none"
                    style={{
                      backgroundColor: combo.c1,
                      borderColor: `${combo.c2}60`,
                      color: combo.c4
                    }}
                  >
                    <option value="bride_side" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Bride's Guest</option>
                    <option value="groom_side" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Groom's Guest</option>
                    <option value="mutual_friend" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Mutual Friend</option>
                    <option value="family" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Family</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: combo.c4 }}>
                    Total Attending
                  </label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    className="w-full h-11 rounded-xl border text-sm px-3 font-semibold focus:outline-none"
                    style={{
                      backgroundColor: combo.c1,
                      borderColor: `${combo.c2}60`,
                      color: combo.c4
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={String(n)} style={{ backgroundColor: combo.c1, color: combo.c4 }}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meal Preference */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: combo.c4 }}>
                  Entr&eacute;e / Meal Choice
                </label>
                <select
                  value={rsvpMeal}
                  onChange={(e) => setRsvpMeal(e.target.value)}
                  className="w-full h-11 rounded-xl border text-sm px-3 font-semibold focus:outline-none"
                  style={{
                    backgroundColor: combo.c1,
                    borderColor: `${combo.c2}60`,
                    color: combo.c4
                  }}
                >
                  <option value="standard" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Chef's Prime Filet Mignon</option>
                  <option value="seafood" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Pan-Seared Chilean Sea Bass</option>
                  <option value="vegetarian" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Truffle Wild Mushroom Risotto (Vegetarian)</option>
                  <option value="vegan" style={{ backgroundColor: combo.c1, color: combo.c4 }}>Garden Harvest Plate (Vegan/Gluten-Free)</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer mt-2"
                style={{
                  backgroundColor: combo.c3,
                  color: combo.c1
                }}
              >
                {isSubmitting ? "Submitting RSVP..." : "Submit RSVP Response"}
              </Button>
            </form>
          )}
        </div>

        {/* 7. Hotel & Accommodations Note */}
        <div 
          className="p-5 rounded-2xl border text-center space-y-1.5 max-w-md mx-auto"
          style={{
            backgroundColor: `${combo.c2}15`,
            borderColor: `${combo.c2}30`
          }}
        >
          <Hotel className="size-5 mx-auto" style={{ color: combo.c3 }} />
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: combo.c4 }}>
            Accommodations & Shuttles
          </h4>
          <p className="text-[11px]" style={{ color: `${combo.c4}AA` }}>
            A room block and complimentary event shuttles are available at the resort.
          </p>
        </div>

        {/* 8. Share & Copy Link Footer */}
        <div className="pt-4 flex justify-center gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
            style={{
              backgroundColor: `${combo.c2}25`,
              borderColor: `${combo.c3}60`,
              color: combo.c4
            }}
          >
            {copied ? <Check className="size-4" style={{ color: combo.c3 }} /> : <Copy className="size-4" />}
            <span>{copied ? "Link Copied!" : "Copy Invite Link"}</span>
          </Button>
        </div>

      </main>
    </div>
  );
}
