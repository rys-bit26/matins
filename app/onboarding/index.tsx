import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, getReadingFont } from '../../src/theme';
import { useSettingsStore, BibleTranslation } from '../../src/stores/settingsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  icon: string;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: '✦',
    title: 'Welcome to Matins',
    body: 'A daily prayer companion rooted in the Book of Common Prayer and the historic Christian tradition.\n\nFor centuries, Christians have gathered at fixed hours to pray the Psalms, hear Scripture, and lift their hearts in prayer. This practice — the Daily Office — is one of the oldest rhythms of Christian life.',
  },
  {
    icon: '☀',
    title: 'Morning, Evening, Night',
    body: 'Matins offers three daily offices:\n\nMorning Prayer begins the day by turning your first thoughts toward God — with psalms, Scripture, and ancient prayers.\n\nEvening Prayer offers thanksgiving and intercession as the day draws to a close.\n\nCompline is the brief, intimate night prayer said before sleep.',
  },
  {
    icon: '📖',
    title: 'Everything Assembled',
    body: 'Each day, Matins assembles the complete office for you — the right opening sentence for the season, the appointed psalms and readings, the proper canticle and collect.\n\nYou do not need to look anything up. Just open and pray.',
  },
  {
    icon: '?',
    title: 'We Explain as We Go',
    body: 'New to liturgical prayer? Throughout the office, you will find "why" explanations — brief notes on what each element is and why the Church has prayed this way for centuries.\n\nYou can turn these on or off anytime in Settings.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { completeOnboarding, setTranslation } = useSettingsStore();
  const isLast = step === SLIDES.length;

  const handleNext = () => {
    if (step < SLIDES.length) {
      setStep(step + 1);
    }
  };

  const handleComplete = (translation: BibleTranslation) => {
    setTranslation(translation);
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  if (isLast) {
    // Translation choice screen
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.slideContent}>
          <Text style={styles.icon}>📜</Text>
          <Text style={styles.title}>Choose a Translation</Text>
          <Text style={styles.body}>
            Which Bible translation would you like to use for Scripture readings? You can change this anytime.
          </Text>
          <View style={styles.translationOptions}>
            <Pressable style={styles.translationButton} onPress={() => handleComplete('bsb')}>
              <Text style={styles.translationName}>BSB</Text>
              <Text style={styles.translationDesc}>Berean Standard Bible — modern, clear</Text>
            </Pressable>
            <Pressable style={styles.translationButton} onPress={() => handleComplete('web')}>
              <Text style={styles.translationName}>WEB</Text>
              <Text style={styles.translationDesc}>World English Bible — updated ASV</Text>
            </Pressable>
            <Pressable style={styles.translationButton} onPress={() => handleComplete('kjv')}>
              <Text style={styles.translationName}>KJV</Text>
              <Text style={styles.translationDesc}>King James Version — traditional</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const slide = SLIDES[step];

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.slideContent}>
        <Text style={styles.icon}>{slide.icon}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      {/* Progress dots and next button */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive]}
            />
          ))}
          <View style={[styles.dot, isLast && styles.dotActive]} />
        </View>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Continue</Text>
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
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.screen,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: 15,
    color: colors.text.tertiary,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: 'Cormorant_700Bold',
    fontSize: 32,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  body: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.accent.gold,
    width: 24,
  },
  nextButton: {
    backgroundColor: colors.accent.gold,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  nextText: {
    fontFamily: 'Cormorant_600SemiBold',
    fontSize: 18,
    color: colors.background.primary,
    letterSpacing: 0.5,
  },
  translationOptions: {
    width: '100%',
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  translationButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  translationName: {
    fontSize: 17,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  translationDesc: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
