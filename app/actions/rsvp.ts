"use server";

import { db } from "@/db";
import { guests } from "@/db/schema";
import { z } from "zod";

const rsvpSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  name: z.string().min(2, "Guest name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  relation: z.string(),
  attendance: z.enum(["yes", "no"]),
  guestCount: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Guest count must be positive"),
  side: z.string(),
});

interface RsvpInput {
  eventId: string;
  name: string;
  phone: string;
  relation: string;
  attendance: string;
  guestCount: string;
  side: string;
}

export async function createRsvpAction(data: RsvpInput) {
  try {
    // Server-side Zod check
    const parse = rsvpSchema.safeParse(data);
    if (!parse.success) {
      return { success: false, error: parse.error.issues[0].message };
    }
    const newGuest = await db
      .insert(guests)
      .values({
        id: crypto.randomUUID(),
        eventId: data.eventId,
        name: data.name,
        phone: data.phone,
        relation: data.relation,
        attendance: data.attendance,
        guestCount: data.guestCount,
        side: data.side,
      })
      .returning();

    return { success: true, guest: newGuest[0] };
  } catch (err: any) {
    console.error("Error saving RSVP:", err);
    return { success: false, error: err.message || "Failed to submit RSVP" };
  }
}
