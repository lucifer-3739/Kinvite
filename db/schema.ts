import { pgTable, text, timestamp, boolean, uuid, integer, doublePrecision } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  phone: text("phone"),
  bio: text("bio"),
  location: text("location"),
  plan: text("plan").default("free"), // free, pro
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: timestamp("expires_at"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  type: text("event_type").notNull(), // wedding, birthday, engagement, baby shower (mapped to event_type column)
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  coverImage: text("cover_image"),
  theme: text("theme").default("Wedding03"), // Wedding01, Wedding02, Wedding03, etc.
  description: text("description"),
  relationshipTree: text("relationship_tree"), // JSON string containing full nodes/edges for React Flow
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  phone: text("phone"),
  relation: text("relation"), // family, friend, office
  attendance: text("attendance").default("pending"), // yes, no, pending
  guestCount: text("guest_count").default("1"),
  side: text("side"), // bride_side, groom_side, default
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const relations = pgTable("relations", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull().references(() => events.id),
  person1: text("person_1").notNull(), // Parent node
  person2: text("person_2").notNull(), // Child node
  relationType: text("relation_type"), // Sister, Parent, Cousin, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitationDesigns = pgTable("invitation_designs", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull().references(() => events.id),
  userId: text("user_id").notNull().references(() => user.id),
  theme: text("theme"),
  designJson: text("design_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const relationshipNodes = pgTable("relationship_nodes", {
  id: text("id").primaryKey(), // React Flow nodes use string IDs
  eventId: uuid("event_id").notNull().references(() => events.id),
  label: text("label").notNull(),
  nodeType: text("node_type").notNull(),
  positionX: doublePrecision("position_x").notNull(),
  positionY: doublePrecision("position_y").notNull(),
});

export const relationshipEdges = pgTable("relationship_edges", {
  id: text("id").primaryKey(), // React Flow edges use string IDs
  eventId: uuid("event_id").notNull().references(() => events.id),
  source: text("source").notNull(),
  target: text("target").notNull(),
  relationType: text("relation_type"),
});

export const invitationVersions = pgTable("invitation_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  designId: uuid("design_id").notNull().references(() => invitationDesigns.id),
  versionNumber: integer("version_number").notNull(),
  designJson: text("design_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});