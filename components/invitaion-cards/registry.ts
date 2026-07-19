export interface ThemeInfo {
  id: string; // e.g. "Wedding01"
  name: string; // e.g. "Classic Wedding 01"
  category: "wedding" | "birthday" | "corporate";
  rating: string;
  uses: string;
  bg: string; // preview card background classes
  colorBubbleClass: string;
  legacyThemeMapping?: string; // used for shells mapping to InviteClient
  variants?: { id: string; name: string; colorBubbleClass: string; }[];
  creatorId?: string;
}

export const themesRegistry: ThemeInfo[] = [
  {
    id: "Wedding01",
    name: "Classic Wedding (Custom)",
    category: "wedding",
    rating: "5.0",
    uses: "10.5k uses",
    bg: "from-amber-500/20 to-yellow-600/20",
    colorBubbleClass: "bg-white",
    creatorId: "UwtWJEEVpGz1JycsvEYfW6MNedwqU2fF",
    variants: [
      { id: "wedding_01", name: "Classic Light", colorBubbleClass: "bg-white" }
    ]
  },
  {
    id: "Wedding02",
    name: "Classic Gala (Custom)",
    category: "wedding",
    rating: "5.0",
    uses: "8.1k uses",
    bg: "from-blue-900/40 to-slate-950/40",
    colorBubbleClass: "bg-[#07111f]",
    creatorId: "UwtWJEEVpGz1JycsvEYfW6MNedwqU2fF",
    variants: [
      { id: "wedding_02", name: "Classic Navy/Gold", colorBubbleClass: "bg-[#07111f]" }
    ]
  },
  {
    id: "Wedding03",
    name: "Floral Elegance",
    category: "wedding",
    rating: "4.9",
    uses: "2.4k uses",
    bg: "from-pink-900/40 to-rose-950/40",
    colorBubbleClass: "bg-rose-500",
    legacyThemeMapping: "minimal_elegant",
    variants: [
      { id: "floral_elegance", name: "Floral Elegance", colorBubbleClass: "bg-rose-500" },
      { id: "golden_glow_wedding", name: "Golden Glow", colorBubbleClass: "bg-amber-500" },
      { id: "midnight_romance", name: "Midnight Romance", colorBubbleClass: "bg-indigo-500" },
      { id: "garden_party", name: "Garden Party", colorBubbleClass: "bg-emerald-500" }
    ]
  },
  {
    id: "Wedding04",
    name: "Golden Glow",
    category: "wedding",
    rating: "4.8",
    uses: "3.1k uses",
    bg: "from-amber-905/40 to-yellow-950/40",
    colorBubbleClass: "bg-amber-500",
    legacyThemeMapping: "royal_wedding",
    variants: [
      { id: "royal_gold", name: "Royal Gold", colorBubbleClass: "bg-amber-500" },
      { id: "classic_white", name: "Classic White", colorBubbleClass: "bg-zinc-200" }
    ]
  },
  {
    id: "Birthday01",
    name: "Confetti Pop",
    category: "birthday",
    rating: "4.6",
    uses: "2.7k uses",
    bg: "from-sky-900/40 to-blue-950/40",
    colorBubbleClass: "bg-sky-400",
    legacyThemeMapping: "traditional_indian",
    variants: [
      { id: "confetti_pastel", name: "Confetti Pastel", colorBubbleClass: "bg-sky-400" },
      { id: "bright_fun", name: "Bright Fun", colorBubbleClass: "bg-pink-500" }
    ]
  },
  {
    id: "Birthday02",
    name: "Midnight Bloom",
    category: "birthday",
    rating: "4.7",
    uses: "1.9k uses",
    bg: "from-indigo-900/40 to-purple-950/40",
    colorBubbleClass: "bg-purple-500",
    legacyThemeMapping: "modern_birthday",
    variants: [
      { id: "midnight_neon", name: "Midnight Neon", colorBubbleClass: "bg-purple-500" },
      { id: "sunset_glow", name: "Sunset Glow", colorBubbleClass: "bg-orange-500" }
    ]
  },
  {
    id: "Corporate01",
    name: "Corporate Classic",
    category: "corporate",
    rating: "4.5",
    uses: "1.5k uses",
    bg: "from-zinc-800/40 to-zinc-950/40",
    colorBubbleClass: "bg-blue-600",
    legacyThemeMapping: "luxury_gold",
    variants: [
      { id: "exec_navy", name: "Executive Navy", colorBubbleClass: "bg-blue-600" },
      { id: "slate_minimal", name: "Slate Minimal", colorBubbleClass: "bg-slate-500" }
    ]
  },
  {
    id: "Corporate02",
    name: "Executive Slate",
    category: "corporate",
    rating: "4.4",
    uses: "1.2k uses",
    bg: "from-neutral-800/40 to-neutral-950/40",
    colorBubbleClass: "bg-neutral-200",
    legacyThemeMapping: "executive_slate",
    variants: [
      { id: "classic_charcoal", name: "Classic Charcoal", colorBubbleClass: "bg-zinc-650" },
      { id: "platinum_edge", name: "Platinum Edge", colorBubbleClass: "bg-neutral-200" }
    ]
  }
];
