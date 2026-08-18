export interface JournalLine {
  id: string;
  accountId: string;
  debit: number;
  kredit: number;
  memo?: string;
}

export type JournalLineInput = Omit<JournalLine, "id">;

export type JournalSourceType =
  | "manual"
  | "template"
  | "pembelian"
  | "penjualan"
  | "pelunasan"
  | "stock-opname"
  | "mutasi-stok";

export interface JournalEntry {
  id: string;
  nomor: string;
  tanggal: string;
  memo?: string;
  sourceType: JournalSourceType;
  lines: JournalLine[];
  createdAt: string;
  updatedAt: string;
}

export type JournalEntryInput = Omit<
  JournalEntry,
  "id" | "nomor" | "lines" | "createdAt" | "updatedAt"
> & {
  lines: JournalLineInput[];
};

export interface JournalTemplate {
  id: string;
  nama: string;
  memo?: string;
  lines: JournalLineInput[];
  createdAt: string;
}

export type JournalTemplateInput = Omit<JournalTemplate, "id" | "createdAt">;
