# Agnos Assessment Tasks

## 1. Foundation

- [x] Review the installed Next.js documentation in `node_modules/next/dist/docs/` before changing framework APIs.
- [x] Replace the starter home page with assessment-specific navigation or routing.
- [x] Update app metadata title and description.
- [x] Create `/patient` route.
- [x] Create `/staff` route.
- [x] Create shared intake field schema.
- [x] Create shared TypeScript types for form data, patient status, and real-time events.
- [x] Create shared validation helpers.

Acceptance criteria:

- [x] App builds with the new route structure.
- [x] Home page gets reviewers to patient and staff views quickly.
- [x] Field definitions come from one canonical schema.

## 2. Patient Form

- [x] Build input controls for First Name.
- [x] Build input controls for Middle Name, optional.
- [x] Build input controls for Last Name.
- [x] Build input controls for Date of Birth.
- [x] Build input controls for Gender.
- [x] Build input controls for Phone Number.
- [x] Build input controls for Email.
- [x] Build input controls for Address.
- [x] Build input controls for Preferred Language.
- [x] Build input controls for Nationality.
- [x] Build input controls for Emergency Contact, optional name and relationship.
- [x] Build input controls for Religion, optional.
- [x] Group fields into readable form sections.
- [x] Mark optional fields clearly.
- [x] Add required-field validation.
- [x] Add email validation.
- [x] Add phone validation.
- [x] Add date-of-birth validation.
- [x] Show inline errors after blur and on submit.
- [x] Track active, inactive, and submitted status.
- [x] Submit only when validation passes.

Acceptance criteria:

- [x] Every assignment field is present.
- [x] Required fields block submit when empty.
- [x] Optional fields do not block submit when empty.
- [x] Email and phone errors are understandable.
- [x] Form works on mobile and desktop.

## 3. Staff View

- [x] Display every patient form field.
- [x] Add empty state before patient activity.
- [x] Add patient status badge.
- [x] Add last-updated timestamp.
- [x] Add visual treatment for newly updated fields.
- [x] Keep values readable when fields are empty.
- [x] Build mobile stacked layout.
- [x] Build desktop scanning layout.
- [x] Add disconnected/error state for real-time connection issues.

Acceptance criteria:

- [x] Staff view mirrors patient changes without manual refresh.
- [x] Staff can identify active, inactive, and submitted states.
- [x] Staff layout remains stable as values update.
- [x] Staff view works on mobile and desktop.

## 4. Real-time Synchronization

- [x] Install `@supabase/supabase-js`.
- [x] Add `NEXT_PUBLIC_SUPABASE_URL` environment variable documentation.
- [x] Add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` environment variable documentation.
- [x] Create `lib/intake/supabase.ts`.
- [x] Create `lib/intake/realtime.ts`.
- [x] Implement Supabase client creation with publishable-key-only frontend configuration.
- [x] Create a Supabase Realtime Broadcast channel for the assessment flow.
- [x] Define real-time event names for field updates, status updates, and full form replacement.
- [x] Implement patient-side publishing for field changes.
- [x] Implement patient-side publishing for status changes.
- [x] Implement staff-side subscription.
- [x] Reconcile incoming events into staff dashboard state.
- [x] Add reconnect or retry handling where supported.
- [x] Add local `BroadcastChannel` fallback for same-browser demos if Supabase is not configured.
- [x] Document any local-only fallback limitations in README.
- [x] Test patient and staff views side by side.
- [ ] Test deployed patient and staff views across separate browser sessions.

Acceptance criteria:

- [x] Field updates appear in the staff view immediately.
- [x] Active, inactive, and submitted statuses synchronize.
- [x] Connection issues are visible without breaking the UI.
- [x] The deployed solution uses Supabase Realtime Broadcast when environment variables are configured.
- [x] No Supabase service role or secret key is exposed to client code.

## 5. Responsive UX and Accessibility

- [ ] Verify layout at 360px mobile width.
- [ ] Verify layout at 768px tablet width.
- [ ] Verify layout at 1024px or wider desktop width.
- [ ] Check text does not overlap or overflow controls.
- [ ] Confirm all form controls have visible labels.
- [ ] Confirm errors are associated with inputs.
- [ ] Confirm keyboard navigation works.
- [ ] Confirm focus states are visible.
- [ ] Confirm status indicators do not rely on color alone.
- [ ] Confirm color contrast is readable.

Acceptance criteria:

- [ ] Patient form is usable across target screen sizes.
- [ ] Staff dashboard is usable across target screen sizes.
- [ ] No visible text or controls overlap.
- [ ] Basic accessibility checks pass.

## 6. Documentation

- [ ] Update README with project overview.
- [ ] Add setup instructions.
- [ ] Add local run instructions.
- [ ] Add route descriptions for `/patient` and `/staff`.
- [ ] Add Supabase Realtime configuration notes.
- [ ] Document required Supabase environment variables.
- [ ] Add deployment notes.
- [ ] Add bonus feature notes, if any were implemented.
- [x] Keep `docs/frontend-assessment-plan.md` current.
- [ ] Reference `docs/rules.md` and `docs/tasks.md` from README or planning notes.

Acceptance criteria:

- [ ] A reviewer can run the project from README instructions.
- [ ] A reviewer can understand the architecture from the documentation.
- [ ] Any limitations are clearly documented.

## 7. Final Verification and Delivery

- [ ] Run `npm run lint`.
- [ ] Fix lint issues.
- [ ] Run `npm run build`.
- [ ] Fix build issues.
- [ ] Deploy to a frontend cloud platform.
- [ ] Confirm deployed `/patient` route works.
- [ ] Confirm deployed `/staff` route works.
- [ ] Confirm real-time synchronization works in the deployed environment.
- [ ] Add deployed URL to README.
- [ ] Prepare final submission with repository link and deployed application link.

Acceptance criteria:

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Deployed URL is accessible.
- [ ] Repository contains clear instructions and planning documentation.
