/**
 * Quick verification script for the liturgical calendar engine.
 * Run with: npx tsx scripts/test-calendar.ts
 */

import { computeEaster } from '../src/lib/calendar/easter';
import { getLiturgicalDay, getLectionaryYear } from '../src/lib/calendar/seasons';

// ─── Easter date verification ───────────────────────────────────────────────
// Known Easter dates from astronomical tables
const knownEasters: [number, number, number][] = [
  [2024, 2, 31],  // March 31, 2024
  [2025, 3, 20],  // April 20, 2025
  [2026, 3, 5],   // April 5, 2026
  [2027, 2, 28],  // March 28, 2027
  [2028, 3, 16],  // April 16, 2028
  [2029, 3, 1],   // April 1, 2029
  [2030, 3, 21],  // April 21, 2030
];

console.log('=== Easter Date Verification ===');
let allPass = true;
for (const [year, month, day] of knownEasters) {
  const computed = computeEaster(year);
  const expected = new Date(year, month, day);
  const pass = computed.getTime() === expected.getTime();
  if (!pass) allPass = false;
  console.log(
    `${year}: ${pass ? '✓' : '✗'} ` +
    `Expected ${expected.toDateString()}, got ${computed.toDateString()}`
  );
}
console.log(allPass ? '\nAll Easter dates correct!' : '\nSome Easter dates FAILED!');

// ─── Season verification for specific dates ─────────────────────────────────
console.log('\n=== Season Verification ===');

const testDates: [Date, string, string][] = [
  // [date, expected season, expected title fragment]
  [new Date(2026, 2, 23), 'lent', 'Lent'],              // March 23, 2026 (today per system)
  [new Date(2026, 11, 25), 'christmas', 'Christmas'],     // Christmas 2026
  [new Date(2026, 3, 5), 'easter', 'Easter'],             // Easter 2026
  [new Date(2026, 1, 18), 'lent', 'Ash Wednesday'],       // Ash Wed 2026 (Easter Apr 5 - 46 = Feb 18)
  [new Date(2026, 6, 14), 'ordinary-time', 'Pentecost'],  // Random Tuesday in July
  [new Date(2025, 11, 1), 'advent', 'Advent'],             // Dec 1, 2025 (Advent)
  [new Date(2026, 3, 3), 'holy-week', 'Good Friday'],     // Good Friday 2026
  [new Date(2026, 4, 24), 'easter', 'Ascension'],         // Ascension 2026 (Easter + 39)
  [new Date(2026, 4, 14), 'easter', 'Easter'],             // Ascension Thu: May 14? Let me check
];

for (const [date, expectedSeason, titleFragment] of testDates) {
  const day = getLiturgicalDay(date);
  const seasonMatch = day.season === expectedSeason;
  const titleMatch = day.title.includes(titleFragment);
  console.log(
    `${date.toDateString()}: ${seasonMatch && titleMatch ? '✓' : '✗'} ` +
    `Season: ${day.season} (expected: ${expectedSeason}) | ` +
    `Title: "${day.title}" | Color: ${day.color} | Year: ${day.lectionaryYear}`
  );
}

// ─── Lectionary Year verification ───────────────────────────────────────────
console.log('\n=== Lectionary Year Verification ===');
// Advent 2025 starts Year One (2026 is odd church year? Actually:
// Year One starts Advent preceding odd years. So Advent 2024 → Year One for 2025.
// Advent 2025 → Year Two for 2026.
const lyTests: [Date, string][] = [
  [new Date(2025, 0, 15), 'Year One'],   // Jan 2025 - church year started Advent 2024 → 2025 is odd → Year One
  [new Date(2025, 11, 15), 'Year Two'],  // Dec 2025 - Advent 2025 started → church year 2026 is even → Year Two
  [new Date(2026, 2, 23), 'Year Two'],   // March 2026 - still in church year 2026 → Year Two
];

for (const [date, expected] of lyTests) {
  const year = getLectionaryYear(date);
  const pass = year === expected;
  console.log(
    `${date.toDateString()}: ${pass ? '✓' : '✗'} ` +
    `Got: ${year}, Expected: ${expected}`
  );
}

// ─── Full liturgical day for today ──────────────────────────────────────────
console.log('\n=== Today\'s Liturgical Day ===');
const today = getLiturgicalDay(new Date());
console.log(`Date: ${today.date.toDateString()}`);
console.log(`Season: ${today.season}`);
console.log(`Title: ${today.title}`);
console.log(`Color: ${today.color}`);
console.log(`Week: ${today.week}`);
console.log(`Day: ${today.dayOfWeek}`);
console.log(`Lectionary Year: ${today.lectionaryYear}`);
if (today.holyDays.length > 0) {
  console.log(`Holy Days: ${today.holyDays.map(h => h.name).join(', ')}`);
}
