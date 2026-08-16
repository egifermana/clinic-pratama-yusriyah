import type { StateCreator } from "zustand";
import type { Supplier, SupplierInput } from "@/types/supplier";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface SuppliersSlice {
  suppliers: Supplier[];
  addSupplier: (input: SupplierInput) => Supplier;
}

export const createSuppliersSlice: StateCreator<StoreState, [], [], SuppliersSlice> = (
  set
) => ({
  suppliers: [],
  addSupplier: (input) => {
    const supplier: Supplier = { ...input, id: generateId(), createdAt: nowIso() };
    set((state) => ({ suppliers: [...state.suppliers, supplier] }));
    return supplier;
  },
});
