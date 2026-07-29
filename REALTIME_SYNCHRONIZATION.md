# Real-Time Synchronization Flow

The patient form and staff dashboard communicate through transient realtime
events. No patient record is written to a database or browser storage.

## Transport Selection

When the app starts, `realtime.ts` checks for the two public Supabase
environment variables.

- If both values are present, the app connects to the Supabase Realtime
  Broadcast topic `patient-intake:demo`.
- If either value is missing, the app uses the browser `BroadcastChannel` API.

Supabase supports updates across browsers and devices. The local fallback works
only between tabs or windows on the same origin and browser profile.

## Event Types

The synchronization layer uses three data events and one request event.

| Event | Purpose |
| --- | --- |
| `field:update` | Sends one changed field while the patient is typing |
| `status:update` | Sends active, inactive, or submitted patient status |
| `form:replace` | Sends a complete form snapshot and its status |
| `snapshot:request` | Asks the patient screen to resend its current snapshot |

Each data event includes an ISO timestamp. Zod validates event names, fields,
values, statuses, complete snapshots, and timestamps before the event is used.
Invalid messages are ignored.

## Update Flow

```text
Patient changes a field
        │
        ├── local form state updates
        ├── patient status becomes active
        └── field:update is published
                    │
                    ▼
          Realtime transport
       Supabase or BroadcastChannel
                    │
                    ▼
          StaffDashboard receives
        and validates the event
                    │
                    ├── older event? ignore it
                    └── current event? update the field
                                      and highlight it briefly
```

The patient becomes inactive after 25 seconds without editing. That status is
published separately so the dashboard can show activity even when no field
value changes.

## Submission Flow

Before submission, the full patient form is validated and normalized with the
Zod `patientIntakeSchema`.

1. A valid submission publishes a `form:replace` event with the complete form
   and `submitted` status.
2. The staff dashboard replaces its current snapshot with the submitted data.
3. The patient form clears its visible fields.
4. The submitted snapshot remains in transient memory so it can still be sent
   to a staff screen that connects shortly afterward.
5. Typing again starts a new active intake and replaces the previous snapshot.

An invalid form is not submitted or published as a completed record.

## Late Connection and Recovery

A staff dashboard may open after the patient has already entered data. To avoid
showing an empty dashboard:

1. The staff screen publishes `snapshot:request` after connecting.
2. The patient screen responds with its latest full `form:replace` snapshot.
3. The staff screen validates and displays the snapshot.

The realtime module also keeps the latest snapshot in module memory. This
supports same-tab navigation between routes until the page is fully reloaded.

## Ordering and Cleanup

The staff dashboard compares event timestamps and ignores an event when it is
older than the snapshot already displayed. This prevents delayed messages from
overwriting newer information.

Each screen removes its Supabase channel or closes its local
`BroadcastChannel` when the component unmounts. Highlight and inactivity timers
are also cleared.

## Privacy and Production Scope

The current public broadcast topic is appropriate for a frontend demonstration,
not for production healthcare data. A production version would require
authenticated private channels, patient-specific topics, authorization rules,
server-side validation, secure persistence, auditing, and a formal privacy and
security review.
