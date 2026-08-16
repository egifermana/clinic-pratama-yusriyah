import type { StateCreator } from "zustand";
import type { DailyEntry, DailyEntryInput } from "@/types/finance";
import { generateId } from "@/lib/id";
import type { StoreState } from "@/lib/store/types";

export interface DailyEntriesSlice {
  dailyEntries: DailyEntry[];
  addDailyEntry: (input: DailyEntryInput) => void;
  updateDailyEntry: (id: string, input: DailyEntryInput) => void;
  deleteDailyEntry: (id: string) => void;
}

export const createDailyEntriesSlice: StateCreator<StoreState, [], [], DailyEntriesSlice> = (
  set
) => ({
  dailyEntries: [],
  addDailyEntry: (input) =>
    set((state) => ({
      dailyEntries: [...state.dailyEntries, { ...input, id: generateId() }],
    })),
  updateDailyEntry: (id, input) =>
    set((state) => ({
      dailyEntries: state.dailyEntries.map((e) => (e.id === id ? { ...input, id } : e)),
    })),
  deleteDailyEntry: (id) =>
    set((state) => ({ dailyEntries: state.dailyEntries.filter((e) => e.id !== id) })),
});
