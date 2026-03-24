import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BibleTranslation = 'bsb' | 'web' | 'kjv';
export type PsalterCycle = 'lectionary' | '30-day';
export type FontStyle = 'serif' | 'sans-serif';

interface SettingsState {
  // Bible preferences
  translation: BibleTranslation;
  psalterCycle: PsalterCycle;

  // Display preferences
  showRubrics: boolean;
  showWhyTooltips: boolean;
  fontSize: 'small' | 'medium' | 'large';
  fontStyle: FontStyle;

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Sacred Space
  sacredSpaceEnabled: boolean;
  sacredSpaceSetupComplete: boolean;

  // Notifications
  morningReminderEnabled: boolean;
  morningReminderTime: string;
  eveningReminderEnabled: boolean;
  eveningReminderTime: string;
  complineReminderEnabled: boolean;
  complineReminderTime: string;

  // Actions
  setTranslation: (translation: BibleTranslation) => void;
  setPsalterCycle: (cycle: PsalterCycle) => void;
  setShowRubrics: (show: boolean) => void;
  setShowWhyTooltips: (show: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setFontStyle: (style: FontStyle) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setSacredSpaceEnabled: (enabled: boolean) => void;
  setSacredSpaceSetupComplete: (complete: boolean) => void;
  setMorningReminder: (enabled: boolean, time?: string) => void;
  setEveningReminder: (enabled: boolean, time?: string) => void;
  setComplineReminder: (enabled: boolean, time?: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Defaults
      translation: 'bsb',
      psalterCycle: 'lectionary',
      showRubrics: true,
      showWhyTooltips: true,
      fontSize: 'medium',
      fontStyle: 'serif',
      hasCompletedOnboarding: false,
      sacredSpaceEnabled: false,
      sacredSpaceSetupComplete: false,
      morningReminderEnabled: false,
      morningReminderTime: '07:00',
      eveningReminderEnabled: false,
      eveningReminderTime: '17:00',
      complineReminderEnabled: false,
      complineReminderTime: '21:00',

      // Actions
      setTranslation: (translation) => set({ translation }),
      setPsalterCycle: (psalterCycle) => set({ psalterCycle }),
      setShowRubrics: (showRubrics) => set({ showRubrics }),
      setShowWhyTooltips: (showWhyTooltips) => set({ showWhyTooltips }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFontStyle: (fontStyle) => set({ fontStyle }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      setSacredSpaceEnabled: (sacredSpaceEnabled) => set({ sacredSpaceEnabled }),
      setSacredSpaceSetupComplete: (sacredSpaceSetupComplete) =>
        set({ sacredSpaceSetupComplete }),
      setMorningReminder: (enabled, time) =>
        set((state) => ({
          morningReminderEnabled: enabled,
          morningReminderTime: time ?? state.morningReminderTime,
        })),
      setEveningReminder: (enabled, time) =>
        set((state) => ({
          eveningReminderEnabled: enabled,
          eveningReminderTime: time ?? state.eveningReminderTime,
        })),
      setComplineReminder: (enabled, time) =>
        set((state) => ({
          complineReminderEnabled: enabled,
          complineReminderTime: time ?? state.complineReminderTime,
        })),
    }),
    {
      name: 'matins-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
