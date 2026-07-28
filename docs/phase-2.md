# Phase 2 Review Notes

## Summary

Phase 2 replaced the patient route shell with an interactive, schema-driven intake form. The patient form now renders every assignment field, validates required/contact/date inputs, tracks active/inactive/submitted status, and shows required-field completion progress.

## 1. Client Form Boundary

### What Was Implemented

- Added a focused Client Component for patient form interactivity.
- Kept `app/patient/page.tsx` as a Server Component.
- Mounted the interactive form from the patient route.

### Files Involved

- `app/patient/page.tsx`
- `components/intake/PatientForm.tsx`

### Decision

Only the form component is marked with `"use client"`. The route page remains server-rendered so the app keeps a clean Server/Client Component boundary.

## 2. Schema-Driven Field Controls

### What Was Implemented

- Added reusable field rendering for text, email, telephone, date, select, and textarea inputs.
- Generated form sections from the shared `intakeSections` object.
- Generated all patient inputs from the shared `intakeFields` schema.
- Marked required and optional fields visibly.

### Files Involved

- `components/intake/FieldControl.tsx`
- `components/intake/PatientForm.tsx`
- `lib/intake/schema.ts`

### Field Coverage

The form renders every assignment field:

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

## 3. Validation

### What Was Implemented

- Required fields are validated.
- Email format is validated.
- Phone number format is validated.
- Date of birth is validated and cannot be in the future.
- Optional fields do not block submission when empty.
- Inline errors appear after blur and on submit.
- Error messages are associated with the relevant input through `aria-describedby`.

### Files Involved

- `components/intake/FieldControl.tsx`
- `components/intake/PatientForm.tsx`
- `lib/intake/validation.ts`

### Decision

Validation remains client-side for Phase 2 because the assignment currently asks for a frontend-focused live intake flow without persistence. If persistence is added later, server-side validation should be added too.

## 4. Patient Status and Progress

### What Was Implemented

- Added required-field completion progress.
- Added visible patient status states:
  - Inactive
  - Actively filling
  - Submitted
- Added idle timeout behavior that moves the form from active to inactive after 25 seconds without changes.
- Added a successful submit message with timestamp.

### Files Involved

- `components/intake/FormProgress.tsx`
- `components/intake/PatientForm.tsx`

### Decision

Status state is local in Phase 2. Phase 4 should publish the same status transitions through Supabase Realtime Broadcast.

## 5. Accessibility and UX

### What Was Implemented

- Every input has a visible label.
- Error text is linked to the relevant control.
- Submit feedback uses `aria-live="polite"`.
- Focus states are visible.
- Required/optional state is communicated with text.
- The form uses the Agnos-inspired theme from Phase 1.

### Files Involved

- `components/intake/FieldControl.tsx`
- `components/intake/FormProgress.tsx`
- `components/intake/PatientForm.tsx`

## Future Notes

- Phase 3 should connect the staff dashboard to the same schema and display submitted/live values.
- Phase 4 should publish field changes and status updates through Supabase Realtime Broadcast.
- If the project adds persistence, server-side validation and database security rules should be added intentionally.

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

The sandboxed build hit the same Turbopack internal process and local port restriction observed in Phase 1. Running the same build command with approved permissions succeeded.

### Static Routes Generated

- `/`
- `/patient`
- `/staff`
- `/_not-found`
