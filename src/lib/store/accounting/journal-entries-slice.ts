import type { StateCreator } from "zustand";
import type { JournalEntry, JournalEntryInput } from "@/types/accounting/journal";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import { nextSequentialNomor } from "@/lib/accounting/sequence";
import type { StoreState } from "@/lib/store/types";

export interface JournalEntriesSlice {
  journalEntries: JournalEntry[];
  addJournalEntry: (input: JournalEntryInput) => JournalEntry;
  deleteJournalEntry: (id: string) => void;
}

export const createJournalEntriesSlice: StateCreator<
  StoreState,
  [],
  [],
  JournalEntriesSlice
> = (set, get) => ({
  journalEntries: [],
  addJournalEntry: (input) => {
    const entry: JournalEntry = {
      ...input,
      id: generateId(),
      nomor: nextSequentialNomor(get().journalEntries.map((e) => e.nomor), "JV"),
      lines: input.lines.map((line) => ({ ...line, id: generateId() })),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    set((state) => ({ journalEntries: [...state.journalEntries, entry] }));
    return entry;
  },
  deleteJournalEntry: (id) =>
    set((state) => ({
      journalEntries: state.journalEntries.filter((e) => e.id !== id),
    })),
});
