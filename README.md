# Agnos Patient Intake

A responsive real-time patient intake demo built with Next.js. The app provides
a patient-facing form and a staff-facing dashboard that stay synchronized
through transient live events. Patient records are not stored in a database,
browser storage, analytics, or console logs.

## Project Overview

This project was built for a frontend assessment focused on healthcare intake
workflows. It demonstrates how a patient can enter intake details while staff
monitor the same information as it changes.

The app has three routes:

- `/` - reviewer entry screen with quick access to both workflows.
- `/patient` - patient-facing intake form with validation and live publishing.
- `/staff` - staff-facing live dashboard with patient status, field values, and
  update timing.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Realtime Broadcast
- Zod

## Features

- Patient intake form with all required assessment fields:
  - first name, last name, date of birth, gender, phone number, email, address,
    preferred language, and nationality
  - optional middle name, religion, emergency contact name, and emergency
    contact relationship
- Form sections for personal, contact, background, and emergency details.
- Shared intake schema used by both patient and staff interfaces.
- Zod validation for required fields, email, phone number, date of birth,
  allowed gender values, length limits, trimming, and normalization.
- Inline validation errors after blur and on submit.
- Patient status tracking for active, inactive, and submitted states.
- Submitted forms clear on the patient screen after successful submission.
- Staff dashboard mirrors patient field changes without manual refresh.
- Staff dashboard shows empty, connected, disconnected, active, inactive, and
  submitted states.
- Newly updated staff fields are highlighted briefly for easier scanning.
- Responsive layouts for patient and staff workflows.

## Bonus Features

- Supabase Realtime Broadcast integration for cross-browser or cross-device live
  updates when environment variables are configured.
- Local `BroadcastChannel` fallback for same-browser demos when Supabase is not
  configured.
- Full snapshot recovery so the staff dashboard can request the current patient
  state after opening late or reconnecting.
- Same-tab transient memory handoff so navigating between routes can preserve
  the latest in-memory snapshot until reload.
- Runtime validation of realtime payloads with Zod before messages reach UI
  state.
- Stale event protection so older messages do not overwrite newer dashboard
  values.
- Publishable-key-only Supabase client setup with Auth session persistence
  disabled for this ephemeral demo.
- Privacy-conscious implementation that avoids persistence, browser storage,
  analytics, and full patient-data logging.

## Local Setup

Requirements:

- Node.js 22 or newer
- npm

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open the patient and staff workflows in separate tabs:

- [http://localhost:3000/patient](http://localhost:3000/patient)
- [http://localhost:3000/staff](http://localhost:3000/staff)

## Supabase Realtime Setup

Supabase is optional for local same-browser demos, but required for live updates
across different browsers, devices, or deployed sessions.

Create a Supabase project and copy the project URL and publishable key from the
project's Connect dialog into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Restart the development server after changing environment variables.

Only use a Supabase publishable key in this app. Do not put a secret key or
service-role key in `.env.local`, `.env.example`, or any client-side code.
Values prefixed with `NEXT_PUBLIC_` are included in the browser bundle.

The app uses a public Supabase Realtime Broadcast channel named
`patient-intake:demo`. It sends field updates, status updates, snapshot
requests, and full form snapshots without writing to a database.

## Local Fallback

When either Supabase environment value is missing, the app automatically uses
the browser `BroadcastChannel` API.

This fallback works between tabs or windows on the same origin and browser
profile. It does not synchronize across different browsers, devices, profiles,
or deployed clients. It is ephemeral and disappears when the pages close.

## Architecture

- `lib/intake/schema.ts` defines the canonical intake fields, sections,
  labels, required flags, and empty form shape.
- `lib/intake/types.ts` defines shared TypeScript types for intake data,
  statuses, realtime events, and connection state.
- `lib/intake/validation.ts` owns shared Zod schemas, normalization, field
  validation, and full-form validation.
- `lib/intake/supabase.ts` creates the browser Supabase client with public
  environment values only.
- `lib/intake/realtime.ts` owns event schemas, Supabase Broadcast setup, local
  fallback setup, publishing, subscription cleanup, connection state, snapshot
  recovery, and stale event filtering.
- `components/intake/PatientForm.tsx` renders the patient form, validates
  input, publishes field/status changes, submits snapshots, and resets the form
  after successful submission.
- `components/intake/StaffDashboard.tsx` subscribes to realtime events and
  reconciles them into the staff dashboard.

The current demo intentionally has no persistence endpoint. If database writes
are added later, run the same `patientIntakeSchema` at the server boundary
before saving patient data.

## Privacy and Production Notes

This demo treats patient intake data as sensitive:

- No database persistence is implemented.
- No browser storage persistence is used.
- No analytics events are sent.
- Full patient records are not logged to the console.
- `.env.local` is ignored by Git and should contain local credentials only.
- `.env.example` should contain placeholders only.

The public single-patient Broadcast topic is suitable for an assessment demo,
not a production healthcare security model. A production workflow would need
authenticated private channels, per-session topics, authorization policies,
server-side validation, audit requirements, and a formal privacy review.

## Validation

Run these checks before delivery:

```bash
npm run lint
npm run build
```

## Project Documentation

- [Project Structure](PROJECT_STRUCTURE.md) - folder organization and the role
  of important files.
- [UI and UX Design Decisions](DESIGN_DECISIONS.md) - visual, interaction, and
  responsive design choices.
- [Component Architecture](COMPONENT_ARCHITECTURE.md) - main components,
  shared modules, and data ownership.
- [Real-Time Synchronization](REALTIME_SYNCHRONIZATION.md) - event flow,
  transport selection, validation, and snapshot recovery.
