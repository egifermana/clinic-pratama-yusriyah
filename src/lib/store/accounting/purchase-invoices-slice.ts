import type { StateCreator } from "zustand";
import type { PurchaseInvoice, PurchaseInvoiceInput } from "@/types/accounting/purchase";
import type { JournalLineInput } from "@/types/accounting/journal";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import { nextSequentialNomor } from "@/lib/accounting/sequence";
import type { StoreState } from "@/lib/store/types";

export interface PurchaseInvoicesSlice {
  purchaseInvoices: PurchaseInvoice[];
  addPurchaseInvoice: (input: PurchaseInvoiceInput) => PurchaseInvoice;
  settlePurchaseInvoice: (id: string, jumlah: number) => void;
}

export const createPurchaseInvoicesSlice: StateCreator<
  StoreState,
  [],
  [],
  PurchaseInvoicesSlice
> = (set, get) => ({
  purchaseInvoices: [],
  addPurchaseInvoice: (input) => {
    const goods = get().goods;
    const total = input.lines.reduce((sum, l) => sum + l.qty * l.harga, 0);

    const journalLines: JournalLineInput[] = [];
    for (const line of input.lines) {
      const good = goods.find((g) => g.id === line.goodId);
      if (!good?.akunPersediaanId) continue;
      journalLines.push({
        accountId: good.akunPersediaanId,
        debit: line.qty * line.harga,
        kredit: 0,
        memo: good.nama,
      });
      get().updateGood(good.id, { ...good, stok: (good.stok ?? 0) + line.qty });
    }
    journalLines.push({
      accountId: input.akunKasHutangId,
      debit: 0,
      kredit: total,
      memo: input.lunasLangsung ? "Pembayaran tunai" : "Hutang usaha",
    });

    const partner = get().partners.find((p) => p.id === input.partnerId);
    const journalEntry = get().addJournalEntry({
      tanggal: input.tanggal,
      memo: `Pembelian${partner ? ` — ${partner.nama}` : ""}`,
      sourceType: "pembelian",
      lines: journalLines,
    });

    const invoice: PurchaseInvoice = {
      ...input,
      id: generateId(),
      nomor: nextSequentialNomor(get().purchaseInvoices.map((i) => i.nomor), "PB"),
      lines: input.lines.map((line) => ({ ...line, id: generateId() })),
      total,
      dibayar: input.lunasLangsung ? total : 0,
      journalEntryId: journalEntry.id,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    set((state) => ({ purchaseInvoices: [...state.purchaseInvoices, invoice] }));
    return invoice;
  },
  settlePurchaseInvoice: (id, jumlah) => {
    set((state) => ({
      purchaseInvoices: state.purchaseInvoices.map((i) =>
        i.id === id
          ? { ...i, dibayar: Math.min(i.total, i.dibayar + jumlah), updatedAt: nowIso() }
          : i
      ),
    }));
  },
});
