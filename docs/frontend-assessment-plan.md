# Agnos Front-end Assessment Plan

## Assignment Summary

Build a responsive, real-time patient intake system with two synchronized interfaces:

- Patient Form: a responsive form where patients enter or update their information.
- Staff View: a responsive monitoring interface where staff can see patient information update in real time.

The two interfaces must synchronize immediately, show patient activity/submission status, use the required front-end stack, and be deployable to a public frontend cloud platform.

## Source Requirements

The assignment PDF specifies a 3-day completion window after receiving the task.

Required patient fields:

- First Name
- Middle Name, optional
- Last Name
- Date of Birth
- Gender
- Phone Number
- Email
- Address
- Preferred Language
- Nationality
- Emergency Contact, optional name and relationship
- Religion, optional

Required validation:

- Required fields must be enforced.
- Phone number must be valid.
- Email must be valid when provided.
- Optional fields must remain optional.
- Validation feedback must be clear and accessible.

Required staff view behavior:

- Display each patient form field in real time as the patient inputs or updates information.
- Adapt cleanly to different staff screen sizes.
- Show indicators for these patient states:
  - Submitted
  - Actively filling in
  - Inactive

Required real-time behavior:

- Use WebSockets or another suitable real-time technology.
- Synchronize data between patient and staff views instantly.

Required stack:

- Framework: Next.js
- Styling: TailwindCSS
- Real-time communication: Supabase Realtime Broadcast
- Hosting: Vercel, Heroku, Netlify, or similar frontend cloud platform

Required deliverables:

- Code repository with clear setup and run instructions.
- Deployed application URL.
- README with project overview, setup instructions, and bonus feature notes.
- Development planning documentation covering:
  - Project structure
  - UI/UX design decisions across screen sizes
  - Component architecture
  - Real-time synchronization flow

Evaluation criteria:

- Responsiveness across mobile and desktop.
- Clean, organized modern JavaScript and React/Next.js code.
- Complete functionality and effective real-time synchronization.
- Simple, intuitive UX/UI for both patient and staff users.
- Proper deployment with an accessible URL.

## Project Rules

Use this file as the implementation contract for the assessment.

- Keep the first screen usable. The application should open directly into the intake system, not a marketing page.
- Prefer the existing Next.js App Router structure in `app/`.
- Follow the installed framework versions: Next.js `16.2.12`, React `19.2.4`, TailwindCSS `4`.
- Before changing Next.js APIs or conventions, verify behavior against `node_modules/next/dist/docs/` because this project uses a newer Next version with breaking changes.
- Keep server-rendered UI as the default; use Client Components only for interactive form state, WebSocket/session behavior, or browser-only APIs.
- Treat patient intake data as sensitive. Do not log full patient details to the console, analytics, or persistent browser storage unless explicitly needed for the assignment.
- Do not add a backend database unless required. The assignment asks for live synchronization, not persistence.
- Keep dependencies minimal. Add a real-time package only if it materially improves the implementation.
- Preserve accessibility: semantic labels, visible focus states, keyboard-friendly controls, readable errors, descriptive page title, and sufficient color contrast.
- Make responsive behavior intentional at mobile, tablet, and desktop sizes.
- Validate with `npm run lint` and `npm run build` before delivery.

## Recommended Architecture

Use a single Next.js app with two routes:

- `/patient`: patient-facing intake form.
- `/staff`: staff-facing live monitoring view.

Recommended file structure:

```text
app/
  layout.tsx
  page.tsx
  patient/
    page.tsx
  staff/
    page.tsx
components/
  intake/
    PatientForm.tsx
    FieldControl.tsx
    FormProgress.tsx
    StaffDashboard.tsx
    PatientStatusBadge.tsx
lib/
  intake/
    schema.ts
    types.ts
    validation.ts
    realtime.ts
    supabase.ts
docs/
  frontend-assessment-plan.md
```

Notes:

- `app/page.tsx` should redirect or link clearly to `/patient` and `/staff`.
- `schema.ts` should define the canonical field list, labels, required flags, and validation rules.
- `types.ts` should define shared `PatientIntake`, `PatientStatus`, and real-time message types.
- `realtime.ts` should isolate connection setup, message parsing, retry behavior, and fallback logic.

## Real-time Strategy

Selected implementation for the assignment:

- Use Supabase Realtime Broadcast through `@supabase/supabase-js`.
- Use client-side broadcast channels for ephemeral patient intake events.
- Keep Supabase setup isolated in `lib/intake/supabase.ts`.
- Keep app-specific publish/subscribe behavior isolated in `lib/intake/realtime.ts`.
- Broadcast field-level updates from the patient view to staff view.
- Broadcast status changes:
  - `active` while the user is focused or typing.
  - `inactive` after an idle timeout, recommended 20-30 seconds.
  - `submitted` after successful validation and submit.
- Use a stable channel topic such as `patient-intake:demo` for the single-patient assessment flow.
- Configure Broadcast acknowledgements when useful for connection feedback.

Fallback for local/demo mode:

- If Supabase environment variables are not configured, use `BroadcastChannel` for same-browser-tab demos.
- Clearly document that fallback in README as local-only.
- Keep the provider abstraction stable so the UI does not depend directly on Supabase channel details.

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Security notes:

- Use a Supabase publishable key in frontend code.
- Never expose a Supabase service role or secret key in the browser.
- Do not persist patient intake data unless the project intentionally adds a database-backed bonus feature.
- If private channels or database-backed Realtime are added later, configure the required Supabase Realtime authorization and RLS policies before relying on them.

Recommended event shape:

```ts
type IntakeRealtimeEvent =
  | { type: "field:update"; field: keyof PatientIntake; value: string; updatedAt: string }
  | { type: "status:update"; status: "active" | "inactive" | "submitted"; updatedAt: string }
  | { type: "form:replace"; data: PatientIntake; status: PatientStatus; updatedAt: string };
```

## UX Rules

Patient form:

- Use a calm clinical interface with compact, readable form sections.
- Group fields into personal details, contact details, background details, and emergency contact.
- Show inline validation after blur and on submit.
- Keep the primary submit button visible at the end of the form.
- Include a clear saved/live indicator, but avoid implying permanent storage if the app only synchronizes live state.

Staff view:

- Prioritize scanning over decoration.
- Show patient status at the top.
- Display last updated time.
- Use stable rows or definition-list groups so values do not jump as data arrives.
- Clearly distinguish empty, updating, invalid, and submitted states.
- On desktop, use a multi-column dashboard layout. On mobile, collapse to stacked sections.

Responsive targets:

- Mobile: 360px and up.
- Tablet: 768px and up.
- Desktop: 1024px and up.

Accessibility targets:

- Every input has a visible label.
- Error messages are associated with the relevant input.
- Status updates use a polite live region where useful.
- Color is not the only indicator of status.

## Task Breakdown

### 1. Foundation

- Replace the starter landing UI with assessment-specific routing.
- Update metadata title and description.
- Create shared intake types, schema, and validation helpers.
- Add the planned route structure for `/patient` and `/staff`.

Acceptance criteria:

- App builds with the new routes.
- Home page gets users to both views quickly.
- Shared field schema is the single source of truth.

### 2. Patient Form

- Build all required fields.
- Mark optional fields clearly.
- Add validation for required values, email, phone, and date of birth.
- Track dirty, valid, invalid, active, inactive, and submitted states.
- Submit only when validation passes.

Acceptance criteria:

- Required fields block submit when empty.
- Optional fields do not block submit.
- Email and phone errors are clear.
- Mobile and desktop layouts are usable.

### 3. Staff View

- Display every patient field in real time.
- Add patient status indicator.
- Add last updated timestamp.
- Show empty state before any patient activity.
- Keep layout stable while values update.

Acceptance criteria:

- Staff view updates when patient fields change.
- Staff can identify active, inactive, and submitted states.
- Staff view remains readable on mobile and desktop.

### 4. Real-time Synchronization

- Install and configure `@supabase/supabase-js`.
- Create `lib/intake/supabase.ts` for the browser Supabase client.
- Implement a Supabase Realtime Broadcast abstraction in `lib/intake/realtime.ts`.
- Add live publishing from patient form changes.
- Add staff subscription and state reconciliation.
- Add reconnect/error state handling.
- Add local demo fallback if a hosted real-time service is not configured.

Acceptance criteria:

- Updates appear in the staff view without manual refresh.
- Status changes are synchronized.
- Connection issues are visible without breaking the UI.

### 5. Polish and Documentation

- Update README with setup, scripts, routes, deployment notes, and real-time configuration.
- Document any bonus features.
- Verify responsive layouts manually.
- Run lint and production build.

Acceptance criteria:

- `npm run lint` passes.
- `npm run build` passes.
- README is enough for a reviewer to run the app.
- Deployed URL is available for submission.

## Implementation Plan

### Phase 1: Planning and Skeleton

- Confirm the app uses Next.js App Router and TailwindCSS.
- Create route pages for `/patient` and `/staff`.
- Add shared intake schema and TypeScript types.
- Replace the default starter content.

### Phase 2: Form and Validation

- Implement reusable form field components.
- Implement validation helpers from the shared schema.
- Build the patient form UI.
- Add form-level submit handling and status transitions.

### Phase 3: Staff Dashboard

- Build read-only staff dashboard sections from the same schema.
- Add status badges and timestamps.
- Add empty and disconnected states.
- Tune responsive layout for staff monitoring.

### Phase 4: Real-time Layer

- Install `@supabase/supabase-js`.
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` configuration.
- Implement `RealtimeClient` abstraction with Supabase Realtime Broadcast.
- Add local `BroadcastChannel` fallback for development.
- Use a Supabase channel topic such as `patient-intake:demo` for cross-device deployed sync.
- Test with patient and staff views open side by side.

### Phase 5: Delivery

- Update README.
- Run lint and build.
- Deploy to a frontend cloud platform.
- Add deployment URL and final notes to README.

## Suggested Bonus Features

- Form completion progress.
- Staff-side field highlighting when a value changes.
- Idle timer with countdown-to-inactive logic.
- Copy/share buttons for staff review.
- Masking or privacy mode for sensitive staff display fields.
- Connection quality indicator.

## Risks and Decisions

- Serverless platforms may not support custom long-lived WebSocket servers directly. Prefer a hosted real-time provider for deployed cross-device sync.
- Local `BroadcastChannel` is useful for demonstration but only works across tabs in the same browser profile.
- Supabase Realtime Broadcast is selected for deployed cross-device synchronization.
- Supabase Broadcast events are ephemeral. If persistence or replay becomes required, add a database-backed design and RLS policies intentionally.
- The assignment does not require persistence, authentication, or multi-patient queues. Add those only as documented bonus work if time allows.
- Patient data should be treated as transient and private unless persistence is intentionally added.

## Verification Checklist

- Patient form includes every required assignment field.
- Required, email, and phone validation work.
- Staff view mirrors patient changes immediately.
- Status shows active, inactive, and submitted.
- Layout works at mobile, tablet, and desktop widths.
- No console logging of full patient records.
- README has setup, usage, deployment, and architecture notes.
- `npm run lint` passes.
- `npm run build` passes.
- Deployment URL is publicly accessible.
