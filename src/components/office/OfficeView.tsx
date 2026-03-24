import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, seasonColors, getReadingFont } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTypeStyles } from '../../hooks/useTypeStyles';
import { AssembledOffice, AssembledSection, AssembledElement } from '../../lib/office/types';
import { WhyTooltip } from '../learn/WhyTooltip';

interface OfficeViewProps {
  office: AssembledOffice;
}

export function OfficeView({ office }: OfficeViewProps) {
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  const ts = useTypeStyles();
  const rf = getReadingFont(fontStyle);
  const rfBold = getReadingFont(fontStyle, 'bold');
  const rfItalic = getReadingFont(fontStyle, 'italic');
  const seasonColor = seasonColors[office.liturgicalDay.color];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {office.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
            {section.title}
          </Text>
          <View style={[styles.sectionDivider, { backgroundColor: seasonColor + '40' }]} />
          {section.elements.map((element, i) => (
            <View key={`${section.id}-${i}`}>
              <ElementRenderer
                element={element}
                readingFont={rf}
                readingFontBold={rfBold}
                readingFontItalic={rfItalic}
                isSerif={fontStyle === 'serif'}
              />
              {element.whyTopic && <WhyTooltip topic={element.whyTopic} />}
            </View>
          ))}
        </View>
      ))}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

// ─── Element Renderer ───────────────────────────────────────────────────────

interface ElementRendererProps {
  element: AssembledElement;
  readingFont: string;
  readingFontBold: string;
  readingFontItalic: string;
  isSerif: boolean;
}

function ElementRenderer({ element, readingFont, readingFontBold, readingFontItalic, isSerif }: ElementRendererProps) {
  switch (element.type) {
    case 'rubric':
      return (
        <Text style={[styles.rubric, { fontFamily: readingFontItalic, fontStyle: isSerif ? undefined : 'italic' }]}>
          {element.content}
        </Text>
      );

    case 'text':
    case 'prayer':
    case 'collect':
      return (
        <Text style={[
          styles.prayerText,
          { fontFamily: readingFont },
          element.speaker === 'all' && { fontFamily: readingFontBold, fontWeight: isSerif ? undefined : '700' as any },
        ]}>
          {element.content}
        </Text>
      );

    case 'response':
      return (
        <Text style={[styles.responseText, { fontFamily: readingFontBold, fontWeight: isSerif ? undefined : '700' as any }]}>
          {element.content}
        </Text>
      );

    case 'psalm':
      return (
        <View style={styles.psalmBlock}>
          <Text style={[styles.psalmRef, { fontFamily: readingFont }]}>
            {element.content}
          </Text>
          {element.reference && (
            <Text style={styles.psalmNote}>
              Tap to read full text
            </Text>
          )}
        </View>
      );

    case 'scripture':
      if (!element.content && element.reference) {
        // Placeholder for scripture that will be fetched
        return (
          <View style={styles.scriptureBlock}>
            <Text style={[styles.scriptureRef, { fontFamily: readingFont }]}>
              {element.reference}
            </Text>
            <Text style={styles.scriptureNote}>
              Scripture text loaded when you tap to read
            </Text>
          </View>
        );
      }
      return (
        <Text style={[styles.prayerText, { fontFamily: readingFont }]}>
          {element.content}
        </Text>
      );

    case 'canticle':
      return (
        <View style={styles.canticleBlock}>
          <Text style={[styles.canticleText, { fontFamily: readingFont }]}>
            {element.content}
          </Text>
        </View>
      );

    case 'heading':
      return (
        <Text style={[styles.heading, { fontFamily: readingFontBold, fontWeight: isSerif ? undefined : '700' as any }]}>
          {element.content}
        </Text>
      );

    default:
      return (
        <Text style={[styles.prayerText, { fontFamily: readingFont }]}>
          {element.content}
        </Text>
      );
  }
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  section: {
    marginBottom: spacing.section,
  },
  sectionTitle: {
    fontSize: 22,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  sectionDivider: {
    height: 1,
    marginBottom: spacing.xl,
  },
  rubric: {
    fontSize: 15,
    color: colors.text.rubric,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  prayerText: {
    fontSize: 19,
    color: colors.text.primary,
    lineHeight: 30,
    marginBottom: spacing.lg,
    letterSpacing: 0.15,
  },
  responseText: {
    fontSize: 19,
    color: colors.text.primary,
    lineHeight: 30,
    marginBottom: spacing.lg,
    letterSpacing: 0.15,
  },
  heading: {
    fontSize: 24,
    color: colors.text.primary,
    lineHeight: 32,
    marginBottom: spacing.md,
  },
  psalmBlock: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.gold + '60',
  },
  psalmRef: {
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 26,
  },
  psalmNote: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  scriptureBlock: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.sage + '60',
  },
  scriptureRef: {
    fontSize: 18,
    color: colors.accent.gold,
    lineHeight: 26,
  },
  scriptureNote: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  canticleBlock: {
    paddingLeft: spacing.lg,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent.gold + '30',
    marginBottom: spacing.lg,
  },
  canticleText: {
    fontSize: 18,
    color: colors.text.primary,
    lineHeight: 28,
    letterSpacing: 0.1,
  },
  bottomSpacer: {
    height: 100,
  },
});
