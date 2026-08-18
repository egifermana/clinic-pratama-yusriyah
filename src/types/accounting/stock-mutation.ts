export type StockMutationType = "masuk" | "keluar" | "saldo-awal";

export interface StockMutation {
  id: string;
  nomor: string;
  tanggal: string;
  goodId: string;
  tipe: StockMutationType;
  qty: number;
  hargaSatuan: number;
  /** Counter account: equity for saldo-awal, expense (e.g. rusak/hilang) for keluar, varies for masuk. */
  akunLawanId: string;
  catatan?: string;
  journalEntryId: string;
  createdAt: string;
}

export type StockMutationInput = Omit<
  StockMutation,
  "id" | "nomor" | "journalEntryId" | "createdAt"
>;
