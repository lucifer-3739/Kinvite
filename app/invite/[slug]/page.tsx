import { db } from "@/db";
import { events, guests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ThemeLoader from "@/components/invitaion-cards/loader";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InvitePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Fetch event from database by slug
  const eventList = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug));

  const event = eventList[0];

  // 2. If event does not exist, return a Next.js 404
  if (!event) {
    notFound();
  }

  // 3. Fetch guests associated with this event
  const guestList = await db
    .select()
    .from(guests)
    .where(eq(guests.eventId, event.id));

  // Cast schema Date cleanly to satisfy typings
  const formattedEvent = {
    ...event,
    date: new Date(event.date),
  };

  return <ThemeLoader themeId={event.theme || "Wedding03"} event={formattedEvent} initialGuests={guestList} />;
}
