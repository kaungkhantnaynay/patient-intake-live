# Project Structure

The project uses the Next.js App Router. Route-level files live in `app/`,
reusable interface components live in `components/`, and shared intake logic
lives in `lib/`.

```text
patient-intake-live/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── patient/
│   │   └── page.tsx
│   └── staff/
│       └── page.tsx
├── components/
│   └── intake/
│       ├── FieldControl.tsx
│       ├── FormProgress.tsx
│       ├── PatientForm.tsx
│       ├── PatientStatusBadge.tsx
│       └── StaffDashboard.tsx
├── lib/
│   └── intake/
│       ├── realtime.ts
│       ├── schema.ts
│       ├── supabase.ts
│       ├── types.ts
│       └── validation.ts
├── public/
├── .env.example
├── package.json
└── README.md
```

## Main Folders

### `app/`

Contains the pages and global styles.

- `app/page.tsx` is the home screen and links to the patient and staff flows.
- `app/patient/page.tsx` provides the patient form page layout.
- `app/staff/page.tsx` provides the staff dashboard page layout.
- `app/layout.tsx` defines shared metadata and the root application shell.
- `app/globals.css` contains Tailwind setup, color tokens, motion settings, and
  global accessibility styles.

### `components/intake/`

Contains the React components used by the intake experience. The patient form
and staff dashboard manage their own screen state, while smaller components
handle fields, progress, and status presentation.

### `lib/intake/`

Contains framework-independent intake rules and realtime behavior.

- `schema.ts` is the single source of truth for field names, labels, sections,
  input types, and required fields.
- `validation.ts` contains the Zod schemas and validation helpers.
- `types.ts` contains the shared TypeScript types.
- `supabase.ts` creates the browser Supabase client when public environment
  variables are available.
- `realtime.ts` validates messages and manages Supabase or local realtime
  connections.

### `public/`

Contains static assets, including the home page background image.

## Configuration Files

- `.env.example` lists the public Supabase variables required for cross-browser
  realtime updates.
- `package.json` defines project dependencies and the development, lint, build,
  and start commands.
- `next.config.ts` contains Next.js configuration.
- `tsconfig.json` contains strict TypeScript settings and the `@/*` import alias.
- `eslint.config.mjs` contains the lint rules.

## Organization Decision

Page files stay small and focus on route layout. Reusable interface behavior is
kept in components, while validation, field definitions, and synchronization
are kept in shared modules. This separation makes each part easier to explain,
test, and change without duplicating intake rules.
