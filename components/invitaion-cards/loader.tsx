import dynamic from "next/dynamic";
import React from "react";

// Declare dynamic imports at module level
const Wedding01 = dynamic(() => import("./Wedding01"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Wedding02 = dynamic(() => import("./Wedding02"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Wedding03 = dynamic(() => import("./Wedding03"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Birthday01 = dynamic(() => import("./Birthday01"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Engagement01 = dynamic(() => import("./Engagement01"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Corporate01 = dynamic(() => import("./Corporate01"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});

interface ThemeLoaderProps {
  themeId: string;
  event: any;
  initialGuests: any[];
}

export default function ThemeLoader({ themeId, event, initialGuests }: ThemeLoaderProps) {
  switch (themeId) {
    case "Wedding01":
      return <Wedding01 event={event} initialGuests={initialGuests} />;
    case "Wedding02":
      return <Wedding02 event={event} initialGuests={initialGuests} />;
    case "Wedding03":
      return <Wedding03 event={event} initialGuests={initialGuests} defaultColorCombo="sage_serenity" />;
    case "Wedding04":
      return <Wedding03 event={event} initialGuests={initialGuests} defaultColorCombo="midnight_luxe" />;
    case "Birthday01":
      return <Birthday01 event={event} initialGuests={initialGuests} defaultColorCombo="ocean_blue" />;
    case "Birthday02":
      return <Birthday01 event={event} initialGuests={initialGuests} defaultColorCombo="lavender_modern" />;
    case "Engagement01":
      return <Engagement01 event={event} initialGuests={initialGuests} defaultColorCombo="burgundy_elegance" />;
    case "Engagement02":
      return <Engagement01 event={event} initialGuests={initialGuests} defaultColorCombo="terracotta_warmth" />;
    case "Corporate01":
      return <Corporate01 event={event} initialGuests={initialGuests} defaultColorCombo="midnight_luxe" />;
    case "Corporate02":
      return <Corporate01 event={event} initialGuests={initialGuests} defaultColorCombo="ocean_blue" />;
    default:
      if (event?.type === "birthday") {
        return <Birthday01 event={event} initialGuests={initialGuests} />;
      }
      if (event?.type === "engagement") {
        return <Engagement01 event={event} initialGuests={initialGuests} />;
      }
      if (event?.type === "corporate") {
        return <Corporate01 event={event} initialGuests={initialGuests} />;
      }
      return <Wedding03 event={event} initialGuests={initialGuests} />;
  }
}
