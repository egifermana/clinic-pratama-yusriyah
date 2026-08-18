import type { StateCreator } from "zustand";
import type { StockMutation, StockMutationInput } from "@/types/accounting/stock-mutation";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import { nextSequentialNomor } from "@/lib/accounting/sequence";
import type { StoreState } from "@/lib/store/types";

export interface StockMutationsSlice {
  stockMutations: StockMutation[];
  addStockMutation: (input: StockMutationInput) => StockMutation | null;
}

export const createStockMutationsSlice: StateCreator<StoreState, [], [], StockMutationsSlice> = (
  set,
  get
) => ({
  stockMutations: [],
  addStockMutation: (input) => {
    const good = get().goods.find((g) => g.id === input.goodId);
    if (!good?.akunPersediaanId) return null;

    const amount = input.qty * input.hargaSatuan;
    const isIn = input.tipe === "masuk" || input.tipe === "saldo-awal";

    const journalEntry = get().addJournalEntry({
      tanggal: input.tanggal,
      memo: `${input.tipe === "saldo-awal" ? "Saldo awal stok" : input.tipe === "masuk" ? "Stok masuk" : "Stok keluar"} — ${good.nama}${input.catatan ? ` (${input.catatan})` : ""}`,
      sourceType: "mutasi-stok",
      lines: isIn
        ? [
            { accountId: good.akunPersediaanId, debit: amount, kredit: 0 },
            { accountId: input.akunLawanId, debit: 0, kredit: amount },
          ]
        : [
            { accountId: input.akunLawanId, debit: amount, kredit: 0 },
            { accountId: good.akunPersediaanId, debit: 0, kredit: amount },
          ],
    });

    get().updateGood(good.id, {
      ...good,
      stok: isIn ? (good.stok ?? 0) + input.qty : Math.max(0, (good.stok ?? 0) - input.qty),
    });

    const mutation: StockMutation = {
      ...input,
      id: generateId(),
      nomor: nextSequentialNomor(
        get().stockMutations.map((m) => m.nomor),
        "MS"
      ),
      journalEntryId: journalEntry.id,
      createdAt: nowIso(),
    };
    set((state) => ({ stockMutations: [...state.stockMutations, mutation] }));
    return mutation;
  },
});
