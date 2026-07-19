"use server";

import { db } from "@/db";
import { events, guests, relations, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum([
    "wedding",
    "birthday",
    "engagement",
    "baby_shower",
    "office_party",
    "family_reunion",
    "farewell_dinner",
    "anniversary_gala"
  ]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Please choose a valid date"),
  venue: z.string().min(5, "Venue location must be at least 5 characters"),
  description: z.string().optional(),
  theme: z.string().optional(),
});

const addGuestSchema = z.object({
  eventId: z.string().uuid("Invalid event ID format"),
  name: z.string().min(2, "Guest name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  relation: z.enum(["family", "friend", "office"]),
  attendance: z.enum(["yes", "no", "pending"]),
  guestCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Guest count must be positive"),
  side: z.string(),
});

// Helper to get active user ID securely from server session
async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized: No session found");
  }
  return session.user.id;
}

// 1. CREATE EVENT ACTION
interface CreateEventInput {
  title: string;
  type: string;
  date: string;
  venue: string;
  description: string;
  theme: string;
}

export async function createEventAction(data: CreateEventInput) {
  try {
    const userId = await getUserId();
    
    // Server-side Zod check
    const parse = createEventSchema.safeParse(data);
    if (!parse.success) {
      return { success: false, error: parse.error.issues[0].message };
    }

    const eventId = crypto.randomUUID();
    
    // Generate unique, clean slug
    const cleanTitle = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const slug = `${cleanTitle}-${userId.slice(0, 4)}`;

    await db.insert(events).values({
      id: eventId,
      userId: userId,
      title: data.title,
      slug: slug,
      type: data.type,
      date: new Date(data.date),
      venue: data.venue,
      coverImage: "/wedding_hero.png",
      theme: data.theme,
      description: data.description,
    });

    revalidatePath("/dashboard");
    return { success: true, eventId, slug };
  } catch (err: any) {
    console.error("Error creating event:", err);
    return { success: false, error: err.message || "Failed to create event" };
  }
}

// 2. DELETE EVENT ACTION
export async function deleteEventAction(eventId: string) {
  try {
    const userId = await getUserId();

    // Verify ownership first
    const eventList = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.userId, userId)));

    if (eventList.length === 0) {
      return { success: false, error: "Unauthorized or event not found" };
    }

    // Delete associated guests
    await db.delete(guests).where(eq(guests.eventId, eventId));

    // Delete associated relations
    await db.delete(relations).where(eq(relations.eventId, eventId));

    // Delete event
    await db.delete(events).where(eq(events.id, eventId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting event:", err);
    return { success: false, error: err.message || "Failed to delete event" };
  }
}

// 3. ADD GUEST ACTION
interface AddGuestInput {
  eventId: string;
  name: string;
  phone: string;
  relation: string;
  attendance: string;
  guestCount: string;
  side: string;
}

export async function addGuestAction(data: AddGuestInput) {
  try {
    const userId = await getUserId();

    // Server-side Zod check
    const parse = addGuestSchema.safeParse(data);
    if (!parse.success) {
      return { success: false, error: parse.error.issues[0].message };
    }

    // Verify ownership of the event
    const eventList = await db
      .select()
      .from(events)
      .where(and(eq(events.id, data.eventId), eq(events.userId, userId)));

    if (eventList.length === 0) {
      return { success: false, error: "Unauthorized to add guests to this event" };
    }

    const guestId = crypto.randomUUID();
    await db.insert(guests).values({
      id: guestId,
      eventId: data.eventId,
      name: data.name,
      phone: data.phone,
      relation: data.relation,
      attendance: data.attendance,
      guestCount: data.guestCount,
      side: data.side,
    });

    revalidatePath("/dashboard");
    return { success: true, guestId };
  } catch (err: any) {
    console.error("Error adding guest:", err);
    return { success: false, error: err.message || "Failed to add guest" };
  }
}

// 4. DELETE GUEST ACTION
export async function deleteGuestAction(guestId: string, eventId: string) {
  try {
    const userId = await getUserId();

    // Verify ownership of the event associated with this guest
    const eventList = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.userId, userId)));

    if (eventList.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(guests).where(eq(guests.id, guestId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting guest:", err);
    return { success: false, error: err.message || "Failed to delete guest" };
  }
}

// 5. UPDATE EVENT THEME/TEMPLATE ACTION
export async function updateEventThemeAction(
  eventId: string, 
  theme?: string,
  details?: {
    title?: string;
    date?: string;
    venue?: string;
    description?: string;
    coverImage?: string;
    published?: boolean;
  }
) {
  try {
    const userId = await getUserId();

    // Verify ownership
    const eventList = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.userId, userId)));

    if (eventList.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    const updatePayload: any = {};
    if (theme) updatePayload.theme = theme;
    if (details) {
      if (details.title) updatePayload.title = details.title;
      if (details.date) updatePayload.date = new Date(details.date);
      if (details.venue) updatePayload.venue = details.venue;
      if (details.description) updatePayload.description = details.description;
      if (details.coverImage !== undefined) updatePayload.coverImage = details.coverImage;
      if (details.published !== undefined) updatePayload.published = details.published;
    }

    await db
      .update(events)
      .set(updatePayload)
      .where(eq(events.id, eventId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating event theme:", err);
    return { success: false, error: err.message || "Failed to update event theme" };
  }
}

// 6. UPDATE USER PROFILE/PLAN ACTION
export async function updateUserProfileAction(details: {
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  location: string | null;
  image: string | null;
  plan?: string;
}) {
  try {
    const userId = await getUserId();

    const updatePayload: any = {
      name: details.name,
      email: details.email,
      phone: details.phone,
      bio: details.bio,
      location: details.location,
      image: details.image,
    };
    if (details.plan) {
      updatePayload.plan = details.plan;
    }

    await db
      .update(user)
      .set(updatePayload)
      .where(eq(user.id, userId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating profile:", err);
    return { success: false, error: err.message || "Failed to update profile" };
  }
}

// 7. SAVE RELATIONSHIP TREE ACTION
export async function saveRelationshipTreeAction(eventId: string, relationshipTreeJson: string) {
  try {
    const userId = await getUserId();

    // Verify ownership
    const eventList = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.userId, userId)));

    if (eventList.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(events)
      .set({ relationshipTree: relationshipTreeJson })
      .where(eq(events.id, eventId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error saving relationship tree:", err);
    return { success: false, error: err.message || "Failed to save tree" };
  }
}

// 8. FETCH LATEST GUESTS ACTION (REAL TIME DATA)
export async function getGuestsAction(eventId: string) {
  try {
    const userId = await getUserId();

    // Verify ownership of the event first
    const eventList = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.userId, userId)));

    if (eventList.length === 0) {
      return { success: false, error: "Unauthorized" };
    }

    const guestList = await db
      .select()
      .from(guests)
      .where(eq(guests.eventId, eventId));

    return { success: true, guests: guestList };
  } catch (err: any) {
    console.error("Error fetching guests:", err);
    return { success: false, error: err.message || "Failed to fetch guests" };
  }
}
