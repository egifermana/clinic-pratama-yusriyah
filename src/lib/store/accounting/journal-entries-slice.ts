import type { StateCreator } from "zustand";
import type { JournalEntry, JournalEntryInput } from "@/types/accounting/journal";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

function nextNomor(entries: JournalEntry[]): string {
  const maxSeq = entries.reduce((max, e) => {
    const seq = Number.parseInt(e.nomor.split("-")[1] ?? "0", 10);
    return Number.isFinite(seq) && seq > max ? seq : max;
  }, 0);
  return `JV-${String(maxSeq + 1).padStart(6, "0")}`;
}

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
      nomor: nextNomor(get().journalEntries),
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
