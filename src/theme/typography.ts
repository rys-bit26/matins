import { TextStyle } from 'react-native';
import type { FontStyle } from '../stores/settingsStore';

// Font families
// Cormorant: elegant serif for prayer/body text (liturgical feel)
// System font (SF Pro / Roboto): clean sans-serif
export const fonts = {
  serif: {
    regular: 'Cormorant_400Regular',
    italic: 'Cormorant_400Regular_Italic',
    medium: 'Cormorant_500Medium',
    semiBold: 'Cormorant_600SemiBold',
    bold: 'Cormorant_700Bold',
  },
  sans: {
    regular: 'System',
  },
} as const;

// ─── Font-style-aware helpers ───────────────────────────────────────────────

/**
 * Returns the appropriate font family for reading content
 * based on the user's font style preference.
 */
export function getReadingFont(style: FontStyle, weight: 'regular' | 'italic' | 'medium' | 'semiBold' | 'bold' = 'regular'): string {
  if (style === 'sans-serif') return 'System';
  return fonts.serif[weight];
}

/**
 * Build a complete set of type styles for the given font preference.
 * Serif uses Cormorant; sans-serif uses System font throughout.
 */
export function getTypeStyles(fontStyle: FontStyle): Record<string, TextStyle> {
  const isSerif = fontStyle === 'serif';
  const reading = isSerif ? fonts.serif.regular : fonts.sans.regular;
  const readingBold = isSerif ? fonts.serif.bold : fonts.sans.regular;
  const readingItalic = isSerif ? fonts.serif.italic : fonts.sans.regular;
  const readingSemiBold = isSerif ? fonts.serif.semiBold : fonts.sans.regular;
  const readingMedium = isSerif ? fonts.serif.medium : fonts.sans.regular;

  // Sans-serif needs slightly smaller sizes and tighter line heights
  // since system fonts read larger than Cormorant at the same point size
  const sizeAdj = isSerif ? 0 : -2;
  const lhAdj = isSerif ? 0 : -2;

  return {
    // Prayer text — the primary reading experience
    prayer: {
      fontFamily: reading,
      fontSize: 20 + sizeAdj,
      lineHeight: 32 + lhAdj,
      letterSpacing: isSerif ? 0.2 : 0,
    },
    prayerBold: {
      fontFamily: readingBold,
      fontSize: 20 + sizeAdj,
      lineHeight: 32 + lhAdj,
      letterSpacing: isSerif ? 0.2 : 0,
      fontWeight: isSerif ? undefined : '700',
    },
    prayerItalic: {
      fontFamily: readingItalic,
      fontSize: 20 + sizeAdj,
      lineHeight: 32 + lhAdj,
      letterSpacing: isSerif ? 0.2 : 0,
      fontStyle: isSerif ? undefined : 'italic',
    },

    // Rubrics — instructions
    rubric: {
      fontFamily: readingItalic,
      fontSize: 16 + sizeAdj,
      lineHeight: 24 + lhAdj,
      letterSpacing: 0.1,
      fontStyle: isSerif ? undefined : 'italic',
    },

    // Scripture text
    scripture: {
      fontFamily: reading,
      fontSize: 19 + sizeAdj,
      lineHeight: 30 + lhAdj,
      letterSpacing: isSerif ? 0.15 : 0,
    },

    // Section headings within the office
    sectionHeading: {
      fontFamily: readingSemiBold,
      fontSize: 24 + sizeAdj,
      lineHeight: 32,
      letterSpacing: isSerif ? 0.5 : 0.2,
      fontWeight: isSerif ? undefined : '600',
    },

    // Screen titles
    screenTitle: {
      fontFamily: readingBold,
      fontSize: 28 + sizeAdj,
      lineHeight: 36,
      letterSpacing: isSerif ? 0.3 : 0,
      fontWeight: isSerif ? undefined : '700',
    },

    // UI text (always sans-serif regardless of preference)
    body: {
      fontFamily: fonts.sans.regular,
      fontSize: 16,
      lineHeight: 24,
    },
    bodySmall: {
      fontFamily: fonts.sans.regular,
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontFamily: fonts.sans.regular,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    label: {
      fontFamily: fonts.sans.regular,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
  };
}

// Default type styles (serif) — used as static fallback
export const typeStyles = getTypeStyles('serif');
