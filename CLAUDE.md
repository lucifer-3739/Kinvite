@AGENTS.md
Kinvite Development Plan
Project Goal

Build a SaaS platform called Kinvite where users can:

Create events
Design invitation pages
Customize themes
Collect RSVPs
Manage guests
Visualize relationship trees
Share public invitation links
Phase 1: Foundation Setup
Objective

Create production-ready project architecture.

Tasks
Setup Next.js App Router
Configure TypeScript
Configure Tailwind CSS
Configure shadcn/ui
Configure ESLint
Configure Prettier
Configure Drizzle ORM
Configure Supabase
Configure Better Auth
Deliverables
Authentication working
Database connection working
Dashboard shell working
Landing page working
Phase 2: Database Design
Create Tables
users
id
name
email
phone
plan
created_at
events
id
user_id
title
slug
event_type
date
venue
description
theme
cover_image
published
created_at
invitation_designs
id
event_id
user_id
theme
design_json
created_at
updated_at
guests
id
event_id
name
phone
relation
side
attendance
guest_count
created_at
relationship_nodes
id
event_id
label
node_type
position_x
position_y
relationship_edges
id
event_id
source
target
relation_type
invitation_versions
id
design_id
version_number
design_json
created_at
Phase 3: Authentication
Features
Signup
Email
Password
Login
Email
Password
Logout
Session Management
Protected Routes

Protect:

/dashboard
/events
/templates
/settings
Phase 4: Dashboard
Sidebar

Create:

Overview
Events
Guests
Templates
Analytics
Settings
Important

Only current page should be highlighted.

Example:

Overview ← highlighted

Events
Guests
Templates

Never highlight multiple sections.

Dashboard Widgets
Overview

Show:

Total Events
Total Guests
Confirmed RSVPs
Pending RSVPs
Phase 5: Event Management
Create Event Form

Fields:

Event Title
Event Type
Date
Venue
Description
Theme
Cover Image

Event Types:

Wedding
Birthday
Engagement
Baby Shower
Auto Generate Slug

Example:

rahul-weds-priya

kinvite.app/invite/rahul-weds-priya
Phase 6: Invitation Theme System
Objective

Create reusable theme engine.

Every invitation should render from:

{
"theme": "",
"colors": {},
"fonts": {},
"images": {}
}
Themes
Wedding

Background:

Luxury wedding hall
Flowers
Golden lighting
Birthday

Background:

Balloons
Confetti
Party atmosphere
Traditional Indian Wedding

Background:

Mandap
Marigold flowers
Traditional decorations
Engagement

Background:

Couple
Ring ceremony
Soft luxury atmosphere
Baby Shower

Background:

Clouds
Teddy bears
Soft pastel colors
Phase 7: Invitation Builder
Build Editor

Allow users to customize:

Text
Title
Subtitle
Story
Invitation message
Colors
Primary
Secondary
Accent
Fonts
Heading
Body
Images
Hero Image
Gallery Images
Background Image

Store all customization in:

invitation_designs.design_json
Phase 8: Invitation Page
Public Route
/invite/[slug]
Sections

Hero

Countdown

Story

Timeline

Gallery

Relationship Tree

RSVP Form

Map

Footer

Phase 9: RSVP System
RSVP Form

Fields:

Name
Phone
Attendance
Guest Count
Relation
Side
Dashboard

Show:

Coming
Not Coming
Pending
Filters
Bride Side
Groom Side
Family
Friends
Office
Phase 10: Relationship Tree
Use React Flow

Allow:

Create Node
Edit Node
Delete Node

Create Connection
Edit Connection
Delete Connection

Example:

Bride
├─ Sister
├─ Cousin
└─ Friend

Persist all nodes and edges to database.

Phase 11: Media Storage

Use Supabase Storage.

Buckets:

event-images
gallery-images
background-images
music-files

Store URLs only in database.

Phase 12: Invitation Versioning

Every save creates:

Version 1
Version 2
Version 3

Allow:

Restore Previous Version
Phase 13: Pricing System
Free
1 Event
50 Guests
Basic Templates
Pro
Unlimited Events
Unlimited Guests
Premium Templates
Custom Domain

Prepare architecture for payment integration later.

Phase 14: Performance

Requirements:

Server Components by default
Server Actions for mutations
Optimized images
Lazy loading
Pagination
Mobile-first responsive design
Final Deliverable

Generate a complete production-ready SaaS with:

Authentication
Dashboard
Event Management
Theme Engine
Invitation Builder
RSVP System
Guest Management
Relationship Tree
Versioning
Supabase Storage
Drizzle ORM
Responsive UI
Clean Architecture

Tell the AI to complete each phase before moving to the next and keep the code modular, scalable, and production-ready. This usually produces much better results than asking it to build everything at once.
