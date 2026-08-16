import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StoreState } from "@/lib/store/types";
import { createProductsSlice } from "@/lib/store/products-slice";
import { createSuppliersSlice } from "@/lib/store/suppliers-slice";
import { createOrdersSlice } from "@/lib/store/orders-slice";
import { createTransactionsSlice } from "@/lib/store/transactions-slice";
import { createDailyEntriesSlice } from "@/lib/store/daily-entries-slice";
import { createMetaSlice } from "@/lib/store/meta-slice";

export const useClinicStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createProductsSlice(...a),
      ...createSuppliersSlice(...a),
      ...createOrdersSlice(...a),
      ...createTransactionsSlice(...a),
      ...createDailyEntriesSlice(...a),
      ...createMetaSlice(...a),
    }),
    {
      name: "klinik-yusriyah-store-v3",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        products: state.products,
        suppliers: state.suppliers,
        orders: state.orders,
        transactions: state.transactions,
        dailyEntries: state.dailyEntries,
        seeded: state.seeded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // Lets ad-hoc data fixes/imports run from the browser console, e.g.
  // window.useClinicStore.getState().addDailyEntry({ ... })
  (window as unknown as { useClinicStore: typeof useClinicStore }).useClinicStore =
    useClinicStore;
}
