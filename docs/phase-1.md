# Phase 1 Review Notes

## Summary

Phase 1 converted the default Create Next App project into a usable assessment foundation. The app now has reviewer navigation, patient and staff route shells, shared intake domain files, project metadata, and verified build output.

## 1. Next App Router Foundation

### What Was Implemented

- Confirmed the project uses the Next.js App Router in `app/`.
- Reviewed the local Next.js 16 documentation for project structure, layouts, pages, links, and Server/Client Components.
- Kept route files under `app/` and shared non-route logic outside `app/` in `lib/`.

### Files Involved

- `app/layout.tsx`
- `app/page.tsx`
- `app/patient/page.tsx`
- `app/staff/page.tsx`
- `lib/intake/types.ts`
- `lib/intake/schema.ts`
- `lib/intake/validation.ts`

### Decision

Pages remain Server Components by default. Client Components will be introduced later only where interactivity is required, such as patient form state and real-time synchronization.

### Future Notes

- Phase 2 should add Client Components for the interactive patient form.
- Phase 4 should add browser-only real-time behavior behind a small abstraction.

## 2. Home Entry Screen

### What Was Implemented

- Replaced the default Create Next App starter page.
- Added a simple reviewer-facing entry screen.
- Added clear navigation to the two assessment interfaces:
  - `/patient`
  - `/staff`

### Files Involved

- `app/page.tsx`

### Decision

The home page is not a marketing landing page. It is a practical entry screen so reviewers can immediately open the patient and staff workflows.

### Future Notes

- The home page can remain lightweight for submission.
- If the final project needs a default redirect, `/` could later redirect to `/patient`, but the current split is better for reviewer discovery.

## 3. Patient and Staff Route Shells

### What Was Implemented

- Created `/patient` route shell.
- Created `/staff` route shell.
- Both routes render the shared intake field schema to prove the schema is reusable.
- Patient route shows field groups and required/optional status.
- Staff route shows the future monitoring groups and status states.

### Files Involved

- `app/patient/page.tsx`
- `app/staff/page.tsx`
- `lib/intake/schema.ts`

### Decision

The route shells are intentionally static in Phase 1. They establish navigation, layout direction, and data shape without prematurely adding form state or real-time behavior.

### Future Notes

- Phase 2 should replace the patient route field list with real form controls.
- Phase 3 should replace the staff placeholders with live read-only values.

## 4. Intake Domain Model

### What Was Implemented

- Added shared patient intake TypeScript types.
- Added a canonical intake field schema.
- Added empty patient intake data derived from the schema.
- Added shared validation helpers for required fields, email, phone, and date of birth.

### Files Involved

- `lib/intake/types.ts`
- `lib/intake/schema.ts`
- `lib/intake/validation.ts`

### Field Coverage

The schema includes every assignment field:

- First Name
- Middle Name
- Last Name
- Date of Birth
- Gender
- Phone Number
- Email
- Address
- Preferred Language
- Nationality
- Emergency Contact Name
- Emergency Contact Relationship
- Religion

### Decision

The schema is the single source of truth for labels, required/optional flags, field type, field section, and form placeholders.

### Future Notes

- Phase 2 should generate patient form controls from this schema.
- Phase 3 should generate staff display rows from this schema.
- Phase 4 should use the shared event types in `types.ts` for real-time updates.

## 5. App Metadata and Fonts

### What Was Implemented

- Updated the app metadata title.
- Updated the app metadata description.
- Removed the default `next/font/google` dependency so builds do not require fetching Google Fonts.
- Added an Agnos-inspired color palette based on the public Agnos Health website.

### Files Involved

- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/patient/page.tsx`
- `app/staff/page.tsx`

### Current Metadata

- Title: `Agnos Patient Intake`
- Description: `Real-time patient intake and staff monitoring interface`

### Decision

The metadata now describes the assessment project instead of the default Create Next App starter.

The app now uses system font stacks through Tailwind theme tokens. This avoids production build failures in restricted or offline environments.

The app theme uses a light clinical background, white cards, cobalt blue primary actions, and cyan accent states to reflect the Agnos Health website and app imagery.

### Future Notes

- If final deployment needs richer sharing previews, Open Graph metadata can be added later.

## 6. Verification

### Commands Run

```bash
npm run lint
npm run build
```

### Results

- `npm run lint` passed.
- `npm run build` passed after rerunning outside the sandbox.

### Build Notes

The first build attempt failed because the default Google font setup required network access. The app was updated to use system fonts through Tailwind theme tokens.

The next sandboxed build attempt failed because Turbopack needed to spawn an internal process and bind a local port during CSS processing. Running the same command with approved permissions succeeded.

### Static Routes Generated

- `/`
- `/patient`
- `/staff`
- `/_not-found`

### Decision

Phase 1 is verified. The project now has a working route skeleton, shared intake domain model, project metadata, and local implementation notes.
