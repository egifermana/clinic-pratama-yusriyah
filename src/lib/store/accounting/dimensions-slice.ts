import type { StateCreator } from "zustand";
import type { Dimension, DimensionInput } from "@/types/accounting/dimension";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface DimensionsSlice {
  dimensions: Dimension[];
  addDimension: (input: DimensionInput) => void;
  deleteDimension: (id: string) => void;
}

export const createDimensionsSlice: StateCreator<StoreState, [], [], DimensionsSlice> = (
  set
) => ({
  dimensions: [],
  addDimension: (input) =>
    set((state) => ({
      dimensions: [...state.dimensions, { ...input, id: generateId(), createdAt: nowIso() }],
    })),
  deleteDimension: (id) =>
    set((state) => ({ dimensions: state.dimensions.filter((d) => d.id !== id) })),
});
