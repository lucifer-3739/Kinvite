"use client";

import { InviteClient } from "@/components/invite-client";

export default function Wedding03({ event, initialGuests }: any) {
  const updatedEvent = { ...event, theme: "minimal_elegant" };
  return <InviteClient event={updatedEvent} initialGuests={initialGuests} />;
}
