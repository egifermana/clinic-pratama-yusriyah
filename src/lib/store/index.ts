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

if (typeof window !== "undefined") {
  // Lets ad-hoc data fixes/imports run from the browser console, e.g.
  // window.useClinicStore.getState().addDailyEntry({ ... })
  // No auth/backend here, so anyone with devtools access can already
  // read/write this data straight from localStorage — this just makes
  // that easier via the store's own actions instead of raw JSON.
  (window as unknown as { useClinicStore: typeof useClinicStore }).useClinicStore =
    useClinicStore;
}
