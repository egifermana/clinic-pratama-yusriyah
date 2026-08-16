import type { StateCreator } from "zustand";
import type { CartItem, PaymentMethod, Transaction } from "@/types/transaction";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface TransactionsSlice {
  transactions: Transaction[];
  addTransaction: (params: {
    items: CartItem[];
    diskon: number;
    metodePembayaran: PaymentMethod;
    uangDibayar?: number;
  }) => Transaction | null;
}

export const createTransactionsSlice: StateCreator<StoreState, [], [], TransactionsSlice> = (
  set,
  get
) => ({
  transactions: [],
  addTransaction: ({ items, diskon, metodePembayaran, uangDibayar }) => {
    if (items.length === 0) return null;
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = Math.max(0, subtotal - diskon);
    const transaction: Transaction = {
      id: generateId(),
      items,
      subtotal,
      diskon,
      total,
      metodePembayaran,
      uangDibayar,
      kembalian: uangDibayar !== undefined ? Math.max(0, uangDibayar - total) : undefined,
      timestamp: nowIso(),
    };

    for (const item of items) {
      get().adjustStock(item.productId, -item.qty);
    }

    set((state) => ({ transactions: [...state.transactions, transaction] }));
    return transaction;
  },
});
