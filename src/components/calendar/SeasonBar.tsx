import { View, Text, StyleSheet } from 'react-native';
import { colors, seasonColors, spacing } from '../../theme';
import { SEASON_NAMES, Season, LiturgicalColor } from '../../lib/calendar';

interface SeasonBarProps {
  season: Season;
  color: LiturgicalColor;
}

export function SeasonBar({ season, color }: SeasonBarProps) {
  const barColor = seasonColors[color];

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <Text style={[styles.label, { color: barColor }]}>
        {SEASON_NAMES[season]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bar: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
