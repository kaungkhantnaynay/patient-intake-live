# Phase 3 Review Notes

## Summary

Phase 3 replaced the staff route shell with a structured monitoring dashboard. The staff view now displays every patient field from the shared schema, includes status and connection panels, shows an empty state before patient activity, and has layout scaffolding for real-time updates in Phase 4.

## 1. Staff Dashboard Component

### What Was Implemented

- Added a reusable `StaffDashboard` Client Component.
- Kept `app/staff/page.tsx` as a Server Component.
- Rendered all staff field rows from the shared intake schema.
- Added stable empty values using `Awaiting input`.

### Files Involved

- `app/staff/page.tsx`
- `components/intake/StaffDashboard.tsx`
- `lib/intake/schema.ts`

### Decision

The dashboard is a Client Component because Phase 4 will subscribe to Supabase Realtime and update its state in the browser. In Phase 3, it starts with an empty local snapshot.

## 2. Patient Status Badge

### What Was Implemented

- Added a reusable `PatientStatusBadge` component.
- Added visual states for:
  - Inactive
  - Actively filling
  - Submitted
- Used text labels plus color treatments so status is not communicated by color alone.

### Files Involved

- `components/intake/PatientStatusBadge.tsx`
- `components/intake/StaffDashboard.tsx`

### Decision

The staff status model uses the same `PatientStatus` type as the patient form, so Phase 4 can synchronize status without type translation.

## 3. Empty and Connection States

### What Was Implemented

- Added a waiting connection panel.
- Added a last-updated display.
- Added an empty state for no patient activity.
- Added a disconnected state label in the component model for Phase 4.

### Files Involved

- `components/intake/StaffDashboard.tsx`

### Decision

The dashboard shows `Waiting for patient activity` until realtime is connected. Phase 4 should replace this local state with Supabase connection status.

## 4. Responsive Field Layout

### What Was Implemented

- Added mobile stacked field rows.
- Added desktop two-column dashboard sections.
- Kept labels and values in stable grid rows to prevent layout jumping as values arrive.
- Added update-highlight styling for future changed fields.

### Files Involved

- `components/intake/StaffDashboard.tsx`

### Decision

Update highlighting is present as a UI path, but no field is marked as updated until Phase 4 provides incoming events.

## 5. Realtime Boundary

### What Is Deferred

- Actual patient-to-staff mirroring is not implemented in Phase 3.
- Supabase Realtime Broadcast setup is deferred to Phase 4.
- Staff subscription and field reconciliation are deferred to Phase 4.

### Decision

Phase 3 focuses on staff dashboard structure. This keeps realtime work isolated and easier to verify in Phase 4.

## Future Notes

- Phase 4 should install and configure `@supabase/supabase-js`.
- Phase 4 should publish patient form field/status changes.
- Phase 4 should subscribe in `StaffDashboard` and update the local snapshot.
- Phase 4 should drive `connectionState`, `lastUpdatedAt`, and `updatedField` from realtime events.

## Verification

### Commands Run

```bash
npm run lint
npm run build
```

### Results

- `npm run lint` passed.
- `npm run build` passed after rerunning outside the sandbox.

### Build Notes

The sandboxed build hit the same Turbopack internal process and local port restriction observed in earlier phases. Running the same build command with approved permissions succeeded.

### Static Routes Generated

- `/`
- `/patient`
- `/staff`
- `/_not-found`
