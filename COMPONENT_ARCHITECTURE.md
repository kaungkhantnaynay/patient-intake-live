# Component Architecture

The application separates route layout, interactive screens, reusable controls,
and shared business rules. This keeps the UI components focused and prevents
the patient and staff views from defining the same fields differently.

## Route Components

### `app/page.tsx`

Renders the home screen and provides links to the patient form and staff
dashboard.

### `app/patient/page.tsx`

Provides the patient page header and layout, then renders `PatientForm`.

### `app/staff/page.tsx`

Provides the staff page header and layout, then renders `StaffDashboard`.

## Patient Components

### `PatientForm`

Owns the patient form state and coordinates the complete intake workflow. It:

- renders sections from the shared field schema
- tracks values, touched fields, and validation errors
- marks the patient active while they are typing
- marks the patient inactive after a short idle period
- publishes field, status, and full-form updates
- validates and normalizes the form before submission
- clears the visible form after a successful submission
- preserves the submitted snapshot in memory for staff snapshot requests

### `FieldControl`

Renders the correct control for each field definition: input, select, or
textarea. It also connects labels, required markers, errors, and accessibility
attributes to the control.

### `FormProgress`

Shows required-field completion, patient status, realtime connection state, and
the progress bar.

## Staff Components

### `StaffDashboard`

Owns the current staff-side snapshot. It:

- subscribes to realtime events
- requests the latest snapshot after connecting
- applies field, status, and full-form updates
- ignores events older than the current snapshot
- briefly highlights the latest changed field
- shows connection state, completion count, update time, and grouped values

### `PatientStatusBadge`

Displays active, inactive, or submitted status with a consistent label,
description, and visual treatment.

## Shared Intake Modules

### `schema.ts`

Defines every field once, including its name, label, section, input type,
required state, placeholder, and select options. Both main screens render from
this schema.

### `validation.ts`

Defines Zod schemas for individual fields, complete submitted forms, and
realtime wire data. It also provides helpers for field validation, full-form
validation, and normalized parsing.

### `types.ts`

Defines the shared TypeScript contracts for patient data, fields, statuses,
connection states, transports, validation errors, and realtime events.

### `supabase.ts`

Creates one browser Supabase client from public environment variables. Auth
session persistence is disabled because this demo uses transient broadcast
events rather than user sessions.

### `realtime.ts`

Provides one connection interface to the components. Internally, it selects
Supabase Realtime when configured or the browser `BroadcastChannel` fallback
when it is not. It also validates inbound and outbound messages and maintains
the latest in-memory snapshot.

## Data Ownership

```text
schema.ts
   ├── PatientForm ── FieldControl
   │               └── FormProgress
   └── StaffDashboard ── PatientStatusBadge

PatientForm ── realtime.ts ── StaffDashboard
                    │
                    └── supabase.ts

validation.ts and types.ts support both sides of the flow.
```

The form owns editable patient data. The dashboard owns its received snapshot.
The realtime module passes validated events between them without coupling one
screen directly to the other.
