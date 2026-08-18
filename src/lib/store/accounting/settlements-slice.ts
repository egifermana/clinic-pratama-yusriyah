import type { StateCreator } from "zustand";
import type { Settlement, SettlementInput } from "@/types/accounting/settlement";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import { nextSequentialNomor } from "@/lib/accounting/sequence";
import type { StoreState } from "@/lib/store/types";

export interface SettlementsSlice {
  settlements: Settlement[];
  addSettlement: (input: SettlementInput) => Settlement | null;
}

export const createSettlementsSlice: StateCreator<StoreState, [], [], SettlementsSlice> = (
  set,
  get
) => ({
  settlements: [],
  addSettlement: (input) => {
    let counterAccountId: string | undefined;
    let memo: string;

    if (input.jenis === "pembelian") {
      const invoice = get().purchaseInvoices.find((i) => i.id === input.invoiceId);
      if (!invoice) return null;
      counterAccountId = invoice.akunKasHutangId;
      memo = `Pelunasan hutang — ${invoice.nomor}`;
      get().settlePurchaseInvoice(invoice.id, input.jumlah);
    } else {
      const invoice = get().salesInvoices.find((i) => i.id === input.invoiceId);
      if (!invoice) return null;
      counterAccountId = invoice.akunKasPiutangId;
      memo = `Pelunasan piutang — ${invoice.nomor}`;
      get().settleSalesInvoice(invoice.id, input.jumlah);
    }

    const isPurchase = input.jenis === "pembelian";
    const journalEntry = get().addJournalEntry({
      tanggal: input.tanggal,
      memo,
      sourceType: "pelunasan",
      lines: [
        {
          accountId: isPurchase ? counterAccountId : input.akunKasBankId,
          debit: input.jumlah,
          kredit: 0,
        },
        {
          accountId: isPurchase ? input.akunKasBankId : counterAccountId,
          debit: 0,
          kredit: input.jumlah,
        },
      ],
    });

    const settlement: Settlement = {
      ...input,
      id: generateId(),
      nomor: nextSequentialNomor(get().settlements.map((s) => s.nomor), "PL"),
      journalEntryId: journalEntry.id,
      createdAt: nowIso(),
    };
    set((state) => ({ settlements: [...state.settlements, settlement] }));
    return settlement;
  },
});
