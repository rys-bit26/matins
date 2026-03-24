import { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, seasonColors, getReadingFont } from '../../src/theme';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useOfficeStore, OfficeType } from '../../src/stores/officeStore';
import { assembleOffice } from '../../src/lib/office/assembler';
import { OfficeView } from '../../src/components/office/OfficeView';

const OFFICE_NAMES: Record<string, string> = {
  morning: 'Morning Prayer',
  evening: 'Evening Prayer',
  compline: 'Compline',
};

export default function OfficeScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const showRubrics = useSettingsStore((s) => s.showRubrics);
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  const markCompleted = useOfficeStore((s) => s.markCompleted);

  const officeType = (type as OfficeType) ?? 'morning';
  const officeName = OFFICE_NAMES[officeType] ?? 'Daily Office';
  const today = new Date();
  const dateKey = today.toISOString().split('T')[0];

  const office = useMemo(
    () => assembleOffice(today, officeType, { showRubrics }),
    [dateKey, officeType, showRubrics]
  );

  const seasonColor = seasonColors[office.liturgicalDay.color];

  const handleComplete = () => {
    markCompleted(officeType, dateKey);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.seasonDot, { backgroundColor: seasonColor }]} />
          <Text style={[styles.headerTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
            {officeName}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Liturgical day subtitle */}
      <View style={styles.dayBar}>
        <Text style={styles.dayText}>{office.liturgicalDay.title}</Text>
      </View>

      {/* Office content */}
      <OfficeView office={office} />

      {/* Complete button */}
      <View style={styles.completeBar}>
        <Pressable style={[styles.completeButton, { borderColor: seasonColor }]} onPress={handleComplete}>
          <Text style={[styles.completeText, { color: seasonColor }]}>Office Complete</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.text.secondary,
    fontSize: 18,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  seasonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  dayBar: {
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dayText: {
    ...typeStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  completeBar: {
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  completeButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
  },
  completeText: {
    ...typeStyles.body,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
