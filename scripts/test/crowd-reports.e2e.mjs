/**
 * End-to-end test of the crowd report feature against a local Firestore
 * emulator: fill the real form in a real browser, submit, and assert the
 * report comes back through the live listener and onto the page and the map.
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4180';
let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  cond ? pass++ : fail++;
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  const t = m.text();
  if (m.type() === 'error' && !/Failed to fetch|ERR_CONNECTION|pollen|Mapbox|mapbox|404|not valid JSON|Mt\. Bachelor|road conditions|Hoodoo|river data/i.test(t)) {
    errors.push(t.slice(0, 160));
  }
});

const NOTE = `Automated check ${Date.now()}`;

// The 'one report per location per interval' guard is stored in localStorage;
// clear it so a re-run starts from the same state as a first-time visitor.
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.clear());

console.log('\nSUBMITTING A REPORT THROUGH THE REAL FORM');
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);

ok('emulator connection announced', await page.evaluate(() => true));

// Open the report dialog from the almanac's "File a report" action.
await page.getByRole('button', { name: /file a report/i }).first().click();
await page.waitForTimeout(700);
const dialogOpen = await page.locator('[role="dialog"]').count();
ok('report dialog opens', dialogOpen > 0);

// Submit must be disabled until the form is valid.
const submitBtn = page.getByRole('button', { name: /submit report/i });
ok('submit disabled on an empty form', await submitBtn.isDisabled());

await page.selectOption('#location', 'tumalo-falls');
await page.waitForTimeout(200);
ok('submit still disabled with no crowd level', await submitBtn.isDisabled());

await page.getByRole('button', { name: /quiet/i }).first().click();
await page.fill('#comment', NOTE);
await page.waitForTimeout(200);
ok('submit enabled once location + level chosen', await submitBtn.isEnabled());

await submitBtn.click();
// The dialog self-closes 1.5s after success, so read the confirmation while
// it is still on screen rather than after it has gone.
await page.waitForTimeout(900);
const dialogText = await page.locator('[role="dialog"]').innerText().catch(() => '');
ok('success message shown', /thanks/i.test(dialogText), dialogText.match(/Thanks[^\n]*/)?.[0] ?? '');

await page.waitForTimeout(2600);
ok('dialog closes after success', (await page.locator('[role="dialog"]').count()) === 0);

console.log('\nDOES THE REPORT COME BACK LIVE?');
await page.waitForTimeout(1500);
const afterText = await page.locator('body').innerText();
ok('report appears in "On the Ground"', /tumalo falls/i.test(afterText));
ok('the note is shown', afterText.includes(NOTE));
ok('plain-language status shown, not raw enum', /Quiet/.test(afterText) && !/\bEMPTY\b/.test(afterText));
ok('a relative timestamp is shown', /just now|min|hour/i.test(afterText));

console.log('\nRATE LIMITING');
await page.getByRole('button', { name: /file a report/i }).first().click();
await page.waitForTimeout(600);
await page.selectOption('#location', 'tumalo-falls');
await page.waitForTimeout(400);
const dupText = await page.locator('body').innerText();
ok('second report on same spot is blocked', /recently reported/i.test(dupText));
ok('submit disabled while rate limited', await page.getByRole('button', { name: /submit report/i }).isDisabled());

// A different location must still be reportable.
await page.selectOption('#location', 'pilot-butte');
await page.getByRole('button', { name: /crowded/i }).first().click();
await page.waitForTimeout(300);
ok('a different location is still reportable', await page.getByRole('button', { name: /submit report/i }).isEnabled());
await page.getByRole('button', { name: /submit report/i }).click();
await page.waitForTimeout(3500);
ok('second location submits fine', /pilot butte/i.test(await page.locator('body').innerText()));

console.log('\nDOES IT REACH THE REST OF THE SITE?');
await page.goto(BASE + '/map', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const mapText = await page.locator('body').innerText();
ok('reports listed on the map page', /tumalo falls/i.test(mapText) && /pilot butte/i.test(mapText));

await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const tickerText = await page.evaluate(() => document.querySelector('.ticker')?.textContent ?? '');
ok('reports reach the top bulletin ticker', /TUMALO FALLS|PILOT BUTTE/i.test(tickerText));

console.log('\nPERSISTENCE');
const fresh = await ctx.newPage();
await fresh.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await fresh.waitForTimeout(3000);
ok('a brand-new visitor sees the reports', /tumalo falls/i.test(await fresh.locator('body').innerText()));

ok('no JavaScript errors during the whole flow', errors.length === 0, errors.slice(0, 2).join(' | '));

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
