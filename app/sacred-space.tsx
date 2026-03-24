import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typeStyles, spacing, getReadingFont } from '../src/theme';
import { useSettingsStore } from '../src/stores/settingsStore';
import { getSetupSteps } from '../src/lib/sacredSpace';

export default function SacredSpaceScreen() {
  const router = useRouter();
  const fontStyle = useSettingsStore((s) => s.fontStyle);
  const { sacredSpaceSetupComplete, setSacredSpaceSetupComplete, setSacredSpaceEnabled } = useSettingsStore();
  const steps = getSetupSteps();
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = () => {
    setSacredSpaceSetupComplete(true);
    setSacredSpaceEnabled(true);
    router.back();
  };

  if (sacredSpaceSetupComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.icon}>🕯</Text>
          <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
            Sacred Space is Active
          </Text>
          <Text style={styles.body}>
            When you open Matins, your device will silence notifications so you can be fully present in prayer.
          </Text>
          <Pressable
            style={styles.resetButton}
            onPress={() => {
              setSacredSpaceSetupComplete(false);
              setSacredSpaceEnabled(false);
              setCurrentStep(0);
            }}
          >
            <Text style={styles.resetText}>Reconfigure</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.icon}>🕯</Text>
        <Text style={[styles.title, { fontFamily: getReadingFont(fontStyle, 'bold'), fontWeight: fontStyle === 'sans-serif' ? '700' : undefined }]}>
          Sacred Space
        </Text>
        <Text style={styles.subtitle}>
          Create a distraction-free environment for prayer by automatically silencing notifications.
        </Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Current Step */}
        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>Step {currentStep + 1} of {steps.length}</Text>
          <Text style={[styles.stepTitle, { fontFamily: getReadingFont(fontStyle, 'semiBold'), fontWeight: fontStyle === 'sans-serif' ? '600' : undefined }]}>
            {step.title}
          </Text>
          <Text style={styles.stepDescription}>{step.description}</Text>

          {step.action && step.actionLabel && (
            <Pressable
              style={styles.actionButton}
              onPress={step.action}
            >
              <Text style={styles.actionText}>{step.actionLabel}</Text>
            </Pressable>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          {currentStep > 0 && (
            <Pressable
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          )}
          <View style={{ flex: 1 }} />
          <Pressable
            style={styles.nextButton}
            onPress={isLast ? handleComplete : () => setCurrentStep(currentStep + 1)}
          >
            <Text style={styles.nextText}>{isLast ? 'Complete Setup' : 'Next'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typeStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  body: {
    ...typeStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.accent.gold,
    width: 20,
  },
  stepCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  stepNumber: {
    ...typeStyles.caption,
    color: colors.accent.gold,
    marginBottom: spacing.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  stepDescription: {
    ...typeStyles.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  actionButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent.gold + '20',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.accent.gold + '40',
  },
  actionText: {
    ...typeStyles.bodySmall,
    color: colors.accent.gold,
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  backText: {
    ...typeStyles.body,
    color: colors.text.secondary,
  },
  nextButton: {
    backgroundColor: colors.accent.gold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 24,
  },
  nextText: {
    ...typeStyles.body,
    color: colors.background.primary,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: {
    ...typeStyles.body,
    color: colors.text.secondary,
  },
});
