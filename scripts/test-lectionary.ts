/**
 * Verify lectionary resolution and reference parsing.
 * Run with: npx tsx scripts/test-lectionary.ts
 */

import { resolveLectionary } from '../src/lib/office/lectionary';
import { parseReference, formatReference } from '../src/lib/bible/referenceParser';

// ─── Reference Parser Tests ─────────────────────────────────────────────────
console.log('=== Reference Parser ===');

const refTests = [
  'Isa 1:1–9',
  'Gen 1:1–2:3',
  'Matt 25:1–13',
  '1 Cor 4:1–16',
  'Ps 119:1–24',
  'Luke 20:1–8',
  '2 Pet 3:1–10',
  'Rev 22',
  '1 Thess 1:1–10',
  'Jer 16:10–21',
];

for (const ref of refTests) {
  const parsed = parseReference(ref);
  if (parsed) {
    console.log(`  ✓ "${ref}" → ${parsed.book} ${parsed.chapter}:${parsed.startVerse ?? 'all'}${parsed.endVerse ? `–${parsed.endVerse}` : ''}${parsed.endChapter ? ` to ${parsed.endChapter}:${parsed.endChapterVerse}` : ''} [${parsed.bookId}]`);
  } else {
    console.log(`  ✗ "${ref}" → FAILED TO PARSE`);
  }
}

// ─── Lectionary Resolution Tests ────────────────────────────────────────────
console.log('\n=== Lectionary Resolution ===');

const testDates: [Date, string][] = [
  [new Date(2026, 2, 24), 'Today (Tue, 5th week of Lent)'],
  [new Date(2025, 11, 7), 'Sun, 2nd week of Advent 2025'],
  [new Date(2026, 3, 5), 'Easter Day 2026'],
  [new Date(2026, 6, 14), 'Tue in Ordinary Time (July)'],
  [new Date(2026, 0, 6), 'Epiphany'],
  [new Date(2025, 11, 25), 'Christmas 2025'],
];

for (const [date, label] of testDates) {
  const readings = resolveLectionary(date);
  const hasReadings = readings.lessons.first || readings.lessons.second;
  console.log(`\n  ${hasReadings ? '✓' : '✗'} ${label} — ${date.toDateString()}`);
  console.log(`    Season: ${readings.liturgicalDay.season} | Year: ${readings.liturgicalDay.lectionaryYear}`);
  console.log(`    Psalms AM: ${readings.psalms.morning.join(', ') || 'none'}`);
  console.log(`    Psalms PM: ${readings.psalms.evening.join(', ') || 'none'}`);
  console.log(`    1st: ${readings.lessons.first || '—'}`);
  console.log(`    2nd: ${readings.lessons.second || '—'}`);
  console.log(`    Gospel: ${readings.lessons.gospel || '—'}`);
}
