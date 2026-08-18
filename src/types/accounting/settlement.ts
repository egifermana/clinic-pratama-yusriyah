export type SettlementKind = "pembelian" | "penjualan";

export interface Settlement {
  id: string;
  nomor: string;
  tanggal: string;
  jenis: SettlementKind;
  invoiceId: string;
  jumlah: number;
  akunKasBankId: string;
  journalEntryId: string;
  createdAt: string;
}

export type SettlementInput = Omit<Settlement, "id" | "nomor" | "journalEntryId" | "createdAt">;
