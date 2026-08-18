import type { StateCreator } from "zustand";
import type { AssetType, AssetTypeInput } from "@/types/accounting/asset";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface AssetTypesSlice {
  assetTypes: AssetType[];
  addAssetType: (input: AssetTypeInput) => void;
  deleteAssetType: (id: string) => void;
}

export const createAssetTypesSlice: StateCreator<StoreState, [], [], AssetTypesSlice> = (
  set
) => ({
  assetTypes: [],
  addAssetType: (input) =>
    set((state) => ({
      assetTypes: [...state.assetTypes, { ...input, id: generateId(), createdAt: nowIso() }],
    })),
  deleteAssetType: (id) =>
    set((state) => ({ assetTypes: state.assetTypes.filter((t) => t.id !== id) })),
});
