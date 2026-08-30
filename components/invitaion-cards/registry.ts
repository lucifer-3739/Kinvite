export interface ThemeInfo {
  id: string; // e.g. "Wedding01"
  name: string; // e.g. "Classic Wedding 01"
  category: "wedding" | "birthday" | "engagement" | "corporate";
  rating: string;
  uses: string;
  bg: string; // preview card background classes
  colorBubbleClass: string;
  legacyThemeMapping?: string; // used for shells mapping to InviteClient
  variants?: { id: string; name: string; colorBubbleClass: string; }[];
  creatorId?: string;
}

const ALL_COLOR_VARIANTS = [
  { id: "midnight_luxe", name: "Midnight Luxe", colorBubbleClass: "bg-[#D4AF37]" },
  { id: "sage_serenity", name: "Sage Serenity", colorBubbleClass: "bg-[#6B8E7B]" },
  { id: "burgundy_elegance", name: "Burgundy Elegance", colorBubbleClass: "bg-[#7A2946]" },
  { id: "ocean_blue", name: "Ocean Blue", colorBubbleClass: "bg-[#5B9BD5]" },
  { id: "terracotta_warmth", name: "Terracotta Warmth", colorBubbleClass: "bg-[#D88C72]" },
  { id: "lavender_modern", name: "Lavender Modern", colorBubbleClass: "bg-[#A9A1D1]" }
];

export const themesRegistry: ThemeInfo[] = [
  // 1. WEDDING THEMES
  {
    id: "Wedding03",
    name: "Royal Botanical Wedding",
    category: "wedding",
    rating: "5.0",
    uses: "12.4k uses",
    bg: "from-[#243B35]/80 to-[#171717]/90",
    colorBubbleClass: "bg-[#6B8E7B]",
    variants: ALL_COLOR_VARIANTS
  },
  {
    id: "Wedding04",
    name: "Midnight Luxe Nuptials",
    category: "wedding",
    rating: "4.9",
    uses: "9.8k uses",
    bg: "from-[#171717]/90 to-[#6B7280]/40",
    colorBubbleClass: "bg-[#D4AF37]",
    variants: ALL_COLOR_VARIANTS
  },
  {
    id: "Wedding01",
    name: "Classic Wedding (Custom)",
    category: "wedding",
    rating: "5.0",
    uses: "10.5k uses",
    bg: "from-amber-500/20 to-yellow-600/20",
    colorBubbleClass: "bg-white",
    creatorId: "UwtWJEEVpGz1JycsvEYfW6MNedwqU2fF",
    variants: ALL_COLOR_VARIANTS
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
    variants: ALL_COLOR_VARIANTS
  },

  // 2. ENGAGEMENT THEMES
  {
    id: "Engagement01",
    name: "Burgundy Elegance Engagement",
    category: "engagement",
    rating: "4.9",
    uses: "6.2k uses",
    bg: "from-[#4A1525]/90 to-[#7A2946]/50",
    colorBubbleClass: "bg-[#7A2946]",
    variants: ALL_COLOR_VARIANTS
  },
  {
    id: "Engagement02",
    name: "Terracotta Warmth Soirée",
    category: "engagement",
    rating: "4.8",
    uses: "4.5k uses",
    bg: "from-[#6B2F2F]/90 to-[#A44A3F]/50",
    colorBubbleClass: "bg-[#D88C72]",
    variants: ALL_COLOR_VARIANTS
  },

  // 3. BIRTHDAY THEMES
  {
    id: "Birthday01",
    name: "Ocean Blue Milestone Bash",
    category: "birthday",
    rating: "4.9",
    uses: "8.7k uses",
    bg: "from-[#0B2545]/90 to-[#134074]/50",
    colorBubbleClass: "bg-[#5B9BD5]",
    variants: ALL_COLOR_VARIANTS
  },
  {
    id: "Birthday02",
    name: "Lavender Modern Party",
    category: "birthday",
    rating: "4.8",
    uses: "7.1k uses",
    bg: "from-[#302B4D]/90 to-[#625B8C]/50",
    colorBubbleClass: "bg-[#A9A1D1]",
    variants: ALL_COLOR_VARIANTS
  },

  // 4. CORPORATE & OFFICE PARTY THEMES
  {
    id: "Corporate01",
    name: "Executive Innovation Gala",
    category: "corporate",
    rating: "4.9",
    uses: "5.3k uses",
    bg: "from-[#171717]/90 to-[#134074]/50",
    colorBubbleClass: "bg-[#D4AF37]",
    variants: ALL_COLOR_VARIANTS
  },
  {
    id: "Corporate02",
    name: "Ocean Tech Summit Soirée",
    category: "corporate",
    rating: "4.7",
    uses: "3.9k uses",
    bg: "from-[#0B2545]/90 to-[#5B9BD5]/40",
    colorBubbleClass: "bg-[#5B9BD5]",
    variants: ALL_COLOR_VARIANTS
  }
];
