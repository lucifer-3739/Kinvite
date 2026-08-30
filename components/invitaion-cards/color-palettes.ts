export interface ColorCombo {
  id: string;
  name: string;
  c1: string; // Base / Background dark
  c2: string; // Secondary / Border / Muted
  c3: string; // Primary Accent / Highlight
  c4: string; // Soft Foreground / Text
  colorBubbleClass: string;
  description: string;
}

export const COLOR_COMBOS: Record<string, ColorCombo> = {
  midnight_luxe: {
    id: "midnight_luxe",
    name: "Midnight Luxe",
    c1: "#171717",
    c2: "#6B7280",
    c3: "#D4AF37",
    c4: "#F5E6C8",
    colorBubbleClass: "bg-[#D4AF37]",
    description: "Deep noir with metallic gold & warm champagne accents."
  },
  sage_serenity: {
    id: "sage_serenity",
    name: "Sage Serenity",
    c1: "#243B35",
    c2: "#6B8E7B",
    c3: "#B7C9B1",
    c4: "#F1E9D2",
    colorBubbleClass: "bg-[#6B8E7B]",
    description: "Earthy forest green with soft sage & warm linen."
  },
  burgundy_elegance: {
    id: "burgundy_elegance",
    name: "Burgundy Elegance",
    c1: "#4A1525",
    c2: "#7A2946",
    c3: "#C98B9B",
    c4: "#F4E6E8",
    colorBubbleClass: "bg-[#7A2946]",
    description: "Rich royal wine with dusty rose & blush tints."
  },
  ocean_blue: {
    id: "ocean_blue",
    name: "Ocean Blue",
    c1: "#0B2545",
    c2: "#134074",
    c3: "#5B9BD5",
    c4: "#DCEAF7",
    colorBubbleClass: "bg-[#5B9BD5]",
    description: "Midnight abyss navy with azure blue & ice mist."
  },
  terracotta_warmth: {
    id: "terracotta_warmth",
    name: "Terracotta Warmth",
    c1: "#6B2F2F",
    c2: "#A44A3F",
    c3: "#D88C72",
    c4: "#F4D6C6",
    colorBubbleClass: "bg-[#D88C72]",
    description: "Deep rust with warm desert peach & linen."
  },
  lavender_modern: {
    id: "lavender_modern",
    name: "Lavender Modern",
    c1: "#302B4D",
    c2: "#625B8C",
    c3: "#A9A1D1",
    c4: "#E8E4F3",
    colorBubbleClass: "bg-[#A9A1D1]",
    description: "Royal dark violet with glowing lilac & lavender mist."
  }
};

export const COLOR_COMBOS_LIST = Object.values(COLOR_COMBOS);

export function getColorCombo(comboId?: string | null): ColorCombo {
  if (!comboId) return COLOR_COMBOS.midnight_luxe;
  return COLOR_COMBOS[comboId] || COLOR_COMBOS.midnight_luxe;
}
