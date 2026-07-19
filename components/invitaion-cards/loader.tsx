import dynamic from "next/dynamic";
import React from "react";

// Declare dynamic imports at module level to comply with React/ESLint rules
const Wedding01 = dynamic(() => import("./Wedding01"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Wedding02 = dynamic(() => import("./Wedding02"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Wedding03 = dynamic(() => import("./Wedding03"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Wedding04 = dynamic(() => import("./Wedding04"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Birthday01 = dynamic(() => import("./Birthday01"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Birthday02 = dynamic(() => import("./Birthday02"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Corporate01 = dynamic(() => import("./Corporate01"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});
const Corporate02 = dynamic(() => import("./Corporate02"), {
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
      return <Wedding03 event={event} initialGuests={initialGuests} />;
    case "Wedding04":
      return <Wedding04 event={event} initialGuests={initialGuests} />;
    case "Birthday01":
      return <Birthday01 event={event} initialGuests={initialGuests} />;
    case "Birthday02":
      return <Birthday02 event={event} initialGuests={initialGuests} />;
    case "Corporate01":
      return <Corporate01 event={event} initialGuests={initialGuests} />;
    case "Corporate02":
      return <Corporate02 event={event} initialGuests={initialGuests} />;
    default:
      return <Wedding03 event={event} initialGuests={initialGuests} />;
  }
}
