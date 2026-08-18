import type { StateCreator } from "zustand";
import type { FixedAsset, FixedAssetInput } from "@/types/accounting/asset";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface FixedAssetsSlice {
  fixedAssets: FixedAsset[];
  addFixedAsset: (input: FixedAssetInput) => void;
  updateFixedAsset: (id: string, input: FixedAssetInput) => void;
  deleteFixedAsset: (id: string) => void;
}

export const createFixedAssetsSlice: StateCreator<StoreState, [], [], FixedAssetsSlice> = (
  set
) => ({
  fixedAssets: [],
  addFixedAsset: (input) =>
    set((state) => ({
      fixedAssets: [
        ...state.fixedAssets,
        { ...input, id: generateId(), createdAt: nowIso(), updatedAt: nowIso() },
      ],
    })),
  updateFixedAsset: (id, input) =>
    set((state) => ({
      fixedAssets: state.fixedAssets.map((a) =>
        a.id === id ? { ...input, id, createdAt: a.createdAt, updatedAt: nowIso() } : a
      ),
    })),
  deleteFixedAsset: (id) =>
    set((state) => ({ fixedAssets: state.fixedAssets.filter((a) => a.id !== id) })),
});
