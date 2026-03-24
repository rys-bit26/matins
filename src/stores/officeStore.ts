import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OfficeType = 'morning' | 'evening' | 'compline';

interface OfficeState {
  // Current office being viewed
  currentOfficeType: OfficeType | null;
  currentDate: string | null;

  // Scroll position per office (restore on return)
  scrollPositions: Record<string, number>;

  // Completed offices by date: { "2026-03-23": ["morning", "evening"] }
  completedOffices: Record<string, OfficeType[]>;

  // Actions
  setCurrentOffice: (type: OfficeType, date: string) => void;
  clearCurrentOffice: () => void;
  saveScrollPosition: (key: string, position: number) => void;
  markCompleted: (type: OfficeType, date: string) => void;
  isCompleted: (type: OfficeType, date: string) => boolean;
}

export const useOfficeStore = create<OfficeState>()(
  persist(
    (set, get) => ({
      currentOfficeType: null,
      currentDate: null,
      scrollPositions: {},
      completedOffices: {},

      setCurrentOffice: (type, date) =>
        set({ currentOfficeType: type, currentDate: date }),

      clearCurrentOffice: () =>
        set({ currentOfficeType: null, currentDate: null }),

      saveScrollPosition: (key, position) =>
        set((state) => ({
          scrollPositions: { ...state.scrollPositions, [key]: position },
        })),

      markCompleted: (type, date) =>
        set((state) => {
          const existing = state.completedOffices[date] ?? [];
          if (existing.includes(type)) return state;
          return {
            completedOffices: {
              ...state.completedOffices,
              [date]: [...existing, type],
            },
          };
        }),

      isCompleted: (type, date) => {
        const existing = get().completedOffices[date] ?? [];
        return existing.includes(type);
      },
    }),
    {
      name: 'matins-office',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
