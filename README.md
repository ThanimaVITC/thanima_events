# Thanima Events Portal

Thanima Events Portal is a Next.js app to manage events and registrations. Admins can create events (individual or team-based), and participants can register via a clean, responsive UI.

## Features
- Individual and team-based event configuration
  - Toggle team registration and set team size during event creation
- Participant registration with validation (leader contact details; team members list)
- Admin authentication (cookie-based) and dashboard to create/list/delete events
- Firebase Firestore persistence
- WhatsApp group link per event

## Tech Stack
- Next.js App Router (Server Actions)
- TypeScript, Tailwind CSS, Shadcn UI
- Firebase Firestore

## Getting Started
1. Install dependencies:
```bash
npm install
```
2. Configure environment variables (create `.env.local`):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
ADMIN_PASSWORD=your_admin_password
```
3. Run the app:
```bash
npm run dev
```

## Admin Dashboard
- Visit `/admin`
- Login with `ADMIN_PASSWORD`
- Create Event fields:
  - Title, Description, Event Date, WhatsApp Link
  - Coordinators (1–3)
  - Team-based toggle and Team Size (>= 2 when enabled)

## Data Model (simplified)
- Collection `events`
  - `title`, `description`, `eventDate`, `whatsappLink`
  - `isTeamBased`: boolean
  - `teamSize`: number
  - `coordinators`: array of `{ name, phone }`
  - `createdAt`
- Sub-collection `events/{eventId}/participants`
  - Leader: `name`, `email`, `phone`, `regNo`
  - `isTeamRegistration`, `teamSize`
  - `teamMembers`: array of `{ name, regNo? }` (when team-based)
  - `submittedAt`

## Logo
The registration form displays the Thanima logo from `public/thanima logo.png`.

## License
Proprietary. All rights reserved by Thanima.