"use client";

import { InviteClient } from "@/components/invite-client";

export default function Wedding04({ event, initialGuests }: any) {
  const updatedEvent = { ...event, theme: "royal_wedding" };
  return <InviteClient event={updatedEvent} initialGuests={initialGuests} />;
}
