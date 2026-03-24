import { getLiturgicalDay } from '../calendar/seasons';
import { LiturgicalDay, Season } from '../calendar/types';
import { resolveLectionary } from './lectionary';
import {
  AssembledOffice,
  AssembledSection,
  AssembledElement,
  OfficeType,
  DailyReadings,
} from './types';

import openingSentencesData from '../../../data/bcp/opening-sentences.json';
import prayersData from '../../../data/bcp/prayers.json';
import canticlesData from '../../../data/bcp/canticles.json';
import collectsData from '../../../data/bcp/collects-daily.json';

const openingSentences = openingSentencesData as Record<string, any[]>;
const prayers = prayersData as Record<string, any>;
const canticles = canticlesData as Record<string, any>;
const dailyCollects = collectsData as Record<string, any>;

// ─── Main Assembly Function ─────────────────────────────────────────────────

export function assembleOffice(
  date: Date,
  type: OfficeType,
  settings: { showRubrics: boolean }
): AssembledOffice {
  const liturgicalDay = getLiturgicalDay(date);
  const readings = resolveLectionary(date);

  switch (type) {
    case 'morning':
      return assembleMorningPrayer(date, liturgicalDay, readings, settings);
    case 'evening':
      return assembleEveningPrayer(date, liturgicalDay, readings, settings);
    case 'compline':
      return assembleCompline(date, liturgicalDay, settings);
    default:
      return assembleMorningPrayer(date, liturgicalDay, readings, settings);
  }
}

// ─── Morning Prayer (Rite Two) ──────────────────────────────────────────────

function assembleMorningPrayer(
  date: Date,
  litDay: LiturgicalDay,
  readings: DailyReadings,
  settings: { showRubrics: boolean }
): AssembledOffice {
  const sections: AssembledSection[] = [];
  const { showRubrics } = settings;
  const season = litDay.season;

  // 1. Opening Sentence
  sections.push(buildOpeningSentence(season, showRubrics));

  // 2. Confession of Sin
  sections.push(buildConfession(showRubrics));

  // 3. The Invitatory and Psalter
  sections.push(buildInvitatory(season, showRubrics));

  // 4. The Psalms
  if (readings.psalms.morning.length > 0) {
    sections.push(buildPsalmsSection(readings.psalms.morning, 'morning'));
  }

  // 5. The Lessons
  if (readings.lessons.first) {
    sections.push(buildLessonSection('The First Lesson', readings.lessons.first));
  }

  // 6. Canticle after first lesson (Benedictus / Te Deum)
  sections.push(buildCanticleSection('after-ot', litDay));

  // 7. Second Lesson
  if (readings.lessons.second) {
    sections.push(buildLessonSection('The Second Lesson', readings.lessons.second));
  }

  // 8. Gospel
  if (readings.lessons.gospel) {
    sections.push(buildLessonSection('The Gospel', readings.lessons.gospel));
  }

  // 9. The Apostles' Creed
  sections.push(buildCreed(showRubrics));

  // 10. The Prayers
  sections.push(buildPrayersSection(litDay, showRubrics));

  // 11. The Collect of the Day
  sections.push(buildDailyCollect(litDay));

  // 12. General Thanksgiving
  sections.push(buildGeneralThanksgiving(showRubrics));

  // 13. Dismissal
  sections.push(buildDismissal(season));

  return {
    type: 'morning',
    date,
    liturgicalDay: litDay,
    sections,
  };
}

// ─── Evening Prayer (simplified for now) ────────────────────────────────────

function assembleEveningPrayer(
  date: Date,
  litDay: LiturgicalDay,
  readings: DailyReadings,
  settings: { showRubrics: boolean }
): AssembledOffice {
  const sections: AssembledSection[] = [];
  const { showRubrics } = settings;
  const season = litDay.season;

  sections.push(buildOpeningSentence(season, showRubrics));
  sections.push(buildConfession(showRubrics));

  // Invitatory for Evening Prayer
  sections.push({
    id: 'invitatory',
    title: 'The Invitatory',
    elements: [
      { type: 'text', content: prayers.invitatory.versicle, speaker: 'officiant' },
      { type: 'response', content: prayers.invitatory.response, speaker: 'people' },
    ],
  });

  // Evening Psalms
  if (readings.psalms.evening.length > 0) {
    sections.push(buildPsalmsSection(readings.psalms.evening, 'evening'));
  }

  // Lessons (same readings, evening uses them too)
  if (readings.lessons.first) {
    sections.push(buildLessonSection('The First Lesson', readings.lessons.first));
  }
  if (readings.lessons.second) {
    sections.push(buildLessonSection('The Second Lesson', readings.lessons.second));
  }
  if (readings.lessons.gospel) {
    sections.push(buildLessonSection('The Gospel', readings.lessons.gospel));
  }

  sections.push(buildCreed(showRubrics));
  sections.push(buildPrayersSection(litDay, showRubrics));
  sections.push(buildDailyCollect(litDay));
  sections.push(buildGeneralThanksgiving(showRubrics));
  sections.push(buildDismissal(season));

  return {
    type: 'evening',
    date,
    liturgicalDay: litDay,
    sections,
  };
}

// ─── Compline ───────────────────────────────────────────────────────────────

function assembleCompline(
  date: Date,
  litDay: LiturgicalDay,
  settings: { showRubrics: boolean }
): AssembledOffice {
  const sections: AssembledSection[] = [];

  sections.push({
    id: 'opening',
    title: 'The Opening',
    elements: [
      { type: 'text', content: 'The Lord Almighty grant us a peaceful night and a perfect end.', speaker: 'officiant' },
      { type: 'response', content: 'Amen.', speaker: 'people' },
    ],
  });

  sections.push({
    id: 'confession',
    title: 'Confession',
    elements: [
      { type: 'text', content: prayers.confession.invitation, speaker: 'officiant' },
      { type: 'text', content: prayers.confession.text, speaker: 'all' },
    ],
  });

  sections.push({
    id: 'psalm',
    title: 'The Psalm',
    elements: [
      { type: 'rubric', content: 'One or more of the following Psalms are sung or said: Psalm 4, 31:1-5, 91, 134' },
      { type: 'psalm', content: 'Psalm 134', reference: 'Ps 134' },
    ],
  });

  sections.push({
    id: 'reading',
    title: 'The Reading',
    elements: [
      { type: 'rubric', content: 'One of the following, or some other suitable passage of Scripture, is read' },
      { type: 'scripture', content: 'You, O Lord, are in the midst of us, and we are called by your Name: Do not forsake us, O Lord our God.', reference: 'Jeremiah 14:9,22' },
      { type: 'response', content: 'Thanks be to God.', speaker: 'people' },
    ],
  });

  sections.push({
    id: 'prayers',
    title: 'The Prayers',
    elements: [
      { type: 'text', content: prayers.lordsPrayer.text, speaker: 'all' },
      { type: 'text', content: 'Lord, hear our prayer;', speaker: 'officiant' },
      { type: 'response', content: 'And let our cry come to you.', speaker: 'people' },
      { type: 'text', content: 'Let us pray.', speaker: 'officiant' },
      { type: 'prayer', content: 'Visit this place, O Lord, and drive far from it all snares of the enemy; let your holy angels dwell with us to preserve us in peace; and let your blessing be upon us all, through Jesus Christ our Lord. Amen.' },
    ],
  });

  sections.push({
    id: 'nuncDimittis',
    title: 'Nunc Dimittis',
    elements: [
      { type: 'rubric', content: 'The Song of Simeon' },
      { type: 'canticle', content: 'Lord, you now have set your servant free\nto go in peace as you have promised;\nFor these eyes of mine have seen the Savior,\nwhom you have prepared for all the world to see:\nA Light to enlighten the nations,\nand the glory of your people Israel.', reference: 'Luke 2:29-32', whyTopic: 'what-is-the-nunc-dimittis' },
      { type: 'text', content: prayers.gloriaPatri.text, speaker: 'all' },
    ],
  });

  sections.push({
    id: 'dismissal',
    title: 'Dismissal',
    elements: [
      { type: 'text', content: 'Guide us waking, O Lord, and guard us sleeping; that awake we may watch with Christ, and asleep we may rest in peace.', speaker: 'officiant' },
      { type: 'text', content: prayers.grace.text, speaker: 'officiant' },
    ],
  });

  return {
    type: 'compline',
    date,
    liturgicalDay: litDay,
    sections,
  };
}

// ─── Section Builders ───────────────────────────────────────────────────────

function buildOpeningSentence(season: Season, showRubrics: boolean): AssembledSection {
  const seasonKey = season as string;
  const sentences = openingSentences[seasonKey] ?? openingSentences['ordinary-time'] ?? openingSentences['default'];
  // Pick a deterministic sentence based on the day
  const sentence = sentences[new Date().getDate() % sentences.length];

  const elements: AssembledElement[] = [];
  if (showRubrics) {
    elements.push({ type: 'rubric', content: 'The Officiant begins the service with one or more of these sentences of Scripture.' });
  }
  elements.push({ type: 'text', content: sentence.text, speaker: 'officiant' });
  if (sentence.response) {
    elements.push({ type: 'response', content: sentence.response, speaker: 'people' });
  }
  if (sentence.source) {
    elements.push({ type: 'rubric', content: sentence.source });
  }

  return { id: 'opening-sentence', title: 'Opening Sentence', elements };
}

function buildConfession(showRubrics: boolean): AssembledSection {
  const conf = prayers.confession;
  const elements: AssembledElement[] = [];

  if (showRubrics) {
    elements.push({ type: 'rubric', content: conf.rubric });
  }
  elements.push({ type: 'text', content: conf.invitation, speaker: 'officiant' });
  if (showRubrics) {
    elements.push({ type: 'rubric', content: conf.rubricSilence });
  }
  elements.push({ type: 'text', content: conf.text, speaker: 'all', whyTopic: conf.whyTopic });
  elements.push({ type: 'text', content: conf.absolution, speaker: 'officiant' });

  return { id: 'confession', title: 'Confession of Sin', elements };
}

function buildInvitatory(season: Season, showRubrics: boolean): AssembledSection {
  const inv = prayers.invitatory;
  const elements: AssembledElement[] = [];

  elements.push({ type: 'text', content: inv.versicle, speaker: 'officiant', whyTopic: inv.whyTopic });
  elements.push({ type: 'response', content: inv.response, speaker: 'people' });

  // Select invitatory psalm/canticle
  if (season === 'easter') {
    const pascha = canticles.christOurPassover;
    elements.push({ type: 'rubric', content: `${pascha.name}  —  ${pascha.english}` });
    elements.push({ type: 'canticle', content: pascha.text, reference: pascha.source });
  } else {
    const venite = canticles.venite;
    elements.push({ type: 'rubric', content: `${venite.name}  —  ${venite.english}` });
    elements.push({ type: 'canticle', content: venite.text, reference: venite.source, whyTopic: venite.whyTopic });
  }

  elements.push({ type: 'text', content: prayers.gloriaPatri.text, speaker: 'all' });

  return { id: 'invitatory', title: 'The Invitatory and Psalter', elements };
}

function buildPsalmsSection(psalms: string[], period: 'morning' | 'evening'): AssembledSection {
  const elements: AssembledElement[] = [];

  for (const ps of psalms) {
    // Clean bracket notation: [120] means optional
    const cleaned = ps.replace(/[\[\]()]/g, '');
    elements.push({
      type: 'psalm',
      content: `Psalm ${cleaned}`,
      reference: `Ps ${cleaned}`,
    });
  }

  elements.push({ type: 'text', content: prayers.gloriaPatri.text, speaker: 'all' });

  return {
    id: `psalms-${period}`,
    title: 'The Psalms',
    elements,
  };
}

function buildLessonSection(title: string, reference: string): AssembledSection {
  return {
    id: `lesson-${title.toLowerCase().replace(/\s/g, '-')}`,
    title,
    elements: [
      { type: 'rubric', content: `A Reading from ${reference}` },
      { type: 'scripture', content: '', reference },
      { type: 'text', content: 'The Word of the Lord.', speaker: 'officiant' },
      { type: 'response', content: 'Thanks be to God.', speaker: 'people' },
    ],
  };
}

function buildCanticleSection(position: string, litDay: LiturgicalDay): AssembledSection {
  // Use Benedictus on most days, Te Deum on Sundays and feasts
  const useTeDeum = litDay.dayOfWeek === 'Sunday' || litDay.holyDays.some(h => h.type === 'principal-feast');
  const canticle = useTeDeum ? canticles.teDeum : canticles.benedictus;

  return {
    id: `canticle-${position}`,
    title: canticle.name,
    elements: [
      { type: 'rubric', content: `${canticle.english}  —  ${canticle.source}` },
      { type: 'canticle', content: canticle.text, whyTopic: canticle.whyTopic },
      { type: 'text', content: prayers.gloriaPatri.text, speaker: 'all' },
    ],
  };
}

function buildCreed(showRubrics: boolean): AssembledSection {
  const creed = prayers.apostlesCreed;
  const elements: AssembledElement[] = [];

  if (showRubrics) {
    elements.push({ type: 'rubric', content: creed.rubric });
  }
  elements.push({ type: 'text', content: creed.text, speaker: 'all', whyTopic: creed.whyTopic });

  return { id: 'creed', title: 'The Apostles\' Creed', elements };
}

function buildPrayersSection(litDay: LiturgicalDay, showRubrics: boolean): AssembledSection {
  const elements: AssembledElement[] = [];

  // Lord's Prayer
  if (showRubrics) {
    elements.push({ type: 'rubric', content: prayers.lordsPrayer.rubric });
  }
  elements.push({ type: 'prayer', content: prayers.lordsPrayer.text, speaker: 'all' });

  // Suffrages (alternate A/B by day of month)
  const useA = new Date().getDate() % 2 === 0;
  const suffrages = useA ? prayers.suffragesA : prayers.suffragesB;
  if (showRubrics) {
    elements.push({ type: 'rubric', content: useA ? 'Suffrages A' : 'Suffrages B' });
  }
  for (const pair of suffrages.pairs) {
    elements.push({ type: 'text', content: pair.v, speaker: 'officiant' });
    elements.push({ type: 'response', content: pair.r, speaker: 'people' });
  }

  return { id: 'prayers', title: 'The Prayers', elements };
}

function buildDailyCollect(litDay: LiturgicalDay): AssembledSection {
  const collect = dailyCollects[litDay.dayOfWeek as keyof typeof dailyCollects];

  return {
    id: 'collect',
    title: collect?.title ?? 'The Collect',
    elements: [
      { type: 'collect', content: collect?.text ?? '', whyTopic: 'why-do-we-use-collects' },
    ],
  };
}

function buildGeneralThanksgiving(showRubrics: boolean): AssembledSection {
  const gt = prayers.generalThanksgiving;
  const elements: AssembledElement[] = [];

  if (showRubrics) {
    elements.push({ type: 'rubric', content: gt.rubric });
  }
  elements.push({ type: 'prayer', content: gt.text, speaker: 'all' });

  return { id: 'thanksgiving', title: 'The General Thanksgiving', elements };
}

function buildDismissal(season: Season): AssembledSection {
  const dismissal = season === 'easter' ? prayers.dismissal.easter : prayers.dismissal;

  return {
    id: 'dismissal',
    title: 'Dismissal',
    elements: [
      { type: 'text', content: dismissal.text, speaker: 'officiant' },
      { type: 'response', content: dismissal.response, speaker: 'people' },
      { type: 'text', content: prayers.grace.text, speaker: 'officiant' },
    ],
  };
}
