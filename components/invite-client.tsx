"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar, MapPin, Users, Phone, User, Check, X, Gift, Sparkles, Clock, ArrowRight, Loader2, Share2, Copy } from "lucide-react";
import { toast, Toaster } from "sonner";
import ReactFlow, { Background, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRsvpAction } from "@/app/actions/rsvp";
import { z } from "zod";

// Helper to check text contrast based on background brightness
const isLightColor = (hex: string) => {
  if (!hex) return false;
  const cleanHex = hex.replace("#", "");
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex.charAt(0) + cleanHex.charAt(0), 16);
    g = parseInt(cleanHex.charAt(1) + cleanHex.charAt(1), 16);
    b = parseInt(cleanHex.charAt(2) + cleanHex.charAt(2), 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
};

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

interface InviteClientProps {
  event: EventData;
  initialGuests: GuestData[];
}

// RSVP Client side validation schema
const rsvpSchema = z.object({
  name: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  phone: z.string().min(8, "Please enter a valid phone number (at least 8 digits)"),
  relation: z.string(),
  attendance: z.enum(["yes", "no"], {
    message: "Please select whether you will attend"
  }),
  guestCount: z.string(),
  side: z.string().optional()
});

export function InviteClient({ event, initialGuests }: InviteClientProps) {
  const isWedding = event.type === "wedding";
  const isBirthday = event.type === "birthday";

  const [isLoading, setIsLoading] = useState(true);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpRelation, setRsvpRelation] = useState("friend");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpSide, setRsvpSide] = useState(isWedding ? "groom_side" : "friend");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpChoice, setRsvpChoice] = useState<"yes" | "no" | null>(null);

  // Local state for the real database-derived guests list
  const [guestsList, setGuestsList] = useState<GuestData[]>(initialGuests);

  // Sharing functionality state & logic
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFloatingShareOpen, setIsFloatingShareOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const shareText = `You are cordially invited to celebrate ${event.title}! 🥳✨\n\n📅 Date: ${new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n📍 Venue: ${event.venue}\n\nCheck out the details and RSVP here:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Invitation link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  // Parse coverImage styling JSON
  let styleConfig: any = {};
  if (event.coverImage) {
    try {
      styleConfig = JSON.parse(event.coverImage);
    } catch (e) {
      // Backwards compatibility: coverImage is a raw string/URL
      styleConfig = { customBgImage: event.coverImage };
    }
  }

  const {
    customBgColor = "",
    customBgImage = "",
    customTextColor = "",
    selectedVariant = "",
    customDressCode = "",
    customRsvpDate = ""
  } = styleConfig;

  // Dynamic Theme Mapping
  const themeClass = 
    event.theme === "minimal_elegant" ? "theme-minimal" :
    event.theme === "royal_wedding" ? "theme-wedding" :
    event.theme === "traditional_indian" ? "theme-traditional_indian" :
    event.theme === "luxury_gold" ? "theme-engagement" :
    event.theme === "modern_birthday" ? "theme-birthday" :
    event.type === "birthday" ? "theme-birthday" : 
    event.type === "baby_shower" ? "theme-baby_shower" : 
    event.type === "engagement" ? "theme-engagement" : "theme-wedding";

  // Dynamic Backgrounds Mapping based on event type / selected theme
  const getHeroBackground = () => {
    if (customBgImage) {
      return customBgImage;
    }
    if (event.theme === "royal_wedding" || event.type === "wedding") {
      return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";
    }
    if (event.theme === "modern_birthday" || event.type === "birthday") {
      return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop";
    }
    if (event.theme === "traditional_indian") {
      return "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop";
    }
    if (event.theme === "luxury_gold" || event.type === "engagement") {
      return "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop";
    }
    if (event.type === "baby_shower") {
      return "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200&auto=format&fit=crop";
  };

  const heroBg = getHeroBackground();

  // Customizer styling overrides
  const dynamicStyles: React.CSSProperties & Record<string, string> = {};
  if (customBgColor) {
    dynamicStyles["--theme-bg" as any] = customBgColor;
    dynamicStyles["--theme-bg-gradient" as any] = "none";
    const isLight = isLightColor(customBgColor);
    if (isLight) {
      dynamicStyles["--theme-card-bg" as any] = "rgba(0, 0, 0, 0.04)";
      dynamicStyles["--theme-card-border" as any] = "rgba(0, 0, 0, 0.08)";
      dynamicStyles["--theme-countdown-bg" as any] = "rgba(0, 0, 0, 0.05)";
    } else {
      dynamicStyles["--theme-card-bg" as any] = "rgba(255, 255, 255, 0.04)";
      dynamicStyles["--theme-card-border" as any] = "rgba(255, 255, 255, 0.08)";
      dynamicStyles["--theme-countdown-bg" as any] = "rgba(255, 255, 255, 0.05)";
    }
  }
  if (customTextColor) {
    dynamicStyles["--theme-text-primary" as any] = customTextColor;
    dynamicStyles["--theme-text-secondary" as any] = customTextColor + "b3";
    dynamicStyles["--theme-accent-gold" as any] = customTextColor;
    dynamicStyles["--theme-accent-light" as any] = customTextColor + "cc";
    dynamicStyles["--theme-countdown-text" as any] = customTextColor;
  }
  if (customBgImage) {
    const overlayBg = event.theme === "traditional_indian" ? "rgba(53, 6, 14, 0.82)" : 
                      event.theme === "engagement" ? "rgba(44, 22, 25, 0.82)" : "rgba(18, 15, 15, 0.82)";
    dynamicStyles.backgroundImage = `linear-gradient(180deg, ${overlayBg} 0%, ${overlayBg} 100%), url("${customBgImage}")`;
    dynamicStyles.backgroundSize = "cover";
    dynamicStyles.backgroundPosition = "center";
    dynamicStyles.backgroundAttachment = "fixed";
    dynamicStyles["--theme-bg-gradient" as any] = "none";
  }

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Loader progress simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 15);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date(event.date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  // Handle RSVP Submit via Server Action + ZOD VALIDATION
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = rsvpSchema.safeParse({
      name: rsvpName,
      phone: rsvpPhone,
      relation: rsvpRelation,
      attendance: rsvpChoice,
      guestCount: rsvpGuests,
      side: rsvpSide
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    setIsSubmittingRsvp(true);

    try {
      const response = await createRsvpAction({
        eventId: event.id,
        name: rsvpName,
        phone: rsvpPhone,
        relation: rsvpRelation,
        attendance: rsvpChoice!,
        guestCount: rsvpGuests,
        side: rsvpSide
      });

      if (response.success) {
        setRsvpSubmitted(true);
        if (response.guest) {
          setGuestsList((prev) => [...prev, response.guest as GuestData]);
        }
        if (rsvpChoice === "yes") {
          toast.success(`Hooray! Thank you, ${rsvpName}. RSVP confirmed!`);
        } else {
          toast.success(`Thank you, ${rsvpName}. Response saved.`);
        }
      } else {
        toast.error(response.error || "Failed to submit RSVP");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Render ambient particles based on theme
  const renderAmbientParticles = () => {
    const count = 25;
    const particles = Array.from({ length: count });

    if (themeClass === "theme-birthday") {
      const colors = ["#E200FF", "#00E4FF", "#FFDF00", "#FF007F", "#00FF66"];
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((_, idx) => {
            const size = Math.random() * 8 + 6;
            const delay = Math.random() * 6;
            const duration = Math.random() * 5 + 4;
            const left = Math.random() * 100;
            const color = colors[idx % colors.length];
            return (
              <motion.div
                key={idx}
                className="absolute rounded-sm"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  left: `${left}%`,
                  top: "-5%",
                }}
                animate={{
                  y: ["0vh", "110vh"],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                  x: [0, (Math.random() - 0.5) * 120],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "linear",
                }}
              />
            );
          })}
        </div>
      );
    } else if (themeClass === "theme-baby_shower") {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((_, idx) => {
            const size = Math.random() * 40 + 20;
            const delay = Math.random() * 8;
            const duration = Math.random() * 12 + 8;
            const top = Math.random() * 80;
            return (
              <motion.div
                key={idx}
                className="absolute rounded-full bg-white/5 blur-[2px]"
                style={{
                  width: size,
                  height: size * 0.7,
                  left: "-15%",
                  top: `${top}%`,
                }}
                animate={{
                  x: ["0vw", "115vw"],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "linear",
                }}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((_, idx) => {
            const size = Math.random() * 5 + 3;
            const delay = Math.random() * 5;
            const duration = Math.random() * 7 + 5;
            const left = Math.random() * 100;
            return (
              <motion.div
                key={idx}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: "var(--theme-accent-light)",
                  opacity: Math.random() * 0.35 + 0.15,
                  boxShadow: "0 0 6px var(--theme-accent-gold)",
                  left: `${left}%`,
                  bottom: "-5%",
                }}
                animate={{
                  y: ["0vh", "-110vh"],
                  x: [0, (Math.random() - 0.5) * 70],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      );
    }
  };

  // Generate dynamic React Flow Relationship Tree
  let nodes: Node[] = [];
  let edges: Edge[] = [];

  try {
    if (event.relationshipTree) {
      const parsed = JSON.parse(event.relationshipTree);
      nodes = parsed.nodes || [];
      edges = parsed.edges || [];
      
      // Dynamic styles sync for nodes in tree to fit theme background colors!
      nodes = nodes.map(n => {
        if (n.id === "union" || n.id === "celebrant") {
          return {
            ...n,
            style: {
              background: "linear-gradient(135deg, var(--theme-accent-gold) 0%, var(--theme-accent-rose) 100%)",
              color: "var(--theme-btn-text)",
              border: "none",
              borderRadius: "16px",
              padding: "10px 16px",
              fontWeight: "bold",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            }
          };
        }
        return {
          ...n,
          style: {
            background: "var(--theme-countdown-bg)",
            color: n.style?.color || "var(--theme-accent-light)",
            border: `1px solid var(--theme-card-border)`,
            borderRadius: "12px",
            padding: "8px 12px",
            fontSize: "11px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
          }
        };
      });

      // Dynamic styles sync for edges to fit theme colors!
      edges = edges.map(e => ({
        ...e,
        style: { stroke: "var(--theme-accent-gold)" },
        labelBgStyle: { fill: "var(--theme-bg)", fillOpacity: 0.85 },
        labelStyle: { fill: "var(--theme-text-primary)", fontSize: "9px" }
      }));

    }
  } catch (e) {
    console.error("Failed to parse custom tree, loading dynamic fallback", e);
  }

  // Fallback tree generation using REAL GUESTS list from database
  if (nodes.length === 0) {
    const isWedding = event.type === "wedding";
    const celebrantLabel = isWedding 
      ? event.title.replace("'s Wedding", "").replace(" Wedding", "")
      : event.title.replace("'s Birthday", "").replace(" Birthday", "");

    // 1. Root Node (Celebrants)
    nodes.push({
      id: "union",
      data: { label: celebrantLabel },
      position: { x: 250, y: 20 },
      style: {
        background: "linear-gradient(135deg, var(--theme-accent-gold) 0%, var(--theme-accent-rose) 100%)",
        color: "var(--theme-btn-text)",
        border: "none",
        borderRadius: "16px",
        padding: "12px 18px",
        fontWeight: "bold",
        fontSize: "13px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
      }
    });

    // 2. Category Nodes based on Event Type
    const categories = isWedding
      ? [
          { id: "groom-side", label: "Groom's Side", color: "var(--theme-accent-rose)" },
          { id: "bride-side", label: "Bride's Side", color: "var(--theme-accent-gold)" }
        ]
      : [
          { id: "family-side", label: "Family & Relatives", color: "var(--theme-accent-rose)" },
          { id: "friends-side", label: "Friends Circle", color: "var(--theme-accent-gold)" }
        ];

    nodes.push(
      {
        id: categories[0].id,
        data: { label: categories[0].label },
        position: { x: 70, y: 130 },
        style: {
          background: "var(--theme-countdown-bg)",
          color: categories[0].color,
          border: "1px solid var(--theme-card-border)",
          borderRadius: "10px",
          padding: "8px 12px",
          fontSize: "11px"
        }
      },
      {
        id: categories[1].id,
        data: { label: categories[1].label },
        position: { x: 430, y: 130 },
        style: {
          background: "var(--theme-countdown-bg)",
          color: categories[1].color,
          border: "1px solid var(--theme-card-border)",
          borderRadius: "10px",
          padding: "8px 12px",
          fontSize: "11px"
        }
      }
    );

    edges.push(
      { id: "e-cat1", source: "union", target: categories[0].id, animated: true, style: { stroke: categories[0].color } },
      { id: "e-cat2", source: "union", target: categories[1].id, animated: true, style: { stroke: categories[1].color } }
    );

    // 3. Populate attending guests from the real database state!
    const attendingGuests = guestsList.filter((g) => g.attendance === "yes");
    
    // Sort guests into the categories
    const cat1Guests = attendingGuests.filter((g) => 
      isWedding 
        ? g.side === "groom_side" 
        : (g.relation === "family" || g.side === "family_side")
    );
    
    const cat2Guests = attendingGuests.filter((g) => 
      isWedding 
        ? g.side === "bride_side" || g.side === "mutual"
        : (g.relation === "friend" || g.relation === "office" || g.side === "friends_side" || !g.relation)
    );

    // Place category 1 guests under categories[0].id
    cat1Guests.forEach((guest, index) => {
      const nodeId = `guest-${guest.id}`;
      // Elegant grid positioning below category node
      const x = 70 + (index % 2 === 0 ? -45 : 45) + Math.floor(index / 2) * 5;
      const y = 220 + Math.floor(index / 2) * 50;
      
      nodes.push({
        id: nodeId,
        data: { label: guest.name },
        position: { x, y },
        style: {
          background: "var(--theme-card-bg)",
          color: "var(--theme-text-secondary)",
          border: "1px solid var(--theme-card-border)",
          borderRadius: "8px",
          padding: "6px 10px",
          fontSize: "9px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        }
      });

      edges.push({
        id: `edge-${nodeId}`,
        source: categories[0].id,
        target: nodeId,
        style: { stroke: "var(--theme-card-border)", strokeDasharray: "3,3" }
      });
    });

    // Place category 2 guests under categories[1].id
    cat2Guests.forEach((guest, index) => {
      const nodeId = `guest-${guest.id}`;
      // Elegant grid positioning below category node
      const x = 430 + (index % 2 === 0 ? -45 : 45) + Math.floor(index / 2) * 5;
      const y = 220 + Math.floor(index / 2) * 50;
      
      nodes.push({
        id: nodeId,
        data: { label: guest.name },
        position: { x, y },
        style: {
          background: "var(--theme-card-bg)",
          color: "var(--theme-text-secondary)",
          border: "1px solid var(--theme-card-border)",
          borderRadius: "8px",
          padding: "6px 10px",
          fontSize: "9px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        }
      });

      edges.push({
        id: `edge-${nodeId}`,
        source: categories[1].id,
        target: nodeId,
        style: { stroke: "var(--theme-card-border)", strokeDasharray: "3,3" }
      });
    });
  }

  // Create real database-driven itinerary using event data!
  const eventTimeStr = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const defaultEvents = [
    {
      name: event.type === "wedding" ? "Wedding Ceremony" : "Main Celebration",
      time: eventTimeStr,
      desc: `The grand celebrations begin at ${event.venue}. We look forward to your gracious presence!`
    },
    {
      name: "Dinner & Reception",
      time: new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      }),
    }
  ];
  // Dynamic Google Maps embed URL
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.venue)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div 
      style={dynamicStyles}
      className={`relative min-h-screen text-[var(--theme-text-primary)] ${themeClass} overflow-x-hidden selection:bg-[var(--theme-accent-gold)] selection:text-[var(--theme-bg)] ${
        customBgImage ? "" : "bg-[var(--theme-bg)] bg-gradient-to-b var(--theme-bg-gradient)"
      }`}
    >
      {customBgImage && (
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{
            backgroundColor: event.theme === "traditional_indian" ? "rgba(53, 6, 14, 0.82)" : 
                             event.theme === "engagement" ? "rgba(44, 22, 25, 0.82)" : "rgba(18, 15, 15, 0.82)"
          }}
        />
      )}

      <AnimatePresence>
        {/* CINEMATIC LOADING SCREEN */}
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-[var(--theme-bg)] flex flex-col justify-center items-center px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              {isWedding ? (
                <Heart className="w-12 h-12 text-[var(--theme-accent-gold)] fill-[var(--theme-accent-gold)] animate-beat" />
              ) : (
                <Gift className="w-12 h-12 text-[var(--theme-accent-gold)] fill-[var(--theme-accent-gold)] animate-bounce" />
              )}
              
              <h2 className="font-serif text-2xl sm:text-3xl tracking-wide text-[var(--theme-text-primary)] text-center max-w-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                {event.title}
              </h2>
              
              <div className="text-zinc-550 text-xs font-semibold uppercase tracking-widest animate-pulse">
                Loading memories...
              </div>

              {/* Progress bar */}
              <div className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden mt-4 relative border border-[var(--theme-card-border)]">
                <motion.div
                  className="h-full bg-gradient-to-r var(--theme-btn-gradient)"
                  style={{ width: `${loadPercentage}%` }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          {/* HERO SECTION */}
          <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-[var(--theme-card-border)]">
            
            {/* Fullscreen Background Cinematic Image */}
            {!customBgImage && (
              <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none">
                <Image
                  src={heroBg}
                  alt="Celebration cinematic background stage"
                  fill
                  priority
                  className="object-cover scale-105 blur-[1px] brightness-[0.8]"
                />
              </div>
            )}

            {/* Dark readabilty Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/80 to-[var(--theme-bg)] z-1" />

            {/* Ambient Animated Particles tailored to theme */}
            {renderAmbientParticles()}

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="mb-4"
              >
                {isWedding ? (
                  <Heart className="w-8 h-8 text-[var(--theme-accent-gold)] fill-[var(--theme-accent-gold)] mx-auto animate-pulse" />
                ) : (
                  <Gift className="w-8 h-8 text-[var(--theme-accent-gold)] fill-[var(--theme-accent-gold)] mx-auto animate-bounce" />
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xs uppercase tracking-widest text-[var(--theme-accent-light)] mb-6 font-semibold"
              >
                {isWedding ? "Together with their families" : "Join us in celebrating"}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-7xl tracking-wide text-[var(--theme-text-primary)] mb-6 font-bold leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {event.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-[var(--theme-text-secondary)] text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed"
              >
                {event.description || (isWedding ? "invite you to celebrate their sacred wedding ceremony and union" : "join family and friends to share another milestone of joy")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex flex-col sm:flex-row gap-6 items-center justify-center border-t border-[var(--theme-card-border)] pt-8 w-full max-w-md"
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--theme-accent-light)]">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[var(--theme-accent-rose)]/40" />
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--theme-accent-light)] truncate max-w-xs">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </motion.div>

              {customDressCode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="text-xs uppercase tracking-[0.2em] text-[var(--theme-accent-light)] mt-5 font-bold border border-solid border-[var(--theme-card-border)] px-5 py-2 rounded-full bg-[var(--theme-card-bg)] backdrop-blur-sm"
                >
                  👗 Dress Code: {customDressCode} 🤵
                </motion.div>
              )}

              {/* Scroll down indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
                transition={{ delay: 1.4, duration: 2, repeat: Infinity }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => {
                  document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="text-[9px] uppercase tracking-widest text-zinc-555">Scroll Down</span>
                <div className="w-[1px] h-6 bg-[var(--theme-accent-gold)]/40" />
              </motion.div>
            </div>
          </section>

          {/* COUNTDOWN TIMER */}
          <section id="countdown" className="py-20 bg-transparent border-b border-[var(--theme-card-border)] text-center px-4 relative">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-sm uppercase tracking-widest text-[var(--theme-accent-light)] mb-8 flex justify-center items-center gap-2 font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                <Clock className="w-4 h-4 text-[var(--theme-accent-gold)]" /> The Celebration Begins In
              </h2>

              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
                {/* Days */}
                <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-md">
                  <div className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--theme-countdown-text)', fontFamily: 'var(--font-heading)' }}>{timeLeft.days}</div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 mt-2 font-semibold">Days</div>
                </div>

                {/* Hours */}
                <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-md">
                  <div className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--theme-countdown-text)', fontFamily: 'var(--font-heading)' }}>
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 mt-2 font-semibold">Hours</div>
                </div>

                {/* Minutes */}
                <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-md">
                  <div className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--theme-countdown-text)', fontFamily: 'var(--font-heading)' }}>
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 mt-2 font-semibold">Mins</div>
                </div>

                {/* Seconds */}
                <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-md">
                  <div className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--theme-accent-rose)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 mt-2 font-semibold">Secs</div>
                </div>
              </div>
            </div>
          </section>

          {/* STORY SECTION */}
          <section className="py-24 px-6 max-w-4xl mx-auto text-center border-b border-[var(--theme-card-border)]">
            {isWedding ? (
              <Heart className="w-5 h-5 text-[var(--theme-accent-rose)] fill-[var(--theme-accent-rose)] mx-auto mb-6" />
            ) : (
              <Gift className="w-5 h-5 text-[var(--theme-accent-rose)] fill-[var(--theme-accent-rose)] mx-auto mb-6" />
            )}
            <h2 className="text-2xl sm:text-3xl italic mb-6 text-[var(--theme-text-primary)] font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
              {isWedding
                ? `"Two families, one beautiful celebration."`
                : `"A beautiful milestone of joy, growth, and memories."`}
            </h2>
            <p className="text-[var(--theme-text-secondary)] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              {isWedding
                ? "We believe that wedding celebrations are the harmonious intertwining of two distinct lives, families, and histories. We are profoundly excited to join together and share our joy with the people we hold closest."
                : "Life is defined by the wonderful moments and milestones we share with the people we love. We are deeply grateful to bring together our family, relatives, and circles of friends to celebrate another milestone of happiness."}
            </p>
          </section>

          {/* RELATIONSHIP TREE (USP - DYNAMIC & Terminology Adjusted) */}
          <section className="py-24 bg-transparent border-b border-[var(--theme-card-border)] px-4 relative overflow-hidden">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl text-[var(--theme-text-primary)] mb-2 uppercase tracking-wide font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                Relationship Tree
              </h2>
              <p className="text-[var(--theme-accent-light)] text-xs uppercase tracking-widest mb-10">
                🌳 {isWedding ? "Visualizing the family branches coming together" : "Mapping the circles of loved ones & friends"}
              </p>

              {/* React Flow Board */}
              <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-3xl h-[400px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-4 right-4 z-10 bg-zinc-900/90 border border-[var(--theme-card-border)] rounded-lg px-3 py-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 select-none pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent-gold)] animate-ping" /> Drag Canvas to Explore
                </div>

                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView
                  zoomOnScroll={false}
                  zoomOnPinch={false}
                  panOnDrag={true}
                  preventScrolling={false}
                  className="react-flow-wedding"
                >
                  <Background color="var(--theme-accent-gold)" style={{ opacity: 0.05 }} gap={16} />
                </ReactFlow>
              </div>
            </div>
          </section>

          {/* EVENT TIMELINE */}
          <section className="py-24 px-6 border-b border-[var(--theme-card-border)] relative">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl text-center text-[var(--theme-text-primary)] mb-12 uppercase tracking-wide font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                Celebration Itinerary
              </h2>

              <div className="relative border-l border-[var(--theme-card-border)] pl-8 space-y-12 max-w-xl mx-auto">
                {defaultEvents.map((timelineEvt, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle timeline index */}
                    <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-[var(--theme-bg)] border-2 border-[var(--theme-accent-gold)] flex items-center justify-center text-[10px] font-semibold" style={{ color: 'var(--theme-accent-light)' }}>
                      {idx + 1}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-heading text-lg font-semibold text-[var(--theme-text-primary)] tracking-wide font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                          {timelineEvt.name}
                        </h3>
                        <span className="text-[10px] font-semibold text-[var(--theme-accent-gold)] bg-[var(--theme-accent-gold)]/5 px-2.5 py-0.5 rounded-full border border-[var(--theme-card-border)] w-fit">
                          {timelineEvt.time}
                        </span>
                      </div>
                      <p className="text-[var(--theme-text-secondary)] text-xs font-light leading-relaxed">
                        {timelineEvt.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP FORM (Database Sync Enabled + Zod RSVP Validation) */}
          <section className="py-24 px-6 bg-transparent border-b border-[var(--theme-card-border)] relative">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-10">
                {isWedding ? (
                  <Heart className="w-6 h-6 text-[var(--theme-accent-rose)] fill-[var(--theme-accent-rose)] mx-auto mb-4 animate-beat" />
                ) : (
                  <Gift className="w-6 h-6 text-[var(--theme-accent-gold)] fill-[var(--theme-accent-gold)] mx-auto mb-4 animate-bounce" />
                )}
                <h2 className="text-2xl sm:text-3xl text-[var(--theme-text-primary)] mb-2 uppercase tracking-wide font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                  Share Your Response
                </h2>
                <p className="text-[var(--theme-text-secondary)] text-xs font-light">
                  Please let us know your attendance status {customRsvpDate ? `by ${new Date(customRsvpDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}` : "as soon as possible"}.
                </p>
              </div>

              {rsvpSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-2xl p-8 text-center backdrop-blur-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--theme-accent-gold)]/10 border border-[var(--theme-accent-gold)]/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-[var(--theme-accent-light)]" />
                  </div>
                  <h3 className="font-heading text-lg text-[var(--theme-text-primary)] mb-2 font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                    Response Registered
                  </h3>
                  <p className="text-[var(--theme-text-secondary)] text-xs font-light leading-relaxed">
                    {rsvpChoice === "yes"
                      ? "Thank you! We are absolutely thrilled to share this wonderful celebration with you."
                      : "Thank you for letting us know. We will miss you dearly, but we deeply appreciate your warm wishes!"}
                  </p>

                  {/* Share Panel in Success Card */}
                  <div className="mt-8 pt-6 border-t border-[var(--theme-card-border)] space-y-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-accent-light)]">
                      Spread the word to other guests
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {/* WhatsApp */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all active:scale-95 duration-200"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.035-4.437l.363.216c1.648.978 3.56 1.495 5.54 1.496 5.707 0 10.35-4.638 10.353-10.343.002-2.763-1.072-5.361-3.024-7.315-1.953-1.953-4.551-3.024-7.317-3.025-5.714 0-10.358 4.64-10.362 10.348-.002 2.012.527 3.98 1.53 5.725l.235.408-1.002 3.657 3.738-.98zm9.967-5.41c-.266-.134-1.57-.775-1.813-.863-.243-.089-.42-.134-.596.134-.176.267-.68.863-.833 1.041-.153.178-.305.201-.57.067-.266-.134-1.123-.414-2.14-1.321-.79-.705-1.324-1.576-1.48-1.843-.155-.267-.017-.411.117-.544.12-.12.266-.311.4-.467.132-.156.176-.267.264-.445.088-.178.044-.334-.022-.467-.066-.134-.596-1.437-.816-1.97-.215-.518-.452-.448-.62-.456-.16-.008-.344-.01-.528-.01-.184 0-.485.069-.74.346-.253.278-.968.947-.968 2.31 0 1.361.99 2.678 1.123 2.856.134.178 1.95 2.977 4.723 4.17.659.284 1.174.453 1.576.58.662.21 1.264.181 1.74.11.53-.08 1.57-.641 1.79-1.26.22-.619.22-1.15.155-1.26-.066-.11-.243-.176-.51-.31z" />
                        </svg>
                        WhatsApp
                      </a>

                      {/* Twitter / X */}
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 duration-200"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Share on X
                      </a>

                      {/* Facebook */}
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/20 transition-all active:scale-95 duration-200"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </a>

                      {/* Copy Link */}
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium transition-all active:scale-95 duration-200 cursor-pointer ${
                          copied
                            ? "bg-[var(--theme-accent-gold)]/20 border border-[var(--theme-accent-gold)]/40 text-[var(--theme-accent-light)]"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setRsvpSubmitted(false);
                      setRsvpName("");
                      setRsvpPhone("");
                      setRsvpChoice(null);
                    }}
                    className="mt-6 h-9 px-4 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] text-[var(--theme-accent-light)] hover:bg-zinc-900 cursor-pointer"
                  >
                    Edit Response
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="rsvp-name" className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[var(--theme-accent-gold)]" /> Your Full Name
                    </label>
                    <Input
                      id="rsvp-name"
                      type="text"
                      placeholder="e.g. Alex Davis"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      required
                      className="bg-[var(--theme-card-bg)] border-b border-b-[var(--theme-card-border)] focus-visible:border-b-[var(--theme-accent-gold)] text-xs h-10 rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-secondary)]/50"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="rsvp-phone" className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[var(--theme-accent-gold)]" /> Phone Number
                    </label>
                    <Input
                      id="rsvp-phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      required
                      className="bg-[var(--theme-card-bg)] border-b border-b-[var(--theme-card-border)] focus-visible:border-b-[var(--theme-accent-gold)] text-xs h-10 rounded-lg text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-secondary)]/50"
                    />
                  </div>

                  {/* Dynamic connection selectors based on Event Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="rsvp-relation" className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)] flex items-center gap-1.5">
                        Relation
                      </label>
                      <select
                        id="rsvp-relation"
                        value={rsvpRelation}
                        onChange={(e) => setRsvpRelation(e.target.value)}
                        className="w-full h-10 border-0 border-b border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] text-xs text-[var(--theme-text-secondary)] focus:outline-none focus:border-b-[var(--theme-accent-gold)] px-2 rounded-lg cursor-pointer"
                      >
                        <option value="family" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">Family & Relative</option>
                        <option value="friend" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">Friend Circle</option>
                        <option value="office" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">Office Colleague</option>
                        <option value="other" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">Well Wisher</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rsvp-guests" className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[var(--theme-accent-gold)]" /> Total Guests
                      </label>
                      <select
                        id="rsvp-guests"
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="w-full h-10 border-0 border-b border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] text-xs text-[var(--theme-text-secondary)] focus:outline-none focus:border-b-[var(--theme-accent-gold)] px-2 rounded-lg cursor-pointer"
                      >
                        <option value="1" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">1 Guest (Just Me)</option>
                        <option value="2" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">2 Guests</option>
                        <option value="3" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">3 Guests</option>
                        <option value="4" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">4 Guests</option>
                        <option value="5" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">5+ Guests</option>
                      </select>
                    </div>
                  </div>

                  {/* DYNAMIC CONNECTIONS FOR WEDDINGS VS BIRTHDAYS (NO Bride/Groom for Birthday) */}
                  {isWedding ? (
                    <div className="space-y-1.5">
                      <label htmlFor="rsvp-side" className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Wedding Side Association
                      </label>
                      <select
                        id="rsvp-side"
                        value={rsvpSide}
                        onChange={(e) => setRsvpSide(e.target.value)}
                        className="w-full h-10 border-0 border-b border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] text-xs text-[var(--theme-text-secondary)] focus:outline-none focus:border-b-[var(--theme-accent-gold)] px-2 rounded-lg cursor-pointer"
                      >
                        <option value="groom_side" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">Groom's Side Association</option>
                        <option value="bride_side" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">Bride's Side Association</option>
                        <option value="mutual" className="bg-[var(--theme-bg)] text-[var(--theme-text-primary)]">Mutual Friends</option>
                      </select>
                    </div>
                  ) : (
                    <div className="hidden">
                      <input type="hidden" value="friends_side" />
                    </div>
                  )}

                  {/* Attendance Choice Buttons */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                      Will You Attend?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Excited to Join */}
                      <button
                        type="button"
                        onClick={() => {
                          setRsvpChoice("yes");
                          if (!isWedding) setRsvpSide("friends_side");
                        }}
                        className={`h-11 rounded-xl flex items-center justify-center gap-2 border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                          rsvpChoice === "yes"
                            ? "bg-[var(--theme-accent-gold)] border-[var(--theme-accent-gold)] text-[var(--theme-btn-text)]"
                            : "bg-[var(--theme-card-bg)] border-[var(--theme-card-border)] text-[var(--theme-text-secondary)] hover:border-[var(--theme-accent-gold)]/50"
                        }`}
                      >
                        <Check className="w-4 h-4" /> Excited to Join
                      </button>

                      {/* Sadly Decline */}
                      <button
                        type="button"
                        onClick={() => setRsvpChoice("no")}
                        className={`h-11 rounded-xl flex items-center justify-center gap-2 border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                          rsvpChoice === "no"
                            ? "bg-[var(--theme-accent-rose)] border-[var(--theme-accent-rose)] text-[var(--theme-btn-text)]"
                            : "bg-[var(--theme-card-bg)] border-[var(--theme-card-border)] text-[var(--theme-text-secondary)] hover:border-[var(--theme-accent-rose)]/50"
                        }`}
                      >
                        <X className="w-4 h-4" /> Sadly Decline
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full h-12 bg-gradient-to-r var(--theme-btn-gradient) text-white hover:opacity-90 font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 border-0 group relative overflow-hidden transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingRsvp ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        Submit Response
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </section>

          {/* MAP SECTION */}
          <section className="py-24 px-6 border-b border-[var(--theme-card-border)] relative text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl text-[var(--theme-text-primary)] mb-2 uppercase tracking-wide font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                Venue Location
              </h2>
              <p className="text-[var(--theme-accent-light)] text-xs uppercase tracking-widest mb-10">
                📍 {event.venue}
              </p>

              {/* Google Maps embed with dynamic styles based on theme */}
              <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-3xl overflow-hidden h-[350px] shadow-2xl mb-8">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "var(--theme-maps-filter)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-11 px-6 rounded-xl bg-zinc-900 border border-[var(--theme-card-border)] hover:bg-zinc-950 text-[var(--theme-accent-light)] text-xs font-semibold cursor-pointer transition-all">
                  Open in Google Maps
                </Button>
              </a>
            </div>
          </section>

          {/* SHARE SECTION */}
          <section className="py-24 px-6 bg-transparent border-b border-[var(--theme-card-border)] relative text-center">
            <div className="max-w-xl mx-auto">
              <Share2 className="w-6 h-6 text-[var(--theme-accent-gold)] mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl text-[var(--theme-text-primary)] mb-2 uppercase tracking-wide font-serif" style={{ fontFamily: 'var(--font-heading)' }}>
                Spread the Word
              </h2>
              <p className="text-[var(--theme-text-secondary)] text-xs font-light mb-10">
                Invite friends and family to join this memorable celebration!
              </p>

              {/* Premium Copy Link Card */}
              <div className="bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-6">
                <div className="relative flex items-center bg-[#120F0F]/50 border border-zinc-800 rounded-xl overflow-hidden p-1">
                  <div className="px-3 text-zinc-450 text-xs truncate select-all flex-1 text-left font-mono">
                    {shareUrl || "Loading invitation link..."}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer shrink-0 ${
                      copied
                        ? "bg-[var(--theme-accent-gold)] text-[var(--theme-btn-text)]"
                        : "bg-zinc-900 border border-zinc-800 text-[var(--theme-accent-light)] hover:bg-zinc-800"
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>

                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800/60" />
                  </div>
                  <span className="relative px-3 bg-[var(--theme-card-bg)] text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                    Or Share Via
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-zinc-850 hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all active:scale-95 group duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.035-4.437l.363.216c1.648.978 3.56 1.495 5.54 1.496 5.707 0 10.35-4.638 10.353-10.343.002-2.763-1.072-5.361-3.024-7.315-1.953-1.953-4.551-3.024-7.317-3.025-5.714 0-10.358 4.64-10.362 10.348-.002 2.012.527 3.98 1.53 5.725l.235.408-1.002 3.657 3.738-.98zm9.967-5.41c-.266-.134-1.57-.775-1.813-.863-.243-.089-.42-.134-.596.134-.176.267-.68.863-.833 1.041-.153.178-.305.201-.57.067-.266-.134-1.123-.414-2.14-1.321-.79-.705-1.324-1.576-1.48-1.843-.155-.267-.017-.411.117-.544.12-.12.266-.311.4-.467.132-.156.176-.267.264-.445.088-.178.044-.334-.022-.467-.066-.134-.596-1.437-.816-1.97-.215-.518-.452-.448-.62-.456-.16-.008-.344-.01-.528-.01-.184 0-.485.069-.74.346-.253.278-.968.947-.968 2.31 0 1.361.99 2.678 1.123 2.856.134.178 1.95 2.977 4.723 4.17.659.284 1.174.453 1.576.58.662.21 1.264.181 1.74.11.53-.08 1.57-.641 1.79-1.26.22-.619.22-1.15.155-1.26-.066-.11-.243-.176-.51-.31z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider group-hover:text-white transition-colors">WhatsApp</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-zinc-850 hover:border-white/40 hover:bg-white/5 transition-all active:scale-95 group duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider group-hover:text-white transition-colors">Share on X</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-zinc-850 hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5 transition-all active:scale-95 group duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider group-hover:text-white transition-colors">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-16 text-center text-zinc-500 bg-[#0A0808]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3"
            >
              {isWedding ? (
                <Heart className="w-5 h-5 text-[var(--theme-accent-gold)] fill-[var(--theme-accent-gold)] animate-pulse" />
              ) : (
                <Gift className="w-5 h-5 text-[var(--theme-accent-gold)] fill-[var(--theme-accent-gold)] animate-pulse" />
              )}
              <p className="font-serif italic text-sm text-[var(--theme-text-primary)]/80" style={{ fontFamily: 'var(--font-heading)' }}>
                {isWedding ? "Thank you for being a part of our story" : "Thank you for celebrating with us"}
              </p>
              <p className="text-[10px] text-[var(--theme-accent-light)] mt-4 flex items-center gap-1.5 font-semibold">
                Made with <span className="font-bold uppercase">KInvite</span>
              </p>
            </motion.div>
          </footer>
          {/* FLOATING SHARE ACTION BUTTON */}
          <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3 print:hidden">
            {/* Expanded Menu Options */}
            <AnimatePresence>
              {isFloatingShareOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex flex-col gap-2.5 bg-zinc-950/90 border border-[var(--theme-card-border)] rounded-2xl p-2.5 backdrop-blur-md shadow-2xl mr-0.5"
                >
                  {/* WhatsApp Option */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/25 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] transition-all duration-300 hover:scale-105 active:scale-95 group relative"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.035-4.437l.363.216c1.648.978 3.56 1.495 5.54 1.496 5.707 0 10.35-4.638 10.353-10.343.002-2.763-1.072-5.361-3.024-7.315-1.953-1.953-4.551-3.024-7.317-3.025-5.714 0-10.358 4.64-10.362 10.348-.002 2.012.527 3.98 1.53 5.725l.235.408-1.002 3.657 3.738-.98zm9.967-5.41c-.266-.134-1.57-.775-1.813-.863-.243-.089-.42-.134-.596.134-.176.267-.68.863-.833 1.041-.153.178-.305.201-.57.067-.266-.134-1.123-.414-2.14-1.321-.79-.705-1.324-1.576-1.48-1.843-.155-.267-.017-.411.117-.544.12-.12.266-.311.4-.467.132-.156.176-.267.264-.445.088-.178.044-.334-.022-.467-.066-.134-.596-1.437-.816-1.97-.215-.518-.452-.448-.62-.456-.16-.008-.344-.01-.528-.01-.184 0-.485.069-.74.346-.253.278-.968.947-.968 2.31 0 1.361.99 2.678 1.123 2.856.134.178 1.95 2.977 4.723 4.17.659.284 1.174.453 1.576.58.662.21 1.264.181 1.74.11.53-.08 1.57-.641 1.79-1.26.22-.619.22-1.15.155-1.26-.066-.11-.243-.176-.51-.31z" />
                    </svg>
                    <span className="absolute right-12 bg-zinc-900 text-zinc-200 text-[9px] px-2 py-1 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase font-semibold tracking-wider shadow-lg">WhatsApp</span>
                  </a>

                  {/* X Option */}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 group relative"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="absolute right-12 bg-zinc-900 text-zinc-200 text-[9px] px-2 py-1 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase font-semibold tracking-wider shadow-lg">Share on X</span>
                  </a>

                  {/* Facebook Option */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/25 border border-[#1877F2]/20 flex items-center justify-center text-[#1877F2] transition-all duration-300 hover:scale-105 active:scale-95 group relative"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="absolute right-12 bg-zinc-900 text-zinc-200 text-[9px] px-2 py-1 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase font-semibold tracking-wider shadow-lg">Facebook</span>
                  </a>

                  {/* Copy Link Option */}
                  <button
                    onClick={handleCopyLink}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group relative cursor-pointer ${
                      copied
                        ? "bg-[var(--theme-accent-gold)]/20 border border-[var(--theme-accent-gold)]/40 text-[var(--theme-accent-light)]"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="absolute right-12 bg-zinc-900 text-zinc-200 text-[9px] px-2 py-1 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase font-semibold tracking-wider shadow-lg">
                      {copied ? "Copied!" : "Copy Link"}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main FAB Toggle Button */}
            <motion.button
              onClick={() => setIsFloatingShareOpen((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r var(--theme-btn-gradient) text-[var(--theme-btn-text)] shadow-2xl flex items-center justify-center border-0 cursor-pointer relative group overflow-hidden"
            >
              <motion.div
                animate={{ rotate: isFloatingShareOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isFloatingShareOpen ? <X className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
