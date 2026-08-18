import type { StateCreator } from "zustand";
import type { SalesInvoice, SalesInvoiceInput } from "@/types/accounting/sale";
import type { JournalLineInput } from "@/types/accounting/journal";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import { nextSequentialNomor } from "@/lib/accounting/sequence";
import type { StoreState } from "@/lib/store/types";

export interface SalesInvoicesSlice {
  salesInvoices: SalesInvoice[];
  addSalesInvoice: (input: SalesInvoiceInput) => SalesInvoice;
  settleSalesInvoice: (id: string, jumlah: number) => void;
}

export const createSalesInvoicesSlice: StateCreator<StoreState, [], [], SalesInvoicesSlice> = (
  set,
  get
) => ({
  salesInvoices: [],
  addSalesInvoice: (input) => {
    const goods = get().goods;
    const total = input.lines.reduce((sum, l) => sum + l.qty * l.harga, 0);

    const journalLines: JournalLineInput[] = [];
    for (const line of input.lines) {
      const good = goods.find((g) => g.id === line.goodId);
      if (!good) continue;
      journalLines.push({
        accountId: good.akunPendapatanId,
        debit: 0,
        kredit: line.qty * line.harga,
        memo: good.nama,
      });
      if (good.tipe === "barang" && good.akunPersediaanId && good.akunHppId) {
        const hpp = line.qty * good.hargaBeli;
        journalLines.push({ accountId: good.akunHppId, debit: hpp, kredit: 0, memo: `HPP ${good.nama}` });
        journalLines.push({
          accountId: good.akunPersediaanId,
          debit: 0,
          kredit: hpp,
          memo: `HPP ${good.nama}`,
        });
        get().updateGood(good.id, { ...good, stok: Math.max(0, (good.stok ?? 0) - line.qty) });
      }
    }
    journalLines.unshift({
      accountId: input.akunKasPiutangId,
      debit: total,
      kredit: 0,
      memo: input.lunasLangsung ? "Penerimaan tunai" : "Piutang usaha",
    });

    const partner = get().partners.find((p) => p.id === input.partnerId);
    const journalEntry = get().addJournalEntry({
      tanggal: input.tanggal,
      memo: `Penjualan${partner ? ` — ${partner.nama}` : ""}`,
      sourceType: "penjualan",
      lines: journalLines,
    });

    const invoice: SalesInvoice = {
      ...input,
      id: generateId(),
      nomor: nextSequentialNomor(get().salesInvoices.map((i) => i.nomor), "PJ"),
      lines: input.lines.map((line) => ({ ...line, id: generateId() })),
      total,
      diterima: input.lunasLangsung ? total : 0,
      journalEntryId: journalEntry.id,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    set((state) => ({ salesInvoices: [...state.salesInvoices, invoice] }));
    return invoice;
  },
  settleSalesInvoice: (id, jumlah) => {
    set((state) => ({
      salesInvoices: state.salesInvoices.map((i) =>
        i.id === id
          ? { ...i, diterima: Math.min(i.total, i.diterima + jumlah), updatedAt: nowIso() }
          : i
      ),
    }));
  },
});
