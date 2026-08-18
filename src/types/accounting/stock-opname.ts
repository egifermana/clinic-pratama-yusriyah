export interface StockOpnameLine {
  id: string;
  goodId: string;
  stokSistem: number;
  stokFisik: number;
}

export type StockOpnameLineInput = Omit<StockOpnameLine, "id">;

export interface StockOpname {
  id: string;
  nomor: string;
  tanggal: string;
  lines: StockOpnameLine[];
  akunSelisihId: string;
  catatan?: string;
  journalEntryId?: string;
  createdAt: string;
}

export type StockOpnameInput = Omit<
  StockOpname,
  "id" | "nomor" | "lines" | "journalEntryId" | "createdAt"
> & {
  lines: StockOpnameLineInput[];
};
