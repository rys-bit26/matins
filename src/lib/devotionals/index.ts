import { Season } from '../calendar/types';
import indexData from '../../../data/devotionals/index.json';

interface DevotionalMeta {
  slug: string;
  title: string;
  author: string;
  source: string;
  circa: string;
  tags: string[];
  seasons: string[];
}

const devotionals = indexData as DevotionalMeta[];

/**
 * Select a devotional for a given date, preferring seasonal matches.
 * Uses a deterministic rotation so the same date always yields the same reading.
 */
export function selectDevotional(date: Date, season: Season): DevotionalMeta {
  // First, try to find seasonally appropriate devotionals
  const seasonalMatches = devotionals.filter((d) =>
    d.seasons.includes(season) || d.seasons.includes('ordinary-time')
  );

  const pool = seasonalMatches.length > 0 ? seasonalMatches : devotionals;

  // Deterministic selection based on day of year
  const dayOfYear = getDayOfYear(date);
  const index = dayOfYear % pool.length;

  return pool[index];
}

/**
 * Get all devotionals, optionally filtered by season.
 */
export function getAllDevotionals(season?: Season): DevotionalMeta[] {
  if (!season) return devotionals;
  return devotionals.filter((d) => d.seasons.includes(season));
}

/**
 * Get all unique authors.
 */
export function getAuthors(): string[] {
  return [...new Set(devotionals.map((d) => d.author))];
}

/**
 * Get devotionals by author.
 */
export function getByAuthor(author: string): DevotionalMeta[] {
  return devotionals.filter((d) => d.author === author);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}
