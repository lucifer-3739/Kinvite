"use client";

import { InviteClient } from "@/components/invite-client";

export default function Corporate02({ event, initialGuests }: any) {
  const updatedEvent = { ...event, theme: "executive_slate" };
  return <InviteClient event={updatedEvent} initialGuests={initialGuests} />;
}
