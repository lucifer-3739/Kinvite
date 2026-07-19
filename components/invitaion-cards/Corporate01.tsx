"use client";

import { InviteClient } from "@/components/invite-client";

export default function Corporate01({ event, initialGuests }: any) {
  const updatedEvent = { ...event, theme: "luxury_gold" };
  return <InviteClient event={updatedEvent} initialGuests={initialGuests} />;
}
