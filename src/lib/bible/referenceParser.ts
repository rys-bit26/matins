import { BibleReference } from './types';

/**
 * BCP/SBL abbreviation → full book name + API ID mapping.
 * Covers all abbreviations used in the Daily Office Lectionary.
 */
const BOOK_MAP: Record<string, { name: string; id: string }> = {
  // Old Testament
  'Gen': { name: 'Genesis', id: 'GEN' },
  'Ex': { name: 'Exodus', id: 'EXO' },
  'Exod': { name: 'Exodus', id: 'EXO' },
  'Lev': { name: 'Leviticus', id: 'LEV' },
  'Num': { name: 'Numbers', id: 'NUM' },
  'Deut': { name: 'Deuteronomy', id: 'DEU' },
  'Josh': { name: 'Joshua', id: 'JOS' },
  'Judg': { name: 'Judges', id: 'JDG' },
  'Ruth': { name: 'Ruth', id: 'RUT' },
  '1 Sam': { name: '1 Samuel', id: '1SA' },
  '2 Sam': { name: '2 Samuel', id: '2SA' },
  '1 Kings': { name: '1 Kings', id: '1KI' },
  '2 Kings': { name: '2 Kings', id: '2KI' },
  '1 Chr': { name: '1 Chronicles', id: '1CH' },
  '2 Chr': { name: '2 Chronicles', id: '2CH' },
  'Chron': { name: '1 Chronicles', id: '1CH' },
  'Ezra': { name: 'Ezra', id: 'EZR' },
  'Neh': { name: 'Nehemiah', id: 'NEH' },
  'Esth': { name: 'Esther', id: 'EST' },
  'Job': { name: 'Job', id: 'JOB' },
  'Ps': { name: 'Psalms', id: 'PSA' },
  'Psalm': { name: 'Psalms', id: 'PSA' },
  'Prov': { name: 'Proverbs', id: 'PRO' },
  'Eccles': { name: 'Ecclesiastes', id: 'ECC' },
  'Eccl': { name: 'Ecclesiastes', id: 'ECC' },
  'Song': { name: 'Song of Solomon', id: 'SNG' },
  'Isa': { name: 'Isaiah', id: 'ISA' },
  'Jer': { name: 'Jeremiah', id: 'JER' },
  'Lam': { name: 'Lamentations', id: 'LAM' },
  'Ezek': { name: 'Ezekiel', id: 'EZK' },
  'Dan': { name: 'Daniel', id: 'DAN' },
  'Hos': { name: 'Hosea', id: 'HOS' },
  'Joel': { name: 'Joel', id: 'JOL' },
  'Amos': { name: 'Amos', id: 'AMO' },
  'Obad': { name: 'Obadiah', id: 'OBA' },
  'Jonah': { name: 'Jonah', id: 'JON' },
  'Mic': { name: 'Micah', id: 'MIC' },
  'Nah': { name: 'Nahum', id: 'NAM' },
  'Hab': { name: 'Habakkuk', id: 'HAB' },
  'Zeph': { name: 'Zephaniah', id: 'ZEP' },
  'Hag': { name: 'Haggai', id: 'HAG' },
  'Zech': { name: 'Zechariah', id: 'ZEC' },
  'Mal': { name: 'Malachi', id: 'MAL' },

  // Apocrypha (used in some BCP readings)
  'Wisd': { name: 'Wisdom of Solomon', id: 'WIS' },
  'Wis': { name: 'Wisdom of Solomon', id: 'WIS' },
  'Sir': { name: 'Sirach', id: 'SIR' },
  'Ecclus': { name: 'Sirach', id: 'SIR' },
  'Bar': { name: 'Baruch', id: 'BAR' },
  'Tob': { name: 'Tobit', id: 'TOB' },
  'Jdt': { name: 'Judith', id: 'JDT' },
  '1 Macc': { name: '1 Maccabees', id: '1MA' },
  '2 Macc': { name: '2 Maccabees', id: '2MA' },

  // New Testament
  'Matt': { name: 'Matthew', id: 'MAT' },
  'Mark': { name: 'Mark', id: 'MRK' },
  'Luke': { name: 'Luke', id: 'LUK' },
  'John': { name: 'John', id: 'JHN' },
  'Acts': { name: 'Acts', id: 'ACT' },
  'Rom': { name: 'Romans', id: 'ROM' },
  '1 Cor': { name: '1 Corinthians', id: '1CO' },
  '2 Cor': { name: '2 Corinthians', id: '2CO' },
  'Gal': { name: 'Galatians', id: 'GAL' },
  'Eph': { name: 'Ephesians', id: 'EPH' },
  'Phil': { name: 'Philippians', id: 'PHP' },
  'Col': { name: 'Colossians', id: 'COL' },
  '1 Thess': { name: '1 Thessalonians', id: '1TH' },
  '2 Thess': { name: '2 Thessalonians', id: '2TH' },
  '1 Tim': { name: '1 Timothy', id: '1TI' },
  '2 Tim': { name: '2 Timothy', id: '2TI' },
  'Titus': { name: 'Titus', id: 'TIT' },
  'Philem': { name: 'Philemon', id: 'PHM' },
  'Phlm': { name: 'Philemon', id: 'PHM' },
  'Heb': { name: 'Hebrews', id: 'HEB' },
  'James': { name: 'James', id: 'JAS' },
  'Jas': { name: 'James', id: 'JAS' },
  '1 Pet': { name: '1 Peter', id: '1PE' },
  '2 Pet': { name: '2 Peter', id: '2PE' },
  '1 John': { name: '1 John', id: '1JN' },
  '2 John': { name: '2 John', id: '2JN' },
  '3 John': { name: '3 John', id: '3JN' },
  'Jude': { name: 'Jude', id: 'JUD' },
  'Rev': { name: 'Revelation', id: 'REV' },
};

// Build a sorted list of abbreviations (longest first) for regex matching
const ABBR_LIST = Object.keys(BOOK_MAP).sort((a, b) => b.length - a.length);
const ABBR_PATTERN = ABBR_LIST.map((a) => a.replace(/\s/g, '\\s')).join('|');

/**
 * Parse a BCP-style scripture reference into a structured BibleReference.
 *
 * Handles formats like:
 *   "Isa 1:1–9"
 *   "Gen 1:1–2:3"  (multi-chapter)
 *   "Ps 119:1–24"
 *   "Matt 25:1–13"
 *   "1 Cor 4:1–16"
 *   "Luke 20:1–8"
 *   "Rev 22"  (whole chapter)
 *
 * Uses en-dash (–) or hyphen (-) as range separator.
 */
export function parseReference(raw: string): BibleReference | null {
  if (!raw || !raw.trim()) return null;

  const cleaned = raw.trim();

  // Match: book abbreviation + chapter:verse-range
  // The en-dash (–) is common in BCP references
  const regex = new RegExp(
    `^(${ABBR_PATTERN})\\s+(\\d+)(?::(\\d+))?(?:[–\\-](\\d+)(?::(\\d+))?)?`,
    'u'
  );

  const match = cleaned.match(regex);
  if (!match) return null;

  const [, bookAbbr, chapterStr, startVerseStr, endPartStr, endVerseStr] = match;

  const bookInfo = findBook(bookAbbr);
  if (!bookInfo) return null;

  const chapter = parseInt(chapterStr, 10);
  const startVerse = startVerseStr ? parseInt(startVerseStr, 10) : undefined;

  let endChapter: number | undefined;
  let endVerse: number | undefined;
  let endChapterVerse: number | undefined;

  if (endPartStr) {
    if (endVerseStr) {
      // Multi-chapter range: "Gen 1:1–2:3"
      endChapter = parseInt(endPartStr, 10);
      endChapterVerse = parseInt(endVerseStr, 10);
    } else if (startVerse !== undefined) {
      // Same-chapter verse range: "Isa 1:1–9"
      endVerse = parseInt(endPartStr, 10);
    } else {
      // Chapter range without verses: "Ps 1–3" (unlikely in DOL but handle it)
      endChapter = parseInt(endPartStr, 10);
    }
  }

  return {
    book: bookInfo.name,
    bookAbbr: bookAbbr.trim(),
    bookId: bookInfo.id,
    chapter,
    startVerse,
    endVerse,
    endChapter,
    endChapterVerse,
    raw: cleaned,
  };
}

function findBook(abbr: string): { name: string; id: string } | null {
  // Direct lookup
  const normalized = abbr.trim();
  if (BOOK_MAP[normalized]) return BOOK_MAP[normalized];

  // Case-insensitive search
  const lower = normalized.toLowerCase();
  for (const [key, value] of Object.entries(BOOK_MAP)) {
    if (key.toLowerCase() === lower) return value;
  }

  return null;
}

/**
 * Format a BibleReference back into a human-readable string.
 */
export function formatReference(ref: BibleReference): string {
  let result = `${ref.book} ${ref.chapter}`;
  if (ref.startVerse !== undefined) {
    result += `:${ref.startVerse}`;
    if (ref.endChapter !== undefined) {
      result += `–${ref.endChapter}`;
      if (ref.endChapterVerse !== undefined) {
        result += `:${ref.endChapterVerse}`;
      }
    } else if (ref.endVerse !== undefined) {
      result += `–${ref.endVerse}`;
    }
  }
  return result;
}
