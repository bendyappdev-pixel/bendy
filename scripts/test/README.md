# Crowd report tests

These exercise the crowd-report feature end to end against a **local Firestore
emulator**. Nothing here touches the production database.

## Running them

Three terminals' worth of work, in order:

```bash
# 1. Start the emulator (loads the real firestore.rules)
npx firebase-tools@15 emulators:start --only firestore \
  --project bendy-test --config scripts/test/firebase.emulator.json

# 2. Security rules — does Firestore accept good reports and reject bad ones?
npm run test:rules

# 3. The full journey — build the app pointed at the emulator, serve it,
#    then drive the real form in a real browser.
npm run test:crowd
```

`test:crowd` builds into `dist-emu/` with `VITE_FIRESTORE_EMULATOR` set, which
is what makes `src/config/firebase.ts` call `connectFirestoreEmulator` instead
of talking to production. That variable is unset in every real build.

## What each covers

**`firestore-rules.test.mjs`** — 19 cases against the live rules: every valid
crowd level is accepted; unknown location ids, invalid levels, over-long notes
and location names, client-forged timestamps, already-expired reports,
smuggled extra fields, writes to other collections, and edits or deletes of
existing reports are all rejected.

**`crowd-reports.e2e.mjs`** — the real UI: the dialog opens, submit stays
disabled until the form is valid, a report submits, the confirmation shows, the
dialog closes, the report comes back through the live listener into "On the
Ground" with its note and a relative timestamp, the one-report-per-location
rate limit blocks a repeat while still allowing a different location, and the
report reaches the map page, the bulletin ticker, and a brand-new visitor.

## Two things these cannot tell you

Both need the real project and have to be checked in the Firebase console:

1. **App Check.** `src/config/firebase.ts` initialises App Check from
   `VITE_RECAPTCHA_SITE_KEY`. If that variable is missing from a deployed
   build the console logs a warning and App Check is skipped — and if App Check
   is *enforced* on the project, Firestore will reject every report. Confirm
   the variable is set wherever the site is built.
2. **Deployed indexes.** The listener query needs the composite index on
   `expiresAt DESC, timestamp DESC`. It is declared in
   `firestore.indexes.json`, but a declaration is not a deployment — the
   emulator does not enforce indexes, so only production can confirm it. Run
   `firebase deploy --only firestore:indexes` if in doubt.
