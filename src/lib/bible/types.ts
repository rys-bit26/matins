export type Translation = 'bsb' | 'web' | 'kjv';

export interface BibleReference {
  book: string;       // Full book name ("Genesis", "Isaiah", etc.)
  bookAbbr: string;   // Standard abbreviation ("Gen", "Isa")
  bookId: string;     // API-friendly ID ("GEN", "ISA")
  chapter: number;
  startVerse?: number;
  endVerse?: number;
  endChapter?: number;  // For multi-chapter ranges (e.g., "Gen 1:1-2:3")
  endChapterVerse?: number;
  raw: string;         // Original reference string
}

export interface BibleVerse {
  chapter: number;
  verse: number;
  text: string;
}

export interface BiblePassage {
  reference: BibleReference;
  translation: Translation;
  verses: BibleVerse[];
  text: string;          // Full concatenated text
}
