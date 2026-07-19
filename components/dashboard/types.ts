export interface EventData {
  id: string;
  userId: string;
  title: string;
  slug: string;
  type: string;
  date: Date;
  venue: string;
  coverImage: string | null;
  theme: string | null;
  description: string | null;
  relationshipTree: string | null;
  published?: boolean;
  createdAt?: Date | string | null;
}

export interface GuestData {
  id: string;
  eventId: string;
  name: string;
  phone: string | null;
  relation: string | null;
  attendance: string | null;
  guestCount: string | null;
  side: string | null;
  createdAt?: Date | string | null;
}
