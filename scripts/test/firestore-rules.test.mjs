/**
 * Exercises firestore.rules against the emulator: does a well-formed crowd
 * report get accepted, and do malformed / abusive ones get rejected?
 */
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { collection, addDoc, getDocs, serverTimestamp, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'node:fs';

const env = await initializeTestEnvironment({
  projectId: 'bendy-test',
  firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('firestore.rules', 'utf8') },
});

const db = env.unauthenticatedContext().firestore();
const col = () => collection(db, 'crowdReports');
const future = () => Timestamp.fromDate(new Date(Date.now() + 4 * 60 * 60 * 1000));

const valid = () => ({
  locationId: 'tumalo-falls',
  locationName: 'Tumalo Falls',
  crowdLevel: 'moderate',
  timestamp: serverTimestamp(),
  expiresAt: future(),
});

let pass = 0, fail = 0;
async function check(name, promise, shouldSucceed) {
  try {
    await (shouldSucceed ? assertSucceeds(promise) : assertFails(promise));
    console.log(`  PASS  ${name}`);
    pass++;
  } catch (e) {
    console.log(`  FAIL  ${name}  — ${String(e).split('\n')[0].slice(0, 110)}`);
    fail++;
  }
}

console.log('\nSHOULD BE ACCEPTED');
await check('a plain valid report', addDoc(col(), valid()), true);
await check('valid report with a note', addDoc(col(), { ...valid(), comment: 'Lot about half full.' }), true);
for (const lvl of ['empty', 'moderate', 'busy', 'packed'])
  await check(`crowd level "${lvl}"`, addDoc(col(), { ...valid(), crowdLevel: lvl }), true);
await check('anyone can read reports', getDocs(col()), true);

console.log('\nSHOULD BE REJECTED');
await check('unknown location id', addDoc(col(), { ...valid(), locationId: 'my-back-garden' }), false);
await check('invalid crowd level', addDoc(col(), { ...valid(), crowdLevel: 'apocalyptic' }), false);
await check('note over 150 chars', addDoc(col(), { ...valid(), comment: 'x'.repeat(151) }), false);
await check('location name over 100 chars', addDoc(col(), { ...valid(), locationName: 'y'.repeat(101) }), false);
await check('empty location name', addDoc(col(), { ...valid(), locationName: '' }), false);
await check('client-forged timestamp', addDoc(col(), { ...valid(), timestamp: Timestamp.fromDate(new Date()) }), false);
await check('already-expired report', addDoc(col(), { ...valid(), expiresAt: Timestamp.fromDate(new Date(Date.now() - 1000)) }), false);
await check('extra smuggled field', addDoc(col(), { ...valid(), isAdmin: true }), false);
await check('missing required field', addDoc(col(), { locationId: 'tumalo-falls', crowdLevel: 'empty' }), false);
await check('writing to another collection', addDoc(collection(db, 'secrets'), { a: 1 }), false);

// Tamper-resistance: seed a doc with admin rights, then try to change it as a visitor.
let seededId;
await env.withSecurityRulesDisabled(async (ctx) => {
  const ref = await addDoc(collection(ctx.firestore(), 'crowdReports'), {
    locationId: 'pilot-butte', locationName: 'Pilot Butte', crowdLevel: 'packed',
    timestamp: Timestamp.fromDate(new Date()), expiresAt: future(),
  });
  seededId = ref.id;
});
await check('editing an existing report', updateDoc(doc(db, 'crowdReports', seededId), { crowdLevel: 'empty' }), false);
await check('deleting an existing report', deleteDoc(doc(db, 'crowdReports', seededId)), false);

await env.cleanup();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
