# Agnos Assessment Rules

## Product Rules

- Build a responsive, real-time patient intake system with two synchronized interfaces.
- Provide a Patient Form where patients can enter or update their information.
- Provide a Staff View where staff can monitor the patient information as it changes.
- Synchronize patient and staff views immediately.
- Show whether the patient is actively filling in the form, inactive, or submitted.
- Deploy the final project to a frontend cloud platform such as Vercel, Heroku, Netlify, or similar.

## Field Rules

Required patient fields:

- First Name
- Last Name
- Date of Birth
- Gender
- Phone Number
- Email
- Address
- Preferred Language
- Nationality

Optional patient fields:

- Middle Name
- Emergency Contact, including name and relationship
- Religion

Validation rules:

- Required fields must be enforced.
- Phone number must be valid.
- Email must be valid when provided.
- Optional fields must not block submission when empty.
- Validation messages must be clear, visible, and accessible.

## Staff View Rules

- Display every field from the patient form.
- Update displayed values in real time as the patient types or edits.
- Provide a responsive layout for staff members across screen sizes.
- Show patient status indicators for submitted, actively filling in, and inactive states.
- Include a last-updated indicator when live data changes.
- Keep the layout stable while values update.

## Technical Rules

- Use Next.js as the framework.
- Use TailwindCSS for styling.
- Use Supabase Realtime Broadcast for synchronization.
- Follow the installed versions in this repository: Next.js `16.2.12`, React `19.2.4`, TailwindCSS `4`.
- Verify Next.js APIs against `node_modules/next/dist/docs/` before changing framework-specific code.
- Prefer the App Router structure in `app/`.
- Keep server-rendered UI as the default.
- Use Client Components only for interactive form state, real-time behavior, or browser-only APIs.
- Keep dependencies minimal.
- Do not add persistence, authentication, or multi-patient queues unless implemented as documented bonus features.
- Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for frontend Supabase configuration.
- Never expose a Supabase service role or secret key in the browser.
- Keep Supabase channel setup isolated from UI components.

## Privacy Rules

- Treat patient intake data as sensitive.
- Do not log full patient records to the console.
- Do not send patient data to analytics.
- Do not persist patient data unless the behavior is intentional and documented.
- Avoid implying permanent storage when the app only synchronizes live state.
- Treat Supabase Broadcast messages as transient unless a database-backed feature is explicitly added.

## UX Rules

- The first screen should be usable and lead directly to the intake workflow.
- Do not build a marketing landing page as the primary experience.
- Use a calm, clinical, readable interface.
- Group patient fields into clear sections.
- Make mobile, tablet, and desktop layouts intentional.
- Prefer scanning and clarity in the staff interface.
- Clearly distinguish empty, editing, invalid, inactive, and submitted states.
- Use color, text, and/or iconography together; color alone must not carry meaning.

## Accessibility Rules

- Every input must have a visible label.
- Error messages must be associated with their relevant inputs.
- Focus states must be visible.
- Keyboard navigation must work.
- Status updates should use a polite live region where useful.
- Text and UI controls must maintain sufficient contrast.
- Each page should have a descriptive title.

## Delivery Rules

- Provide a code repository with clear setup and run instructions.
- Provide a deployed application URL.
- Update README with project overview, setup instructions, and bonus feature notes.
- Include development planning documentation covering project structure, responsive UI/UX decisions, component architecture, and real-time synchronization flow.
- Run `npm run lint` before delivery.
- Run `npm run build` before delivery.
