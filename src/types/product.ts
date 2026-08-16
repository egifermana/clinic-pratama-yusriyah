export type StockStatus = "aman" | "menipis" | "habis";

export const PRODUCT_CATEGORIES = [
  "Box & Strip",
  "Ointment & Cream",
  "Drops & Powder",
  "Medical Devices",
  "Syrup",
  "Package",
  "Injection",
  "Carton & Q",
  "Fluid & Infusion Set",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  nama: string;
  kategori: string;
  jumlahStok: number;
  satuan: string;
  satuanBesar: string;
  isiPerBox: number;
  hargaCogsBox: number;
  hargaCogsStrip: number;
  hargaJualBox: number;
  hargaJualStrip: number;
  hargaHetBox: number;
  hargaHetStrip: number;
  stokMinimum: number;
  tanggalKadaluarsa?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
