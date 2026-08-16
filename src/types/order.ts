export type OrderStatus = "pending" | "diterima" | "dibatalkan";

export interface OrderItem {
  productId: string;
  namaProduk: string;
  qty: number;
  hargaSatuan: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  namaSupplier: string;
  items: OrderItem[];
  status: OrderStatus;
  tanggalOrder: string;
  tanggalDiterima?: string;
  totalBiaya: number;
  catatan?: string;
}

export type PurchaseOrderInput = {
  supplierId: string;
  items: OrderItem[];
  catatan?: string;
};
