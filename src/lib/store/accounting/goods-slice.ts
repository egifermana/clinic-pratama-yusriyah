import type { StateCreator } from "zustand";
import type { Good, GoodInput } from "@/types/accounting/good";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface GoodsSlice {
  goods: Good[];
  addGood: (input: GoodInput) => void;
  updateGood: (id: string, input: GoodInput) => void;
  deleteGood: (id: string) => void;
}

export const createGoodsSlice: StateCreator<StoreState, [], [], GoodsSlice> = (set) => ({
  goods: [],
  addGood: (input) =>
    set((state) => ({
      goods: [
        ...state.goods,
        { ...input, id: generateId(), createdAt: nowIso(), updatedAt: nowIso() },
      ],
    })),
  updateGood: (id, input) =>
    set((state) => ({
      goods: state.goods.map((g) =>
        g.id === id ? { ...input, id, createdAt: g.createdAt, updatedAt: nowIso() } : g
      ),
    })),
  deleteGood: (id) =>
    set((state) => ({ goods: state.goods.filter((g) => g.id !== id) })),
});
