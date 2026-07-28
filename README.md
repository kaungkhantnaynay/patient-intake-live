# Agnos Patient Intake

A responsive Next.js patient intake demo with a patient-facing form and a
staff-facing live monitor. Form values and patient activity are synchronized
as transient events; the app does not store patient records.

## Routes

- `/patient` provides the validated intake form.
- `/staff` displays every intake field, patient status, and the latest update.
- `/` links directly to both workflows.

## Local Setup

Requirements:

- Node.js 22 or newer
- npm

Install dependencies and start the app:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/patient](http://localhost:3000/patient) and
[http://localhost:3000/staff](http://localhost:3000/staff) in separate tabs.

## Supabase Realtime

Create a Supabase project, then copy the project URL and publishable key from
the project's Connect dialog into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Restart the development server after changing these values. Because
`NEXT_PUBLIC_` variables are included in the browser bundle at build time,
configure both values in the deployment environment before building.

The app uses a public Supabase Realtime Broadcast channel named
`patient-intake:demo`. It sends field updates, status updates, and full form
snapshots without writing to a database. A publishable key is expected; never
use a Supabase secret or service-role key in this application.

This public single-patient channel is appropriate only for the assessment
demo. A production healthcare workflow would require authenticated private
channels, per-session topics, authorization policies, and a formal privacy
review.

## Local Fallback

When either Supabase environment value is missing, the app automatically uses
the browser `BroadcastChannel` API. This makes side-by-side local demos work
across tabs or windows on the same origin and browser profile.

The fallback cannot synchronize different browsers, devices, profiles, or
origins. It is ephemeral and disappears when the pages close.

## Architecture

- `lib/intake/schema.ts` is the canonical field definition.
- `lib/intake/validation.ts` owns shared Zod validation and normalization.
- `lib/intake/supabase.ts` creates the publishable-key-only browser client.
- `lib/intake/realtime.ts` owns typed events, Zod message validation,
  Supabase Broadcast, local fallback, connection state, and snapshot recovery.
- `components/intake/PatientForm.tsx` publishes field and status changes.
- `components/intake/StaffDashboard.tsx` reconciles incoming events.

On connection, the patient publishes a complete snapshot and the staff view
requests one. This recovers current state when either page opens later or the
Supabase channel reconnects. No patient data is logged, analyzed, or written
to browser storage by the application.

For same-tab demos, the realtime boundary also retains the latest snapshot in
JavaScript module memory while navigating between routes. This snapshot clears
on page reload and is never written to browser storage or the database.

The current demo has no persistence endpoint. If one is added, run the same
`patientIntakeSchema` at that server boundary before writing patient data.

Planning and implementation details live in `docs/frontend-assessment-plan.md`,
`docs/rules.md`, and `docs/tasks.md`.

## Validation

```bash
npm run lint
npm run build
```
