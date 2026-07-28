# Phase 4: Real-time Synchronization

## Summary

Phase 4 connects the patient form and staff dashboard through a typed realtime
boundary. Supabase Realtime Broadcast is used when public configuration is
available. The browser BroadcastChannel API is used for same-browser local
demos when it is not.

## Transport

- Added and pinned `@supabase/supabase-js` at `2.110.9`.
- Added `lib/intake/supabase.ts` for publishable-key-only client creation.
- Added `lib/intake/realtime.ts` for channel setup, event parsing, publishing,
  subscription state, cleanup, and local fallback.
- Disabled Supabase Auth session persistence because this phase uses public,
  ephemeral Broadcast rather than authenticated records.

## Event Flow

The transport uses these application events:

- `field:update` sends one changed field.
- `status:update` sends active and inactive transitions.
- `form:replace` sends a complete current or submitted snapshot.
- `snapshot:request` is an internal recovery event.

Incoming payloads are checked at runtime before they reach UI state. Unknown
fields, statuses, malformed snapshots, and invalid timestamps are ignored.

## Patient Publishing

- Every field change publishes immediately.
- Status publishes only when it transitions.
- A 25-second idle timer publishes inactive status.
- Valid submission publishes a complete submitted snapshot.
- Editing after submission moves status back to active.
- Connection and snapshot requests publish a complete current form.

## Staff Subscription

- Incoming fields reconcile into the current snapshot.
- Full snapshots replace the dashboard state after reconnect or late join.
- Same-tab client navigation reads the latest snapshot from transient module
  memory after the patient route unmounts.
- Older events are ignored to prevent stale values replacing newer state.
- The latest field is highlighted briefly with a CSS color transition.
- Connection, transport, status, field count, and last update remain visible.

## Privacy and Limitations

Realtime messages are transient and are not written to a database, local
storage, analytics, or console output. The assessment uses one public topic,
so it is not a production healthcare security model. Production use requires
authenticated private channels, per-session topics, authorization, and a
privacy review.

The local BroadcastChannel fallback only works between pages using the same
origin, browser, and profile. The same-tab handoff is memory-only and clears on
page reload.
