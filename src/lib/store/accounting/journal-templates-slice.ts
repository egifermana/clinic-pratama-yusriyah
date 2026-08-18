import type { StateCreator } from "zustand";
import type { JournalTemplate, JournalTemplateInput } from "@/types/accounting/journal";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface JournalTemplatesSlice {
  journalTemplates: JournalTemplate[];
  addJournalTemplate: (input: JournalTemplateInput) => void;
  updateJournalTemplate: (id: string, input: JournalTemplateInput) => void;
  deleteJournalTemplate: (id: string) => void;
}

export const createJournalTemplatesSlice: StateCreator<
  StoreState,
  [],
  [],
  JournalTemplatesSlice
> = (set) => ({
  journalTemplates: [],
  addJournalTemplate: (input) =>
    set((state) => ({
      journalTemplates: [
        ...state.journalTemplates,
        { ...input, id: generateId(), createdAt: nowIso() },
      ],
    })),
  updateJournalTemplate: (id, input) =>
    set((state) => ({
      journalTemplates: state.journalTemplates.map((t) =>
        t.id === id ? { ...input, id, createdAt: t.createdAt } : t
      ),
    })),
  deleteJournalTemplate: (id) =>
    set((state) => ({
      journalTemplates: state.journalTemplates.filter((t) => t.id !== id),
    })),
});
