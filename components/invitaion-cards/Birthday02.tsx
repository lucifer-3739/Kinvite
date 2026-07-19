"use client";

import { InviteClient } from "@/components/invite-client";

export default function Birthday02({ event, initialGuests }: any) {
  const updatedEvent = { ...event, theme: "modern_birthday" };
  return <InviteClient event={updatedEvent} initialGuests={initialGuests} />;
}
