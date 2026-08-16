import type { StateCreator } from "zustand";
import type { Product, ProductInput } from "@/types/product";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface ProductsSlice {
  products: Product[];
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: Partial<ProductInput>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  resetAllStock: () => void;
}

export const createProductsSlice: StateCreator<StoreState, [], [], ProductsSlice> = (
  set
) => ({
  products: [],
  addProduct: (input) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...input, id: generateId(), createdAt: nowIso(), updatedAt: nowIso() },
      ],
    })),
  updateProduct: (id, input) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...input, updatedAt: nowIso() } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  adjustStock: (id, delta) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? { ...p, jumlahStok: Math.max(0, p.jumlahStok + delta), updatedAt: nowIso() }
          : p
      ),
    })),
  resetAllStock: () =>
    set((state) => ({
      products: state.products.map((p) => ({ ...p, jumlahStok: 0, updatedAt: nowIso() })),
    })),
});
