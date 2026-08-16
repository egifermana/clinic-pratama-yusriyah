import type { StateCreator } from "zustand";
import type { StoreState } from "@/lib/store/types";
import {
  seedDailyEntries,
  seedOrders,
  seedProducts,
  seedSuppliers,
  seedTransactions,
} from "@/lib/seed-data";

export interface MetaSlice {
  seeded: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  seedIfEmpty: () => void;
}

export const createMetaSlice: StateCreator<StoreState, [], [], MetaSlice> = (set, get) => ({
  seeded: false,
  hasHydrated: false,
  setHasHydrated: (value) => set({ hasHydrated: value }),
  seedIfEmpty: () => {
    if (get().seeded) return;
    const products = seedProducts();
    const suppliers = seedSuppliers();
    const orders = seedOrders(products, suppliers);
    const transactions = seedTransactions(products);
    const dailyEntries = seedDailyEntries();

    set({
      products,
      suppliers,
      orders,
      transactions,
      dailyEntries,
      seeded: true,
    });
  },
});
