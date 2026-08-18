import type { StateCreator } from "zustand";
import type { PartnerCategory, PartnerCategoryInput } from "@/types/accounting/partner";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface PartnerCategoriesSlice {
  partnerCategories: PartnerCategory[];
  addPartnerCategory: (input: PartnerCategoryInput) => void;
  deletePartnerCategory: (id: string) => void;
}

export const createPartnerCategoriesSlice: StateCreator<
  StoreState,
  [],
  [],
  PartnerCategoriesSlice
> = (set) => ({
  partnerCategories: [],
  addPartnerCategory: (input) =>
    set((state) => ({
      partnerCategories: [
        ...state.partnerCategories,
        { ...input, id: generateId(), createdAt: nowIso() },
      ],
    })),
  deletePartnerCategory: (id) =>
    set((state) => ({
      partnerCategories: state.partnerCategories.filter((c) => c.id !== id),
    })),
});
