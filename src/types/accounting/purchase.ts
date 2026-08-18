export interface PurchaseInvoiceLine {
  id: string;
  goodId: string;
  qty: number;
  harga: number;
}

export type PurchaseInvoiceLineInput = Omit<PurchaseInvoiceLine, "id">;

export interface PurchaseInvoice {
  id: string;
  nomor: string;
  tanggal: string;
  partnerId: string;
  lines: PurchaseInvoiceLine[];
  total: number;
  dibayar: number;
  /** The Kas/Bank account debited immediately, or the Hutang account credited if unpaid. */
  akunKasHutangId: string;
  lunasLangsung: boolean;
  journalEntryId: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseInvoiceInput = Omit<
  PurchaseInvoice,
  "id" | "nomor" | "lines" | "total" | "dibayar" | "journalEntryId" | "createdAt" | "updatedAt"
> & {
  lines: PurchaseInvoiceLineInput[];
};
