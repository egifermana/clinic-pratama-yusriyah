export type PaymentMethod = "tunai" | "qris" | "debit" | "transfer";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "tunai", label: "Cash" },
  { value: "qris", label: "QRIS" },
  { value: "debit", label: "Debit Card" },
  { value: "transfer", label: "Bank Transfer" },
];

export interface CartItem {
  productId: string;
  namaProduk: string;
  qty: number;
  hargaJualSatuan: number;
  hargaCogsSatuan: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  diskon: number;
  total: number;
  metodePembayaran: PaymentMethod;
  uangDibayar?: number;
  kembalian?: number;
  timestamp: string;
}
