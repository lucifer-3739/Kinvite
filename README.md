# Kinvite 💌

Kinvite is a premium, state-of-the-art event invitation and management platform. It allows users to create stunning digital invitations with custom themes, manage guest lists, track RSVPs, and visualize complex family relationship trees in a unified dashboard.

---

## 🌟 Key Features

* **Dynamic Theme Designer**: Live visual customization of invitations (modify background colors, text colors, background image presets, celebret/celebrant names, event subtexts, dress codes, and RSVP dates).
* **Live Interactive Previews**: An interactive mobile mockup preview panel embedded directly in the dashboard shows customization changes instantly.
* **Smart RSVP Manager**: Real-time RSVP responses mapping directly to your Supabase PostgreSQL database. Tracks guest attendance, seating preferences, and dietary requirements.
* **Interactive Relationship Trees**: Build and display family or party networks (React Flow) to organize wedding seating layouts or guest relationship hierarchies.
* **Robust Authentication**: Powered by Better Auth with secure logins, password resets, and session management.
* **Unified Template Registry**: Plug-and-play theme architecture inside `/components/invitaion-cards` allowing developers to add new layout components instantly.

---

## 🛠️ Technology Stack

* **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + Turbopack
* **Languages**: [TypeScript](https://www.typescriptlang.org/) + [React 19](https://react.dev/)
* **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
* **Database & ORM**: [Supabase PostgreSQL](https://supabase.com/) + [Drizzle ORM](https://orm.drizzle.team/)
* **Authentication**: [Better Auth](https://www.better-auth.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Components**: Radix UI + Tailwind Merge + Sonner

---

## 📁 Repository Structure

```
kinvite/
├── app/                        # Next.js App Router folders
│   ├── (auth)/                 # Login, Signup, Password resets
│   ├── dashboard/              # Event management workspace client
│   ├── invite/                 # Public dynamic invitation paths
│   └── page.tsx                # Landing Homepage
├── components/
│   ├── dashboard/              # Dashboard tab layouts (Overview, Guests, Settings, etc.)
│   ├── invitaion-cards/        # Central Dynamic Themes Folder
│   │   ├── registry.ts         # Central Metadata array for templates
│   │   ├── loader.tsx          # Dynamic Loader component
│   │   ├── Wedding01.tsx       # Classic Wedding Template
│   │   ├── Wedding02.tsx       # Classic Gala Template
│   │   └── Wedding03.tsx etc.  # Legacy wrapper shells
│   └── ui/                     # Shared UI components
├── db/                         # Drizzle schema and client configurations
└── lib/                        # Helpers and auth clients
```

---

## 🎨 Developer Guide: Adding a New Theme

Kinvite uses a dynamic, lazy-loading template directory. Adding a new invitation card theme takes 3 simple steps:

### 1. Create the Layout Component
Add your new `.tsx` file inside `components/invitaion-cards/` (e.g., `Birthday03.tsx`):
```typescript
"use client";

export default function Birthday03({ event, initialGuests }: any) {
  return (
    <div className="bg-pink-100 text-neutral-900 p-8 min-h-screen">
      <h1>{event.title}</h1>
      <p>{event.venue}</p>
    </div>
  );
}
```

### 2. Register Your Theme
Add the metadata entry for your theme in `components/invitaion-cards/registry.ts`:
```typescript
  {
    id: "Birthday03",
    name: "Confetti Celebration 03 (Custom)",
    category: "birthday",
    rating: "5.0",
    uses: "100 uses",
    bg: "from-pink-500/20 to-rose-600/20",
    colorBubbleClass: "bg-pink-400",
    variants: [
      { id: "birthday_03_default", name: "Confetti Pink", colorBubbleClass: "bg-pink-400" }
    ]
  }
```

### 3. Expose in Loader
Update `components/invitaion-cards/loader.tsx` to lazy-load the component:
```typescript
const Birthday03 = dynamic(() => import("./Birthday03"), {
  loading: () => <div className="p-8 text-center text-zinc-400 font-serif">Loading Invitation...</div>
});

// Inside switch(themeId) in ThemeLoader:
case "Birthday03":
  return <Birthday03 event={event} initialGuests={initialGuests} />;
```

The new template will automatically appear inside the **Create Event** theme selector dropdown, show in the **Templates Library Grid**, and render in the **Preview Mockup Frame**!

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file at the root:
```env
# Supabase PostgreSQL connection
DATABASE_URL="postgresql://postgres.xxx:password@aws-xx.pooler.supabase.com:6543/postgres"

# Next.js Application Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase Auth/Client Credentials
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
```

### 3. Apply Migrations
Apply database schemas and changes:
```bash
npx drizzle-kit push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Kinvite landing page!
