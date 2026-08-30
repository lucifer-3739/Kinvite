"use client";

import React, { useState } from "react";
import { 
  Search, Heart, Sparkles, Cake, Gift, Briefcase, ArrowLeft, Edit, Check, X, Image as ImageIcon, Palette, Trash
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventData } from "./types";
import { themesRegistry } from "@/components/invitaion-cards/registry";
import ThemeLoader from "@/components/invitaion-cards/loader";

interface TemplatesTabProps {
  activeEvent: EventData | null;
  theme: "light" | "dark";
  onSelectTemplate: (
    themeName: string,
    details?: {
      title?: string;
      date?: string;
      venue?: string;
      description?: string;
      coverImage?: string;
    }
  ) => Promise<void>;
  searchQuery: string;
  currentUser?: any;
}

export default function TemplatesTab({
  activeEvent,
  theme,
  onSelectTemplate,
  searchQuery,
  currentUser,
}: TemplatesTabProps) {
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [isEditingData, setIsEditingData] = useState(false);

  // Customization States
  const [customNames, setCustomNames] = useState("Arjun & Riya");
  const [customEventTitle, setCustomEventTitle] = useState("Wedding Celebration");
  const [customDate, setCustomDate] = useState("2025-07-24");
  const [customVenue, setCustomVenue] = useState("The Ritz Grand Banquet Hall");
  const [customDressCode, setCustomDressCode] = useState("Black Tie Preferred");
  const [customRsvpDate, setCustomRsvpDate] = useState("2025-07-10");
  const [customBgColor, setCustomBgColor] = useState("");
  const [customBgImage, setCustomBgImage] = useState("");
  const [customTextColor, setCustomTextColor] = useState("");

  // Preset Colors List (6 Official Color Combinations)
  const colorPresets = [
    { name: "Default Theme", color: "", text: "" },
    { name: "Midnight Luxe", color: "#171717", text: "#F5E6C8" },
    { name: "Sage Serenity", color: "#243B35", text: "#F1E9D2" },
    { name: "Burgundy Elegance", color: "#4A1525", text: "#F4E6E8" },
    { name: "Ocean Blue", color: "#0B2545", text: "#DCEAF7" },
    { name: "Terracotta Warmth", color: "#6B2F2F", text: "#F4D6C6" },
    { name: "Lavender Modern", color: "#302B4D", text: "#E8E4F3" }
  ];

  // Preset Images List
  const imagePresets = [
    { name: "Default Background", url: "" },
    { name: "Elegant Floral", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop" },
    { name: "Classic Marble", url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop" },
    { name: "Gold Dust", url: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=600&auto=format&fit=crop" },
    { name: "Soft Watercolor", url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop" }
  ];

  // Theme styling constants
  const cardBg = theme === "dark" ? "bg-neutral-905 border-white/5" : "bg-white border-zinc-200";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";

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

  const handleDeleteTheme = (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...deletedThemes, themeId];
    setDeletedThemes(updated);
    localStorage.setItem("deleted_themes", JSON.stringify(updated));
    toast.success("Custom theme deleted successfully");
  };

  const templatesList = themesRegistry;

  const filteredTemplates = templatesList.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = templateCategoryFilter === "all" || t.category === templateCategoryFilter;
    const isOwner = !t.creatorId || t.creatorId === currentUser?.id;
    const isDeleted = deletedThemes.includes(t.id);
    return matchesSearch && matchesCategory && isOwner && !isDeleted;
  });

  // helper to generate dynamic monogram text from names
  const getMonogramText = (namesString: string) => {
    if (!namesString) return "K";
    const clean = namesString.replace(/and/g, "&").replace(/or/g, "&");
    const parts = clean.split("&").map(s => s.trim());
    if (parts.length >= 2) {
      return `${parts[0].charAt(0).toUpperCase()}&${parts[1].charAt(0).toUpperCase()}`;
    }
    const words = namesString.split(" ").map(s => s.trim()).filter(Boolean);
    if (words.length >= 2) {
      return `${words[0].charAt(0).toUpperCase()}&${words[1].charAt(0).toUpperCase()}`;
    }
    return namesString.slice(0, 2).toUpperCase();
  };

  // helper to calculate light/dark color contrast based on YIQ formula
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

  // helper to resolve variantbg
  const getCardVariantBgClass = () => {
    switch (selectedVariant) {
      case "wedding_02":
        return "bg-[#07111f]";
      case "wedding_01":
        return "bg-white";
      case "floral_elegance":
      case "golden_glow_wedding":
      case "midnight_romance":
      case "garden_party":
        return "bg-[#140e0e]";
      case "royal_gold":
        return "bg-[#181510]";
      case "classic_white":
        return "bg-[#1d1d1d]";
      case "midnight_neon":
        return "bg-[#09050d]";
      case "sunset_glow":
        return "bg-[#0c0704]";
      case "confetti_pastel":
        return "bg-[#0f1418]";
      case "bright_fun":
        return "bg-[#180f14]";
      case "exec_navy":
        return "bg-[#080d16]";
      case "slate_minimal":
        return "bg-[#12161a]";
      case "classic_charcoal":
        return "bg-[#141414]";
      case "platinum_edge":
        return "bg-[#222222]";
      default:
        return "bg-neutral-900";
    }
  };

  const getCardVariantBorderClass = () => {
    switch (selectedVariant) {
      case "wedding_02":
        return "border-[#d8b56a]/30";
      case "wedding_01":
        return "border-black/10";
      case "floral_elegance":
        return "border-rose-500/25";
      case "golden_glow_wedding":
      case "royal_gold":
        return "border-amber-500/25";
      case "midnight_romance":
        return "border-indigo-500/25";
      case "garden_party":
        return "border-emerald-500/25";
      case "classic_white":
        return "border-zinc-300/20";
      case "midnight_neon":
        return "border-purple-500/25";
      case "sunset_glow":
        return "border-orange-500/25";
      case "confetti_pastel":
        return "border-sky-500/25";
      case "bright_fun":
        return "border-pink-500/25";
      case "exec_navy":
        return "border-blue-700/25";
      case "slate_minimal":
        return "border-slate-500/25";
      case "classic_charcoal":
        return "border-zinc-700/25";
      case "platinum_edge":
        return "border-neutral-500/25";
      default:
        return "border-white/10";
    }
  };

  const getCardVariantTextAccentClass = () => {
    switch (selectedVariant) {
      case "wedding_02":
        return "text-[#d8b56a] border-[#d8b56a]/30";
      case "wedding_01":
        return "text-[oklch(0.55_0.05_25)] border-[oklch(0.75_0.09_85)]/30";
      case "floral_elegance":
      case "bright_fun":
        return "text-rose-450 border-rose-500/30";
      case "golden_glow_wedding":
      case "royal_gold":
        return "text-amber-450 border-amber-500/30";
      case "midnight_romance":
        return "text-indigo-400 border-indigo-500/30";
      case "garden_party":
        return "text-emerald-450 border-emerald-500/30";
      case "classic_white":
      case "platinum_edge":
        return "text-zinc-200 border-zinc-200/30";
      case "midnight_neon":
        return "text-purple-400 border-purple-500/30";
      case "sunset_glow":
        return "text-orange-400 border-orange-500/30";
      case "confetti_pastel":
        return "text-sky-400 border-sky-500/30";
      case "exec_navy":
        return "text-blue-400 border-blue-500/30";
      case "slate_minimal":
        return "text-slate-350 border-slate-350/30";
      case "classic_charcoal":
        return "text-zinc-400 border-zinc-400/30";
      default:
        return "text-amber-500 border-amber-500/30";
    }
  };

  const getCardVariantButtonClass = () => {
    switch (selectedVariant) {
      case "wedding_02":
        return "bg-[#d8b56a] hover:bg-[#c2a25b] text-[#07111f]";
      case "wedding_01":
        return "bg-neutral-900 hover:bg-neutral-800 text-neutral-50";
      case "floral_elegance":
      case "bright_fun":
        return "bg-rose-500 hover:bg-rose-600 text-neutral-950";
      case "golden_glow_wedding":
      case "royal_gold":
        return "bg-amber-500 hover:bg-amber-600 text-neutral-950";
      case "midnight_romance":
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
      case "garden_party":
        return "bg-emerald-600 hover:bg-emerald-700 text-neutral-950";
      case "classic_white":
      case "platinum_edge":
        return "bg-zinc-200 hover:bg-zinc-300 text-neutral-950";
      case "midnight_neon":
        return "bg-purple-600 hover:bg-purple-750 text-white";
      case "sunset_glow":
        return "bg-orange-500 hover:bg-orange-600 text-neutral-950";
      case "confetti_pastel":
        return "bg-sky-500 hover:bg-sky-600 text-neutral-950";
      case "exec_navy":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "slate_minimal":
        return "bg-slate-700 hover:bg-slate-800 text-white";
      case "classic_charcoal":
        return "bg-zinc-700 hover:bg-zinc-650 text-white";
      default:
        return "bg-white text-neutral-950 hover:bg-zinc-100";
    }
  };

  const handleSelectTemplateAndClose = async () => {
    if (!selectedTemplate) return;

    const styleConfig = {
      customBgColor,
      customBgImage,
      customTextColor,
      selectedVariant,
      customNames,
      customEventTitle,
      customDressCode,
      customRsvpDate
    };
    const coverImageJson = JSON.stringify(styleConfig);

    await onSelectTemplate(selectedTemplate.id, {
      title: customNames,
      date: customDate,
      venue: customVenue,
      description: customDressCode,
      coverImage: coverImageJson
    });
  };

  // Render Template Preview Customizer View
  if (selectedTemplate) {
    const mockEvent = {
      id: activeEvent?.id || "preview-id",
      userId: activeEvent?.userId || "",
      title: customNames || activeEvent?.title || "Emma & James",
      slug: activeEvent?.slug || "preview-slug",
      type: selectedTemplate.category,
      date: customDate ? new Date(customDate) : (activeEvent?.date ? new Date(activeEvent.date) : new Date("2026-09-14")),
      venue: customVenue || activeEvent?.venue || "Rosewood Gardens",
      coverImage: activeEvent?.coverImage || null,
      theme: selectedTemplate.id,
      description: customDressCode || activeEvent?.description || "A celebration of love.",
      relationshipTree: activeEvent?.relationshipTree || null
    };

    const isWedding = selectedTemplate.category === "wedding";
    const isBirthday = selectedTemplate.category === "birthday";
    const isCorporate = selectedTemplate.category === "corporate";

    // Dynamic contrast styling parameters
    const isLight = customBgColor ? isLightColor(customBgColor) : false;
    const primaryTextClass = isLight ? "text-neutral-955" : "text-white";
    const secondaryTextClass = isLight ? "text-neutral-800" : "text-zinc-200";
    const tertiaryTextClass = isLight ? "text-neutral-600" : "text-zinc-400";
    const borderDividerClass = isLight ? "border-black/10" : "border-white/5";

    return (
      <div className="space-y-6 animate-fade">
        {/* Customizer Sub Header Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-solid border-white/5 pb-4">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { setSelectedTemplate(null); setIsEditingData(false); }}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-transparent border-0 cursor-pointer select-none font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Templates
            </button>
            <span className="text-zinc-600 text-xs mx-1">/</span>
            <span className="text-zinc-200 text-xs font-bold">{selectedTemplate.name}</span>
          </div>

          <h2 className="hidden md:block text-sm font-bold text-white tracking-wide uppercase font-serif">
            {selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1)} Theme — {selectedTemplate.name}
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingData(!isEditingData)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-solid text-xs font-bold transition-all bg-transparent cursor-pointer select-none ${
                isEditingData 
                  ? "bg-amber-500/10 border-amber-500/35 text-amber-500 font-extrabold" 
                  : "border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              {isEditingData ? "Close designer" : "Edit details"}
            </button>
            <Button
              onClick={handleSelectTemplateAndClose}
              disabled={!activeEvent}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 font-extrabold text-xs border-0 cursor-pointer select-none shadow"
            >
              Use Template
            </Button>
          </div>
        </div>

        {/* Customizer Main Workspace (Split Screen on Desktop) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
          
          {/* LEFT COLUMN: CUSTOMIZATION PANELS (Inline in Edit Mode) */}
          {isEditingData && (
            <div className="w-full lg:w-[360px] bg-neutral-900/40 border border-solid border-white/5 rounded-3xl p-5 sm:p-6 space-y-5 flex flex-col justify-start shrink-0 overflow-y-auto max-h-[75vh] scrollbar-thin">
              <div className="flex items-center justify-between border-b border-solid border-white/5 pb-3">
                <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-500" /> Customize Details
                </h3>
                <button
                  onClick={() => setIsEditingData(false)}
                  className="p-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white border-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-450">Celebrant Names</label>
                  <Input
                    type="text"
                    value={customNames}
                    onChange={(e) => setCustomNames(e.target.value)}
                    required
                    className="bg-neutral-950 border-white/10 text-xs h-9 rounded-lg text-white font-semibold"
                  />
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-455">Event Title Subtext</label>
                  <Input
                    type="text"
                    value={customEventTitle}
                    onChange={(e) => setCustomEventTitle(e.target.value)}
                    required
                    className="bg-neutral-950 border-white/10 text-xs h-9 rounded-lg text-white font-semibold"
                  />
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-455">Attire / Dress Code</label>
                  <Input
                    type="text"
                    value={customDressCode}
                    onChange={(e) => setCustomDressCode(e.target.value)}
                    required
                    className="bg-neutral-950 border-white/10 text-xs h-9 rounded-lg text-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 flex flex-col">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-455">Celebration Date</label>
                    <Input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      required
                      className="bg-neutral-950 border-white/10 text-xs h-9 rounded-lg text-white font-semibold"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-455">RSVP Deadline</label>
                    <Input
                      type="date"
                      value={customRsvpDate}
                      onChange={(e) => setCustomRsvpDate(e.target.value)}
                      required
                      className="bg-neutral-950 border-white/10 text-xs h-9 rounded-lg text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1 flex flex-col">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-455">Venue Location Address</label>
                  <Input
                    type="text"
                    value={customVenue}
                    onChange={(e) => setCustomVenue(e.target.value)}
                    required
                    className="bg-neutral-950 border-white/10 text-xs h-9 rounded-lg text-white font-semibold"
                  />
                </div>

                {/* Preset Colors */}
                <div className="space-y-2 border-t border-solid border-white/5 pt-3">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-455 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-zinc-500" /> Color presets
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {colorPresets.map((preset) => {
                      const isSelected = customBgColor === preset.color;
                      return (
                        <button
                          type="button"
                          key={preset.name}
                          onClick={() => {
                            setCustomBgColor(preset.color);
                            setCustomTextColor(preset.text);
                          }}
                          className={`px-2 py-1.5 rounded-lg border border-solid text-[9px] font-bold transition-all flex items-center gap-1.5 cursor-pointer truncate ${
                            isSelected 
                              ? "bg-white text-neutral-950 border-white font-extrabold" 
                              : "bg-neutral-950 border-white/5 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {preset.color ? (
                            <span 
                              style={{ backgroundColor: preset.color }} 
                              className="size-2.5 rounded-full border border-solid border-white/10 inline-block shrink-0" 
                            />
                          ) : (
                            <span className="size-2.5 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 border border-solid border-white/10 inline-block shrink-0" />
                          )}
                          <span className="truncate">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Color Pickers */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-1.5 bg-neutral-950/40 p-1.5 rounded-lg border border-solid border-white/5">
                      <input 
                        type="color" 
                        value={customBgColor || "#140e0e"} 
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="size-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                      />
                      <div className="flex flex-col text-[8px] text-left">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Background</span>
                        <span className="text-zinc-350 font-mono font-bold truncate max-w-[50px]">{customBgColor || "Default"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-950/40 p-1.5 rounded-lg border border-solid border-white/5">
                      <input 
                        type="color" 
                        value={customTextColor || "#ffffff"} 
                        onChange={(e) => setCustomTextColor(e.target.value)}
                        className="size-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                      />
                      <div className="flex flex-col text-[8px] text-left">
                        <span className="text-zinc-550 font-bold uppercase tracking-wider">Text Color</span>
                        <span className="text-zinc-350 font-mono font-bold truncate max-w-[50px]">{customTextColor || "Default"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preset Background Images */}
                <div className="space-y-2 border-t border-solid border-white/5 pt-3">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-455 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-500" /> Image presets
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {imagePresets.map((preset) => {
                      const isSelected = customBgImage === preset.url;
                      return (
                        <button
                          type="button"
                          key={preset.name}
                          onClick={() => setCustomBgImage(preset.url)}
                          className={`px-2 py-1 rounded-lg border border-solid text-[9px] font-bold transition-all flex items-center gap-1 cursor-pointer truncate ${
                            isSelected 
                              ? "bg-white text-neutral-950 border-white font-extrabold" 
                              : "bg-neutral-950 border-white/5 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {preset.url ? (
                            <span 
                              style={{ backgroundImage: `url(${preset.url})`, backgroundSize: "cover" }} 
                              className="size-2.5 rounded-full border border-solid border-white/10 inline-block shrink-0" 
                            />
                          ) : (
                            <span className="size-2.5 rounded-full bg-neutral-900 border border-solid border-white/10 inline-block shrink-0" />
                          )}
                          <span className="truncate">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1 flex flex-col pt-1">
                    <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">Custom Background Image URL</span>
                    <Input
                      type="url"
                      placeholder="Paste image URL"
                      value={customBgImage}
                      onChange={(e) => setCustomBgImage(e.target.value)}
                      className="bg-neutral-950 border-white/10 text-xs h-9 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-solid border-white/5">
                <Button
                  onClick={() => setIsEditingData(false)}
                  className="w-full h-9 bg-zinc-800 hover:bg-zinc-750 text-xs font-bold rounded-lg text-zinc-300 border-0 cursor-pointer"
                >
                  Done Customizing
                </Button>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: LIVE CARD PREVIEW (Expands if not editing) */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 relative animate-fade">
            
            {/* Card Mockup Frame */}
            <div className="relative max-w-sm w-full border border-solid border-white/5 rounded-[36px] p-2 bg-neutral-950 shadow-2xl overflow-hidden aspect-[9/16] flex flex-col items-stretch h-[640px]">
              
              {/* Card Frame ornament corners */}
              <div className="absolute top-2 left-2 size-4 border-t border-l border-white/10 rounded-tl-lg pointer-events-none z-10" />
              <div className="absolute top-2 right-2 size-4 border-t border-r border-white/10 rounded-tr-lg pointer-events-none z-10" />
              <div className="absolute bottom-2 left-2 size-4 border-b border-l border-white/10 rounded-bl-lg pointer-events-none z-10" />
              <div className="absolute bottom-2 right-2 size-4 border-b border-r border-white/10 rounded-br-lg pointer-events-none z-10" />

              <div className="relative flex-1 w-full rounded-[28px] overflow-y-auto scrollbar-none aspect-[9/16] h-full">
                <ThemeLoader themeId={selectedTemplate.id} event={mockEvent} initialGuests={[]} />
              </div>

            </div>

          </div>

        </div>

        {/* Theme Variant Options Picker */}
        <div className="w-full max-w-xl mx-auto mt-6 pt-6 border-t border-solid border-white/5 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-extrabold block mb-4">Theme Variants</span>
          <div className="flex justify-center gap-3.5 flex-wrap">
            {selectedTemplate.variants?.map((v: any) => {
              const isSelected = selectedVariant === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v.id);
                    // Reset custom styles when switching variants to let the variant styles shine
                    setCustomBgColor("");
                    setCustomTextColor("");
                    setCustomBgImage("");
                  }}
                  className={`px-4 py-2 rounded-xl border border-solid text-xs font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer select-none ${
                    isSelected 
                      ? "bg-white text-neutral-950 border-white shadow-lg shadow-white/5 font-extrabold" 
                      : "bg-neutral-900 border-white/5 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${v.colorBubbleClass} shrink-0`} />
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // Render Grid View of Templates (Original list view)
  return (
    <div className="space-y-6 animate-fade">

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none font-bold">
        {["all", "wedding", "engagement", "birthday", "corporate"].map((cat) => {
          const isActive = templateCategoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setTemplateCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize select-none cursor-pointer transition-all duration-300 border ${
                isActive
                  ? "bg-white text-neutral-950 border-white shadow"
                  : theme === "dark"
                    ? "bg-neutral-900 border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/10"
                    : "bg-white border-zinc-200 text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Templates Cards Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-zinc-550 border border-dashed rounded-3xl font-bold">
          No templates found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-semibold">
          {filteredTemplates.map((tmpl) => {
            const isActive = activeEvent?.theme === tmpl.id;
            const TmplIcon = 
              tmpl.id === "Wedding02" || tmpl.id === "Wedding04" ? Sparkles :
              tmpl.id === "Birthday01" ? Gift :
              tmpl.id === "Birthday02" ? Cake :
              tmpl.id === "Corporate01" || tmpl.id === "Corporate02" ? Briefcase : Heart;

            return (
              <div
                key={tmpl.id}
                className={`border rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${cardBg} ${
                  isActive ? "border-amber-500 shadow-md shadow-amber-500/5" : "hover:border-white/20"
                }`}
              >
                {/* Colored image placeholder area */}
                <div className={`h-36 w-full bg-gradient-to-br ${tmpl.bg} flex items-center justify-center relative`}>
                  <TmplIcon className="size-10 text-white/40" />
                </div>

                <div className="p-5 space-y-4">
                  {/* Card Content */}
                  <div>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-bold ${titleCol}`}>{tmpl.name}</span>
                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                        ★ {tmpl.rating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-550 mt-1.5 font-bold uppercase tracking-wider">
                      <span className="px-2 py-0.5 bg-neutral-900 border border-white/5 rounded-full capitalize">{tmpl.category}</span>
                      <span>{tmpl.uses}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTemplate(tmpl);

                        // Try to parse activeEvent's style config
                        let savedConfig: any = {};
                        const isCurrentActive = activeEvent?.theme === tmpl.id;
                        if (activeEvent?.coverImage) {
                          try {
                            savedConfig = JSON.parse(activeEvent.coverImage);
                          } catch (e) {
                            // Not JSON
                          }
                        }

                        // Variant
                        const defaultVariant = tmpl.variants ? tmpl.variants[0].id : tmpl.id;
                        setSelectedVariant(isCurrentActive && savedConfig.selectedVariant ? savedConfig.selectedVariant : defaultVariant);

                        // Names/Title: use activeEvent.title if available, fallback to category defaults
                        setCustomNames(isCurrentActive && savedConfig.customNames ? savedConfig.customNames : (activeEvent?.title || (tmpl.category === "wedding" ? "Arjun & Riya" : tmpl.category === "birthday" ? "Arjun Kumar" : "Knivite Corporation")));

                        // Event Title Subtext
                        setCustomEventTitle(isCurrentActive && savedConfig.customEventTitle ? savedConfig.customEventTitle : (tmpl.category === "wedding" ? "Wedding Celebration" : tmpl.category === "birthday" ? "25th Birthday Bash" : "Annual Corporate Gala"));

                        // Date: format date to YYYY-MM-DD
                        let dateStr = "";
                        if (activeEvent?.date) {
                          try {
                            dateStr = new Date(activeEvent.date).toISOString().split('T')[0];
                          } catch (e) {}
                        }
                        setCustomDate(dateStr || (tmpl.category === "wedding" ? "2025-07-24" : tmpl.category === "birthday" ? "2026-10-10" : "2025-12-12"));

                        // Venue
                        setCustomVenue(activeEvent?.venue || (tmpl.category === "wedding" ? "The Ritz Grand Banquet Hall" : tmpl.category === "birthday" ? "The Glasshouse Bistro" : "Grand Hyatt Ballroom"));

                        // Dress Code
                        setCustomDressCode(isCurrentActive && savedConfig.customDressCode ? savedConfig.customDressCode : (activeEvent?.description || (tmpl.category === "wedding" ? "Black Tie Preferred" : tmpl.category === "birthday" ? "Dress to Impress" : "Formal Attire")));

                        // RSVP Date
                        setCustomRsvpDate(isCurrentActive && savedConfig.customRsvpDate ? savedConfig.customRsvpDate : (tmpl.category === "wedding" ? "2025-07-10" : tmpl.category === "birthday" ? "2026-10-01" : "2025-11-30"));

                        // Custom styling: only apply if this is the active template
                        setCustomBgColor(isCurrentActive && savedConfig.customBgColor ? savedConfig.customBgColor : "");
                        setCustomBgImage(isCurrentActive && savedConfig.customBgImage ? savedConfig.customBgImage : "");
                        setCustomTextColor(isCurrentActive && savedConfig.customTextColor ? savedConfig.customTextColor : "");
                      }}
                      className={`flex-grow h-8 rounded-lg text-[10px] font-bold border border-zinc-800 transition-colors bg-transparent cursor-pointer ${theme === "dark" ? "text-zinc-300 hover:bg-zinc-800 hover:text-white" : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"}`}
                    >
                      Preview / Customize
                    </button>
                    {tmpl.creatorId === currentUser?.id && (
                      <button
                        onClick={(e) => handleDeleteTheme(tmpl.id, e)}
                        title="Delete custom theme"
                        className="h-8 w-8 rounded-lg flex items-center justify-center border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 animate-fade"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <Button
                      onClick={() => onSelectTemplate(tmpl.id)}
                      disabled={!activeEvent || isActive}
                      className={`h-8 px-3 rounded-lg text-[10px] font-extrabold border-0 cursor-pointer ${
                        isActive
                          ? "bg-zinc-900 text-zinc-500 cursor-not-allowed"
                          : "bg-white text-neutral-950 hover:bg-zinc-150"
                      }`}
                    >
                      {isActive ? "Active" : "Use"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
