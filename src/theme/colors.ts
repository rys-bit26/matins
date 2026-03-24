export const colors = {
  // Core palette
  background: {
    primary: '#0a0e1a',    // Deep navy — main background
    secondary: '#111628',   // Slightly lighter navy — cards
    tertiary: '#1a1f35',    // Elevated surfaces
  },
  text: {
    primary: '#f5f0e8',     // Warm ivory — body text
    secondary: '#b8b0a0',   // Muted parchment — secondary text
    tertiary: '#7a7468',    // Faded — timestamps, labels
    rubric: '#c9a84c',      // Aged gold — rubrics/instructions
  },
  accent: {
    gold: '#c9a84c',        // Aged gold — primary accent
    goldMuted: '#a08638',   // Darker gold
    sage: '#7a8b6f',        // Muted sage — secondary accent
  },
  border: '#1e2340',        // Subtle borders
  borderLight: '#2a3055',   // Slightly visible borders

  // Functional
  response: '#f5f0e8',      // Congregational responses (bold)
  error: '#c45d5d',
  success: '#7a8b6f',
} as const;

// Liturgical season colors
export type LiturgicalColor = 'purple' | 'white' | 'green' | 'red' | 'blue' | 'rose' | 'black';

export const seasonColors: Record<LiturgicalColor, string> = {
  purple: '#7b5ea7',   // Advent, Lent
  white: '#e8dcc8',    // Easter, Christmas, feasts
  green: '#6b8f5e',    // Ordinary Time
  red: '#b84040',      // Pentecost, martyrs, Holy Week
  blue: '#4a6fa5',     // Advent (alternative tradition)
  rose: '#c48b8b',     // Gaudete/Laetare Sundays
  black: '#3a3a3a',    // Good Friday, funerals
} as const;

// Lighter tints for backgrounds with seasonal accent
export const seasonBackgrounds: Record<LiturgicalColor, string> = {
  purple: '#1a1228',
  white: '#1a1815',
  green: '#121a14',
  red: '#1a1214',
  blue: '#121620',
  rose: '#1a1518',
  black: '#0e0e0e',
} as const;
