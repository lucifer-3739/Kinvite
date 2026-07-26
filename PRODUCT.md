# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are event hosts (individuals planning personal milestones like weddings, birthdays, baby showers, or coordinators managing corporate events) who want to design elegant digital invitation pages, manage RSVPs, organize guest seating plans, and communicate details directly to guests.

## Product Purpose

Kinvite is a premium event invitation and dashboard management application that simplifies the digital invitation process. It combines high-end visual invitation cards (customizable online layout themes) with a back-office administration suite featuring guest list organization, RSVP status tracking, seating/relationship charts, and event reminders.

## Positioning

Kinvite stands out by providing event hosts with a real-time, interactive workspace complete with a live-rendered mobile preview, and a centralized template structure that dynamically controls visibility and allows creators to manage and delete their own custom themes privately.

## Operating Context

A web dashboard that runs in the browser, featuring tabs for Overview, Guest List, Reminders, Seating/Relationship Trees (using React Flow), and Theme Customization, alongside public slug-based invitation pages accessed by event guests.

## Capabilities and Constraints

* **Central Theme Registry**: Dynamically resolved layout component catalog (`Birthday01`, `Wedding01`, etc.) mapped via a central module structure.
* **Owner-Based Control**: Custom themes contain creator filters preventing other users from viewing or modifying them.
* **Auth & DB**: Integrated with Better Auth and Supabase PostgreSQL with Drizzle ORM.
* **Responsive Mockups**: In-dashboard phone simulator that renders invitation cards exactly as they look on mobile devices.

## Brand Commitments

* **Name**: Kinvite
* **Accents**: Dynamic accent colors (Amber, Emerald, Indigo, Rose, Slate) and premium dark/light interfaces.

## Evidence on Hand

* Completed source codebase built on Next.js 16 (Turbopack), TailwindCSS 4, and React 19.
* Deletion filters configured in `templates-tab.tsx` and `invitations-tab.tsx`.

## Product Principles

1. **Instant Feedback**: The customizer must reflect all layout settings in the mobile preview immediately.
2. **Complete Autonomy**: Users retain absolute control over their custom-created templates, including private deletions.
3. **No Placeholders**: Maintain visual excellence with real design schemes, typography, and images.
