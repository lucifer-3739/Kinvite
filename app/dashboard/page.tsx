import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { events, guests, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { DashboardClient } from "./dashboard-client";

interface PageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab || "overview";
  const userId = session.user.id;

  // 1. Fetch user events
  const userEvents = await db
    .select()
    .from(events)
    .where(eq(events.userId, userId));

  // Fetch all guests associated with the user's events
  const eventIds = userEvents.map(e => e.id);
  let userGuests: any[] = [];
  if (eventIds.length > 0) {
    // Fetch all guests belonging to all the user's events
    userGuests = await db
      .select()
      .from(guests)
      .where(inArray(guests.eventId, eventIds));
  }

  // Cast schema dates cleanly
  const formattedEvents = userEvents.map(evt => ({
    ...evt,
    date: new Date(evt.date)
  }));

  // Fetch current user details from db
  const [currentUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId));

  return (
    <DashboardClient
      initialEvents={formattedEvents}
      initialGuests={userGuests}
      activeTab={tab}
      currentUser={currentUser}
    />
  );
}
