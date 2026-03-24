import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, typeStyles, spacing } from '../../src/theme';

export default function PsalmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Psalm {id}</Text>
      <Text style={styles.subtitle}>Psalm text will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  title: {
    ...typeStyles.sectionHeading,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typeStyles.body,
    color: colors.text.secondary,
  },
});
