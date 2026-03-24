import { BibleReference, BiblePassage, BibleVerse, Translation } from './types';

/**
 * bible-api.com client for WEB and KJV translations.
 * Free, no authentication required. Rate-limited but generous.
 *
 * Endpoint format: https://bible-api.com/{reference}?translation={web|kjv}
 */

const BASE_URL = 'https://bible-api.com';

// Map our translation IDs to bible-api.com translation codes
const API_TRANSLATION_MAP: Record<string, string> = {
  web: 'web',
  kjv: 'kjv',
};

// Map our book IDs to bible-api.com book names
const BOOK_NAME_MAP: Record<string, string> = {
  GEN: 'genesis', EXO: 'exodus', LEV: 'leviticus', NUM: 'numbers',
  DEU: 'deuteronomy', JOS: 'joshua', JDG: 'judges', RUT: 'ruth',
  '1SA': '1samuel', '2SA': '2samuel', '1KI': '1kings', '2KI': '2kings',
  '1CH': '1chronicles', '2CH': '2chronicles', EZR: 'ezra', NEH: 'nehemiah',
  EST: 'esther', JOB: 'job', PSA: 'psalms', PRO: 'proverbs',
  ECC: 'ecclesiastes', SNG: 'songofsolomon', ISA: 'isaiah', JER: 'jeremiah',
  LAM: 'lamentations', EZK: 'ezekiel', DAN: 'daniel', HOS: 'hosea',
  JOL: 'joel', AMO: 'amos', OBA: 'obadiah', JON: 'jonah',
  MIC: 'micah', NAM: 'nahum', HAB: 'habakkuk', ZEP: 'zephaniah',
  HAG: 'haggai', ZEC: 'zechariah', MAL: 'malachi',
  MAT: 'matthew', MRK: 'mark', LUK: 'luke', JHN: 'john',
  ACT: 'acts', ROM: 'romans', '1CO': '1corinthians', '2CO': '2corinthians',
  GAL: 'galatians', EPH: 'ephesians', PHP: 'philippians', COL: 'colossians',
  '1TH': '1thessalonians', '2TH': '2thessalonians', '1TI': '1timothy',
  '2TI': '2timothy', TIT: 'titus', PHM: 'philemon', HEB: 'hebrews',
  JAS: 'james', '1PE': '1peter', '2PE': '2peter', '1JN': '1john',
  '2JN': '2john', '3JN': '3john', JUD: 'jude', REV: 'revelation',
};

interface BibleApiResponse {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
}

/**
 * Fetch a Bible passage from bible-api.com.
 */
export async function fetchPassage(
  ref: BibleReference,
  translation: 'web' | 'kjv'
): Promise<BiblePassage> {
  const bookName = BOOK_NAME_MAP[ref.bookId];
  if (!bookName) {
    throw new Error(`Unknown book ID: ${ref.bookId}`);
  }

  // Build the reference string for the API
  let refStr = `${bookName} ${ref.chapter}`;
  if (ref.startVerse !== undefined) {
    refStr += `:${ref.startVerse}`;
    if (ref.endChapter !== undefined) {
      refStr += `-${ref.endChapter}`;
      if (ref.endChapterVerse !== undefined) {
        refStr += `:${ref.endChapterVerse}`;
      }
    } else if (ref.endVerse !== undefined) {
      refStr += `-${ref.endVerse}`;
    }
  }

  const translationCode = API_TRANSLATION_MAP[translation];
  const url = `${BASE_URL}/${encodeURIComponent(refStr)}?translation=${translationCode}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Bible API error: ${response.status} for ${refStr}`);
  }

  const data: BibleApiResponse = await response.json();

  const verses: BibleVerse[] = data.verses.map((v) => ({
    chapter: v.chapter,
    verse: v.verse,
    text: v.text.trim(),
  }));

  return {
    reference: ref,
    translation,
    verses,
    text: data.text.trim(),
  };
}
