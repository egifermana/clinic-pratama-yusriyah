export interface SalesInvoiceLine {
  id: string;
  goodId: string;
  qty: number;
  harga: number;
}

export type SalesInvoiceLineInput = Omit<SalesInvoiceLine, "id">;

export interface SalesInvoice {
  id: string;
  nomor: string;
  tanggal: string;
  partnerId: string;
  lines: SalesInvoiceLine[];
  total: number;
  diterima: number;
  /** The Kas/Bank account debited immediately, or the Piutang account debited if unpaid. */
  akunKasPiutangId: string;
  lunasLangsung: boolean;
  journalEntryId: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export type SalesInvoiceInput = Omit<
  SalesInvoice,
  "id" | "nomor" | "lines" | "total" | "diterima" | "journalEntryId" | "createdAt" | "updatedAt"
> & {
  lines: SalesInvoiceLineInput[];
};
