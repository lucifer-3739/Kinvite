"use client";

import { InviteClient } from "@/components/invite-client";

export default function Birthday01({ event, initialGuests }: any) {
  const updatedEvent = { ...event, theme: "traditional_indian" };
  return <InviteClient event={updatedEvent} initialGuests={initialGuests} />;
}
