import { create } from 'zustand';

interface CalendarState {
  selectedDate: string;  // ISO date string (YYYY-MM-DD)
  viewMonth: number;     // 0-11
  viewYear: number;

  setSelectedDate: (date: string) => void;
  setViewMonth: (month: number, year: number) => void;
}

const now = new Date();

export const useCalendarStore = create<CalendarState>()((set) => ({
  selectedDate: now.toISOString().split('T')[0],
  viewMonth: now.getMonth(),
  viewYear: now.getFullYear(),

  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setViewMonth: (viewMonth, viewYear) => set({ viewMonth, viewYear }),
}));
