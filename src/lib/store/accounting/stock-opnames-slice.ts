import type { StateCreator } from "zustand";
import type { StockOpname, StockOpnameInput } from "@/types/accounting/stock-opname";
import type { JournalLineInput } from "@/types/accounting/journal";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import { nextSequentialNomor } from "@/lib/accounting/sequence";
import type { StoreState } from "@/lib/store/types";

export interface StockOpnamesSlice {
  stockOpnames: StockOpname[];
  addStockOpname: (input: StockOpnameInput) => StockOpname;
}

export const createStockOpnamesSlice: StateCreator<StoreState, [], [], StockOpnamesSlice> = (
  set,
  get
) => ({
  stockOpnames: [],
  addStockOpname: (input) => {
    const goods = get().goods;
    const journalLines: JournalLineInput[] = [];

    for (const line of input.lines) {
      const delta = line.stokFisik - line.stokSistem;
      const good = goods.find((g) => g.id === line.goodId);
      if (!good?.akunPersediaanId || delta === 0) continue;
      const amount = Math.abs(delta) * good.hargaBeli;
      if (delta > 0) {
        journalLines.push({ accountId: good.akunPersediaanId, debit: amount, kredit: 0, memo: good.nama });
        journalLines.push({ accountId: input.akunSelisihId, debit: 0, kredit: amount, memo: good.nama });
      } else {
        journalLines.push({ accountId: input.akunSelisihId, debit: amount, kredit: 0, memo: good.nama });
        journalLines.push({ accountId: good.akunPersediaanId, debit: 0, kredit: amount, memo: good.nama });
      }
      get().updateGood(good.id, { ...good, stok: line.stokFisik });
    }

    let journalEntryId: string | undefined;
    if (journalLines.length > 0) {
      const entry = get().addJournalEntry({
        tanggal: input.tanggal,
        memo: `Stock opname${input.catatan ? ` — ${input.catatan}` : ""}`,
        sourceType: "stock-opname",
        lines: journalLines,
      });
      journalEntryId = entry.id;
    }

    const opname: StockOpname = {
      ...input,
      id: generateId(),
      nomor: nextSequentialNomor(get().stockOpnames.map((o) => o.nomor), "SO"),
      lines: input.lines.map((line) => ({ ...line, id: generateId() })),
      journalEntryId,
      createdAt: nowIso(),
    };
    set((state) => ({ stockOpnames: [...state.stockOpnames, opname] }));
    return opname;
  },
});
