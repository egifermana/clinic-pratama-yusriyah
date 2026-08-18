import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StoreState } from "@/lib/store/types";
import { createProductsSlice } from "@/lib/store/products-slice";
import { createSuppliersSlice } from "@/lib/store/suppliers-slice";
import { createOrdersSlice } from "@/lib/store/orders-slice";
import { createTransactionsSlice } from "@/lib/store/transactions-slice";
import { createDailyEntriesSlice } from "@/lib/store/daily-entries-slice";
import { createMetaSlice } from "@/lib/store/meta-slice";
import { createAccountsSlice } from "@/lib/store/accounting/accounts-slice";
import { createPartnerCategoriesSlice } from "@/lib/store/accounting/partner-categories-slice";
import { createPartnersSlice } from "@/lib/store/accounting/partners-slice";
import { createDimensionsSlice } from "@/lib/store/accounting/dimensions-slice";
import { createProjectsSlice } from "@/lib/store/accounting/projects-slice";
import { createAssetTypesSlice } from "@/lib/store/accounting/asset-types-slice";
import { createFixedAssetsSlice } from "@/lib/store/accounting/fixed-assets-slice";
import { createGoodsSlice } from "@/lib/store/accounting/goods-slice";

export const useClinicStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createProductsSlice(...a),
      ...createSuppliersSlice(...a),
      ...createOrdersSlice(...a),
      ...createTransactionsSlice(...a),
      ...createDailyEntriesSlice(...a),
      ...createMetaSlice(...a),
      ...createAccountsSlice(...a),
      ...createPartnerCategoriesSlice(...a),
      ...createPartnersSlice(...a),
      ...createDimensionsSlice(...a),
      ...createProjectsSlice(...a),
      ...createAssetTypesSlice(...a),
      ...createFixedAssetsSlice(...a),
      ...createGoodsSlice(...a),
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
        accounts: state.accounts,
        partnerCategories: state.partnerCategories,
        partners: state.partners,
        dimensions: state.dimensions,
        projects: state.projects,
        assetTypes: state.assetTypes,
        fixedAssets: state.fixedAssets,
        goods: state.goods,
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
